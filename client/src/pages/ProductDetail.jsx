import { useState, useEffect } from "react";
import { TiShoppingCart } from "react-icons/ti";
import { IoCloseCircleOutline } from "react-icons/io5";
import { AiFillLike } from "react-icons/ai";
import { useParams } from "react-router-dom";
import Rating from 'react-rating-stars-component';

export default function ProductDetail() {

  const { plantId } = useParams();// Get the plantId from the URL
  const [isReasonModalOpen, setIsReasonModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [quantity, setQuantity] = useState(0); // Initial quantity
  const [productData, setProductData] = useState(null); // New state to store product data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [reviews, setReviews] = useState([]); // Ensure reviews is an array
  const [ratingSummary, setRatingSummary] = useState({ totalReviews: 0, totalRating: 0 });
  const [rating, setRating] = useState(0); // State to store the user's rating
  const [comment, setComment] = useState(""); // State to store the user's comment
  const [notification, setNotification] = useState("");
  const [userData, setUserData] = useState(null); // State to store the notification message

  const userIds = localStorage.getItem("userId");
  // Fetch product data when the component mounts
  useEffect(() => {

    const fetchProductData = async () => {
      try {
        // Fetch product details
        const response = await fetch(`https://localhost:7098/api/PlantAPI/getPlantById?id=${plantId}`);
        if (!response.ok) throw new Error("Không thể lấy dữ liệu sản phẩm");
        const data = await response.json();
        setProductData(data);
  
        // Fetch reviews
        const reviewResponse = await fetch(`https://localhost:7098/api/ReviewAPI/getReviewsByPlantId?plantId=${plantId}`);
        let reviewData = await reviewResponse.json();
  
        // Ensure reviews is an array
        if (!Array.isArray(reviewData)) reviewData = [];
  
        // Use Promise.all to fetch user names for each review's userId
        const updatedReviews = await Promise.all(
          reviewData.map(async (review) => {
            // Fetch userName based on userId
            const userResponse = await fetch(`https://localhost:7098/api/UserAPI/getUserById?userId=${review.userId}`);
            if (!userResponse.ok) {
              console.error(`Error fetching user data for userId: ${review.userId}`);
              return review; // Return the review unchanged if the user API call fails
            }
            const userData = await userResponse.json();
            // Assign the fetched userName to the review
            return { ...review, userName: userData.userName };
          })
        );

        setReviews(updatedReviews);

        

        // Fetch rating summary
        const ratingResponse = await fetch(`https://localhost:7098/api/ReviewAPI/getProductRatingSummary?plantId=${plantId}`);
        const ratingData = await ratingResponse.json();
        setRatingSummary(ratingData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData(); // Call the fetch function on mount

  }, [plantId]);
  // Hàm để lấy tên người dùng dựa trên userId
  const fetchUserNameForReview = async (userId) => {
    try {
      const userResponse = await fetch(`https://localhost:7098/api/UserAPI/getUserById?userId=${userId}`);
      if (!userResponse.ok) {
        console.error(`Error fetching user data for userId: ${userId}`);
        return "Unknown User"; 
      }
      const userData = await userResponse.json();
      console.log("Fetched User Data: ", userData.userName);
      setUserData(userData);
    } catch (error) {
      console.error("Error fetching user name:", error);
      return "Unknown User"; 
    }
  };

  // Function to handle increment
  const incrementQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  // Function to handle decrement

  const decrementQuantity  = () => {
    setQuantity((prevQuantity) => (prevQuantity > 0 ? prevQuantity - 1 : 0));
  };

  // Function to handle manual input
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 0) {
      setQuantity(value);
    } else if (e.target.value === "") {
      setQuantity(""); // Allow empty value while typing
    }
  };

  // Reset empty input to 1 on blur
  const handleBlur = () => {
    if (!quantity) {
      setQuantity(0);
    }
  };

  // Handle rating change
  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  // Handle review submit
  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem("userId"); // Giả sử bạn lưu userId trong localStorage
    if (!userId) {
      setNotification("Bạn cần đăng nhập để gửi đánh giá.");
      return;
    }

    // Gửi đánh giá đến API
    try {
      const response = await fetch(`https://localhost:7098/api/ReviewAPI/createReview`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plantId: plantId,
          rating: rating,
          comment: comment,
          userId: userId,
        }),
      });
      if (response.ok) {
        setNotification("Đánh giá của bạn đã được gửi");
        setTimeout(() => {
          setNotification(""); // Ẩn thông báo sau 3 giây
        }, 3000);

        // Fetch reviews and rating summary again after successful submission
        // Refresh reviews and rating summary after submission
        const reviewResponse = await fetch(`https://localhost:7098/api/ReviewAPI/getReviewsByPlantId?plantId=${plantId}`);
      let reviewData = await reviewResponse.json();

      // Ensure reviews is an array
      if (!Array.isArray(reviewData)) reviewData = [];

      // Compare review.userId with userData.userId and assign userName
      const updatedReviews = reviewData.map((review) => {
        // If review.userId matches userData.userId, assign userData.userName
        if (review.userId === userData?.userId) {
          review.userName = userData.userName; // Assign userData.userName to the review
        }
        return review;
      });
        setReviews(updatedReviews);

        const ratingResponse = await fetch(`https://localhost:7098/api/ReviewAPI/getProductRatingSummary?plantId=${plantId}`);
        const ratingData = await ratingResponse.json();
        setRatingSummary(ratingData);
      } else {
        setNotification("Có lỗi xảy ra khi gửi đánh giá của bạn");
        setTimeout(() => {
          setNotification("");
        }, 3000);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      setNotification("Có lỗi xảy ra khi gửi đánh giá của bạn");
      setTimeout(() => {
        setNotification("");
      }, 3000);
    }
  };
  const addToCart = async (productId, quantity) => {
    try {
      const response = await fetch('https://localhost:7098/api/ShoppingCartAPI/createShoppingCart', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plantId: productId,
          quantity: quantity,
          userId : userIds,

        }),
      });

      if (response.ok) {
        alert("Sản phẩm đã được thêm vào giỏ hàng!");
      } else {
        const errorResponse = await response.json();
        alert(`Không thể thêm sản phẩm vào giỏ hàng. ${errorResponse.message}`);
      }
    } catch (err) {
      console.error("Lỗi thêm sản phẩm vào giỏ hàng:", err);
      alert("Đã xảy ra lỗi khi thêm sản phẩm vào giỏ hàng.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const { plantName, price, description, imageUrl, rating: productRating } = productData || {};

  // Tính số sao trung bình
  const averageRating = (ratingSummary.totalRating / ratingSummary.totalReviews).toFixed(1);

  return (
    <body className="overflow-hidden bg-gray-100">
      <section className="py-10 bg-white shadow-lg shadow-gray-200 rounded-md md:py-10 dark:bg-gray-900 antialiased p-10 m-10">
        <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16">
            <div className="shrink-0 max-w-md lg:max-w-lg mx-auto">
              <img
                className="w-full dark:hidden"
                src={imageUrl || "https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front.svg"}
                alt={plantName || "Product Image"}
              />
              <img
                className="w-full hidden dark:block"
                src={imageUrl || "https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front-dark.svg"}
                alt={plantName || "Product Image"}
              />
            </div>

            <div className="mt-6 sm:mt-8 lg:mt-0">
              <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
                {plantName || "Product Name"} {/* Dynamic product name */}
              </h1>

              <div className="mt-4 sm:items-center sm:gap-4 sm:flex">
                <p className="text-2xl font-extrabold text-gray-900 sm:text-3xl dark:text-white">
                  ${(price || 0).toFixed(3)} {/* Dynamic price */}
                </p>

                <div className="flex items-center gap-2 mt-2 sm:mt-0">
                  <div className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4 text-yellow-300"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium leading-none text-gray-500 dark:text-gray-400">
                    ({averageRating || "5.0"}) {/* Dynamic rating */}
                  </p>
                  <a
                    href="#"
                    className="text-sm font-medium leading-none text-gray-900 underline hover:no-underline dark:text-white"
                  >
                    {ratingSummary.totalReviews} Reviews {/* Show total reviews */}
                  </a>
                </div>

                <div className="ml-auto">
                  {/* Button to open reason modal */}
                  <button
                    onClick={() => setIsReasonModalOpen(true)}
                    className="block text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-800"
                  >
                    Report
                  </button>
                </div>
              </div>

              <div className="mt-6 sm:gap-4 sm:items-center sm:flex sm:mt-8">

                <button 
                  onClick={() => addToCart(plantId, quantity)} // Gọi hàm thêm vào giỏ hàng khi nhấn nút
                  className="flex items-center justify-center py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                >
                  <TiShoppingCart className="text-2xl" />
                  Add to cart
                </button>

                <a
                  href="#"
                  title="Buy now"
                  className="flex items-center justify-center py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                >
                  <TiShoppingCart className="text-2xl" />
                  Buy Now
                </a>

                {/* Quantity */}
                <label className="text-gray-900 text-sm dark:text-white ml-4">Quantity:</label>
                <div className="flex items-center mt-2">
                  <button
                    type="button"
                    onClick={decrementQuantity}
                    className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
                  >
                    <svg
                      className="h-2.5 w-2.5 text-gray-900 dark:text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 18 2"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M1 1h16"
                      />
                    </svg>
                  </button>
                  <input
                    type="text"
                    id="counter-input"
                    className="w-16 min-w-[50px] shrink-0 border-0 bg-transparent text-center text-sm font-medium text-gray-900 focus:outline-none focus:ring-0 dark:text-white"
                    value={quantity}
                    onChange={handleQuantityChange}
                    onBlur={handleBlur}
                  />
                  <button
                    type="button"
                    onClick={incrementQuantity}
                    className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
                  >
                    <svg
                      className="h-2.5 w-2.5 text-gray-900 dark:text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 18 18"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 1v16M1 9h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <hr className="my-6 md:my-8 border-gray-200 dark:border-gray-800" />

              <p className="text-gray-500 dark:text-gray-400">{description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Hiển thị thông báo */}
      {notification && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="p-4 bg-blue-500 text-white rounded-lg shadow-lg">
            {notification}
          </div>
        </div>
      )}

      <div className="py-10 bg-white shadow-lg shadow-gray-200 rounded-md md:py-10 dark:bg-gray-900 antialiased p-10 m-10">
        {/* Comments List */}
        <div>
          <h3 className="text-2xl font-semibold mb-6">{ratingSummary.totalReviews} Comments</h3>
          <div className="space-y-8">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.reviewId} className="flex space-x-4">
                  <img
                    src={review.userAvatar || "https://via.placeholder.com/40"}
                    alt={`${review.userName} avatar`}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold">{review.userName }</h4>
                      <span className="text-sm text-gray-500">{new Date(review.reviewDate).toLocaleDateString()}</span>
                    </div>
                    <p className="mt-2 text-gray-700">{review.comment}</p>

                    <div className="flex items-center space-x-4 mt-2">
                      {/* Like button */}
                      <button className="flex items-center text-sm text-blue-500 hover:underline">
                        <AiFillLike className="mr-1" /> Like
                      </button>
                      {/* Reply button */}
                      <button className="text-sm text-blue-500 hover:underline">Reply</button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400">Chưa có review nào về sản phẩm này</p>
            )}
          </div>
        </div>

        {/* Review Form */}
        <div className="mt-10">
          <h3 className="text-2xl font-semibold mb-4">Đánh giá sản phẩm</h3>
          <form onSubmit={handleReviewSubmit} className="space-y-4">
            {/* Star Rating Component */}
            <Rating
              count={5}
              onChange={handleRatingChange}
              size={24}
              activeColor="#ffd700"
            />
            <div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Viết bình luận của bạn"
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500"
                rows="5"
              ></textarea>
            </div>

            <button type="submit" className="block text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-800">
              Gửi đánh giá
            </button>
          </form>
        </div>
      </div>
    </body>
  );
}
