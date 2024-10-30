import { Sidebar } from "flowbite-react";
import { TbShoppingBagSearch } from "react-icons/tb";
import { Link, useNavigate, useLocation  } from "react-router-dom";
import { PiShoppingCartLight } from "react-icons/pi";
import ReactPaginate from "react-paginate";
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Spinner } from "flowbite-react";
import { IoArrowBackCircle, IoArrowForwardCircle } from "react-icons/io5";
import { IoChevronDown } from "react-icons/io5";

export default function ProductSeller() {
  const {userIdPlant } = useParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const usersPerPage = 5;
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

  // lấy sản phẩm 
  useEffect(() => {
    if (!userIdPlant) return;
    
    const fetchProductsAndCategories = async () => {
      try {
        //lấy plants
        const productResponses = await fetch(
          `https://localhost:7098/api/PlantAPI/getPlantByUserIsVerify?UserId=${userIdPlant}`);
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

        //lấy loại cây
        const categoryResponse = await fetch(
          "https://localhost:7098/api/CategoryAPI/getCategory"
        );
        if (!categoryResponse.ok) {
          throw new Error("Failed to fetch categories");
        }
        const categoryData = await categoryResponse.json();
        setCategories(categoryData);
        
        //lấy tên users
        const UsersResponse = await fetch(
          "https://localhost:7098/api/UserAPI/getUser"
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
            const response = await fetch(`https://localhost:7098/api/PlantAPI/most-purchased-by-shop?limit=7&userId=${userIdPlant}`);
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
          `https://localhost:7098/api/PlantAPI/searchPlantsByShop?${query}`
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

  const [showAll, setShowAll] = useState(false); // State to track whether to show all flowers

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  // thêm vào giỏ hàng
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
  return (
    <main>
      <div className="p-6 bg-white shadow-lg rounded-md md:py-10 dark:bg-gray-900 shadow-gray-200 antialiased">
        <div className="flex items-center">
          {/* Profile Image and Info Section */}
          <div className="bg-green-500 p-4 rounded-lg flex items-center space-x-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              {/* Placeholder for Profile Image */}
              <img
                  src={users.imageUrl || "https://via.placeholder.com/64"}
                  alt="Profile"
                  className="rounded-full"
              />  
            </div>
            {productsToDisplay.slice(0, 1).map((product) => (
            <div key={product.plantId} className="product-card p-2  rounded-lg ">
              <h2 className="text-white font-semibold ">
                {getUserName(product.userId)}
              </h2>
            </div>
            ))}
            <button className="ml-4 px-3 py-1 bg-red-500 text-white rounded text-sm">
              Theo dõi
            </button>

            <button className="ml-4 px-3 py-1 bg-red-500 text-white rounded text-sm">
            💬Chat
            </button>

       
          </div>

        </div>

        {/* Stats Section */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-6 text-gray-900 dark:text-white">
          <p className="flex items-center">
            <span className="mr-2">🏪</span> Sản Phẩm:{" "}
            <span className="ml-1 text-red-500">{productsToDisplay.length}</span>
          </p>
          <p className="flex items-center">
            <span className="mr-2">👤</span> Người Theo Dõi:{" "}
            <span className="ml-1 text-red-500">3,3tr</span>
          </p>
          <p className="flex items-center">
            <span className="mr-2">⭐</span> Đánh Giá:{" "}
            <span className="ml-1 text-red-500">4.7 (3,2tr Đánh Giá)</span>
          </p>
          <p className="flex items-center">
            <span className="mr-2">⏳</span> Tham Gia:{" "}
            <span className="ml-1 text-red-500">5 Năm Trước</span>
          </p>
        </div>
      </div>

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
                  .slice(0, showAll ? categories.length : 3)
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
                <div className="ml-6 mt-2">
                  <button
                    onClick={toggleShowAll}
                    className="text-cyan-700 hover:underline focus:outline-none"
                  >
                    {showAll ? "Thu gọn" : "Xem thêm"}
                  </button>
                </div>
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
              className={`px-4 py-2 rounded-md font-medium ${
                sortOption === 5
                  ? "bg-red-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              
            >
              Tất Cả
            </button>
            <button 
              onClick={() => handleSortClick("Mới Nhất", 1)} 
              className={`px-4 py-2 rounded-md font-medium ${
              sortOption === 1 ? "bg-red-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}>
              Mới Nhất
            </button>
            <button 
            onClick={() => handleSortClick("Bán Chạy", 2)} 
              className={`px-4 py-2 rounded-md font-medium ${
              sortOption === "most-purchased" ? "bg-red-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}>
              Bán Chạy
            </button>
            <div
              className="relative"
              onMouseEnter={openDropdown} // Keeps dropdown open if hovering over it
              onMouseLeave={closeDropdown} // Closes dropdown if leaving dropdown area
             >
              <button
              className={`px-4 py-2 flex items-center rounded-md font-medium ${
                sortOption === 3 || sortOption === 4 ? "bg-red-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
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
          <div className="flex flex-wrap justify-center gap-3 p-5">
          
            {productsToDisplay.length === 0 ? (
              <div className="text-center text-green-600 font-semibold">
                {notification || "Không có sản phẩm nào có sẵn."}
              </div>
            ) : (
              productsToDisplay.map((product) => (
                <div
                  key={product.plantId}
                  className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[200px] h-auto"
                >
                    
                  <Link to={`/productdetail/${product.plantId}`}>
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
                        {product.rating || "4.5"}
                      </span>
                    </div>
                  </Link>
                  <div className="p-2 flex items-center justify-between">
                    <div className="truncate flex items-baseline text-red-600">
                      <span className="text-xs font-medium mr-px space-y-14">
                        ₫
                      </span>
                      <span className="font-medium text-xl truncate">
                        {(
                          product.price -
                          product.price * (product.discount / 100 || 0)
                        ).toFixed(3)}
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
                  <div className="p-2 flex items-center justify-between">
                  <Link to={`/producsSeller/${product.userId}`}>
                      <div className="flex items-center space-x-5">
                        <img
                          src={users.imageUrl || "https://via.placeholder.com/40"}
                          alt={product.name}
                          className="h-10 w-10 object-cover bg-gray-500 rounded-full"
                        />
                        <span>{getUserName(product.userId)}</span>
                      </div>
                    </Link>
                  </div>
               </div>
              ))
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