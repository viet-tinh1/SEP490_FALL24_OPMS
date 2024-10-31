import { Modal, Table, Button } from "flowbite-react";
import { useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { AiOutlineSearch } from "react-icons/ai";
import { MdDelete, MdEdit } from "react-icons/md";
import ReactPaginate from "react-paginate";
import { TextInput } from "flowbite-react";

export default function Dashproduct() {
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
    {
      id: 3,
      image: "https://via.placeholder.com/40",
      category: "Fashion",
      name: "T-Shirt",
      description: "Comfortable cotton t-shirt",
      price: "$29",
      stock: 100,
      discount: "5%",
      status: "Available",
      verify: "Verified",
    },
    {
      id: 4,
      image: "https://via.placeholder.com/40",
      category: "Electronics",
      name: "Laptop",
      description: "Powerful laptop for work and gaming",
      price: "$999",
      stock: 10,
      discount: "8%",
      status: "Available",
      verify: "Verified",
    },
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
    <main className="overflow-x-auto md:mx-auto p-4">
      <div className="shadow-md rounded-lg bg-white dark:bg-gray-800 mb-6 p-4">
        <div className="mb-4">
          <h1 className="text-2xl font-semibold text-gray-900">Tất cả sản phẩm</h1>
          <div className="flex justify-between mt-4">
            <form className="flex-grow max-w-xs">
              <TextInput
                type="text"
                placeholder="Tìm kiếm..."
                rightIcon={AiOutlineSearch}
                className="hidden lg:inline w-full"
              />
            </form>
            <Button className="ml-3">Thêm sản phẩm</Button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto shadow-md rounded-lg">
        <Table hoverable className="w-full">
          <Table.Head>
            <Table.HeadCell>Ảnh</Table.HeadCell>
            <Table.HeadCell>Loại</Table.HeadCell>
            <Table.HeadCell>Tên</Table.HeadCell>
            <Table.HeadCell>Mô tả</Table.HeadCell>
            <Table.HeadCell>Giá</Table.HeadCell>
            <Table.HeadCell className="whitespace-nowrap">Số lượng</Table.HeadCell>
            <Table.HeadCell className="whitespace-nowrap">Giảm giá</Table.HeadCell>
            <Table.HeadCell className="whitespace-nowrap">Trạng thái</Table.HeadCell>
            <Table.HeadCell className="whitespace-nowrap">Xác thực</Table.HeadCell>
            <Table.HeadCell className="text-center">Sửa/Xóa</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {productsToDisplay.map((product) => (
              <Table.Row key={product.id} className="align-middle">
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
                <Table.Cell className="p-4">{product.price}</Table.Cell>
                <Table.Cell className="p-4">{product.stock}</Table.Cell>
                <Table.Cell className="p-4">{product.discount}</Table.Cell>
                <Table.Cell className="p-4">{product.status}</Table.Cell>
                <Table.Cell className="p-4">{product.verify}</Table.Cell>
                <Table.Cell className="p-4 flex space-x-2 justify-center">
                  <MdEdit
                    onClick={() => handleEdit(product)}
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

      {/* Pagination */}
      <div className="mt-6 flex justify-center">
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

      {/* Modal for Delete Confirmation */}
      <Modal show={showModal} onClose={handleCancel}>
        <Modal.Header>Xóa sản phẩm</Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500">
              Bạn có chắc chắn muốn xóa sản phẩm {selectedProduct?.name}?
            </h3>
            <div className="flex justify-center space-x-4 mt-4">
              <Button color="failure" onClick={handleConfirmDelete}>
                Có
              </Button>
              <Button color="gray" onClick={handleCancel}>
                Không
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </main>
  );
}
