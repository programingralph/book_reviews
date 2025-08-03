import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const response = await login(email, password);
      console.log('Login response:', response); // Debug log
      const { id, token } = response;
      if (!id) {
        throw new Error('No user ID returned from server');
      }
      localStorage.clear(); // Clear stale data
      localStorage.setItem('token', token);
      localStorage.setItem('id', id);
      setSuccess('Login successful! Redirecting...');
      setEmail('');
      setPassword('');
      setTimeout(() => {
        console.log('Navigating to:', `/user/${id}`); // Debug log
        navigate(`/user/${id}`);
      }, 2000);
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url(background3.jpg)]">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <button
          onClick={handleGoBack}
          className="hover:bg-green-700 transition-colors duration-200 cursor-pointer rounded-xs mb-4 px-4 py-2 text-gray-700"
        >
          Go back
        </button>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>
        {error && (
          <p className="text-red-500 text-center mb-4 p-2 bg-red-100 rounded-md">{error}</p>
        )}
        {success && (
          <p className="text-green-500 text-center mb-4 p-2 bg-green-100 rounded-md">{success}</p>
        )}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Verifying...' : 'Login'}
            </button>
          </div>
        </form>
        <div className="text-green-300 text-center mt-4">
          <p>
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/register')}
              className="text-green-600 hover:underline"
            >
              Register
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}