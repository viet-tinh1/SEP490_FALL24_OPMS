import { Sidebar } from "flowbite-react";
import { Link } from "react-router-dom";
import { PiShoppingCartLight } from "react-icons/pi";
import ReactPaginate from "react-paginate"; // Import the pagination library
import { useState } from "react"; // Import useState
import { IoArrowBackCircle } from "react-icons/io5";
import { IoArrowForwardCircle } from "react-icons/io5";
import { FaThList } from "react-icons/fa";
import { IoChevronDown } from "react-icons/io5";

export default function ProductSeller() {
  const flowers = [
    { name: "Cây hoa hồng", quantity: "450k+" },
    { name: "Hoa cúc", quantity: "320k+" },
    { name: "Cây bàng", quantity: "150k+" },
    { name: "Hoa lan", quantity: "250k+" },
  ];

  const [products] = useState([
    {
      id: 1,
      name: "Combo 70 cây chuỗi ngọc trồng hàng rào trang trí cảnh quan, cây giống mắt ngọc",
      productImage:
        "https://firebasestorage.googleapis.com/v0/b/project-team-7-blog.appspot.com/o/459575711_945200750961543_4220295711316204168_n.jpg?alt=media&token=d3c1e587-ca9f-46b5-a9ef-62de57ae0aea",
      price: "25.000",
      discount: "50%",
      rating: "4.5",
    },
    {
      id: 2,
      name: "2",
      productImage:
        "https://firebasestorage.googleapis.com/v0/b/project-team-7-blog.appspot.com/o/459575711_945200750961543_4220295711316204168_n.jpg?alt=media&token=d3c1e587-ca9f-46b5-a9ef-62de57ae0aea",
      price: "25.000",
      discount: "50%",
      rating: "4.5",
    },
    {
      id: 3,
      name: "3",
      productImage:
        "https://firebasestorage.googleapis.com/v0/b/project-team-7-blog.appspot.com/o/459575711_945200750961543_4220295711316204168_n.jpg?alt=media&token=d3c1e587-ca9f-46b5-a9ef-62de57ae0aea",
      price: "25.000",
      discount: "50%",
      rating: "4.5",
    },
    {
      id: 4,
      name: "4",
      productImage:
        "https://firebasestorage.googleapis.com/v0/b/project-team-7-blog.appspot.com/o/459575711_945200750961543_4220295711316204168_n.jpg?alt=media&token=d3c1e587-ca9f-46b5-a9ef-62de57ae0aea",
      price: "25.000",
      discount: "50%",
      rating: "4.5",
    },
    {
      id: 5,
      name: "5",
      productImage:
        "https://firebasestorage.googleapis.com/v0/b/project-team-7-blog.appspot.com/o/459575711_945200750961543_4220295711316204168_n.jpg?alt=media&token=d3c1e587-ca9f-46b5-a9ef-62de57ae0aea",
      price: "25.000",
      discount: "50%",
      rating: "4.5",
    },
    {
      id: 6,
      name: " 6",
      productImage:
        "https://firebasestorage.googleapis.com/v0/b/project-team-7-blog.appspot.com/o/459575711_945200750961543_4220295711316204168_n.jpg?alt=media&token=d3c1e587-ca9f-46b5-a9ef-62de57ae0aea",
      price: "25.000",
      discount: "50%",
      rating: "4.5",
    },
    {
      id: 7,
      name: "7",
      productImage:
        "https://firebasestorage.googleapis.com/v0/b/project-team-7-blog.appspot.com/o/459575711_945200750961543_4220295711316204168_n.jpg?alt=media&token=d3c1e587-ca9f-46b5-a9ef-62de57ae0aea",
      price: "25.000",
      discount: "50%",
      rating: "4.5",
    },
    {
      id: 8,
      name: "8",
      productImage:
        "https://firebasestorage.googleapis.com/v0/b/project-team-7-blog.appspot.com/o/459575711_945200750961543_4220295711316204168_n.jpg?alt=media&token=d3c1e587-ca9f-46b5-a9ef-62de57ae0aea",
      price: "25.000",
      discount: "50%",
      rating: "4.5",
    },
    {
      id: 9,
      name: "9",
      productImage:
        "https://firebasestorage.googleapis.com/v0/b/project-team-7-blog.appspot.com/o/459575711_945200750961543_4220295711316204168_n.jpg?alt=media&token=d3c1e587-ca9f-46b5-a9ef-62de57ae0aea",
      price: "25.000",
      discount: "50%",
      rating: "4.5",
    },
    {
      id: 10,
      name: "10",
      productImage:
        "https://firebasestorage.googleapis.com/v0/b/project-team-7-blog.appspot.com/o/459575711_945200750961543_4220295711316204168_n.jpg?alt=media&token=d3c1e587-ca9f-46b5-a9ef-62de57ae0aea",
      price: "25.000",
      discount: "50%",
      rating: "4.5",
    },
  ]);

  const [currentPage, setCurrentPage] = useState(0); // Initialize with 0 for the first page
  const usersPerPage = 5; // Limit the number of products per page

  // Pagination: Calculate the number of pages
  const pageCount = Math.ceil(products.length / usersPerPage);

  // Handle page click
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  // Calculate products to display
  const productsToDisplay = products.slice(
    currentPage * usersPerPage,
    (currentPage + 1) * usersPerPage
  );

  const [showAll, setShowAll] = useState(false); // State to track whether to show all flowers

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  {
    /* sắp xếp theo */
  }
  const [sortOption, setSortOption] = useState("Liên Quan");
  const [priceSort, setPriceSort] = useState(null);
  const [isPriceDropdownOpen, setIsPriceDropdownOpen] = useState(false);

  const handleSortClick = (option) => {
    setSortOption(option);
    setPriceSort(null); // Reset price sorting if other sort option is selected
  };

  const handlePriceSort = (option) => {
    setPriceSort(option);
    setSortOption("Giá"); // Set sortOption to "Giá" when price sort is selected
    setIsPriceDropdownOpen(false);
  };

  return (
    <main>
      <div className="p-6 bg-white shadow-lg rounded-md md:py-10 dark:bg-gray-900 shadow-gray-200 antialiased">
        <div className="flex items-center">
          {/* Profile Image and Info Section */}
          <div className="bg-green-500 p-4 rounded-lg flex items-center space-x-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              {/* Placeholder for Profile Image */}
              <img
                src="https://via.placeholder.com/64"
                alt="Profile"
                className="rounded-full"
              />
            </div>
            <div>
              <h2 className="text-white font-semibold">Topick Global</h2>
            </div>
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
            <span className="ml-1 text-red-500">124,9k</span>
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
                <Sidebar.Item as="div">
                  <div className="flex items-center text-gray-900 dark:text-white">
                    <FaThList className="mr-2 text-sm" />
                    <p className="text-lg font-medium">Danh Mục</p>
                  </div>
                </Sidebar.Item>

                {/* Hiển thị danh sách loại hoa và số lượng */}
                <ul className="ml-6 mt-2 space-y-2">
                  {flowers
                    .slice(0, showAll ? flowers.length : 3)
                    .map((flower, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between"
                      >
                        {/* Checkbox bên trái */}
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            className="form-checkbox h-4 w-4 text-indigo-600 border-gray-300 rounded"
                          />
                          <span>{flower.name}</span>
                        </div>

                        {/* Số lượng hoa */}
                        <span className="text-sm text-gray-500">
                          ({flower.quantity})
                        </span>
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

          <div className="bg-white shadow-lg shadow-gray-200  dark:bg-gray-900 antialiased p-2 flex items-center gap-5  ">
            <span className="text-gray-500">Sắp xếp theo</span>

            <button
              className={`px-4 py-2 rounded-md font-medium ${
                sortOption === "Mới Nhất"
                  ? "bg-red-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => handleSortClick("Mới Nhất")}
            >
              Mới Nhất
            </button>

            <button
              className={`px-4 py-2 rounded-md font-medium ${
                sortOption === "Bán Chạy"
                  ? "bg-red-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => handleSortClick("Bán Chạy")}
            >
              Bán Chạy
            </button>

            <div className="relative">
              <button
                className={`px-4 py-2 flex items-center rounded-md font-medium ${
                  sortOption === "Giá"
                    ? "bg-red-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                onClick={() => setIsPriceDropdownOpen(!isPriceDropdownOpen)}
              >
                Giá
                <IoChevronDown className="ml-1" />
              </button>

              {isPriceDropdownOpen && (
                <div className="absolute top-full mt-1 min-w-[150px] bg-white shadow-md border rounded-md z-10">
                  <button
                    className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 whitespace-nowrap"
                    onClick={() => handlePriceSort("Thấp đến Cao")}
                  >
                    Giá: Thấp đến Cao
                  </button>
                  <button
                    className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 whitespace-nowrap"
                    onClick={() => handlePriceSort("Cao đến Thấp")}
                  >
                    Giá: Cao đến Thấp
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-3 p-5">
            {/* Card */}
            {productsToDisplay.map((product) => (
              <div
                key={product.id}
                className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[200px] h-auto"
              >
                <Link to="/productdetail">
                  <div className="relative p-2.5 overflow-hidden rounded-xl bg-clip-border">
                    <img
                      src={product.productImage} // Use the dynamic product image
                      alt="listing cover"
                      className="w-[175px] h-[200px]  object-cover rounded-md hover:scale-105 transition-scale duration-300 mx-auto"
                    />
                  </div>

                  <div className="p-2 flex flex-col gap-2 w-full">
                    {/*     <p className="truncate text-md font-semibold text-slate-700">
                      {product.name}
                    </p>*/}
                    <div className="flex items-center gap-1">
                      <p className="text-sm font-medium text-gray-600 line-clamp-2 w-full">
                        {product.name}
                      </p>
                    </div>
                  </div>
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
                      {product.rating}
                    </span>
                  </div>
                  {/* Price */}
                  <div className="p-2 flex items-center justify-between">
                    <div className="truncate flex items-baseline text-red-600">
                      <span className="text-xs font-medium mr-px space-y-14">
                        ₫
                      </span>
                      <span className="font-medium text-xl truncate">
                        {product.price}
                      </span>
                    </div>
                    {/* Discount */}
                    <div className="rounded bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-800 dark:bg-red-200 dark:text-red-800">
                      {product.discount}
                    </div>

                    <a
                      href="#"
                      className="rounded-lg bg-cyan-700 px-4 py-2 text-center text-sm font-medium text-white hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
                    >
                      <PiShoppingCartLight />
                    </a>
                  </div>
                </Link>
              </div>
            ))}

            {/* Pagination Component */}
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
