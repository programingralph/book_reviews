import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ratings } from '../components';
import WriteReviewNavbar from '../components/WriteReviewNavbar';

export default function WriteReview() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([
    {
      review_id: 1,
      title: 'The Richest Man In Babylon',
      author: 'George A. Clason',
      description:
        'This book teaches the reader about the importance of financial literacy. It provides a simple yet interesting story about financial habits that have been proven to stand the test of time.',
      opinion:
        'A must-read for those in need of a direct explanation on how to achieve financial freedom.',
      isbn: '9798395421142',
      rating: 5,
      review_date: new Date().toISOString().split('T')[0],
    },
  ]);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    opinion: '',
    isbn: '',
    rating: 3,
    review_date: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const [showForm, setShowForm] = useState(true);
  const [errors, setErrors] = useState({
    title: '',
    author: '',
    description: '',
    opinion: '',
    review_date: '',
  });
  const [failedImages, setFailedImages] = useState({});
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleRatingChange = (e) => {
    const label = e.target.getAttribute('aria-label');
    if (label) {
      const ratingValue = parseInt(label.split(' ')[0]);
      setFormData((prev) => ({ ...prev, rating: ratingValue }));
    }
  };

  const handleAddOrUpdateReview = () => {
    const newErrors = {
      title: !formData.title ? 'Title is required' : '',
      author: !formData.author ? 'Author is required' : '',
      description: !formData.description ? 'Description is required' : '',
      opinion: !formData.opinion ? 'Opinion is required' : '',
      review_date: !formData.review_date ? 'Date is required' : '',
    };
    const hasErrors = Object.values(newErrors).some((error) => error);
    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    if (editId !== null) {
      setReviews((prev) =>
        prev.map((review) =>
          review.review_id === editId ? { ...formData, review_id: editId } : review
        )
      );
      setEditId(null);
    } else {
      const newReview = {
        ...formData,
        review_id: reviews.length > 0 ? Math.max(...reviews.map((r) => r.review_id)) + 1 : 1,
      };
      setReviews((prev) => [...prev, newReview]);
    }
    setFormData({
      title: '',
      author: '',
      description: '',
      opinion: '',
      isbn: '',
      rating: 3,
      review_date: '',
    });
    setErrors({
      title: '',
      author: '',
      description: '',
      opinion: '',
      review_date: '',
    });
  };

  const handleDeleteReview = (review_id) => {
    setReviews((prev) => prev.filter((review) => review.review_id !== review_id));
    setFailedImages((prev) => {
      const newFailedImages = { ...prev };
      delete newFailedImages[review_id];
      return newFailedImages;
    });
  };

  const handleEditReview = (review) => {
    setFormData({
      title: review.title,
      author: review.author,
      description: review.description,
      opinion: review.opinion,
      isbn: review.isbn || '',
      rating: review.rating,
      review_date: review.review_date,
    });
    setEditId(review.review_id);
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setFormData({
      title: '',
      author: '',
      description: '',
      opinion: '',
      isbn: '',
      rating: 3,
      review_date: '',
    });
    setErrors({
      title: '',
      author: '',
      description: '',
      opinion: '',
      review_date: '',
    });
  };

  const handleImageError = (review_id) => {
    setFailedImages((prev) => ({ ...prev, [review_id]: true }));
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
      <WriteReviewNavbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <h1 className="text-red-500 text-center mt-4">
        For demo purpose only, please register or login to save reviews
      </h1>
      <div className="text-center mt-6">
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="btn btn-secondary"
        >
          {showForm ? 'Hide Review Form' : 'Show Review Form'}
        </button>
      </div>
      <div
        className={`transition-all duration-300 overflow-hidden ${
          showForm ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
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
                className={`input input-bordered w-full ${errors.title ? 'border-red-500' : ''}`}
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
                className={`input input-bordered w-full ${errors.author ? 'border-red-500' : ''}`}
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
                className={`textarea textarea-bordered w-full ${errors.description ? 'border-red-500' : ''}`}
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
                className={`textarea textarea-bordered w-full ${errors.opinion ? 'border-red-500' : ''}`}
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
                name="review_date"
                value={formData.review_date}
                onChange={handleChange}
                className={`input input-bordered w-full ${errors.review_date ? 'border-red-500' : ''}`}
                required
              />
              {errors.review_date && (
                <p className="text-red-500 text-sm mt-1">{errors.review_date}</p>
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
              {editId !== null ? 'Update Review' : 'Add Review'}
            </button>
            {editId !== null && (
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
      <div className="space-y-10 mt-10 px-6 max-w-4xl mx-auto">
        {debouncedTerm && filteredReviews.length === 0 && (
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            No match available
          </p>
        )}
        {sortedReviews.map((review) => (
          <article
            key={review.review_id}
            className="flex flex-col md:flex-row gap-6 items-start border p-4 rounded shadow"
          >
            <div className="relative group">
              <img
                src={
                  !review.isbn || failedImages[review.review_id]
                    ? '/nocover.jpg'
                    : `https://covers.openlibrary.org/b/isbn/${review.isbn}-M.jpg`
                }
                alt={`Book Cover for ISBN ${review.isbn || 'unknown'}`}
                className="w-[200px] rounded border shadow"
                onError={() => handleImageError(review.review_id)}
              />
              {review.isbn && failedImages[review.review_id] && (
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
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
                <strong>ISBN:</strong> {review.isbn || 'Not provided'}
              </p>
              <p className="text-sm">
                <strong>Rating:</strong> {'⭐'.repeat(review.rating)}
              </p>
              <p className="text-sm">
                <strong>Review Date:</strong> {review.review_date}
              </p>
              <div className="flex space-x-2 mt-2">
                <button
                  onClick={() => handleEditReview(review)}
                  className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteReview(review.review_id)}
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