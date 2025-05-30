import axios from "axios";
import React, { useEffect, useState } from "react"; // Added React import
import { API_URLS } from "../config";
// CORRECTED IMPORT: useBooks from BookContext
import type { bookInterface } from "../contexts/BookContenxt"; // Corrected typo
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

// Define the ReviewInterface outside the component for better readability and reusability
export interface ReviewInterface {
  id: number;
  content: string;
  createdAt: string;
  rating: number;
  bookId: number;
  userId: number;
  // Assuming the backend includes user data with the review
  user: {
    id: number;
    name: string;
    // Add other user properties you might receive, e.g., email
  };
}

// Define props for ReviewCard
interface ReviewCardProps {
  bookId: number;
  book: bookInterface | undefined; // 'book' might be undefined if not found in context
}

function ReviewCard({ bookId }: ReviewCardProps) {
  const navigate = useNavigate();
  const { userId, token, isLoggedIn } = useAuth(); // userId can be null if not logged in
  const [reviews, setReviews] = useState<ReviewInterface[] | null>(null); // Corrected type to array
  const [reviewsLoading, setReviewsLoading] = useState<boolean>(true); // Initial state true
  const [reviewsError, setReviewsError] = useState<string | null>(null); // Changed type to string | null

  const [newReviewContent, setNewReviewContent] = useState<string>("");
  const [newReviewRating, setNewReviewRating] = useState<number>(1);
  const [postingReview, setPostingReview] = useState<boolean>(false);
  const [postReviewError, setPostReviewError] = useState<string | null>(null);

  // Function to fetch reviews
  const fetchReviews = async () => {
    // Only fetch if bookId is a valid number
    if (bookId && !isNaN(bookId)) {
      setReviewsLoading(true);
      setReviewsError(null);
      try {
        const response = await axios.get(API_URLS.GET_REVIEW(bookId));
        // Assuming response.data.reviews is an array of reviews
        setReviews(response.data.reviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setReviewsError("Failed to load reviews.");
        setReviews(null); // Clear reviews on error
      } finally {
        setReviewsLoading(false);
      }
    } else {
      setReviews(null);
      setReviewsError("Invalid Book ID for reviews.");
      setReviewsLoading(false);
    }
  };

  // Function to handle posting a new review
  const handlePostReview = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // PREVENT DEFAULT FORM SUBMISSION (PAGE RELOAD)

    // Basic validation
    if (!newReviewContent.trim()) {
      setPostReviewError("Review content cannot be empty.");
      return;
    }
    if (!isLoggedIn || userId === null) {
      setPostReviewError("You must be logged in to post a review.");
      navigate("/sign-in"); // Redirect to sign-in if not logged in
      return;
    }
    if (bookId === undefined || isNaN(bookId)) {
      setPostReviewError("Invalid book ID for posting review.");
      return;
    }

    setPostingReview(true);
    setPostReviewError(null);

    try {
      console.log("accessToken", token);
      const response = await axios.post(
        API_URLS.WRITE_REVIEW(bookId),
        {
          content: newReviewContent,
          userId: userId, // Ensure userId is correctly passed from AuthContext
          bookId: bookId,
          rating: newReviewRating,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      console.log("Review posted successfully:", response.data);
      setNewReviewContent(""); // Clear the input field
      setNewReviewRating(1); // Reset rating
      fetchReviews(); // RE-FETCH REVIEWS TO UPDATE THE LIST
    } catch (error) {
      console.error("Error posting review:", error);
      setPostReviewError("Failed to post review. Please try again.");
    } finally {
      setPostingReview(false);
    }
  };

  // Fetch reviews when the component mounts or bookId changes
  useEffect(() => {
    fetchReviews();
  }, [bookId]); // Dependency array includes bookId so it refetches if bookId changes

  // --- Conditional Rendering for Loading/Error States ---
  // Note: 'book' prop comes from BookProfile, which already handles its own loading/error
  // So, we only need to handle review-specific loading/error here.

  return (
    <div className="lg:mt-5 sm:mt-10 p-5 w-xl lg:mx-auto  bg-white rounded-lg shadow-xl">
      {/* Review Form Section */}
      {isLoggedIn ? (
        <div className="mb-8 p-4 border rounded-lg bg-gray-50">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Post a Review
          </h3>
          <form onSubmit={handlePostReview}>
            {" "}
            {/* Attach onSubmit to the form */}
            <textarea
              placeholder="Write your review here..."
              value={newReviewContent}
              onChange={(e) => setNewReviewContent(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-y min-h-[80px]"
              rows={3}
            />
            <div className="flex items-center justify-between mt-3">
              <span className="text-lg text-purple-600 font-medium">
                Rating: {newReviewRating}
              </span>
              <input
                type="range"
                min={1}
                max={5}
                step={1}
                value={newReviewRating}
                onChange={(e) => setNewReviewRating(Number(e.target.value))}
                className="w-1/2 accent-purple-500"
              />
            </div>
            {postReviewError && (
              <p className="text-red-500 text-sm mt-2">{postReviewError}</p>
            )}
            <button
              type="submit" // Keep type="submit" for form submission
              disabled={postingReview}
              className="mt-4 w-full bg-green-600 text-white p-3 rounded-md text-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {postingReview ? "Posting..." : "Post Review"}
            </button>
          </form>
        </div>
      ) : (
        <div
          className="text-purple-600 m-5 text-xl cursor-pointer text-center p-4 border rounded-lg bg-yellow-50 hover:bg-yellow-100 transition-colors"
          onClick={() => navigate("/sign-in")}
        >
          Please Sign In to Post a Review
        </div>
      )}

      {/* Display Reviews Section */}
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center border-t pt-8">
        All Reviews
      </h2>
      {reviewsLoading && (
        <div className="text-center text-gray-600">Loading reviews...</div>
      )}
      {reviewsError && (
        <div className="text-center text-red-500">
          Error loading reviews: {reviewsError}
        </div>
      )}
      {!reviewsLoading &&
        !reviewsError &&
        (reviews && reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white p-5 rounded-lg shadow-md border border-gray-200 relative"
              >
                <div className="flex items-center mb-2">
                  <div className="text-2xl text-purple-800 font-bold mr-3">
                    {review.user.name}
                  </div>
                  <div className="bg-amber-500 text-white h-8 w-8 flex justify-center items-center rounded-full text-sm font-bold shadow-sm">
                    {review.rating}
                  </div>
                </div>
                <p className="text-xl text-gray-800 mt-2 mb-3">
                  {review.content}
                </p>
                <p className="text-sm text-gray-500 italic">
                  Reviewed on: {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600">
            No reviews yet. Be the first to review!
          </div>
        ))}
    </div>
  );
}

export default ReviewCard;
