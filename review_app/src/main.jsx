import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import { Home, Login, SignUp, Reviews, WriteReview } from './pages/index';
// import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'; // Your shared layout component

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <SignUp /> },
      { path: 'reviews', element: <Reviews /> },
      { path: 'writereview', element: <WriteReview /> },
    ],
  },
]);

// Render the RouterProvider and inject the router
const root = document.getElementById('root');
ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
