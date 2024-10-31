import { Modal, Table, Button } from "flowbite-react";
import { useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { AiOutlineSearch } from "react-icons/ai";
import { MdDelete, MdEdit } from "react-icons/md";
import ReactPaginate from "react-paginate";
import { TextInput } from "flowbite-react";

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
    // Add other products here as needed
  ]);

  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = 3;

  const handleDelete = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleConfirmDelete = () => {
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== selectedProduct.id)
    );
    setShowModal(false);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const pageCount = Math.ceil(products.length / productsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const productsToDisplay = products.slice(
    currentPage * productsPerPage,
    (currentPage + 1) * productsPerPage
  );

  return (
   <main className="overflow-x-auto mx-auto p-4 sm:p-6 lg:p-8">
  <div className="shadow-md rounded-lg bg-white dark:bg-gray-800 mb-6 p-6 lg:p-8">
    <div className="mb-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">
        All Products
      </h1>
      <div className="flex justify-between items-center mb-6">
        <form className="flex-grow max-w-xs">
          <TextInput
            type="text"
            placeholder="Tìm kiếm..."
            rightIcon={AiOutlineSearch}
            className="hidden lg:inline w-full"
          />
        </form>
      </div>
      <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0 mt-4">
        <Button
          id="1"
          className="bg-green-600 text-white border-green-700 py-1 px-3 text-sm font-semibold rounded-lg shadow hover:bg-green-700"
        >
          Verified Products
        </Button>
        <Button
          id="2"
          className="bg-gray-200 text-gray-700 border-gray-300 py-1 px-3 text-sm font-semibold rounded-lg shadow hover:bg-gray-300 hover:text-gray-900"
        >
          Unverified Products
        </Button>
      </div>
    </div>
  </div>

  <div className="overflow-x-auto shadow-md rounded-lg mb-6">
    <Table hoverable className="w-full">
      <Table.Head>
        <Table.HeadCell>Ảnh</Table.HeadCell>
        <Table.HeadCell>Loại</Table.HeadCell>
        <Table.HeadCell>Tên</Table.HeadCell>
        <Table.HeadCell>Mô tả</Table.HeadCell>
        <Table.HeadCell>Giá</Table.HeadCell>
        <Table.HeadCell className="whitespace-nowrap">Số lượng</Table.HeadCell>
        <Table.HeadCell className="whitespace-nowrap">
          Giảm giá
        </Table.HeadCell>
        <Table.HeadCell className="whitespace-nowrap">
          Trạng thái
        </Table.HeadCell>
        <Table.HeadCell className="whitespace-nowrap">
          xác thực
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
            <Table.Cell className="py-4 flex items-center justify-center">
              <img
                src={product.image}
                alt={product.name}
                className="h-10 w-10 object-cover bg-gray-500 rounded-full"
              />
            </Table.Cell>
            <Table.Cell className="py-4">{product.category}</Table.Cell>
            <Table.Cell className="py-4">{product.name}</Table.Cell>
            <Table.Cell className="py-4">{product.description}</Table.Cell>
            <Table.Cell className="py-4">{product.price}</Table.Cell>
            <Table.Cell className="py-4">{product.stock}</Table.Cell>
            <Table.Cell className="py-4">{product.discount}</Table.Cell>
            <Table.Cell className="py-4">{product.status}</Table.Cell>
            <Table.Cell className="py-4">{product.verify}</Table.Cell>
            <Table.Cell className="py-4 flex space-x-2 justify-center">
              <MdEdit
                onClick={() => console.log("Edit product", product)}
                className="cursor-pointer text-blue-600"
                size={20}
              />
              <MdDelete
                onClick={() => handleDelete(product)}
                className="cursor-pointer text-red-600"
                size={20}
              />
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  </div>

  <div className="mt-8 flex justify-center">
    <ReactPaginate
      previousLabel={"← Previous"}
      nextLabel={"Next →"}
      pageCount={pageCount}
      onPageChange={handlePageClick}
      containerClassName={"flex space-x-4"}
      pageLinkClassName={"py-2 px-4 border rounded"}
      activeClassName={"bg-blue-600 text-white"}
      disabledClassName={"opacity-50 cursor-not-allowed"}
    />
  </div>

  <Modal show={showModal} onClose={handleCancel}>
    <Modal.Header>Delete Product</Modal.Header>
    <Modal.Body>
      <div className="text-center">
        <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 mb-4 mx-auto" />
        <h3 className="mb-5 text-lg text-gray-500">
          Are you sure you want to delete {selectedProduct?.name}?
        </h3>
        <div className="flex justify-center gap-4 mt-6">
          <Button color="failure" onClick={handleConfirmDelete}>
            Yes
          </Button>
          <Button color="gray" onClick={handleCancel}>
            No
          </Button>
        </div>
      </div>
    </Modal.Body>
  </Modal>
</main>

  );
}
