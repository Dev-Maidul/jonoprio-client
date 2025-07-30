import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; 
import { FaStar, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { AuthContext } from '../../Context/AuthProvider';
import useAxiosSecure from '../../hooks/useAxiosSecure';

// Utility function to parse MongoDB Date
const parseDate = (mongoDate) => {
  if (mongoDate) {
    // If it's in the format { "$date": { "$numberLong": "1753884080802" } }
    if (mongoDate.$date) {
      return new Date(parseInt(mongoDate.$date.$numberLong));
    }

    // If it's in the format { "$numberLong": "1753884080802" }
    if (mongoDate.$numberLong) {
      return new Date(parseInt(mongoDate.$numberLong));
    }

    return new Date(mongoDate); // Return as a standard JavaScript Date if possible
  }
  return new Date(); // Return current date if not available
};

const ReviewModal = ({ productId, onClose, onSuccessReview }) => {
  const { user } = useContext(AuthContext); // Get user from AuthContext
  const axiosSecure = useAxiosSecure(); // Get axiosSecure for authenticated requests
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (rating === 0 || !comment.trim()) {
      toast.error("Please provide a rating and a comment!");
      setLoading(false);
      return;
    }

    if (!user || !user.email) {
      toast.error("You must be logged in to submit a review.");
      setLoading(false);
      return;
    }

    try {
      const reviewData = {
        productId: productId,
        userEmail: user.email,
        userName: user.displayName || user.email.split('@')[0], // Use display name or part of email
        userImage: user.photoURL || 'https://i.ibb.co/2d9dK0F/default-profile.png', // User profile image
        rating,
        comment: comment.trim(),
        date: new Date().toISOString(), // Add ISO date string
      };

      const response = await axiosSecure.post(`/product/${productId}/review`, reviewData);

      if (response.data.message === 'Review submitted successfully') {
        toast.success("Review submitted successfully!");
        onSuccessReview(); // Call parent's success callback to re-fetch reviews
        onClose(); // Close the modal
      } else {
        toast.error("Failed to submit review.");
      }
    } catch (error) {
      console.error("Error submitting review:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to submit review.");
    } finally {
      setLoading(false);
    }
  };

  const handleStarClick = (starIndex) => {
    setRating(starIndex + 1);
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.2, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2, ease: "easeIn" } },
  };

  return (
    <AnimatePresence>
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={modalVariants}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose} // Close modal when clicking outside
      >
        <motion.div
          className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative"
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Write a Review</h3>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl transition-colors"
            aria-label="Close review form"
          >
            <FaTimes />
          </button>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Your Rating</label>
              <div className="flex items-center text-2xl text-yellow-500">
                {[...Array(5)].map((_, index) => (
                  <FaStar
                    key={index}
                    className={`cursor-pointer ${rating > index ? '' : 'opacity-30'}`}
                    onClick={() => handleStarClick(index)}
                    aria-label={`Rate ${index + 1} stars`}
                  />
                ))}
                {rating > 0 && <span className="ml-2 text-gray-700 text-base">({rating} of 5)</span>}
              </div>
              {rating === 0 && <p className="text-red-500 text-sm mt-1">Please select a rating.</p>}
            </div>

            <div>
              <label htmlFor="comment" className="block text-gray-700 font-semibold mb-2">Your Comment</label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows="4"
                className="textarea textarea-bordered w-full"
                placeholder="Share your experience with this product..."
              />
              {!comment.trim() && <p className="text-red-500 text-sm mt-1">Comment cannot be empty.</p>}
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn w-full bg-blue-600 text-white rounded-lg py-2 font-bold hover:bg-blue-700 transition-colors"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Review'}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ReviewModal;
