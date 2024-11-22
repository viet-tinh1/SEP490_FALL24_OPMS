import { Modal, Table, Button } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { TbLock, TbLockOpen } from "react-icons/tb"; // Import the lock icons
import { TextInput } from "flowbite-react";
import { AiOutlineSearch } from "react-icons/ai";
import ReactPaginate from "react-paginate"; // Import the pagination library
import { useState, useEffect } from "react";
import { Spinner } from "flowbite-react";
export default function DashFeedback() {
  
  // Store selected user
  const [feedbacks, setFeedbacks] = useState([]); // State để lưu phản hồi từ API
  const [loading, setLoading] = useState(true); // State cho loading
  const [error, setError] = useState(null); // State cho lỗi
  const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại
  const feedbacksPerPage = 5; // Số feedback mỗi trang

  // Hàm gọi API để lấy phản hồi
  const fetchFeedbacks = async () => {
    try {
      setLoading(true); // Bật trạng thái loading
      const response = await fetch("https://localhost:7098/api/FeebbackAPI/getFeedback");
                                    
      if (!response.ok) {
        throw new Error("Không thể lấy danh sách phản hồi. Vui lòng thử lại sau.");
      }

      const data = await response.json(); // Chuyển đổi phản hồi sang JSON
      setFeedbacks(data); // Cập nhật state với dữ liệu phản hồi
    } catch (err) {
      console.error("Lỗi khi lấy phản hồi:", err);
      setError(err.message);
    } finally {
      setLoading(false); // Tắt trạng thái loading
    }
  };

  useEffect(() => {
    fetchFeedbacks(); // Gọi API khi component được render lần đầu
  }, []);

  // Hàm xử lý thay đổi trang
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  // Tính toán số lượng trang
  const pageCount = Math.ceil(feedbacks.length / feedbacksPerPage);

  // Lấy danh sách phản hồi hiển thị trên trang hiện tại
  const feedbacksToDisplay = feedbacks.slice(
    currentPage * feedbacksPerPage,
    (currentPage + 1) * feedbacksPerPage
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner aria-label="Loading spinner" size="xl" />
        <span className="ml-3 text-lg">Đang tải...</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center mt-10">Lỗi: {error}</div>;
  }

  return (
    <main className="overflow-x-auto md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {/*overflow-x-auto :Hide scroll*/}
      {/*overflow-x-scroll : Open scroll*/}
      <div className="shadow-md md:mx-auto p-3  rounded-lg bg-white dark:bg-gray-800 my-4">
        <div className="mb-1 w-full">
          <div className=" mb-4">
            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">Danh Sách Phản Hồi</h1>           
            <div className="sm:flex">
              <div className="hidden items-center mb-3 sm:flex sm:divide-x sm:divide-gray-100 sm:mb-0">
                <form>
                  <TextInput
                    type="text"
                    placeholder="Search..."
                    rightIcon={AiOutlineSearch}
                    className="hidden lg:inline"
                  />
                </form>
              </div>            
            </div>
          </div>
        </div>
      </div>

      <div className="table-auto ">
        <Table hoverable className="shadow-md">
          <Table.Head>
            <Table.HeadCell>Ngày Gửi</Table.HeadCell>
            <Table.HeadCell>Tên Người Gửi</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell>Nội Dung</Table.HeadCell>
            <Table.HeadCell>Đánh Giá</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
          {feedbacksToDisplay.map((feedback) => (
              <Table.Row
                className="bg-white dark:border-gray-700 dark:bg-gray-800 align-middle"
                key={feedback.id}
              >
                <Table.Cell>{new Date(feedback.createdAt).toLocaleDateString("en-GB")}</Table.Cell>
                <Table.Cell>{feedback.name}</Table.Cell>
                <Table.Cell>{feedback.email}</Table.Cell>
                <Table.Cell>{feedback.feedbackText}</Table.Cell>
                <Table.Cell>{feedback.rating}</Table.Cell>                
              </Table.Row>
            ))}
          </Table.Body>
        </Table>

        {/* Pagination Component */}
        <div className="mt-4">
          <ReactPaginate
            previousLabel={"← Previous"}
            nextLabel={"Next →"}
            pageCount={pageCount}
            onPageChange={handlePageClick}
            containerClassName={"flex justify-center space-x-4"}
            pageLinkClassName={"py-2 px-4 border rounded"}
            activeClassName={"bg-blue-600 text-white"}
            disabledClassName={"opacity-50 cursor-not-allowed"}
          />
        </div>

        
      </div>
    </main>
  );
}
