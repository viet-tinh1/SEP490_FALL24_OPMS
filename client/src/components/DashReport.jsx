import { Modal, Table, Button } from "flowbite-react";
import { useState, useEffect } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { TextInput } from "flowbite-react";
import { AiOutlineSearch } from "react-icons/ai";
import ReactPaginate from "react-paginate"; // Import the pagination library

export default function DashReport() {
  const [reports, setReports] = useState([]); // State để lưu danh sách tố cáo
  const [loading, setLoading] = useState(true); // State cho trạng thái loading
  const [error, setError] = useState(null); // State cho lỗi
  const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại
  const reportsPerPage = 3; // Số báo cáo mỗi trang

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://opms1.runasp.net/api/ReportsAPI/getReport");
      if (!response.ok) {
        throw new Error("Failed to fetch reports.");
      }
      const reportsData = await response.json();

      // Gọi API lấy thông tin người tố cáo
      const enrichedReports = await Promise.all(
        reportsData.map(async (report) => {
          const userResponse = await fetch(
            `https://opms1.runasp.net/api/UserAPI/getUserByIds?userId=${report.userId}`
          );
          const userData = await userResponse.json();

         
          const reasonResponse = await fetch(
            "https://opms1.runasp.net/api/ReasonsAPI/getReasons"
          );
          const reasonsData = await reasonResponse.json();
      
          // Tạo ánh xạ reasonId -> reasonName
          const reasonMap = reasonsData.reduce((acc, reason) => {
            acc[reason.id] = reason.reasons;
            return acc;
          }, {});

          const plantResponse = await fetch(
            `https://opms1.runasp.net/api/PlantAPI/getPlantById?id=${report.plantId}`
          );
          const plantData = await plantResponse.json();

          return {
            ...report,
            reporterName: userData.userName,
            reportPlant: plantData.plantName,
            reasonName: reasonMap[report.reasonId] || "Unknown", // Thêm tên người tố cáo vào báo cáo
          };
        })
        
      );

      setReports(enrichedReports);
    } catch (err) {
      setError(err.message); // Lưu lỗi nếu có
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports(); // Gọi API khi component được render
  }, []);

  // Pagination: Calculate the number of pages
  const pageCount = Math.ceil(reports.length / reportsPerPage);

  // Xử lý thay đổi trang
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  // Lấy danh sách tố cáo của trang hiện tại
  const reportsToDisplay = reports.slice(
    currentPage * reportsPerPage,
    (currentPage + 1) * reportsPerPage
  );
  if (loading) {
    return <div className="text-center">Đang tải...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }
  return (
    <main className="overflow-x-auto md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      <div className="shadow-md md:mx-auto p-3 rounded-lg bg-white dark:bg-gray-800 my-4">
        <div className="mb-1 w-full">
          <div className="mb-4">
            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
              Tất cả tố cáo
            </h1>
            <div className="sm:flex">
              <div className="hidden items-center mb-3 sm:flex sm:divide-x sm:divide-gray-100 sm:mb-0">
                <form>
                  
                </form>
              </div>
            
            </div>
          </div>
        </div>
      </div>

      <div className="table-auto ">
        <Table hoverable className="shadow-md">
          <Table.Head>
            <Table.HeadCell>Ngày tố cáo</Table.HeadCell>
            <Table.HeadCell>Người tố cáo</Table.HeadCell>
            <Table.HeadCell>Lý do tố cáo</Table.HeadCell>
            <Table.HeadCell>Sản phẩm bị tố cáo</Table.HeadCell>
            <Table.HeadCell>Nội dung tố cáo</Table.HeadCell>
            
          </Table.Head>
          <Table.Body className="divide-y">
          {reportsToDisplay.map((report) => (
              <Table.Row
                className="bg-white dark:border-gray-700 dark:bg-gray-800 align-middle"
                key={report.id}
              >
                <Table.Cell className="py-4">{new Date(report.createdDate).toLocaleDateString("en-GB")}</Table.Cell>
                <Table.Cell className="py-4">{report.reporterName}</Table.Cell>
                <Table.Cell className="py-4">{report.reasonName}</Table.Cell>
                <Table.Cell className="py-4">{report.reportPlant}</Table.Cell>
                <Table.Cell className="py-4">{report.reportContent}</Table.Cell>               
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
