import { Modal, Table, Button } from "flowbite-react";
import { useState, useEffect } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { TbLock, TbLockOpen } from "react-icons/tb"; // Import the lock icons
import { TextInput } from "flowbite-react";
import { AiOutlineSearch } from "react-icons/ai";
import ReactPaginate from "react-paginate"; // Import the pagination library
import { Link, useNavigate } from "react-router-dom";
import { Spinner } from "flowbite-react";

export default function OrderManager() {
    const [orders, setOrders] = useState([]);
    const [role, setURoles] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [cartDetails, setCartDetails] = useState({});
    const [plantNames, setPlantNames] = useState({});
    const [currentPage, setCurrentPage] = useState(0); // Track current page
    const [selectedOption, setSelectedOption] = useState("");
    const ordersPerPage = 5; // Limit the number of users per page
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [orderStatuses, setOrderStatuses] = useState({});

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        const storedRoles = localStorage.getItem("role");
        setURoles(storedRoles);
        if (!userId || userId === "undefined") {
            navigate("/sign-in");
            setLoading(false);
            return;
        }
        const fetchOrders = async () => {
            try {
                const response = await fetch(`https://opms1.runasp.net/api/OrderAPI/getOrdersBySeller?sellerId=${userId}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch orders");
                }
                const data = await response.json();
                const ordersData = Array.isArray(data.orders) ? data.orders : [];
                setOrders(ordersData);
                console.log("Orders data:", ordersData);
                const initialStatuses = {};
                ordersData.forEach(order => {

                    initialStatuses[order.orderId] = order.status;
                });
                setOrderStatuses(initialStatuses);
                setLoading(false);


            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };

        fetchOrders();
    }, [navigate]);


    const handleToggle = (orders) => {
        setSelectedOrder(orders); // Set the current user
        setShowModal(true); // Show the modal
    };

    const handleStatusChange = async (orderId, newStatus) => {
        // Update the local state immediately for a responsive UI
        setOrderStatuses((prevStatuses) => ({
            ...prevStatuses,
            [orderId]: newStatus,
        }));

        try {
            const response = await fetch("https://opms1.runasp.net/api/OrderAPI/updateOrderStatus", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    orderId: orderId,
                    status: newStatus,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to update order status");
            }

            console.log("Order status updated successfully");

            // Update the orders state with the new status for the specific order
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order.orderId === orderId ? { ...order, status: newStatus } : order
                )
            );
        } catch (error) {
            console.error("Error updating order status:", error);
            // Revert the status in case of an error
            setOrderStatuses((prevStatuses) => ({
                ...prevStatuses,
                [orderId]: orderStatuses[orderId], // revert to the previous status
            }));
        }
    };

    const handleCancel = () => {
        setShowModal(false); // Close the modal without making changes
    };


    // Pagination: Calculate the number of pages
    const pageCount = Math.ceil(orders.length / ordersPerPage);

    // Handle page click
    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    // Get users to display on the current page
    const ordersToDisplay = orders.slice(
        currentPage * ordersPerPage,
        (currentPage + 1) * ordersPerPage
    );
    if (loading) {
        return (
          <div className="flex items-center justify-center h-screen w-full">
            <div className="flex flex-col items-center">
              <Spinner aria-label="Loading spinner" size="xl" />
              <span className="mt-3 text-lg font-semibold">Đang tải...</span>
            </div>
          </div>
        );
      }
    return (
        <main className="overflow-x-auto md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
            {/*overflow-x-auto :Hide scroll*/}
            {/*overflow-x-scroll : Open scroll*/}
            <div className="shadow-md md:mx-auto p-3  rounded-lg bg-white dark:bg-gray-800 my-4">
                <div className="mb-1 w-full">
                    <div className=" mb-4">
                        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">Tất cả đơn hàng</h1>
                        <br></br>
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

            <div className="table-auto flex-grow min-h-[430px] flex flex-col ">
                <Table hoverable className="shadow-md">
                    <Table.Head>
                        <Table.HeadCell>Mã Đơn Hàng</Table.HeadCell>
                        <Table.HeadCell>Ngày Đặt Hàng</Table.HeadCell>
                        <Table.HeadCell>Tên Cây</Table.HeadCell>
                        <Table.HeadCell>Số Lượng</Table.HeadCell>
                        <Table.HeadCell>Tổng Số Tiền</Table.HeadCell>
                        <Table.HeadCell>Trạng Thái đơn hàng</Table.HeadCell>
                        <Table.HeadCell>Trạng Thái Thanh toán</Table.HeadCell>
                        <Table.HeadCell>Phương Thức Thanh Toán</Table.HeadCell>
                        <Table.HeadCell>Xác nhận đơn hàng</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                        {ordersToDisplay.map((order) => (
                            <Table.Row
                                className="bg-white dark:border-gray-700 dark:bg-gray-800 align-middle"
                                key={order.orderId}
                            >
                                <Table.Cell className="py-4">{order.orderId}</Table.Cell>
                                <Table.Cell className="py-4">
                                    {new Date(order.orderDate).toLocaleDateString("en-GB")} {new Date(order.orderDate).toLocaleTimeString("en-GB")}
                                </Table.Cell>
                                <Table.Cell className="py-4">
                                    {order.shoppingCartItems.plantId ? (
                                        <Link to={`/productdetail/${order.shoppingCartItems.plantId}`}>
                                            {order.shoppingCartItems.plantName || "Đang tải..."}
                                        </Link>
                                    ) : (
                                        "Đang tải..."
                                    )}
                                </Table.Cell>
                                <Table.Cell className="py-4">
                                    {order.shoppingCartItems.quantity || "Đang tải..."}
                                </Table.Cell>
                                <Table.Cell className="py-4">${(order.totalAmount).toFixed(3)}</Table.Cell>
                                <Table.Cell className="py-4">
                                    {order.status === "Pending" ? "Đang xử lý"
                                        : order.status === "Success" ? "Thành công"
                                            : order.status === "Cancel" ? "Hủy" : ""
                                    }
                                </Table.Cell>
                                <Table.Cell className="py-4">{order.isSuccess ? "Đã thanh toán" : "Chưa thanh toán"}</Table.Cell>
                                <Table.Cell className="py-4">
                                    {order.paymentMethod === "1" ? "Thanh toán khi nhận hàng" : order.paymentMethod || "Thanh toán khi nhận hàng"}
                                </Table.Cell>
                                <Table.Cell className="py-4">
                                    <select
                                        value={orderStatuses[order.orderId]}
                                        onChange={(e) =>
                                            handleStatusChange(order.orderId, e.target.value)
                                        }
                                        className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >

                                        <option value="Pending">Đang xử lý</option>
                                        <option value="Cancel">Hủy</option>
                                        <option value="Success">Thành công</option>
                                    </select>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </div>
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
        </main>
    );
}