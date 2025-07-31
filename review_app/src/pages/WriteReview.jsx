import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Ratings } from "../components";

export default function WriteReview() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    opinion: "",
    isbn: "",
    rating: 3,
    date: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [showForm, setShowForm] = useState(true);

  // Debounce logic
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 300); // 300ms debounce

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (e) => {
    const label = e.target.getAttribute("aria-label");
    if (label) {
      const ratingValue = parseInt(label);
      setFormData((prev) => ({ ...prev, rating: ratingValue }));
    }
  };

  const handleAddReview = () => {
    const { title, author, description, opinion, isbn, date } = formData;
    if (!title || !author || !description || !opinion || !isbn || !date) return;
    setReviews((prev) => [...prev, formData]);
    setFormData({
      title: "",
      author: "",
      description: "",
      opinion: "",
      isbn: "",
      rating: 3,
      date: "",
    });
  };

  const handleLogout = () => {
    navigate("/");
  };

  const filteredReviews = reviews.filter((review) => {
    const term = debouncedTerm.toLowerCase();
    return (
      review.title.toLowerCase().includes(term) ||
      review.author.toLowerCase().includes(term)
    );
  });

  const sortedReviews = debouncedTerm
    ? [...filteredReviews, ...reviews.filter((r) => !filteredReviews.includes(r))]
    : reviews;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-teal-800 dark:text-teal-400">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-800 shadow">
        <input
          type="text"
          placeholder="Search by title or author..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered w-1/2"
        />
        <button
          onClick={handleLogout}
          className="btn btn-outline btn-error ml-4"
        >
          Logout
        </button>
      </nav>

      {/* Toggle Form Button */}
      <div className="text-center mt-6">
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="btn btn-secondary"
        >
          {showForm ? "Hide Review Form" : "Show Review Form"}
        </button>
      </div>

      {/* Review Form */}
      <div
        className={`transition-all duration-300 overflow-hidden ${
          showForm ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-6 max-w-4xl mx-auto space-y-6">
          <div className="space-y-4">
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Book Title"
              className="input input-bordered w-full"
            />
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="Author"
              className="input input-bordered w-full"
            />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Book Description"
              className="textarea textarea-bordered w-full"
            />
            <textarea
              name="opinion"
              value={formData.opinion}
              onChange={handleChange}
              placeholder="Your Personal Opinion"
              className="textarea textarea-bordered w-full"
            />
            <input
              type="text"
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
              placeholder="ISBN"
              className="input input-bordered w-full"
            />
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="input input-bordered w-full"
            />

            {/* Ratings */}
            <div onChange={handleRatingChange}>
              <Ratings />
            </div>
          </div>

          {/* Add Review Button */}
          <div className="text-center">
            <button
              onClick={handleAddReview}
              className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
            >
              Add Review
            </button>
          </div>
        </div>
      </div>

      {/* Display Reviews */}
      <div className="space-y-10 mt-10 px-6 max-w-4xl mx-auto">
        {debouncedTerm && filteredReviews.length === 0 && (
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            No match available
          </p>
        )}

        {sortedReviews.map((review, index) => (
          <article
            key={index}
            className="flex flex-col md:flex-row gap-6 items-start border p-4 rounded shadow"
          >
            <div className="relative group">
              <img
                src={`https://covers.openlibrary.org/b/isbn/${review.isbn}-M.jpg`}
                alt={`Book Cover for ISBN ${review.isbn}`}
                className="w-[200px] rounded border shadow"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Book_icon_2.svg/512px-Book_icon_2.svg.png";
                  e.target.setAttribute("data-fallback", "true");
                }}
                data-fallback="false"
              />
              {/* Tooltip only if fallback is active */}
              {review.isbn && (
                <div
                  className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Cover not available
                </div>
              )}
            </div>

            <div className="flex-1 space-y-2">
              <h2 className="text-xl font-semibold">
                <strong>Title:</strong><br />
                {review.title}
              </h2>
              <p>
                <strong>Author:</strong><br />
                {review.author}
              </p>
              <p>
                <strong>Description:</strong><br />
                {review.description}
              </p>
              <p>
                <strong>Personal Opinion:</strong><br />
                {review.opinion}
              </p>
              <p className="text-sm">
                <strong>ISBN:</strong> {review.isbn}
              </p>
              <p className="text-sm">
                <strong>Rating:</strong> {"⭐".repeat(review.rating)}
              </p>
              <p className="text-sm">
                <strong>Review Date:</strong> {review.date}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}