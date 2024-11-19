import { useState, useEffect } from "react";
import { TiShoppingCart } from "react-icons/ti";
import { IoCloseCircleOutline } from "react-icons/io5";
import { AiFillLike } from "react-icons/ai";
import { useParams } from "react-router-dom";
import { Spinner } from "flowbite-react";
import Rating from 'react-rating-stars-component';
import { Link } from "react-router-dom";
import CustomRating from "../components/CustomRating";
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
  const [users, setUsers] = useState([]);
  const userIds = localStorage.getItem("userId");
  // Fetch product data when the component mounts
 
    
    
    const fetchProductData = async () => {
      try {
        // lấy data plants theo plantid
        const response = await fetch(`https://localhost:7098/api/PlantAPI/getPlantById?id=${plantId}`);
        if (!response.ok) throw new Error("Không thể lấy dữ liệu sản phẩm");
        const data = await response.json();
        setProductData(data);
        // lấy thông tin user
        const UsersResponse = await fetch(
          "https://localhost:7098/api/UserAPI/getUser"
        );
        if (!UsersResponse.ok) {
          throw new Error("Failed to fetch categories");
        }
        const usersData = await UsersResponse.json();
        console.log(usersData)
        setUsers(usersData);
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

   
  const handleReasonSelect = (reason) => {
    setSelectedReason(reason);
    setIsReasonModalOpen(false);
    setIsFormModalOpen(true);
  };
  // Hàm để lấy tên người dùng dựa trên userId
  const fetchProductReviews = async () => {
    try {
      const reviewResponse = await fetch(`https://localhost:7098/api/ReviewAPI/getReviewsByPlantId?plantId=${plantId}`);
      let reviewData = await reviewResponse.json();
  
      // Ensure reviews is an array
      if (!Array.isArray(reviewData)) reviewData = [];
  
      // Fetch user details for each review
      const updatedReviews = await Promise.all(
        reviewData.map(async (review) => {
          try {
            const userResponse = await fetch(`https://localhost:7098/api/UserAPI/getUserByIds?userId=${review.userId}`);
            const userData = await userResponse.json();
            return {
              ...review,
              username: userData.userName,
              userImage: userData.image || "https://via.placeholder.com/40"
            };
          } catch (error) {
            console.error("Error fetching user data for review:", error);
            return {
              ...review,
              username: "Unknown User",
              userImage: "https://via.placeholder.com/40"
            };
          }
        })
      );
  
      setReviews(updatedReviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };
  useEffect(() => {
    fetchProductReviews(); 
  fetchProductData(); // Call the fetch function on mount

}, [plantId]);
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
        setRating(0);
        setComment("");
        setTimeout(() => {
          setNotification(""); // Ẩn thông báo sau 3 giây
        }, 3000);

       
        fetchProductReviews();

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
    if(quantity <= 0
    ){
      alert("Số lượng phải lớn hơn 0")
      return;
    }
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
  const getUserName = (userId) => {
    const user = users.find((u) => u.userId === userId);
    return user ? user.shopName : "Không tìm thấy người dùng";
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner aria-label="Loading spinner" size="xl" />
        <span className="ml-3 text-lg font-semibold">Loading...</span>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const { plantName, price, description, imageUrl, rating: productRating,userId } = productData || {};

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
                    Phản hổi
                  </button>
                </div>
                {/* Reason Modal */}
                {isReasonModalOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-gray-900 bg-opacity-50">
                    <div
                      className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-700 max-w-md w-full"
                      onClick={(e) => e.stopPropagation()} // To prevent closing modal on content click
                    >
                      <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                          Select reason for complaint
                        </h3>
                        <button
                          className="text-2xl"
                          onClick={() => setIsReasonModalOpen(false)}
                        >
                          <IoCloseCircleOutline />
                        </button>
                      </div>
                      <div className="p-4 space-y-4">
                        <ul className="space-y-2">
                          <li>
                            <button
                              className="block w-full text-left text-gray-900 hover:underline dark:text-white"
                              onClick={() => handleReasonSelect("Lý do A")}
                            >
                              reason A
                            </button>
                          </li>
                          <li>
                            <button
                              className="block w-full text-left text-gray-900 hover:underline dark:text-white"
                              onClick={() => handleReasonSelect("Lý do B")}
                            >
                              reason B
                            </button>
                          </li>
                          <li>
                            <button
                              className="block w-full text-left text-gray-900 hover:underline dark:text-white"
                              onClick={() => handleReasonSelect("Lý do C")}
                            >
                              reason C
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Form Modal */}
                {isFormModalOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-gray-900 bg-opacity-50">
                    <div
                      className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-700 max-w-md w-full"
                      onClick={(e) => e.stopPropagation()} // To prevent closing modal on content click
                    >
                      <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                          Reason
                        </h3>
                        <button
                          className="text-2xl"
                          onClick={() => setIsFormModalOpen(false)}
                        >
                          <IoCloseCircleOutline />
                        </button>
                      </div>
                      <div className="p-4 space-y-4">
                        <p className="text-sm text-gray-700 dark:text-white">
                          Reason you selected: {selectedReason}
                        </p>
                        <form>
                          <div className="mb-4">
                            <label
                              htmlFor="complaintDetails"
                              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                            >
                              Details of the reason for the complaint
                            </label>
                            <textarea
                              id="complaintDetails"
                              name="complaintDetails"
                              rows="4"
                              className="block w-full p-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                              required
                            ></textarea>
                          </div>
                          <div className="flex items-center justify-end">
                            <button
                              type="submit"
                              className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700"
                            >
                              Summit
                            </button>
                            <button
                              className="ml-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:bg-gray-500 dark:hover:bg-gray-600"
                              onClick={() => setIsFormModalOpen(false)}
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 sm:gap-4 sm:items-center sm:flex sm:mt-8">

                <button 
                  onClick={() => addToCart(plantId, quantity)} // Gọi hàm thêm vào giỏ hàng khi nhấn nút
                  className="flex items-center justify-center py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                >
                  <TiShoppingCart className="text-2xl" />
                  Thêm vào giỏ hàng
                </button>

                <a
                  href="#"
                  title="Buy now"
                  className="flex items-center justify-center py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                >
                  <TiShoppingCart className="text-2xl" />
                  Mua ngay
                </a>

                {/* Quantity */}
                <label className="text-gray-900 text-sm dark:text-white ml-4">Số Lượng:</label>
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
              <br></br>
              <Link to={`/producsSeller/${userId}`}>
                <p className="ml-3 mt-2 text-sm font-medium text-gray-900 dark:text-white hover:underline">
                  Người bán: {getUserName(userId)}
                </p>
              </Link>
              <hr className="my-6 md:my-8 border-gray-200 dark:border-gray-800" />
              <div className="text-gray-500 dark:text-gray-400"dangerouslySetInnerHTML={{ __html: description }}/>
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
          <h3 className="text-2xl font-semibold mb-6">{ratingSummary.totalReviews} Bình luận</h3>
          <div className="space-y-8">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.reviewId} className="flex space-x-4">
                  <img
                    src={review.userImage || "https://via.placeholder.com/40"}
                    alt={`${review.userName} avatar`}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold">{review.username }</h4>
                      <span className="text-sm text-gray-500">{new Date(review.reviewDate).toLocaleDateString()}</span>
                    </div>
                    <p className="mt-2 text-gray-700">{review.comment}</p>

                    <div className="flex items-center space-x-4 mt-2">
                      {/* Like button */}
                      <button className="flex items-center text-sm text-blue-500 hover:underline">
                        <AiFillLike className="mr-1" /> Thích
                      </button>
                      {/* Reply button */}
                      <button className="text-sm text-blue-500 hover:underline">Phản hồi</button>
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
            <CustomRating
            count={5}
            value={rating}
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
