// import { useState } from 'react'
// import {Home, Login, SignUp, Reviews, WriteReview } from "./pages/index";
// import React from 'react';
import './App.css'
import { Outlet } from 'react-router-dom';
import { Navbar, Footer } from './components/index';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow px-6 py-4">
        <Outlet />
      </main>
      <Footer/>
    </div>
  );
}

export default App;
