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
  const [errors, setErrors] = useState({
    title: "",
    author: "",
    description: "",
    opinion: "",
    date: "",
  });
  const [failedImages, setFailedImages] = useState({});
  // State for edit mode
  const [editIndex, setEditIndex] = useState(null);

  // Debounce logic
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleRatingChange = (e) => {
    const label = e.target.getAttribute("aria-label");
    if (label) {
      const ratingValue = parseInt(label);
      setFormData((prev) => ({ ...prev, rating: ratingValue }));
    }
  };

  const handleAddOrUpdateReview = () => {
    const newErrors = {
      title: !formData.title ? "Title is required" : "",
      author: !formData.author ? "Author is required" : "",
      description: !formData.description ? "Description is required" : "",
      opinion: !formData.opinion ? "Opinion is required" : "",
      date: !formData.date ? "Date is required" : "",
    };
    const hasErrors = Object.values(newErrors).some((error) => error);
    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    if (editIndex !== null) {
      // Update existing review
      setReviews((prev) =>
        prev.map((review, index) =>
          index === editIndex ? formData : review
        )
      );
      setEditIndex(null); // Exit edit mode
    } else {
      // Add new review
      setReviews((prev) => [...prev, formData]);
    }

    setFormData({
      title: "",
      author: "",
      description: "",
      opinion: "",
      isbn: "",
      rating: 3,
      date: "",
    });
    setErrors({
      title: "",
      author: "",
      description: "",
      opinion: "",
      date: "",
    });
  };

  const handleDeleteReview = (index) => {
    setReviews((prev) => prev.filter((_, i) => i !== index));
    setFailedImages((prev) => {
      const newFailedImages = { ...prev };
      delete newFailedImages[index];
      return newFailedImages;
    });
  };

  const handleEditReview = (index) => {
    setFormData(reviews[index]);
    setEditIndex(index);
    setShowForm(true); // Ensure form is visible
  };

  const handleCancelEdit = () => {
    setEditIndex(null);
    setFormData({
      title: "",
      author: "",
      description: "",
      opinion: "",
      isbn: "",
      rating: 3,
      date: "",
    });
    setErrors({
      title: "",
      author: "",
      description: "",
      opinion: "",
      date: "",
    });
  };

  const handleLogout = () => {
    navigate("/");
  };

  const handleImageError = (index) => {
    setFailedImages((prev) => ({ ...prev, [index]: true }));
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
            <div>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Book Title"
                className={`input input-bordered w-full ${errors.title ? "border-red-500" : ""}`}
                required
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>
            <div>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="Author"
                className={`input input-bordered w-full ${errors.author ? "border-red-500" : ""}`}
                required
              />
              {errors.author && (
                <p className="text-red-500 text-sm mt-1">{errors.author}</p>
              )}
            </div>
            <div>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Book Description"
                className={`textarea textarea-bordered w-full ${errors.description ? "border-red-500" : ""}`}
                required
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
            </div>
            <div>
              <textarea
                name="opinion"
                value={formData.opinion}
                onChange={handleChange}
                placeholder="Your Personal Opinion"
                className={`textarea textarea-bordered w-full ${errors.opinion ? "border-red-500" : ""}`}
                required
              />
              {errors.opinion && (
                <p className="text-red-500 text-sm mt-1">{errors.opinion}</p>
              )}
            </div>
            <div>
              <input
                type="text"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                placeholder="ISBN"
                className="input input-bordered w-full"
              />
            </div>
            <div>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={`input input-bordered w-full ${errors.date ? "border-red-500" : ""}`}
                required
              />
              {errors.date && (
                <p className="text-red-500 text-sm mt-1">{errors.date}</p>
              )}
            </div>

            <div onChange={handleRatingChange}>
              <Ratings />
            </div>
          </div>

          <div className="text-center space-x-4">
            <button
              onClick={handleAddOrUpdateReview}
              className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
            >
              {editIndex !== null ? "Update Review" : "Add Review"}
            </button>
            {editIndex !== null && (
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            )}
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
                src={
                  !review.isbn || failedImages[index]
                    ? "/nocover.jpg"
                    : `https://covers.openlibrary.org/b/isbn/${review.isbn}-M.jpg`
                }
                alt={`Book Cover for ISBN ${review.isbn || "unknown"}`}
                className="w-[200px] rounded border shadow"
                onError={() => handleImageError(index)}
              />
              {review.isbn && failedImages[index] && (
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
                <strong>ISBN:</strong> {review.isbn || "Not provided"}
              </p>
              <p className="text-sm">
                <strong>Rating:</strong> {"⭐".repeat(review.rating)}
              </p>
              <p className="text-sm">
                <strong>Review Date:</strong> {review.date}
              </p>
              <div className="flex space-x-2 mt-2">
                <button
                  onClick={() => handleEditReview(index)}
                  className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteReview(index)}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}