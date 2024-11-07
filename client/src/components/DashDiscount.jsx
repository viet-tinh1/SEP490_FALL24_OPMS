import { Modal, Table, Button, TextInput } from "flowbite-react";
import { useState, useEffect } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { AiOutlineSearch } from "react-icons/ai";
import { MdDelete, MdEdit } from "react-icons/md";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";

export default function DashDiscount() {
  const [Discount, setDiscounts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const discountsPerPage = 3;

  useEffect(() => {
    const fetchDiscounts = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.error("User ID không tìm thấy trong localStorage.");
        return;
      }

      try {
        // Gọi API để lấy toàn bộ voucher
        const response = await fetch(`https://localhost:7098/api/VoucherAPI/getVouchers`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          // Lọc voucher dựa trên userId
          const userVouchers = data.filter(voucher => voucher.userId === parseInt(userId));
          setDiscounts(userVouchers); // Cập nhật danh sách voucher đã lọc
        } else {
          console.error("Không thể lấy danh sách voucher. Mã trạng thái:", response.status);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách voucher:", error);
      }
    };

    fetchDiscounts();
  }, []);

  const handleDelete = (discount) => {
    setSelectedDiscount(discount);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedDiscount) return;
  
    try {
      const response = await fetch(`https://localhost:7098/api/VoucherAPI/deleteVoucher?id=${selectedDiscount.voucherId}`, {
        method: 'DELETE', // Thay đổi phương thức thành DELETE
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        setDiscounts((prevDiscounts) =>
          prevDiscounts.filter((discount) => discount.voucherId !== selectedDiscount.voucherId)
        );
        setShowModal(false);
      } else {
        const errorData = await response.json();
        console.error("Failed to delete voucher:", errorData);
        alert("Xóa mã giảm giá không thành công: " + (errorData.message || "Lỗi không xác định."));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Đã xảy ra lỗi khi xóa mã giảm giá: " + error.message);
    }
  };
  
  const handleCancel = () => {
    setShowModal(false);
  };

  const pageCount = Math.ceil(Discount.length / discountsPerPage);
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const discountsToDisplay = Discount.slice(
    currentPage * discountsPerPage,
    (currentPage + 1) * discountsPerPage
  );

  return (
    <main className="overflow-x-auto md:mx-auto p-4">
      <div className="shadow-md rounded-lg bg-white dark:bg-gray-800 mb-6 p-4">
        <div className="mb-4">
          <h1 className="text-2xl font-semibold text-gray-900">
            Tất cả mã giảm giá
          </h1>
          <div className="flex flex-wrap gap-4 justify-between mt-4">
            <form className="flex-grow max-w-xs w-full md:w-1/2">
              <TextInput
                type="text"
                placeholder="Tìm kiếm..."
                rightIcon={AiOutlineSearch}
                className="w-full"
              />
            </form>
            <Link to="/DiscountUpdate">
              <Button className="w-full md:w-auto">Thêm mã giảm giá</Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto shadow-md rounded-lg">
        <Table hoverable className="w-full">
          <Table.Head>
            <Table.HeadCell>Tên mã</Table.HeadCell>
            <Table.HeadCell>Phần trăm</Table.HeadCell>
            <Table.HeadCell>Ngày tạo</Table.HeadCell>
            <Table.HeadCell>Ngày bắt đầu</Table.HeadCell>
            <Table.HeadCell>Ngày kết thúc</Table.HeadCell>
            <Table.HeadCell>Số lượng</Table.HeadCell>
            <Table.HeadCell>Trạng thái</Table.HeadCell>
            <Table.HeadCell className="text-center">Sửa/Xóa</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {discountsToDisplay.map((discount) => (
              <Table.Row key={discount.voucherId} className="align-middle">
                <Table.Cell className="p-4 text-center">
                  {discount.voucherName}
                </Table.Cell>
                <Table.Cell className="p-4 text-center">
                  {discount.voucherPercent}%
                </Table.Cell>
                <Table.Cell className="p-4 text-center">
                  {new Date(discount.createDate).toLocaleString('vi-VN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'         
                  })}
                </Table.Cell>
                <Table.Cell className="p-4 text-center">
                  {new Date(discount.openDate).toLocaleString('vi-VN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'                  
                  })}
                </Table.Cell>
                <Table.Cell className="p-4 text-center">
                  {new Date(discount.closeDate).toLocaleString('vi-VN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'                    
                  })}
                </Table.Cell>

                <Table.Cell className="p-4 text-center">
                  {discount.amount}
                </Table.Cell>
                <Table.Cell className="p-4 text-center">
                  {discount.status ? "Hoạt động" : "Không hoạt động"}
                </Table.Cell>
                <Table.Cell className="p-4 flex space-x-2 justify-center">
                  <Link
                    to="/DiscountEdit"
                    state={{ voucherId: discount.voucherId }}
                  >
                    <MdEdit
                      className="cursor-pointer text-green-600"
                      size={20}
                    />
                  </Link>
                  <MdDelete
                    onClick={() => handleDelete(discount)}
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
      {/* Modal for Delete Confirmation */}
      <Modal show={showModal} onClose={handleCancel}>
        <Modal.Header>Xóa mã giảm giá</Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500">
              Bạn có chắc chắn muốn xóa mã giảm giá {selectedDiscount?.voucherName}?
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
