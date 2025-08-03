import express from 'express';
import cors from 'cors';
import pool from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

const app = express();
const port = 3000;
dotenv.config({ path: '../.env' });

app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' }));

const JWT_SECRET = process.env.VITE_SECRET_TOKEN || 'S3CR3T';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ error: 'Access denied' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.log('Token verification failed:', err.message);
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    console.log('Authenticated user:', user, 'Params id:', req.params.id); // Debug log
    if (req.params.id && parseInt(req.params.id) !== user.id) {
      console.log(`Unauthorized: JWT id (${user.id}) does not match id (${req.params.id})`);
      return res.status(403).json({ error: 'Unauthorized access' });
    }
    next();
  });
};

app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;
  const created_on = new Date();
  try {
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (email, password, created_on) VALUES ($1, $2, $3) RETURNING id',
      [email, hashedPassword, created_on]
    );
    const id = result.rows[0].id;
    const token = jwt.sign({ id }, JWT_SECRET, { expiresIn: '1h' });
    console.log('Register response:', { id, token }); // Debug log
    res.status(201).json({ id, token });
  } catch (err) {
    console.error('Register error:', err.stack);
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
    console.log('Login response:', { id: user.id, token }); // Debug log
    res.json({ id: user.id, token });
  } catch (err) {
    console.error('Login error:', err.stack);
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

app.get('/', (req, res) => {
  res.send('Welcome to this API');
});

app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, email FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching users:', err.stack);
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

app.get('/api/users/:user_id/reviews', authenticateToken, async (req, res) => {
  const { user_id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM reviews WHERE user_id = $1', [user_id]);
    res.json(result.rows);
  } catch (err) {
    console.error('Fetch reviews error:', err.stack);
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

app.post('/api/users/:user_id/reviews', authenticateToken, async (req, res) => {
  const { user_id } = req.params;
  const { title, author, description, opinion, review_date, isbn, rating } = req.body;
  try {
    if (!title || !author || !review_date) {
      return res.status(400).json({ error: 'Title, author, and review_date are required' });
    }
    const result = await pool.query(
      'INSERT INTO reviews (user_id, title, author, description, opinion, review_date, isbn, rating) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [user_id, title, author, description, opinion, review_date, isbn, rating]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Review creation error:', err.stack);
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

app.put('/api/reviews/:review_id', authenticateToken, async (req, res) => {
  const { review_id } = req.params;
  const { title, author, description, opinion, review_date, isbn, rating } = req.body;
  try {
    const reviewIdInt = parseInt(review_id, 10);
    if (isNaN(reviewIdInt)) {
      return res.status(400).json({ error: 'Invalid review_id: must be an integer' });
    }
    const result = await pool.query(
      'UPDATE reviews SET title = $1, author = $2, description = $3, opinion = $4, review_date = $5, isbn = $6, rating = $7 WHERE review_id = $8 AND user_id = $9 RETURNING *',
      [title, author, description, opinion, review_date, isbn, rating, reviewIdInt, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Review not found or unauthorized' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Review update error:', err.stack);
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

app.delete('/api/reviews/:review_id', authenticateToken, async (req, res) => {
  const { review_id } = req.params;
  try {
    const reviewIdInt = parseInt(review_id, 10);
    if (isNaN(reviewIdInt)) {
      return res.status(400).json({ error: 'Invalid review_id: must be an integer' });
    }
    const result = await pool.query(
      'DELETE FROM reviews WHERE review_id = $1 AND user_id = $2 RETURNING *',
      [reviewIdInt, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Review not found or unauthorized' });
    }
    res.sendStatus(204);
  } catch (err) {
    console.error('Review deletion error:', err.stack);
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

app.use((err, req, res, next) => {
  console.error('Global error:', err.stack);
  res.status(500).json({ error: 'Unexpected server error' });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});