import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Home, Login, Register, WriteReview, ActiveUser } from './pages';
import { ProtectedRoute } from './components';
import './index.css';
import App from './App';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'writereview', element: <WriteReview /> },
      { path: '/user/:id', element: <ProtectedRoute><ActiveUser /></ProtectedRoute> },
      { path: '*', element: <div className="text-center text-red-500 mt-20">404: Page Not Found</div> },
    ],
  },
]);

const root = document.getElementById('root');
ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);