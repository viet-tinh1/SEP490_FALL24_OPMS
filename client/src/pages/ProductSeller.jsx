import { Sidebar } from "flowbite-react";
import { TbShoppingBagSearch } from "react-icons/tb";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { PiShoppingCartLight } from "react-icons/pi";
import ReactPaginate from "react-paginate";
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Spinner } from "flowbite-react";
import { IoArrowBackCircle, IoArrowForwardCircle } from "react-icons/io5";
import { IoChevronDown } from "react-icons/io5";

function formatTimeDifference(timestamp) {
  const now = new Date();
  const time = new Date(timestamp);
  const differenceInSeconds = Math.floor((now - time) / 1000);

  if (differenceInSeconds < 60) {
    return `${differenceInSeconds} giây trước`;
  } else if (differenceInSeconds < 3600) {
    const minutes = Math.floor(differenceInSeconds / 60);
    return `${minutes} phút trước`;
  } else if (differenceInSeconds < 86400) {
    const hours = Math.floor(differenceInSeconds / 3600);
    return `${hours} giờ trước`;
  } else if (differenceInSeconds < 2592000) {
    const days = Math.floor(differenceInSeconds / 86400);
    return `${days} ngày trước`;
  } else if (differenceInSeconds < 31104000) {
    const months = Math.floor(differenceInSeconds / 2592000);
    return `${months} tháng trước`;
  } else {
    const years = Math.floor(differenceInSeconds / 31104000);
    return `${years} năm trước`;
  }
}
export default function ProductSeller() {
  const { userIdPlant } = useParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [userimg, setUserImg] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const usersPerPage = 20;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [priceError, setPriceError] = useState(null);
  const [notification, setNotification] = useState(null);
  const closeTimeoutRef = useRef(null);
  const [isPriceDropdownOpen, setIsPriceDropdownOpen] = useState(false);
  const userIds = localStorage.getItem("userId");
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState(null);
  const [username, setUserName] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [sortOption, setSortOption] = useState("");
  const [ratingData, setRatingData] = useState({});
  const [totalReviews, setTotalReviews] = useState(0);
  const [totalRating, setTotalRating] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0); // State to store follower count
  //lấy session
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const userId = params.get("userId");
    const role = params.get("role");
    const token = params.get("token");
    const email = params.get("email");
    const username = params.get("username");

    if (userId && role && token) {
      // Lưu vào state
      setUserId(userId);
      setRole(role);
      setToken(token);
      setEmail(email);
      setUserName(username);

      // Lưu vào localStorage
      localStorage.setItem("userId", userId);
      localStorage.setItem("role", role);
      localStorage.setItem("token", token);
      localStorage.setItem("email", email);
      localStorage.setItem("username", username);

      // Điều hướng tới trang chính
      navigate("/product"); // Điều hướng tới trang product sau khi lưu thông tin
    }
  }, [location, navigate]);
  // Fetch Follow Status
  useEffect(() => {
    const fetchFollowStatus = async () => {
      try {
        // Lấy số lượng người theo dõi trước
        const followerCountResponse = await fetch(
          `https://opms1.runasp.net/api/FollowerAPI/countFollower?followerId=${userIdPlant}`
        );
  
        if (followerCountResponse.ok) {
          const followerCountData = await followerCountResponse.json();
          console.log("Count:", followerCountData);
          setFollowerCount(followerCountData.count || 0); // Cập nhật số lượng người theo dõi
        } else {
          console.error("Failed to fetch follower count");
        }
  
        // Sau đó kiểm tra trạng thái người dùng đã đăng nhập
        const userId = localStorage.getItem("userId");
        if (!userId) {
          console.log("User chưa đăng nhập");
          return;
        }
  
        // Nếu đã login, kiểm tra trạng thái follow
        const response = await fetch(
          `https://opms1.runasp.net/api/FollowerAPI/is-following?userId=${userId}&followerId=${userIdPlant}`
        );
        if (response.ok) {
          const data = await response.json();
          setIsFollowing(data.isFollowing);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Hoàn thành
      }
    };
  
    fetchFollowStatus();
  }, [userIdPlant]);
  // lấy sản phẩm 
  useEffect(() => {
    if (!userIdPlant) return;

    const fetchProductsAndCategories = async () => {
      try {
        //lấy plants
        const productResponses = await fetch(
          `https://opms1.runasp.net/api/PlantAPI/getPlantByUserIsVerify?UserId=${userIdPlant}`);
        const productsDatas = await productResponses.json();

        if (!productResponses.ok) {
          throw new Error("Không thể lấy dữ liệu ");
        }

        if (productsDatas.message === "No plants available currently.") {
          setNotification("Hiện tại không có cây trồng nào có sẵn.");
          setProducts([]);
          setLoading(false);
          return;
        }
        setProducts(productsDatas);
        const UserResponses = await fetch(
          `https://opms1.runasp.net/api/UserAPI/getUserById?userId=${userIdPlant}`);
        const UserimgDatas = await UserResponses.json();
        setUserImg(UserimgDatas);
        //lấy loại cây
        const categoryResponse = await fetch(
          "https://opms1.runasp.net/api/CategoryAPI/getCategory"
        );
        if (!categoryResponse.ok) {
          throw new Error("Failed to fetch categories");
        }
        const categoryData = await categoryResponse.json();
        setCategories(categoryData);
        const ratings = await fetchRatings(productsDatas);
        setRatingData(ratings);
        //lấy tên users
        const UsersResponse = await fetch(
          "https://opms1.runasp.net/api/UserAPI/getUser"
        );
        if (!UsersResponse.ok) {
          throw new Error("Failed to fetch categories");
        }
        const usersData = await UsersResponse.json();

        setUsers(usersData);

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProductsAndCategories();
  }, []);

  //handle tìm kiếm
  const handleSortClick = async (label, id) => {
    if (id === 2) {
      setSortOption("most-purchased"); // Unique value for "Most Purchased"
      try {
        const response = await fetch(`https://opms1.runasp.net/api/PlantAPI/most-purchased-by-shop?limit=7&userId=${userIdPlant}`);
        const data = await response.json();
        if (!response.ok) throw new Error("Unable to fetch best-selling products");

        setProducts(data); // Update the product list directly for "Most Purchased"
      } catch (err) {
        setError(err.message);
      }
    } else {
      setSortOption(id); // For other cases, set `sortOption` to the id
      await searchPlants(selectedCategories, id); // Trigger search with sort option id
    }
  };

  // tìm kiếm cây
  const searchPlants = async (selectedCategoryIds = [], sortOptionId = null) => {
    try {
      // Construct the category query part
      const categoryIdsQuery = selectedCategoryIds
        .map((id) => `categoryId=${id}`)
        .join("&");

      // Initialize the query string with category filters if any
      let query = categoryIdsQuery ? `${categoryIdsQuery}` : '';

      // Add min and max price to the query if they are set
      if (minPrice && maxPrice) {
        query += `&minPrice=${minPrice}&maxPrice=${maxPrice}`;
      }

      // Add userId if available
      if (userIdPlant) {
        query += `&userId=${userIdPlant}`;
      }

      // Add sort option if it exists
      if (sortOptionId) {
        query += `&sortOption=${sortOptionId}`;
      }

      // Fetch the products with the constructed query
      const productResponses = await fetch(
        `https://opms1.runasp.net/api/PlantAPI/searchPlantsByShop?${query}`
      );
      const productsData = await productResponses.json();

      if (!productResponses.ok) {
        if (productResponses.status === 404 && productsData.message === "Không có kết quả theo yêu cầu.") {
          setError("Cây trồng không được tìm thấy hoặc chưa được xác minh.");
        }
        throw new Error("Không thể lấy cây trồng đã được lọc");
      }

      setProducts(productsData); // Update products state with the fetched data
    } catch (err) {
      setError(err.message); // Set the error message if the fetch fails
    }
  };

  //handle lấy categoryid 
  const handleCheckboxChange = (e, categoryId) => {
    let updatedCategories = [...selectedCategories];

    if (e.target.checked) {
      updatedCategories.push(categoryId);
    } else {
      updatedCategories = updatedCategories.filter((id) => id !== categoryId);
    }

    setSelectedCategories(updatedCategories);

  };

  //mở dropdown tự động
  const openDropdown = () => {
    // Cancel any pending close timeout if it exists
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    setIsPriceDropdownOpen(true);
  };
  // đóng dropdown tự động
  const closeDropdown = () => {
    // Start a delay to close the dropdown
    closeTimeoutRef.current = setTimeout(() => {
      setIsPriceDropdownOpen(false);
    }, 200); // Adjust the delay as needed
  };


  // Automatically search when price or categories change
  useEffect(() => {
    if (sortOption !== "most-purchased" && !priceError) {
      searchPlants(selectedCategories, sortOption); // Only pass selectedCategories and sortOption
    }
  }, [selectedCategories, minPrice, maxPrice, priceError, userIdPlant, sortOption]);

  //phân trang
  const pageCount = Math.ceil(products.length / usersPerPage);
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const productsToDisplay = products.slice(
    currentPage * usersPerPage,
    (currentPage + 1) * usersPerPage
  );

  // lấy tên category
  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.categoryId === categoryId);
    return category ? category.categoryName : "Danh mục không xác định";
  };

  // lấy tên user hoặc tên shop
  const getUserName = (userId) => {
    const user = users.find((u) => u.userId === userId);
    return user ? user.shopName : "Không tìm thấy người dùng";
  };
  const getCreate = (userId) => {
    if (!Array.isArray(users) || users.length === 0) {
      return "Không xác định"; // Fallback if users is invalid or empty
    }

    const user = users.find((u) => u.userId === userId);
    return user && user.createdDate ? user.createdDate : "Không xác định";
  };
  const [showAll, setShowAll] = useState(false); // State to track whether to show all flowers

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  // thêm vào giỏ hàng
  const addToCart = async (productId, quantity) => {
    const userId = localStorage.getItem("userId");
    if (!userId || userId === "undefined") {
      navigate("/sign-in");
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
        const errorResponse = await response.json();
        setSuccessMessage(`Không thể thêm sản phẩm vào giỏ hàng. ${errorResponse.message}`);
      }
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
  const fetchRatings = async (products) => {
    const ratings = {};
    try {
      await Promise.all(
        products.map(async (product) => {
          const response = await fetch(
            `https://opms1.runasp.net/api/ReviewAPI/getProductRatingSummary?plantId=${product.plantId}`
          );
          const data = await response.json();
          ratings[product.plantId] = data;
          return {
            ...product,
            totalReviews: data.totalReviews || 0,
            totalRating: data.totalRating || 0,
          };// Gán dữ liệu đánh giá vào object
        })
      );
      return updatedProducts;
    } catch (err) {
      console.error("Lỗi khi lấy dữ liệu đánh giá:", err);
    }
    return ratings;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner aria-label="Loading spinner" size="xl" />
        <span className="ml-3 text-lg font-semibold">Đang tải...</span>
      </div>
    );
  }
  if (error) {
    return <div>Error: {error}</div>;
  }


  (async () => {
    const rating = await Promise.all(
      products.map(async (product) => {
        return ratingData[product.plantId] || {
          totalReviews: 0,
          totalRating: 0,
        };
      })
    );

    // Log the totalReviews for each resolved rating
    rating.forEach((data) => {
      console.log("q", data.totalReviews);
    });

    // Calculate and log total reviews
    const totalReviews = rating.reduce(
      (sum, data) => sum + (data.totalReviews || 0),
      0
    );
    const totalRating = rating.reduce(
      (sum, data) => sum + (data.totalRating / totalReviews || 0),
      0
    );
    setTotalReviews(totalReviews)
    setTotalRating(totalRating)
    console.log("Total Reviews:", totalRating);
  })();

  const handleFollower = async () => {
    const userId = localStorage.getItem("userId");
    const followerId = userIdPlant; // Thay thế bằng giá trị followerId tương ứng

    if (!userId || userId === "undefined") {
      navigate("/sign-in");
      return;
    }

    try {
      const response = await fetch(
        `https://opms1.runasp.net/api/FollowerAPI/addFollower?userId=${userId}&followerId=${followerId}`,
        {
          method: "POST", // Hoặc "GET" tùy vào yêu cầu API
        }
      );

      if (response.ok) {
        const data = await response.json();
        setIsFollowing(data.isFollowing);

        if (data.isFollowing) {
          setSuccessMessage(`Bạn đã theo dõi ${getUserName(data.followerId)} thành công !`);
        } else {
          setSuccessMessage(`Bạn đã hủy theo dõi ${getUserName(data.followerId)} !`);
        }
        // gọi api lấy tổng theo dõi
        const countResponse = await fetch(
          `https://opms1.runasp.net/api/FollowerAPI/countFollower?followerId=${userIdPlant}`
        );

        if (countResponse.ok) {
          const countData = await countResponse.json();
          setFollowerCount(countData.count || 0); // Assuming `count` field exists in the response
        } else {
          console.error("Failed to fetch follower count.");
        }
      } else {
        setSuccessMessage("Không thể thực hiện thao tác theo dõi. Vui lòng thử lại.");
      }
    } catch (error) {
      setSuccessMessage("Lỗi khi theo dõi");
    }
    finally {

      setTimeout(() => {
        setSuccessMessage('');
      }, 2000);
    }
  };


  return (
    <main>
      <div className="p-6 h-40 bg-white shadow-lg rounded-md md:py-10 dark:bg-gray-900 shadow-gray-200 antialiased">
        <div className="flex items-center">
          {/* Profile Image and Info Section */}
          <div className="bg-green-500 p-4 rounded-lg flex items-center space-x-4 w-[300px]">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              {/* Placeholder for Profile Image */}
              <img
                src={userimg.userImage || "https://via.placeholder.com/64"}
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            {productsToDisplay.slice(0, 1).map((product) => (
              <div key={product.plantId} className="product-card p-2  rounded-lg ">
                <h2 className="text-white font-semibold ">
                  {getUserName(product.userId)}
                </h2>
              </div>
            ))}
            <button
              className={`ml-4 px-3 py-1 rounded text-sm ${isFollowing ? "bg-blue-500" : "bg-red-500"
                } text-white`}
              onClick={handleFollower}
            >
              {isFollowing ? "Đã theo dõi" : "Theo dõi"}
            </button>
          </div>

          {/* Stats Section */}
          <div className="mt-0 relative translate-x-32 grid grid-cols-2 md:grid-cols-4 gap-6 text-gray-900 dark:text-white">
            <p className="flex items-center">
              <span className="mr-2">🏪</span> Sản Phẩm:{" "}
              <span className="ml-1 text-red-500">{productsToDisplay.length}</span>
            </p>
            <p className="flex items-center">
              <span className="mr-2">👤</span> Người Theo Dõi:{" "}
              <span className="ml-1 text-red-500">{followerCount.toLocaleString()}</span>
            </p>
            <p className="flex items-center">
              <span className="mr-2">⭐</span> Đánh Giá:
              <span class="ml-1 text-red-500">{totalRating.toFixed(1)} ({totalReviews.toLocaleString("vi-VN")} Đánh Giá)</span>
            </p>
            <p className="flex items-center">
              <span className="mr-2">⏳</span> Tham Gia:{" "}
              <span className="ml-1 text-red-500">
                {productsToDisplay.length > 0 && getCreate(productsToDisplay[0].userId) !== "Không xác định"
                  ? formatTimeDifference(getCreate(productsToDisplay[0].userId))
                  : "Không xác định"}
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className="h-1"></div>
      <div className="flex flex-col md:flex-row">
        <div className="md:w-56">
          <Sidebar className="w-full md:w-56">
            <Sidebar.Items>
              <Sidebar.ItemGroup>
                <Sidebar.Item icon={TbShoppingBagSearch} as="div">
                  Tìm kiếm theo danh mục
                </Sidebar.Item>
                <ul className="ml-6 mt-2 space-y-2">
                  {categories
                    .slice(0, showAll ? categories.length : 1000000)
                    .map((category) => (
                      <li
                        key={category.categoryId}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            className="form-checkbox h-4 w-4 text-indigo-600 border-gray-300 rounded"
                            value={category.categoryId}
                            checked={selectedCategories.includes(
                              category.categoryId
                            )}
                            onChange={(e) =>
                              handleCheckboxChange(e, category.categoryId)
                            }
                          />
                          <span>{category.categoryName}</span>
                        </div>
                      </li>
                    ))}
                </ul>
                {/* "Xem thêm" button */}
                {categories.length > 100 && (
                  <div className="ml-6 mt-2">
                    <button
                      onClick={toggleShowAll}
                      className="text-cyan-700 hover:underline focus:outline-none"
                    >
                      {showAll ? "Thu gọn" : "Xem thêm"}
                    </button>
                  </div>
                )}
              </Sidebar.ItemGroup>

            </Sidebar.Items>
          </Sidebar>
        </div>
        <div className=" flex-wrap gap-4">
          {/* sắp xếp theo */}
          <div className="bg-white shadow-lg shadow-gray-200  dark:bg-gray-900 antialiased p-2 flex items-center gap-5 w-full sm:max-w-[580px]  ">

            <span className="text-gray-500">Sắp xếp theo</span>
            <button
              onClick={() => handleSortClick(5)}
              className={`px-4 py-2 rounded-md font-medium ${sortOption === 5
                ? "bg-red-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}

            >
              Tất Cả
            </button>
            <button
              onClick={() => handleSortClick("Mới Nhất", 1)}
              className={`px-4 py-2 rounded-md font-medium ${sortOption === 1 ? "bg-red-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}>
              Mới Nhất
            </button>
            <button
              onClick={() => handleSortClick("Bán Chạy", 2)}
              className={`px-4 py-2 rounded-md font-medium ${sortOption === "most-purchased" ? "bg-red-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}>
              Bán Chạy
            </button>
            <div
              className="relative"
              onMouseEnter={openDropdown} // Keeps dropdown open if hovering over it
              onMouseLeave={closeDropdown} // Closes dropdown if leaving dropdown area
            >
              <button
                className={`px-4 py-2 flex items-center rounded-md font-medium ${sortOption === 3 || sortOption === 4 ? "bg-red-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
              >
                Giá
                <IoChevronDown className="ml-1" />
              </button>

              {isPriceDropdownOpen && (
                <div className="absolute top-full mt-1 min-w-[150px] bg-white shadow-md border rounded-md z-10"
                  onMouseEnter={openDropdown} // Keeps dropdown open if hovering over it
                  onMouseLeave={closeDropdown} // Closes dropdown if leaving dropdown area
                >
                  <button
                    onClick={() => {
                      handleSortClick("Giá: Thấp đến Cao", 3);
                      setIsPriceDropdownOpen(false); // Close dropdown after selection
                    }}
                    className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                  >
                    Thấp đến Cao
                  </button>
                  <button
                    onClick={() => {
                      handleSortClick("Giá: Cao đến Thấp", 4);
                      setIsPriceDropdownOpen(false); // Close dropdown after selection
                    }}
                    className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                  >
                    Cao đến Thấp
                  </button>
                </div>
              )}
            </div>
          </div>
          {successMessage && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="bg-green-500 text-white text-lg font-semibold py-2 px-6 rounded-lg shadow-lg transform -translate-y-60">
                {successMessage}
              </div>
            </div>
          )}
          <div className="flex flex-wrap justify-center gap-3 p-5">

            {productsToDisplay.length === 0 ? (
              <div className="text-center text-green-600 font-semibold">
                {notification || "Không có sản phẩm nào có sẵn."}
              </div>
            ) : (
              productsToDisplay.map((product) => {
                const rating = ratingData[product.plantId] || {
                  totalReviews: 0,
                  totalRating: 0,
                };
                const averageRating =
                  rating.totalReviews > 0
                    ? (rating.totalRating / rating.totalReviews).toFixed(1)
                    : "0.0";
                return (
                  <div
                    key={product.plantId}
                    className={`relative bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[200px] h-auto ${product.stock === 0 ? "opacity-98" : ""
                      }`}
                  >
                    {/* Hiển thị chữ "Hết hàng" khi stock === 0 */}
                    {product.stock === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
                        <span className="text-red-400 font-bold text-lg">Hết hàng</span>
                      </div>
                    )}
                    {/* Liên kết đến trang chi tiết sản phẩm */}
                    <Link
                      to={product.stock === 0 ? "#" : `/productdetail/${product.plantId}`}
                      className={`${product.stock === 0 ? "pointer-events-none" : ""}`}
                    >
                      <div className="relative p-2.5 overflow-hidden rounded-xl bg-clip-border">
                        <img
                          src={product.imageUrl}
                          alt={product.plantName}
                          className="w-[175px] h-[200px] object-cover rounded-md hover:scale-105 transition-scale duration-300 mx-auto"
                        />
                      </div>

                      <div className="p-2 flex flex-col gap-2 w-full">
                        <div className="flex items-center gap-1">
                          <p className="text-sm font-medium text-gray-600 line-clamp-2 w-full">
                            {product.plantName}
                          </p>
                        </div>
                      </div>
                      <div className="p-2 flex flex-col gap-2 w-full">
                        <div className="flex items-center gap-1">
                          <p className="text-sm text-gray-600 line-clamp-2 w-full">
                            {getCategoryName(product.categoryId)}
                          </p>
                        </div>
                      </div>

                      {/*} <div className="rounded bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-800 dark:bg-red-200 dark:text-red-800">
                      {product.isVerfied === 1 ? "Đã verify" : "Chưa verify"}
                    </div>*/}

                      <div className="p-2 flex items-center">
                        <svg
                          className="h-4 w-4 text-yellow-300"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="ml-2 rounded bg-cyan-100 px-2 py-0.5 text-xs font-semibold text-cyan-800 dark:bg-cyan-200 dark:text-cyan-800">
                          {averageRating} ({rating.totalReviews} đánh giá)
                        </span>
                      </div>
                    </Link>
                    <div className="p-2 flex items-center justify-between">
                      <div className="truncate flex items-baseline text-red-600">
                        <span className="text-xs font-medium mr-px space-y-14">
                          ₫
                        </span>
                        <span className="font-medium text-xl truncate">
                          {new Intl.NumberFormat("en-US").format(
                            product.price - product.price * (product.discount / 100 || 0)
                          )}
                        </span>
                      </div>
                      <div className="rounded bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-800 dark:bg-red-200 dark:text-red-800">
                        {product.discount ? `${product.discount}%` : "0%"}
                      </div>

                      <button
                        onClick={() => addToCart(product.plantId, 1)} // Chỉ thêm 1 sản phẩm
                        className="rounded-lg bg-cyan-700 px-4 py-2 text-center text-sm font-medium text-white hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
                      >
                        <PiShoppingCartLight />
                      </button>
                    </div>

                  </div>
                );
              })
            )}

            <div className="w-full flex justify-center mt-4">
              <ReactPaginate
                previousLabel={<IoArrowBackCircle />} // Arrow for previous page
                nextLabel={<IoArrowForwardCircle />} // Arrow for next page
                breakLabel={"..."} // Dots for skipped pages
                pageCount={pageCount} // Total number of pages
                onPageChange={handlePageClick} // Function to handle page click
                containerClassName={"flex justify-center space-x-4"} // Container styling for pagination
                pageClassName={
                  "flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-200 cursor-pointer transition duration-300"
                } // Circular page buttons
                activeClassName={
                  "bg-black text-white" // Match active page to image (dark background, white text)
                }
                pageLinkClassName={
                  "w-full h-full flex items-center justify-center"
                } // Center the page number
                breakClassName={"flex items-center justify-center w-8 h-8"} // Dots between numbers
                breakLinkClassName={
                  "w-full h-full flex items-center justify-center"
                } // Center the dots
                previousClassName={
                  "flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-200 cursor-pointer transition duration-300"
                } // Previous button styling
                nextClassName={
                  "flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-200 cursor-pointer transition duration-300"
                } // Next button styling
                disabledClassName={"opacity-50 cursor-not-allowed"} // Disabled button styling
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
