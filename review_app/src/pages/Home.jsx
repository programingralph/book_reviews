import React from 'react';
import { Navbar, BookReview, HomeNavbar } from '../components';

const Home = () => {
  return (
    <div className="bg-black">
      <HomeNavbar />
      <h1 className="text-red-500">Click Add Review to see demo.</h1>
      <BookReview />
    </div>
  );
};

export default Home;