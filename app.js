import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from "dotenv";

const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({extended: true})); // Default code to read user inputs
app.use(express.static("public")); // Allows acces to the public folder
dotenv.config();
// Access to database
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "Books",
    password: process.env.PASSWORD,
    port: 5433,
});
db.connect(); 

app.get("/", async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM reviews ORDER BY book_id ASC')
        res.render("index.ejs", {reviews : result.rows});
        // console.log(result.rows);
    } catch (err) {
        console.log(err);
    }
});

app.post("/add", async (req, res) => {
    
    try {
        res.render("review.ejs")
        
            
        } catch (err) {
            console.log(err)

    } 
   
});

app.post("/review", async (req, res) => {
    const title = req.body.title;
    const author = req.body.author;
    const description = req.body.description;
    const p_opinion = req.body.opinion;
    const date = req.body.review_date;
    const isbn = req.body.isbn;
    const rating = req.body.rating;
    try {
        await db.query("INSERT INTO reviews (title, author, description, opinion, review_date, isbn, rating) VALUES ($1, $2, $3, $4, $5, $6, $7)",
             [title, author, description, p_opinion, date, isbn, rating]);
        res.redirect("/");

    } catch (err) {
        console.log(err);

    }
})

app.listen(port, () => {
    console.log(`Listening to port ${port}`);

});