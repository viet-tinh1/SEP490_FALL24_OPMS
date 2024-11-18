import { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { Spinner } from "flowbite-react";
export default function DiscountEdit() {
  const location = useLocation();
  const navigate = useNavigate();
  const { voucherId } = location.state || {}; // Lấy voucherId từ state

  const [formData, setFormData] = useState({
    discountName: "",
    discountPercentage: "",
    startDate: "",
    endDate: "",
    quantity: "",
  });
  const [existingDiscountNames, setExistingDiscountNames] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false); // State for showing success popup

  // Lấy dữ liệu voucher hiện tại để hiển thị
  useEffect(() => {
    const fetchVoucher = async () => {
      if (!voucherId) {
        setError("Không tìm thấy voucherId.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`https://localhost:7098/api/VoucherAPI/getVoucherById?id=${voucherId}`);
        const nameResponse = await fetch("https://localhost:7098/api/VoucherAPI/getVouchers");

        if (!response.ok || !nameResponse.ok) {
          throw new Error("Không thể tải dữ liệu mã giảm giá.");
        }

        const data = await response.json();
        const namesData = await nameResponse.json();
         setExistingDiscountNames(namesData.map((voucher) => voucher.voucherName.toLowerCase()));

        setFormData({
          discountName: data.voucherName || "",
          discountPercentage: data.voucherPercent || "",
          startDate: data.openDate ? data.openDate.split("T")[0] : "",
          endDate: data.closeDate ? data.closeDate.split("T")[0] : "",
          quantity: data.amount || "",
        });
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchVoucher();
  }, [voucherId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const errors = {};
    const today = new Date();
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);

    if (!formData.discountName.trim()) {
      errors.discountName = "Tên mã giảm giá không được để trống.";
    } else if (existingDiscountNames.includes(formData.discountName.toLowerCase())) {
      errors.discountName = "Tên mã giảm giá đã tồn tại.";
    } else if (!/^[a-zA-Z0-9]{1,20}$/.test(formData.discountName)) {
      errors.discountName = "Tên mã giảm giá không vượt quá 20 ký tự và không chứa ký tự đặc biệt.";
    }

    if (!formData.discountPercentage) {
      errors.discountPercentage = "Phần trăm giảm giá không được để trống.";
    } else if (formData.discountPercentage <= 0 || formData.discountPercentage > 100) {
      errors.discountPercentage = "Phần trăm giảm giá phải từ 1 đến 100.";
    }

    if (!formData.startDate) {
      errors.startDate = "Ngày bắt đầu không được để trống.";
    } else if (startDate < today) {
      errors.startDate = "Ngày bắt đầu không được nhỏ hơn ngày hiện tại.";
    }

    if (!formData.endDate) {
      errors.endDate = "Ngày kết thúc không được để trống.";
    } else if (endDate < startDate) {
      errors.endDate = "Ngày kết thúc không được nhỏ hơn ngày bắt đầu.";
    }

    if (!formData.quantity) {
      errors.quantity = "Số lượng không được để trống.";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.error("User ID không tồn tại trong localStorage.");
      return;
    }

    // Cấu trúc dữ liệu theo yêu cầu của BE
    const updatedData = {
      voucherId: voucherId,
      voucherName: formData.discountName,
      voucherPercent: parseFloat(formData.discountPercentage),
      createDate: new Date().toISOString(),
      openDate: new Date(formData.startDate).toISOString(),
      closeDate: new Date(formData.endDate).toISOString(),
      amount: parseInt(formData.quantity, 10),
      status: true,
      userId: parseInt(userId, 10),
    };

    try {
      const response = await fetch("https://localhost:7098/api/VoucherAPI/updateVoucher", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        setShowPopup(true); // Hiển thị popup thành công
      } else {
        const errorData = await response.json();
        throw new Error("Cập nhật mã giảm giá không thành công: " + (errorData.message || "Lỗi không xác định."));
      }
    } catch (err) {
      console.error("Error:", err);
      setError(err.message);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    navigate("/dashboard?tab=DashDiscount");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <div className="flex flex-col items-center">
          <Spinner aria-label="Loading spinner" size="xl" />
          <span className="mt-3 text-lg font-semibold">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div>Lỗi: {error}</div>;
  }

  return (
    <div className="max-w-md mx-auto p-4 sm:p-6 rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-md text-center">
            <p className="text-lg font-medium">Cập nhật mã giảm giá thành công!</p>
            <button
              onClick={closePopup}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <label htmlFor="discountName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
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
          {errors.discountName && <p className="text-red-500 text-sm">{errors.discountName}</p>}
        </div>
        <div className="space-y-1">
          <label htmlFor="discountPercentage" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
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
          {errors.discountPercentage && <p className="text-red-500 text-sm">{errors.discountPercentage}</p>}
        </div>
        <div className="space-y-1">
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
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
          {errors.startDate && <p className="text-red-500 text-sm">{errors.startDate}</p>}
        </div>
        <div className="space-y-1">
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
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
          {errors.endDate && <p className="text-red-500 text-sm">{errors.endDate}</p>}
        </div>
        <div className="space-y-1">
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
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
          {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity}</p>}
        </div>
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
            Sửa mã giảm giá
          </button>
        </div>
      </form>
    </div>
  );
}
