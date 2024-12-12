import { Sidebar } from "flowbite-react";
import { TbShoppingBagSearch } from "react-icons/tb";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { PiShoppingCartLight } from "react-icons/pi";
import ReactPaginate from "react-paginate";
import { useState, useEffect, useRef } from "react";
import { Spinner } from "flowbite-react";
import { FaThList } from "react-icons/fa";
import { IoArrowBackCircle, IoArrowForwardCircle, IoChevronDown } from "react-icons/io5";


export default function Product() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const usersPerPage = 20;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [priceError, setPriceError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [name, setName] = useState("");
  const [isPriceDropdownOpen, setIsPriceDropdownOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const userIds = localStorage.getItem("userId");
  const [sortOption, setSortOption] = useState("");
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState(null);
  const [status, setStatus] = useState(null);
  const [username, setUserName] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const closeTimeoutRef = useRef(null);
  const [ratingData, setRatingData] = useState({});
  const [showModal, setShowModal] = useState(false);
  //lấy session
  // Lấy thông tin từ URL hoặc localStorage
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const userIdFromUrl = params.get("userId");
    const roleFromUrl = params.get("role");
    const tokenFromUrl = params.get("token");
    const emailFromUrl = params.get("email");
    const usernameFromUrl = params.get("username");
    const statusFromUrl = params.get("status");

    // Ưu tiên lấy từ URL nếu có, sau đó từ localStorage
    const userId = userIdFromUrl || localStorage.getItem("userId");
    const role = roleFromUrl || localStorage.getItem("role");
    const token = tokenFromUrl || localStorage.getItem("token");
    const email = emailFromUrl || localStorage.getItem("email");
    const username = usernameFromUrl || localStorage.getItem("username");
    const status = statusFromUrl || localStorage.getItem("status");

    // Nếu lấy từ URL, lưu vào localStorage
    if (userIdFromUrl && roleFromUrl && tokenFromUrl) {
      localStorage.setItem("userId", userIdFromUrl);
      localStorage.setItem("role", roleFromUrl);
      localStorage.setItem("token", tokenFromUrl);
      localStorage.setItem("email", emailFromUrl);
      localStorage.setItem("username", usernameFromUrl);
      localStorage.setItem("status", statusFromUrl);
    }

    // Cập nhật React state
    setUserId(userId);
    setRole(role);
    setToken(token);
    setEmail(email);
    setUserName(username);
    setStatus(status);

    // Điều hướng xóa query parameters sau khi xử lý
    if (userIdFromUrl && roleFromUrl && tokenFromUrl) {
      navigate("/product", { replace: true });// Điều hướng tới URL sạch
      setTimeout(() => {
        window.location.reload(); // Buộc tải lại trang sau điều hướng
      }, 100);
    }

  }, [location, navigate]);

  // Kiểm tra lại userId khi state hoặc localStorage thay đổi
  useEffect(() => {
    if (!userId) {
      const userIdFromStorage = localStorage.getItem("userId");
      if (userIdFromStorage) {
        setUserId(userIdFromStorage);
      }
    }
  }, [userId]);

  // Debug: Kiểm tra giá trị userId
  useEffect(() => {
    console.log("UserId:", userId);
  }, [userId]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const nameParam = searchParams.get("search");

    if (nameParam) {
      searchPlants(nameParam);
    } else {
      fetchProductsAndCategories();
    }
  }, [location.search]);

  // Sửa logic xóa tìm kiếm
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setName(value); // Cập nhật state với tên tìm kiếm mới

    if (value.trim() === "") {
      // Khi ô tìm kiếm rỗng, gọi lại danh sách sản phẩm ban đầu
      fetchProductsAndCategories(); // Gọi lại hàm fetch dữ liệu sản phẩm từ API
    } else {
      // Gọi hàm tìm kiếm khi có nội dung trong ô tìm kiếm
      searchPlants(value, selectedCategories, minPrice, maxPrice, sortOption);
    }
  };
  //useEffect(() => {
  const fetchProductsAndCategories = async () => {
    setLoading(true); // Bắt đầu loading
    try {
      // lấy sản phẩm 
      const productResponse = await fetch(
        "https://opms1.runasp.net/api/PlantAPI/getVerifiedPlants"
      );
      const productsData = await productResponse.json();

      if (!productResponse.ok) {
        throw new Error("Không thể lấy dữ liệu ");
      }

      if (productsData.message === "No plants available currently.") {
        setNotification("Hiện tại không có cây trồng nào có sẵn.");
        setProducts([]);
        setLoading(false);
        return;
      }
      setProducts(productsData);
      //lấy category
      const categoryResponse = await fetch(
        "https://opms1.runasp.net/api/CategoryAPI/getCategory"
      );
      if (!categoryResponse.ok) {
        throw new Error("Failed to fetch categories");
      }
      const categoryData = await categoryResponse.json();
      setCategories(categoryData);

      // Lấy dữ liệu đánh giá
      const ratings = await fetchRatings(productsData);
      setRatingData(ratings);
      setLoading(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  // Search function 
  const searchPlants = async (name='', selectedCategoryIds = [], minPrice = '', maxPrice = '', sortOptionId = null) => {
    try {
      // Tạo query tìm kiếm
      const query = [];
      if (name) query.push(`name=${encodeURIComponent(name)}`);
      if (!name && !selectedCategoryIds.length && !minPrice && !maxPrice && !sortOptionId) {
        // Nếu không có từ khóa tìm kiếm và không áp dụng bất kỳ bộ lọc nào, tải toàn bộ danh sách
        fetchProductsAndCategories();
        return;
      }
      if (selectedCategoryIds.length)
        query.push(selectedCategoryIds.map(id => `categoryId=${id}`).join("&"));
      if (minPrice) query.push(`minPrice=${minPrice}`);
      if (maxPrice) query.push(`maxPrice=${maxPrice}`);
      if (sortOptionId) {
        query.push(`sortOption=${sortOptionId}`);
        if (sortOptionId === 2) {
          query.push(`limit=100`); // Thêm limit = 100 khi sortOption là 2 (bán chạy nhất)
        }
      }

      const finalQuery = query.length ? `?${query.join("&")}` : "";
      const productResponse = await fetch(`https://opms1.runasp.net/api/PlantAPI/searchPlants${finalQuery}`);
      const productsData = await productResponse.json();
      if (!productResponse.ok) throw new Error(productsData.message || "Không thể lấy cây trồng đã được lọc");
      setProducts([...productsData]);
    } catch (err) {
      setError(err.message);
    }
  };
  useEffect(() => {
    if (name === "") {
      fetchProductsAndCategories(); // Khi tên tìm kiếm rỗng, tải lại sản phẩm ban đầu
    } else {
      searchPlants(name, selectedCategories, minPrice, maxPrice, sortOption);
    }
  }, [name]);

  // handel chọn phương thức tìm kiếm 
  const handleSortClick = async (label, id) => {
    setSortOption(id); // Gán `sortOption` trực tiếp
    try {
      // Thay vì gọi API riêng, luôn gọi `searchPlants` với các thông tin tìm kiếm và `sortOption`
      await searchPlants(name, selectedCategories, minPrice, maxPrice, id);
    } catch (err) {
      setError(err.message);
    }
  };

  // handle lấy category
  const handleCheckboxChange = (e, categoryId) => {
    let updatedCategories = [...selectedCategories];

    if (e.target.checked) {
      updatedCategories.push(categoryId);
    } else {
      updatedCategories = updatedCategories.filter((id) => id !== categoryId);
    }
    console.log("Updated Categories:", updatedCategories);
    setSelectedCategories(updatedCategories);
    searchPlants(name, updatedCategories, minPrice, maxPrice, sortOption); // Tìm kiếm sau khi cập nhật
  };


  // mở dropdown tự động
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
      searchPlants(name, selectedCategories, minPrice, maxPrice, sortOption);
    }
  }, [name, selectedCategories, minPrice, maxPrice, priceError, sortOption]);


  // phân trang
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

  const [showAll, setShowAll] = useState(false); // State to track whether to show all flowers

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };
  /// lock acc
  const handleLogout = () => {
    // Clear localStorage và trạng thái
    localStorage.removeItem("status");
    localStorage.clear();
    localStorage.setItem("signOut", Date.now());

    // Đặt lại trạng thái
    setUserId(null);
    setRole(null);
    setEmail(null);
    setUserName(null);

    setShowModal(false);
    navigate("/sign-in");
    window.location.reload(true); // Reload trang sau đăng xuất

  };

  // thêm sản phẩm vào giỏ hàng 
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

        setSuccessMessage('Sản phẩm đã được thêm vào giỏ hàng!');
      } else {
        const errorData = await response.json(); // Lấy dữ liệu phản hồi lỗi từ server
        if (response.status === 404 && errorData.message === "Not enough stock available.") {
          setSuccessMessage("Không đủ hàng trong kho.");
        } else {
          setSuccessMessage("Đã xảy ra lỗi. Vui lòng thử lại.");
        }
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
          ratings[product.plantId] = data; // Gán dữ liệu đánh giá vào object
        })
      );
    } catch (err) {
      console.error("Lỗi khi lấy dữ liệu đánh giá:", err);
    }
    return ratings;
  };
  // Tính rating trung bình

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

  return (

    <main>
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
      <div className="flex flex-col md:flex-row">
        <div className="md:w-56">
          <Sidebar className="w-full md:w-56">
            <Sidebar.Items>
              <Sidebar.ItemGroup>
                <Sidebar.Item as="div">
                  <div className="flex items-center text-gray-900 dark:text-white">
                    <FaThList className="mr-2 text-sm" />
                    <p className="text-lg font-medium">Danh Mục</p>
                  </div>
                </Sidebar.Item>

                <ul className="ml-6 mt-2 space-y-2">
                  {categories
                    .slice(0, showAll ? categories.length : 100)
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
          <div className="bg-white shadow-lg shadow-gray-200  dark:bg-gray-900 antialiased p-2 flex items-center gap-5 w-full md:max-w-[580px] ">
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
              className={`px-4 py-2 rounded-md font-medium ${sortOption === 2 ? "bg-red-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}>
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
                <div className="absolute top-full mt-1 min-w-[150px] bg-white shadow-md border rounded-md z-50"
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
          <div className="flex flex-wrap justify-center gap-3 p-5 ">
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
                    className={` mb-4 relative bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[200px] h-auto ${product.stock === 0 || product.status === 0 ? "opacity-98" : ""
                      }`}
                  >
                    {/* Hiển thị chữ "Hết hàng" khi stock === 0 */}
                    {(product.stock === 0 || product.status === 0) && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
                        <span className="text-red-400 font-bold text-lg">
                          {product.stock === 0 ? "Hết hàng" : "Ngừng bán"}
                        </span>
                      </div>
                    )}
                    {/* Liên kết đến trang chi tiết sản phẩm */}
                    <Link
                      to={localStorage.getItem("status") === "0" ? "#" : (product.stock === 0 ? "#" : `/productdetail/${product.plantId}`)}
                      onClick={(e) => {
                        if (localStorage.getItem("status") === "0") {
                          e.preventDefault(); // Prevent navigation in both cases
                          addToCart(product.plantId, 1);
                        }
                      }}
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
