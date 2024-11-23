import { useState, useEffect } from "react";
export default function PaymentFailure() {
    const [orderData, setOrderData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrderData = async () => {
            const orderId = localStorage.getItem("orderId"); // Retrieve orderId from localStorage

            if (!orderId) {
                setError("Order ID not found.");
                return;
            }

            try {
                const response = await fetch(`https://opms1.runasp.net/api/PaymentAPI/order/${orderId}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch order data.");
                }

                const data = await response.json();
                setOrderData(data); // Save fetched data to state
            } catch (err) {
                setError(err.message);
            }
        };

        fetchOrderData();
    }, []);

    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <h4 className="text-xl font-semibold text-red-600 mb-4">Thanh toán thất bại</h4>
            <p className="text-base mb-4">
                Nếu có bất kỳ câu hỏi nào, hãy gửi email tới{' '}
                <a href="mailto:support@payos.vn" className="text-blue-600 underline">
                    support@payos.vn
                </a>
            </p>
            <a
                href="/order-success"
                className="mt-4 py-2 px-6 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
                Trở về trang Tạo Link thanh toán
            </a>
        </div>
    );
};

