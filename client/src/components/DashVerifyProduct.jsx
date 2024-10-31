import { Table, Button } from "flowbite-react";
import { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import ReactPaginate from "react-paginate";
import { TextInput } from "flowbite-react";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";

export default function DashVerifyProduct() {
  const [products, setProducts] = useState([
    {
      id: 1,
      image: "https://via.placeholder.com/40",
      category: "Electronics",
      name: "Smartphone",
      description: "High-quality smartphone with advanced features",
      price: "$699",
      stock: 25,
      discount: "10%",
      status: "Available",
      verify: "Verified",
    },
    {
      id: 2,
      image: "https://via.placeholder.com/40",
      category: "Home Appliances",
      name: "Air Conditioner",
      description: "Energy-efficient AC with fast cooling",
      price: "$499",
      stock: 15,
      discount: "15%",
      status: "Out of Stock",
      verify: "Not Verified",
    },
  ]);

  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = 3;
  const pageCount = Math.ceil(products.length / productsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const toggleVerifyStatus = (productId) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId
          ? {
              ...product,
              verify:
                product.verify === "Verified" ? "Not Verified" : "Verified",
            }
          : product
      )
    );
  };

  const productsToDisplay = products.slice(
    currentPage * productsPerPage,
    (currentPage + 1) * productsPerPage
  );

  {
    /* active button */
  }
  const [activeButton, setActiveButton] = useState(null);

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };
  return (
    <main className="overflow-x-auto md:mx-auto p-4">
      {/* Header Section */}
      <div className="shadow-md rounded-lg bg-white dark:bg-gray-800 mb-6 p-6 lg:p-2">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">
            Tất cả người dùng
          </h1>
          <div className="flex flex-wrap gap-4 items-center mb-6">
            <form className="flex-grow max-w-xs w-full md:w-1/2">
              <TextInput
                type="text"
                placeholder="Tìm kiếm  ..."
                rightIcon={AiOutlineSearch}
                className="w-full"
              />
            </form>
          </div>
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0 mt-4">
            <button
              onClick={() => handleButtonClick("nguoi-dung")}
              className={`px-5 py-2 rounded-md font-medium  ${
                activeButton === "nguoi-dung"
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Sản phẩm đã duyệt
            </button>

            <button
              onClick={() => handleButtonClick("quan-tri-vien")}
              className={`px-5 py-2 rounded-md font-medium ${
                activeButton === "quan-tri-vien"
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Sản phẩm chưa duyệt
            </button>
          </div>
        </div>
      </div>

      {/* Product Table Section */}
      <div className="overflow-x-auto shadow-md rounded-lg">
        <Table hoverable className="w-full">
          <Table.Head>
            <Table.HeadCell>Ảnh</Table.HeadCell>
            <Table.HeadCell>Loại</Table.HeadCell>
            <Table.HeadCell>Tên</Table.HeadCell>
            <Table.HeadCell>Mô tả</Table.HeadCell>
            <Table.HeadCell>Giá</Table.HeadCell>
            <Table.HeadCell className="whitespace-nowrap">
              Số lượng
            </Table.HeadCell>
            <Table.HeadCell className="whitespace-nowrap">
              Giảm giá
            </Table.HeadCell>
            <Table.HeadCell className="whitespace-nowrap">
              Trạng thái
            </Table.HeadCell>
            <Table.HeadCell className="whitespace-nowrap">
              Xác thực
            </Table.HeadCell>
            <Table.HeadCell className="whitespace-nowrap">
              Hành động
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {productsToDisplay.map((product) => (
              <Table.Row
                className="bg-white dark:border-gray-700 dark:bg-gray-800 align-middle"
                key={product.id}
              >
                <Table.Cell className="p-4 flex items-center justify-center">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-10 w-10 object-cover bg-gray-500 rounded-full"
                  />
                </Table.Cell>
                <Table.Cell className="p-4">{product.category}</Table.Cell>
                <Table.Cell className="p-4">{product.name}</Table.Cell>
                <Table.Cell className="p-4">{product.description}</Table.Cell>
                <Table.Cell className="p-4 text-center">
                  {product.price}
                </Table.Cell>
                <Table.Cell className="p-4 text-center">
                  {product.stock}
                </Table.Cell>
                <Table.Cell className="p-4 text-center">
                  {product.discount}
                </Table.Cell>
                <Table.Cell className="p-4 text-center">
                  {product.status}
                </Table.Cell>
                <Table.Cell className="p-4 text-center">
                  {product.verify}
                </Table.Cell>
                <Table.Cell className="py-4 flex space-x-2 justify-center">
                  <Button
                    onClick={() => toggleVerifyStatus(product.id)}
                    className={
                      product.verify === "Verified"
                        ? "bg-red-600 py-0.5 px-1 text-xs font-medium rounded-xl text-white hover:bg-red-700"
                        : "bg-green-600 py-0.5 px-1 text-xs font-medium rounded-xl text-white hover:bg-green-700"
                    }
                  >
                    {product.verify === "Verified" ? (
                      <AiOutlineClose className="text-white" />
                    ) : (
                      <AiOutlineCheck className="text-white" />
                    )}
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>

      {/* Pagination Section */}
      <div className="mt-6 flex justify-center">
        <ReactPaginate
          previousLabel={"← Sau"}
          nextLabel={"Trước →"}
          pageCount={pageCount}
          onPageChange={handlePageClick}
          containerClassName={
            "flex flex-wrap justify-center space-x-2 md:space-x-4"
          }
          pageLinkClassName={"py-2 px-3 border rounded text-sm"}
          activeClassName={"bg-blue-600 text-white"}
          disabledClassName={"opacity-50 cursor-not-allowed"}
        />
      </div>
    </main>
  );
}
