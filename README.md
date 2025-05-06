Book Review Application Documentation
This document provides an overview of a web application for managing book reviews, built using Node.js, Express.js, PostgreSQL, and EJS templating. The application allows users to view, add, and store book reviews, with a responsive front-end styled using CSS. The project follows a standard folder structure with views in views/ and static assets in public/styles/.
Table of Contents
Project Overview (#project-overview)

Folder Structure (#folder-structure)

Technologies Used (#technologies-used)

Setup and Installation (#setup-and-installation)

Database Schema (#database-schema)

Application Routes (#application-routes)

Front-End Templates (#front-end-templates)

Styling (#styling)

Error Handling (#error-handling)

Future Improvements (#future-improvements)

Project Overview
The Book Review Application enables users to:
View a list of book reviews on the homepage (index.ejs).

Add new reviews via a form (review.ejs).

Store reviews in a PostgreSQL database.

Display book cover images using the Open Library API based on ISBN.

The application features a dark-themed interface with centered, responsive forms and a floating "Add review" button. Reviews include details like title, author, description, personal opinion, review date, ISBN, and rating.
Folder Structure

project-root/
├── public/
│   └── styles/
│       ├── main.css       # Styles for index.ejs
│       └── review.css     # Styles for review.ejs
├── views/
│   ├── index.ejs         # Homepage displaying reviews
│   └── review.ejs        # Form for adding new reviews
├── app.js                # Main server file
├── .env                  # Environment variables (e.g., database password)
└── package.json          # Project dependencies and scripts

public/styles/: Contains CSS files for styling the front-end.

views/: Contains EJS templates for rendering dynamic HTML.

app.js: Configures the Express server, routes, and database connection.

.env: Stores sensitive data like the database password.

Technologies Used
Node.js: JavaScript runtime for the server.

Express.js: Web framework for handling routes and middleware.

PostgreSQL (pg): Relational database for storing reviews.

EJS: Templating engine for rendering dynamic HTML.

body-parser: Middleware to parse form data.

dotenv: Loads environment variables from .env.

CSS: Custom styles for the front-end.

Open Library API: Fetches book cover images using ISBN.

Setup and Installation
Prerequisites:
Node.js (v16 or higher)

PostgreSQL (installed and running locally)

Git (optional, for cloning the repository)

Clone the Repository (if applicable):
bash

git clone <repository-url>
cd book-review-app

Install Dependencies:
bash

npm install

Installs express, body-parser, pg, and dotenv.

Set Up Environment Variables:
Create a .env file in the project root:
env

PASSWORD=your_postgres_password

Replace your_postgres_password with your PostgreSQL user password.

Set Up PostgreSQL Database:
Create a database named Books:
sql

CREATE DATABASE Books;

Create the reviews table:
sql

CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    opinion TEXT NOT NULL,
    review_date DATE NOT NULL,
    isbn VARCHAR(13) NOT NULL,
    rating VARCHAR(5) NOT NULL
);

Run the Application:
bash

node app.js

The server will start on http://localhost:3000.

Access the Application:
Open a browser and navigate to http://localhost:3000 to view the homepage.

Database Schema
The application uses a single PostgreSQL table, reviews, with the following schema:
Column

Type

Constraints

Description

id

SERIAL

PRIMARY KEY

Unique identifier for each review

title

VARCHAR(255)

NOT NULL

Book title

author

VARCHAR(255)

NOT NULL

Book author

description

TEXT

NOT NULL

Book description

opinion

TEXT

NOT NULL

Personal opinion on the book

review_date

DATE

NOT NULL

Date of the review

isbn

VARCHAR(13)

NOT NULL

Book ISBN (10 or 13 digits)

rating

VARCHAR(5)

NOT NULL

Rating in format "X/10"

Application Routes
The application defines three routes in app.js:
GET /:
Purpose: Displays the homepage with a list of all reviews.

Logic:
Queries the reviews table, ordering by id (ascending).

Renders index.ejs, passing the query results as reviews.

Error Handling: Logs errors to the console but does not inform the client.

POST /add:
Purpose: Renders the review form when the "Add review" button is clicked.

Logic:
Renders review.ejs without processing any data.

Error Handling: Logs errors to the console.

POST /review:
Purpose: Handles submission of the review form, saving data to the database.

Logic:
Extracts form fields (title, author, description, opinion, review_date, isbn, rating) from req.body.

Inserts the data into the reviews table using a parameterized query.

Redirects to the homepage (/).

Error Handling: Logs errors to the console.

Front-End Templates
The application uses two EJS templates in the views/ directory.
index.ejs
Purpose: Displays the homepage with a list of book reviews and a button to add a new review.

Features:
A form with a button (action="/add") to navigate to the review form.

A heading for the user’s name (placeholder: "Your name goes here").

A styled "My Book reviews" title (italicized, underlined, colored).

A conditional block:
If reviews exist, loops through each review to display:
Book cover image (fetched from Open Library API using ISBN).

Title, author, description, personal opinion, ISBN, rating, and review date (formatted as MM/DD/YYYY).

If no reviews exist, displays "You have failed!".

Styling: Linked to /styles/main.css.

review.ejs
Purpose: Provides a form for adding a new book review.

Features:
A form (action="/review") with fields for:
Title (text input)

Author (text input)

Description (textarea)

Personal Opinion (textarea)

Review Date (date input)

ISBN (text input, 10 or 13 digits)

Rating (text input, format "X/10")

All fields are required, with client-side validation for ISBN and rating formats.

A submit button to send the data.

Styling: Linked to /styles/review.css.

Styling
The application uses two CSS files in public/styles/.
main.css (for index.ejs)
Body: Black background, white text.

Headings:
h1: Centered, 40px, orange-brown color (rgb(160, 66, 15)).

h2: Centered, green (#080), italicized, underlined.

Paragraphs:
p: Left-aligned, 20px, isolated text direction.

.lastP: Smaller font (15px), purple-blue color (#88f).

Reviews:
.reviews: Block display, centered horizontally (margin: 0 auto), 50% max-width, 40px bottom padding.

Images:
img: Floats left, 2em right margin, 300px height, antiquewhite background.

Add Button:
.add: Fixed at top-right (10px from top and right).

button: Green background (#080), white text, rounded (10px), hover effect (purple-blue, #88f).

review.css (for review.ejs)
Body: Black background, green text (#080).

Form:
.review-form: Centered (absolute positioning, 50% top/left, translated -50%), dark teal background (rgb(1, 62, 54)), yellow border (#989303), 600px wide, shadow.

Labels: Block display, bold, 5px bottom margin.

Inputs and textareas: Full-width, 8px padding, yellow border, rounded (4px).

Textareas: Vertical resizing, 80px minimum height.

Button: Yellow background (#989303), white text, full-width, rounded, hover effect (blue, #0056b3).

Responsive Design:
Media query (@media (max-width: 450px)): Sets .review-form width to 90% for mobile devices.

Error Handling
Server-Side:
All routes use try/catch blocks to catch errors.

Errors are logged to the console (console.log(err)), but no user feedback is provided (e.g., error pages or messages).

Client-Side:
Form fields in review.ejs use required attributes and pattern attributes (for ISBN and rating) for basic validation.

No custom error messages are displayed for invalid inputs.

Future Improvements
Error Feedback:
Display user-friendly error messages on the front-end for database errors or invalid inputs.

Add validation for ISBN format (e.g., checksum) and rating range (1-10).

Edit/Delete Reviews:
Add routes and forms to edit or delete existing reviews.

User Authentication:
Implement user accounts to associate reviews with specific users.

Replace the placeholder "Your name goes here" with the logged-in user’s name.

Improved Styling:
Add animations (e.g., fade-in for reviews or translucent effect for images).

Enhance mobile responsiveness (e.g., adjust font sizes or image scaling).

Database Enhancements:
Add indexes on isbn or title for faster queries.

Normalize data (e.g., separate books and reviews tables).

Security:
Sanitize form inputs to prevent SQL injection (current parameterized queries are safe, but additional validation helps).

Use HTTPS and secure environment variable storage.

Image Fallback:
Handle cases where the Open Library API fails to provide a book cover (e.g., display a placeholder image).

Usage Example
View Reviews:
Visit http://localhost:3000 to see all reviews.

If no reviews exist, "You have failed!" is displayed.

Add a Review:
Click the "Add review" button (top-right).

Fill out the form in review.ejs (e.g., Title: "1984", Author: "George Orwell", ISBN: "9780451524935", Rating: "8/10").

Submit the form to save the review and redirect to the homepage.

Review Display:
The new review appears on the homepage with its book cover, formatted date, and details.

