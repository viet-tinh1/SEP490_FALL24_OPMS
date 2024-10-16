import { Sidebar } from "flowbite-react";
import { TbShoppingBagSearch } from "react-icons/tb";
import { Link } from "react-router-dom";
import { PiShoppingCartLight } from "react-icons/pi";
import ReactPaginate from "react-paginate";
import { useState, useEffect } from "react";
import { IoArrowBackCircle, IoArrowForwardCircle } from "react-icons/io5";

export default function Product() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const usersPerPage = 5;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [priceError, setPriceError] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const fetchProductsAndCategories = async () => {
      try {
        const productResponse = await fetch(
          "https://localhost:7098/api/PlantAPI/getVerifiedPlants"
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

        const categoryResponse = await fetch(
          "https://localhost:7098/api/CategoryAPI/getCategory"
        );
        if (!categoryResponse.ok) {
          throw new Error("Failed to fetch categories");
        }
        const categoryData = await categoryResponse.json();
        setCategories(categoryData);

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProductsAndCategories();
  }, []);

  const searchPlants = async (selectedCategoryIds = []) => {
    try {
      const categoryIdsQuery = selectedCategoryIds
        .map((id) => `categoryId=${id}`)
        .join("&");
     
      let query = `${categoryIdsQuery}`;
      if (minPrice !== null && maxPrice !== null) {
        query += `&minPrice=${minPrice}&maxPrice=${maxPrice}`;
      }
      const productResponse = await fetch(
        `https://localhost:7098/api/PlantAPI/searchPlants?${query}`
      );
      const productsData = await productResponse.json();
      if (!productResponse.ok) {
        
        if(productResponse.status==404 && productsData.message == "Không có kết quả theo yêu cầu."){
          setError("Cây trồng không được tìm thấy hoặc chưa được xác minh.");
        }
        throw new Error("Không thể lấy cây trồng đã được lọc");
      }
     
     

      
      setProducts(productsData);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCheckboxChange = (e, categoryId) => {
    let updatedCategories = [...selectedCategories];

    if (e.target.checked) {
      updatedCategories.push(categoryId);
    } else {
      updatedCategories = updatedCategories.filter((id) => id !== categoryId);
    }

    setSelectedCategories(updatedCategories);
    
  };
  const handlePriceChange = (e, priceType) => {
    const value = e.target.value;
  
    if (priceType === "min") {
      setMinPrice(value); // Lưu giá trị minPrice từ input Min
    } else if (priceType === "max") {
      setMaxPrice(value); // Lưu giá trị maxPrice từ input Max
    }
  
    const min = parseFloat(priceType === "min" ? value : minPrice);  // Sử dụng giá trị mới nhập cho min
    const max = parseFloat(priceType === "max" ? value : maxPrice);  // Sử dụng giá trị mới nhập cho max
  
    // Validate that minPrice is not greater than maxPrice
    if (value.length !== 0 && (!isNaN(min) && !isNaN(max))) {
      if (min < 0) {
        setPriceError("Giá tối thiểu không được phép là số âm.");
      } else if (min > max) {
        setPriceError("Giá tối thiểu không được lớn hơn giá tối đa.");
      } else {
        setPriceError("");  // Xóa lỗi nếu giá trị hợp lệ
      }
    } else {
      setPriceError("");  // Xóa lỗi nếu minPrice hoặc maxPrice trống
    }
  };
  

  
  // Automatically search when price or categories change
  useEffect(() => {
    if (!priceError) {
      searchPlants(selectedCategories, minPrice, maxPrice);
    }
  }, [selectedCategories, minPrice, maxPrice, priceError]);

  const pageCount = Math.ceil(products.length / usersPerPage);
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const productsToDisplay = products.slice(
    currentPage * usersPerPage,
    (currentPage + 1) * usersPerPage
  );

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.categoryId === categoryId);
    return category ? category.categoryName : "Danh mục không xác định";
  };

  const [showAll, setShowAll] = useState(false); // State to track whether to show all flowers

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <main>
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
              {/* tìm kiếm theo giá*/} 
              <Sidebar.ItemGroup>
                <Sidebar.Item icon={TbShoppingBagSearch} as="div">
                   Tìm kiếm theo giá 
                </Sidebar.Item>
                <ul className="ml-6 mt-2 space-y-2">
                  <li>
                    <label className="block text-sm font-medium text-gray-700">
                      Giá thấp nhất
                    </label>
                    <input
                      type="number"
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                      value={minPrice}
                      onChange={(e) => handlePriceChange(e, "min")} 
                    />
                  </li>
                  <li>
                    <label className="block text-sm font-medium text-gray-700">
                      Giá cao nhất
                    </label>
                    <input
                      type="number"
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                      value={maxPrice}
                      onChange={(e) => handlePriceChange(e, "max")} 
                    />
                  </li>
                  {priceError && (
                    <li>
                      <span className="text-red-500">{priceError}</span>
                    </li>
                  )}
                </ul>
                
              </Sidebar.ItemGroup>
            </Sidebar.Items>
          </Sidebar>
        </div>

        <div className="flex flex-wrap gap-4">
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

                    <Link
                      to=""
                      className="rounded-lg bg-cyan-700 px-4 py-2 text-center text-sm font-medium text-white hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
                    >
                      <PiShoppingCartLight />
                    </Link>
                  </div>
                </div>
              ))
            )}
          

          <div className="bottom-0 left-0 right-0 p-4 flex justify-center">
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