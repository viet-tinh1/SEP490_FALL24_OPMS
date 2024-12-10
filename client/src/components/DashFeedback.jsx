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
  const [showFullText, setShowFullText] = useState({}); // Sử dụng object để theo dõi trạng thái của từng phản hồi
  // Hàm gọi API để lấy phản hồi
  const fetchFeedbacks = async () => {
    try {
      setLoading(true); // Bật trạng thái loading
      const response = await fetch("https://opms1.runasp.net/api/FeebbackAPI/getFeedback");

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
    setShowFullText({}); // Đặt lại trạng thái về mặc định
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
      <div className="flex items-center justify-center h-screen w-screen">
        <div className="flex flex-col items-center">
          <Spinner aria-label="Loading spinner" size="xl" />
          <span className="mt-3 text-lg">Đang tải...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center mt-10">Lỗi: {error}</div>;
  }
  const role = localStorage.getItem("role");
  return (
    <>
      {role === "1" ? ( // Kiểm tra role
        <main className="overflow-x-auto md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
          {/*overflow-x-auto :Hide scroll*/}
          {/*overflow-x-scroll : Open scroll*/}
          <div className="shadow-md md:mx-auto p-3  rounded-lg bg-white dark:bg-gray-800 my-4">
            <div className="mb-1 w-full">
              <div className=" mb-4">
                <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
                  Danh Sách Phản Hồi
                </h1>
                <div className="sm:flex"></div>
              </div>
            </div>
          </div>

          <div className="table-auto ">
            <Table hoverable className="min-w-full">
              <Table.Head>
                <Table.HeadCell>Ngày Gửi</Table.HeadCell>
                <Table.HeadCell>Tên Người Gửi</Table.HeadCell>
                <Table.HeadCell>Email</Table.HeadCell>
                <Table.HeadCell className="w-80" >Nội Dung</Table.HeadCell>
                <Table.HeadCell>Đánh Giá</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {feedbacksToDisplay.map((feedback) => (
                  <Table.Row
                    className="bg-white dark:border-gray-700 dark:bg-gray-800 align-middle"
                    key={feedback.id}
                  >
                    <Table.Cell>
                      {new Date(feedback.createdAt).toLocaleDateString("en-GB")}
                    </Table.Cell>
                    <Table.Cell>{feedback.name}</Table.Cell>
                    <Table.Cell>{feedback.email}</Table.Cell>
                    <Table.Cell className="p-4">
                      <div>
                        {/* Hiển thị nội dung ngắn gọn hoặc đầy đủ dựa vào trạng thái */}
                        <p className={`line-clamp-2 ${showFullText[feedback.id] ? "line-clamp-none" : "overflow-hidden"}`}>
                          {feedback.feedbackText}
                        </p>

                        {/* Chỉ hiển thị nút nếu feedbackText có nhiều hơn 100 ký tự */}
                        {feedback.feedbackText.length > 100 && (
                          <button
                            className="text-blue-500 mt-2"
                            onClick={() => setShowFullText((prev) => ({
                              ...prev,
                              [feedback.id]: !prev[feedback.id],
                            }))}
                          >
                            {showFullText[feedback.id] ? "Thu gọn" : "Xem thêm"}
                          </button>
                        )}
                      </div>
                    </Table.Cell>
                    <Table.Cell>{feedback.rating}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>

            {/* Pagination Component */}
            <div className="mt-4">
              <ReactPaginate
                previousLabel={"← Trước"}
                nextLabel={"Sau →"}
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
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-center text-gray-500 dark:text-gray-400">
            Bạn không có quyền truy cập vào nội dung này.
          </p>
        </div>
      )}
    </>
  );
}
