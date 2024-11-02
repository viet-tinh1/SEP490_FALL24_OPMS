import { useState } from "react";
import { Link } from "react-router-dom";
export default function DiscountUpdate() {
  const [formData, setFormData] = useState({
    discountName: "",
    discountPercentage: "",
    startDate: "",
    endDate: "",
    quantity: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted data:", formData);
  };
  return (
    <div className="max-w-md mx-auto p-4 sm:p-6 rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Tên mã giảm giá */}
        <div className="space-y-1">
          <label
            htmlFor="discountName"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Tên mã giảm giá
          </label>
          <input
            type="text"
            id="discountName"
            name="discountName"
            value={formData.discountName}
            onChange={handleChange}
            placeholder="Nhập tên mã giảm giá"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        {/* Phần trăm */}
        <div className="space-y-1">
          <label
            htmlFor="discountPercentage"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Phần trăm
          </label>
          <input
            type="number"
            id="discountPercentage"
            name="discountPercentage"
            value={formData.discountPercentage}
            onChange={handleChange}
            placeholder="Nhập phần trăm giảm giá"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        {/* Ngày bắt đầu */}
        <div className="space-y-1">
          <label
            htmlFor="startDate"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Ngày bắt đầu
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        {/* Ngày kết thúc */}
        <div className="space-y-1">
          <label
            htmlFor="endDate"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Ngày kết thúc
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        {/* Số lượng */}
        <div className="space-y-1">
          <label
            htmlFor="quantity"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Số lượng
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="Nhập số lượng"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        {/* Buttons */}
        <div className="flex justify-between space-x-2">
          <Link to="/dashboard?tab=DashDiscount" className="w-full">
            <button
              type="button"
              className="w-full px-4 py-2 bg-gray-500 text-white font-medium rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700"
            >
              Trở về
            </button>
          </Link>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-green-600 text-white font-medium rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            Thêm mã giảm giá
          </button>
        </div>
      </form>
    </div>
  );
}