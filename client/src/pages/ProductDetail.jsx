import { useState, useEffect } from "react";
import { TiShoppingCart } from "react-icons/ti";
import { IoCloseCircleOutline } from "react-icons/io5";
import { AiFillLike } from "react-icons/ai";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { Spinner } from "flowbite-react";
import Rating from 'react-rating-stars-component';
import CustomRating from "../components/CustomRating";
import ReactPaginate from "react-paginate";
import { IoArrowBackCircle, IoArrowForwardCircle } from "react-icons/io5";
export default function ProductDetail() {
  const [currentPage, setCurrentPage] = useState(0);
  const commentsPerPage = 5;
  const navigate = useNavigate();
  const { plantId } = useParams();// Get the plantId from the URL
  const [isReasonModalOpen, setIsReasonModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedReason, setSelectedReasonId] = useState("");
  const [selectedReasonText, setSelectedReasonText] = useState("");
  const [quantity, setQuantity] = useState(1); // Initial quantity
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
  const [canReview, setCanReview] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [reasons, setReasons] = useState([]);
  const [complaintDetails, setComplaintDetails] = useState(""); // Chi tiết khi gửi form
  const [showModal, setShowModal] = useState(false);
  // Fetch product data when the component mounts



  useEffect(() => {
    const fetchData = async () => {
      try {
        // Kiểm tra userId trước khi sử dụng
        const localUserId = userIds || null;

        const [productRes, reviewsRes, ratingRes, canReviewRes] = await Promise.all([
          fetch(`https://opms1.runasp.net/api/PlantAPI/getPlantById?id=${plantId}`),
          fetch(`https://opms1.runasp.net/api/ReviewAPI/getReviewsByPlantId?plantId=${plantId}`),
          fetch(`https://opms1.runasp.net/api/ReviewAPI/getProductRatingSummary?plantId=${plantId}`),
          localUserId
            ? fetch(`https://opms1.runasp.net/api/ReviewAPI/canReview?userId=${localUserId}&plantId=${plantId}`)
            : Promise.resolve({ json: () => ({ canReview: false }) }),
        ]);

        const [productData, reviewsData, ratingData, canReviewData] = await Promise.all([
          productRes.json(),
          reviewsRes.json(),
          ratingRes.json(),
          canReviewRes.json(),
        ]);
        const UsersResponse = await fetch(
          "https://opms1.runasp.net/api/UserAPI/getUser"
        );
        if (!UsersResponse.ok) {
          throw new Error("Failed to fetch categories");
        }
        const usersData = await UsersResponse.json();
        console.log(usersData)
        setUsers(usersData);

        setProductData(productData);
        setReviews(reviewsData);
        setRatingSummary(ratingData);
        setCanReview(canReviewData.canReview || false);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [plantId, userIds]);

  // check review
  useEffect(() => {
    const checkCanReview = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      try {
        const response = await fetch(`https://opms1.runasp.net/api/ReviewAPI/canReview?userId=${userId}&plantId=${plantId}`);
        const data = await response.json();
        setCanReview(data.canReview);
      } catch (error) {
        console.error("Error checking review permission:", error);
      }
    };

    checkCanReview();
  }, [plantId]);
  const handleReason = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId || userId === "undefined") {
      navigate("/sign-in");
      return;
    }

    try {
      const response = await fetch("https://opms1.runasp.net/api/ReasonsAPI/getReasons");
      if (!response.ok) {
        throw new Error("Không thể lấy danh sách lý do");
      }
      const data = await response.json();

      setReasons(data); // Lưu danh sách lý do vào state
      setIsReasonModalOpen(true);
    } catch (err) {
      console.error(err);
      setSuccessMessage("Đã xảy ra lỗi khi tải danh sách lý do");
    }
  };
  const handleReasonSelect = (reasonId, reasonText) => {
    setSelectedReasonId(reasonId); // Lưu ID lý do
    setSelectedReasonText(reasonText); // Lưu nội dung lý do
    setIsReasonModalOpen(false); // Đóng Reason Modal
    setIsFormModalOpen(true); // Mở Form Modal
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const reportData = {
      reportId: 0, // ID được tự động tạo
      userId: localStorage.getItem("userId"),
      plantId: plantId, // Bạn có thể cập nhật giá trị này nếu cần
      reasonsId: selectedReason, // ID lý do
      reportContent: complaintDetails, // Nội dung chi tiết
      createdDate: new Date().toISOString(),
    };
    console.log("Dữ liệu gửi đi:", reportData);
    try {
      const response = await fetch("https://opms1.runasp.net/api/ReportsAPI/createReport", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reportData),
      });

      if (response.ok) {
        setSuccessMessage("Tạo báo cáo thành công!");
        resetForm(); // Reset trạng thái form
      } else {
        const errorData = await response.json();
        setSuccessMessage(`Lỗi: ${errorData.message || "Không xác định"}`);
      }
    } catch (error) {
      console.error("Lỗi khi gửi báo cáo:", error);
      setSuccessMessage("Đã xảy ra lỗi, vui lòng thử lại.");
    } finally {
      // Tự động ẩn thông báo sau 2 giây
      setTimeout(() => setSuccessMessage(""), 2000);
    }
  };
  const handleCancel = () => {
    setIsFormModalOpen(false);
    setSelectedReasonId(""); // Reset ID lý do
    setSelectedReasonText(""); // Reset nội dung lý do
    setComplaintDetails(""); // Reset chi tiết
  };
  const resetForm = () => {
    setIsFormModalOpen(false); // Đóng modal
    setSelectedReasonId(""); // Reset lý do
    setSelectedReasonText(""); // Reset nội dung lý do
    setComplaintDetails(""); // Reset chi tiết
  };
  // Hàm để lấy tên người dùng dựa trên userId
  const fetchProductReviews = async () => {
    try {
      const reviewResponse = await fetch(`https://opms1.runasp.net/api/ReviewAPI/getReviewsByPlantId?plantId=${plantId}`);
      let reviewData = await reviewResponse.json();

      // Ensure reviews is an array
      if (!Array.isArray(reviewData)) reviewData = [];

      // Fetch user details for each review
      const updatedReviews = await Promise.all(
        reviewData.map(async (review) => {
          try {
            const userResponse = await fetch(`https://opms1.runasp.net/api/UserAPI/getUserByIds?userId=${review.userId}`);
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
    // Call the fetch function on mount

  }, [plantId]);
  // Function to handle increment
  const incrementQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  // Function to handle decrement

  const decrementQuantity = () => {
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

    const userId = localStorage.getItem("userId");
    const status = localStorage.getItem("status");
    if (status === "0") {
      setShowModal(true);

      // Tạo bộ đếm thời gian (timeout) nếu không bấm
      const timer = setTimeout(() => {
        handleLogout();
      }, 3000);

      return () => clearTimeout(timer); // Dọn dẹp bộ đếm nếu người dùng bấm nút

    } // Lấy userId từ localStorage
    if (!userId) {
      setNotification("Bạn cần đăng nhập để gửi đánh giá.");
      return;
    }

    try {
      // Kiểm tra quyền đánh giá
      const checkResponse = await fetch(
        `https://opms1.runasp.net/api/ReviewAPI/canReview?userId=${userId}&plantId=${plantId}`
      );
      const checkData = await checkResponse.json();

      if (!checkData.canReview) {
        setNotification("Bạn không thể đánh giá sản phẩm này vì chưa mua.");
        return;
      }

      // Gửi đánh giá và cập nhật dữ liệu liên quan
      const [createReviewResponse, updatedRatingData] = await Promise.all([
        fetch(`https://opms1.runasp.net/api/ReviewAPI/createReview`, {
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
        }),
        fetch(
          `https://opms1.runasp.net/api/ReviewAPI/getProductRatingSummary?plantId=${plantId}`
        ).then((res) => res.json()),
      ]);

      if (createReviewResponse.ok) {
        setNotification("Đánh giá của bạn đã được gửi");
        setRating(0);
        setComment("");

        // Cập nhật giao diện với dữ liệu mới
        fetchProductReviews();
        setRatingSummary(updatedRatingData);

        setTimeout(() => {
          setNotification(""); // Ẩn thông báo sau 3 giây
        }, 3000);
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
  const handleLogout = () => {
    // Clear localStorage và trạng thái
    localStorage.removeItem("status");
    localStorage.clear();
    localStorage.setItem("signOut", Date.now());
    setShowModal(false);
    navigate("/sign-in");
    window.location.reload(true); // Reload trang sau đăng xuất

  };
  const addToCart = async (productId, quantity) => {
    const userId = localStorage.getItem("userId");
    const status = localStorage.getItem("status");
    if (status === "0") {
      setShowModal(true);

      // Tạo bộ đếm thời gian (timeout) nếu không bấm
      const timer = setTimeout(() => {
        handleLogout();
      }, 3000);

      return () => clearTimeout(timer); // Dọn dẹp bộ đếm nếu người dùng bấm nút

    }
    if (!userId || userId === "undefined") {
      navigate("/sign-in");
      return;
    }
    if (quantity <= 0
    ) {
      setSuccessMessage("Số lượng phải lớn hơn 0")
      setTimeout(() => setSuccessMessage(''), 2000);
      return;
    }
    try {
      const response = await fetch('https://opms1.runasp.net/api/ShoppingCartAPI/createShoppingCart', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plantId: productId,
          quantity: quantity,
          userId: userIds,

        }),
      });

      if (response.ok) {
        setSuccessMessage("Sản phẩm đã được thêm vào giỏ hàng!");
      } else {
        const errorData = await response.json(); // Lấy dữ liệu phản hồi lỗi từ server
        if (response.status === 404 && errorData.message === "Not enough stock available.") {
          setSuccessMessage("Không đủ hàng trong kho.");
        } else {
          setSuccessMessage("Đã xảy ra lỗi. Vui lòng thử lại.");
        }
      }
      setTimeout(() => {
        setSuccessMessage('');
      }, 2000);
    } catch (err) {
      console.error("Lỗi thêm sản phẩm vào giỏ hàng:", err);
      setSuccessMessage("Đã xảy ra lỗi khi thêm sản phẩm vào giỏ hàng.");
    }
    finally {
      setTimeout(() => {
        setSuccessMessage('');
      }, 2000);
    }
  };
  const buyNow = async (productId, quantity) => {
    const userId = localStorage.getItem("userId");
    const status = localStorage.getItem("status");
  
    if (status === "0") {
      setShowModal(true);
  
      // Tạo bộ đếm thời gian (timeout) nếu không bấm
      const timer = setTimeout(() => {
        handleLogout();
      }, 3000);
  
      return () => clearTimeout(timer); // Dọn dẹp bộ đếm nếu người dùng bấm nút
    }
    if (!userId || userId === "undefined") {
      navigate("/sign-in");
      return;
    }
    if (quantity <= 0) {
      setSuccessMessage("Số lượng phải lớn hơn 0");
      setTimeout(() => setSuccessMessage(''), 2000);
      return;
    }
    try {
      const response = await fetch('https://opms1.runasp.net/api/ShoppingCartAPI/createBuyNowCart', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plantId: productId,
          quantity: quantity,
          userId: userId,
        }),
      });
  
      if (response.ok) {
        const data = await response.json(); // Lấy dữ liệu phản hồi từ server
        const shoppingCartId = data.shoppingCartItemId; // Giả sử server trả về "shoppingCartId"
  
        const selectedCartItems = [shoppingCartId];
        localStorage.setItem("selectedCartItems", JSON.stringify(selectedCartItems));
  
        // Gọi API để lấy giá sản phẩm
        const plantResponse = await fetch(`https://opms1.runasp.net/api/PlantAPI/getPlantById?id=${productId}`);
        if (plantResponse.ok) {
          const plantData = await plantResponse.json();
          const productPrice = plantData.price; // Giả sử API trả về trường "price"
  
          // Tính tổng tiền với voucher (nếu có)
          const voucherDiscount = plantData.discount; // Giảm giá từ voucher (nếu có)
          const totalWithVouchers = productPrice * quantity * (1 - voucherDiscount / 100);
  
          // Lưu tổng tiền vào localStorage
          localStorage.setItem("totalWithVouchers", totalWithVouchers);
  
          setSuccessMessage("Sản phẩm đã được thêm vào giỏ hàng!");
  
          // Điều hướng tới trang thanh toán
          navigate("/payment");
        } else {
          setSuccessMessage("Không thể lấy thông tin sản phẩm.");
        }
      } else {
        const errorData = await response.json();
        if (response.status === 404 && errorData.message === "Not enough stock available.") {
          setSuccessMessage("Không đủ hàng trong kho.");
        } else {
          setSuccessMessage("Đã xảy ra lỗi. Vui lòng thử lại.");
        }
      }
      setTimeout(() => {
        setSuccessMessage('');
      }, 2000);
    } catch (err) {
      console.error("Lỗi thêm sản phẩm vào giỏ hàng:", err);
      setSuccessMessage("Đã xảy ra lỗi khi thêm sản phẩm vào giỏ hàng.");
    } finally {
      setTimeout(() => {
        setSuccessMessage('');
      }, 2000);
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
          <span className="ml-3 text-lg font-semibold">Đang tải...</span>
        </div>
      );
    }
    // Tính tổng số trang chỉ khi reviews không rỗng
    const pageCount = reviews.length > 0
      ? Math.ceil(reviews.length / commentsPerPage)
      : 0;

    const displayedReviews = reviews.length > 0
      ? reviews.slice(
        currentPage * commentsPerPage,
        (currentPage + 1) * commentsPerPage
      )
      : [];

    // Hàm xử lý khi click vào trang
    const handlePageClick = (event) => {
      if (reviews.length > 0) {
        setCurrentPage(event.selected);
      }
    };

    if (error) {
      return <div>Lỗi: {error}</div>;
    }

    const { plantName, price, discount, description, imageUrl, rating: productRating, userId } = productData || {};

    // Tính số sao trung bình
    const averageRating = (ratingSummary.totalRating / ratingSummary.totalReviews).toFixed(1);

    return (
      <body className="overflow-hidden bg-gray-100">
        {successMessage && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-green-500 text-white text-lg font-semibold py-2 px-6 rounded-lg shadow-lg transform -translate-y-60">
              {successMessage}
            </div>
          </div>
        )}
        {/* Render Modal nếu trạng thái showModal là true */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
              <h3 className="text-lg font-semibold mb-2">Tài khoản của bạn đã bị khóa</h3>
              <p className="text-sm mb-4">Vui lòng đăng xuất hoặc đợi 3 giây để tự động chuyển sang màn hình đăng nhập</p>
              <div className="mt-4 flex justify-around">

              </div>
            </div>
          </div>
        )}
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
                    ₫{new Intl.NumberFormat("en-US").format(
                      price - (price * (discount / 100)) || 0
                    )} {/* Dynamic price */}
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
                      <p>({isNaN(averageRating) || !averageRating ? 0 : averageRating})</p> {/* Dynamic rating */}
                    </p>
                    <a
                      href="#"
                      className="text-sm font-medium leading-none text-gray-900 underline hover:no-underline dark:text-white"
                    >
                      {ratingSummary.totalReviews} Đánh giá {/* Show total reviews */}
                    </a>
                  </div>

                  <div className="ml-auto">
                    {/* Button to open reason modal */}
                    <button
                      onClick={() => handleReason()} // Chỉ mở modal khi đã đăng nhập
                      className="block font-medium rounded-lg text-sm px-5 py-2.5 text-center
                       text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-800"
                    >
                      Tố cáo
                    </button>
                  </div>
                  {/* Reason Modal */}
                  {isReasonModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-gray-900 bg-opacity-50">
                      <div
                        className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-700 max-w-md w-full"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Chọn lý do tố cáo
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
                            {reasons.map((reason, index) => (
                              <li key={reason.reasonsId}>
                                <button
                                  className="block w-full text-left text-gray-900 hover:underline dark:text-white"
                                  onClick={() => handleReasonSelect(reason.reasonsId, reason.reasons)}
                                >
                                  {reason.reasons}
                                </button>
                              </li>
                            ))}
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
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Lý do
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
                            Lý do bạn đã chọn: {selectedReasonText}
                          </p>
                          <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                              <label
                                htmlFor="complaintDetails"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                              >
                                Chi tiết
                              </label>
                              <textarea
                                id="complaintDetails"
                                name="complaintDetails"
                                rows="4"
                                className="block w-full p-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                value={complaintDetails}
                                onChange={(e) => setComplaintDetails(e.target.value)}
                                required
                              ></textarea>
                            </div>
                            <div className="flex items-center justify-end">
                              <button
                                type="submit"
                                className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700"
                              >
                                Gửi
                              </button>
                              <button
                                type="button"
                                className="ml-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:bg-gray-500 dark:hover:bg-gray-600"
                                onClick={handleCancel}
                              >
                                Hủy
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

                  <button
                    onClick={() => buyNow(plantId, quantity)}
                    className="flex items-center justify-center py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                  >
                    <TiShoppingCart className="text-2xl" />
                    Mua ngay
                  </button>

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
                    Nhà vườn: {getUserName(userId)}
                  </p>
                </Link>
                <hr className="my-6 md:my-8 border-gray-200 dark:border-gray-800" />
                <div className="text-gray-500 dark:text-gray-400" dangerouslySetInnerHTML={{ __html: description }} />
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
              {displayedReviews.length > 0 ? (
                displayedReviews.map((review) => (
                  <div key={review.reviewId} className="flex space-x-4">
                    <img
                      src={review.userImage || "https://via.placeholder.com/40"}
                      alt={`${review.userName} avatar`}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold">{review.username}</h4>
                        <span className="text-sm text-gray-500">{new Date(review.reviewDate).toLocaleDateString()}</span>
                      </div>
                      <p className="mt-2 text-gray-700">{review.comment}</p>
                      <div class="flex items-center gap-1 mt-2">
                        <svg
                          class="w-4 h-4 text-yellow-300"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z"
                          />
                        </svg>
                        <p class="text-gray-700">4</p>
                      </div>

                      <div className="flex items-center space-x-4 mt-2">
                        {/* Like button */}
                        <button className="flex items-center text-sm text-blue-500 hover:underline">
                          <AiFillLike className="mr-1" /> Thích
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400">Chưa có review nào về sản phẩm này</p>
              )}
            </div>
            <div className="w-full flex justify-center mt-4">
              {reviews.length > 0 ? (
                <ReactPaginate
                  previousLabel={<IoArrowBackCircle />}
                  nextLabel={<IoArrowForwardCircle />}
                  breakLabel={"..."}
                  pageCount={pageCount}
                  onPageChange={handlePageClick}
                  containerClassName={"flex justify-center space-x-4"}
                  pageClassName={
                    "flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-200 cursor-pointer transition duration-300"
                  }
                  activeClassName={"bg-black text-white"}
                  pageLinkClassName={"w-full h-full flex items-center justify-center"}
                  breakClassName={"flex items-center justify-center w-8 h-8"}
                  breakLinkClassName={"w-full h-full flex items-center justify-center"}
                  previousClassName={
                    "flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-200 cursor-pointer transition duration-300"
                  }
                  nextClassName={
                    "flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-200 cursor-pointer transition duration-300"
                  }
                  disabledClassName={"opacity-50 cursor-not-allowed"}
                />
              ) : (
                <div className="text-gray-500"></div>
              )}
            </div>
          </div>

          {/* Review Form */}
          <div className="mt-10">
            {canReview ? (
              <>
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
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Viết bình luận của bạn"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500"
                    rows="5"
                  ></textarea>
                  <button
                    type="submit"
                    className={`block text-white font-medium rounded-lg text-sm px-5 py-2.5 ${comment.trim()
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-gray-300 cursor-not-allowed"
                      }`}
                    disabled={!comment.trim()} // Vô hiệu hóa nếu không có dữ liệu
                  >
                    Gửi đánh giá
                  </button>
                </form>
              </>
            ) : (
              <p className="text-gray-500">Chỉ những người đã mua sản phẩm này mới có thể đánh giá.</p>
            )}
          </div>
        </div>
      </body>
    );
  }
