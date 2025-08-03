import React from 'react';
import Ratings from './Ratings';
import { useNavigate } from 'react-router-dom';

const BookReview = () => {
  const ISBN = '9798395421142';
  const navigate = useNavigate();

  const handleAddReview = (event) => {
    event.preventDefault();
    navigate('/writereview');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-md shadow-md">
      <form action="/writereview" method="GET" className="mb-4">
        <button
          type="submit"
          name="newReview"
          className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
          onClick={handleAddReview}
        >
          Add Review
        </button>
      </form>

      <h1 className="text-2xl font-bold text-teal-800 dark:text-teal-400">This is how your review will look</h1>
      <h2 className="italic underline text-orange-700 mb-10 text-xl">My Book Reviews</h2>

      <article className="flex flex-col md:flex-row gap-6 items-start">
        <img
          src={`https://covers.openlibrary.org/b/isbn/${ISBN}-M.jpg`}
          alt={`Book Cover for ISBN ${ISBN}`}
          className="w-[200px] rounded border shadow"
        />
        <div className="flex-1 space-y-2">
          <h2 className="text-xl font-semibold text-teal-800 dark:text-teal-400">
            <strong>Title:</strong><br />
            The Richest Man In Babylon
          </h2>
          <p className="text-teal-800 dark:text-teal-400">
            <strong>Author:</strong><br />George A. Clason
          </p>
          <p className="text-teal-800 dark:text-teal-400">
            <strong>Description:</strong><br />
            This book teaches the reader about the importance of financial literacy.
            It provides a simple yet interesting story about financial habits that have been proven to stand the test of time.
            From ancient documentation to more recent feedback, this book will help the reader achieve financial freedom when put into practice.
          </p>
          <p className="text-teal-800 dark:text-teal-400">
            <strong>Personal Opinion:</strong><br />
            It's a very good book, a must-read for those in need of a direct explanation
            on how to achieve financial freedom. It only requires time to read the book and patience to put into practice its teachings
            and reap the fruits you sow.
          </p>
          <div className="text-teal-800 dark:text-teal-400 text-sm space-y-1">
            <p>
              <strong>ISBN:</strong> 9798395421142 (When provided, the cover image will display if available)
            </p>
            <div>
              <strong>Rating:</strong> <Ratings />
            </div>
            <p>
              <strong>Review Date:</strong> {new Date().toLocaleDateString('en-US')}
            </p>
          </div>
        </div>
      </article>
    </div>
  );
};

export default BookReview;