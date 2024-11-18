import { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { Spinner } from "flowbite-react";

export default function UserEdit() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = location.state || {}; // Lấy userId từ state

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    phoneNumber: "",
    roles: 2, // Mặc định là 2 (Người Mua)
    address: "",
    shopName: "",
  });
  const [showShopName, setShowShopName] = useState(false); // State to control visibility of shopName field
  const [existingUsernames, setExistingUsernames] = useState([]);
  const [existingEmails, setExistingEmails] = useState([]);
  const [existingShopNames, setExistingShopNames] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false); // State for showing success popup

  // Lấy dữ liệu người dùng hiện tại để hiển thị
  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) {
        setError("Không tìm thấy userId.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`https://localhost:7098/api/UserAPI/getUserById?userId=${userId}`);
        const nameResponse = await fetch("https://localhost:7098/api/UserAPI/getUser");

        if (!response.ok || !nameResponse.ok) {
          throw new Error("Không thể tải dữ liệu người dùng.");
        }

        const data = await response.json();
        const namesData = await nameResponse.json();
        setExistingUsernames(namesData.map((user) => user.username.toLowerCase()));
        setExistingEmails(namesData.map((user) => user.email.toLowerCase()));
        setExistingShopNames(namesData.map((user) => user.shopName?.toLowerCase()).filter(Boolean));

        setFormData({
          username: data.username || "",
          password: "", // Không hiển thị mật khẩu hiện tại
          email: data.email || "",
          phoneNumber: data.phoneNumber || "",
          roles: data.roles || 2,
          address: data.address || "",
          shopName: data.shopName || "",
        });

        setShowShopName(data.roles === 3); // Show shopName field if the role is "Người Bán"
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Toggle shopName field visibility when roles dropdown is changed
    if (name === "roles") {
      setShowShopName(value === "3");
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.username.trim()) {
      errors.username = "Tên người dùng không được để trống.";
    } else if (
      existingUsernames.includes(formData.username.toLowerCase()) &&
      formData.username.toLowerCase() !== formData.username.toLowerCase()
    ) {
      errors.username = "Tên người dùng đã tồn tại.";
    } else if (!/^[a-zA-Z0-9]{1,20}$/.test(formData.username)) {
      errors.username = "Tên người dùng không vượt quá 20 ký tự và không chứa ký tự đặc biệt.";
    }

    if (!formData.email.trim()) {
      errors.email = "Email không được để trống.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email không hợp lệ.";
    } else if (
      existingEmails.includes(formData.email.toLowerCase()) &&
      formData.email.toLowerCase() !== formData.email.toLowerCase()
    ) {
      errors.email = "Email đã tồn tại.";
    }

    // Bắt buộc nhập mật khẩu mới để thay đổi thông tin
    if (!formData.password) {
      errors.password = "Mật khẩu là bắt buộc để cập nhật thông tin.";
    } else if (formData.password.length < 8) {
      errors.password = "Mật khẩu phải có ít nhất 8 ký tự.";
    }

    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = "Số điện thoại không được để trống.";
    } else if (!/^[0-9]{10,11}$/.test(formData.phoneNumber)) {
      errors.phoneNumber = "Số điện thoại phải có 10-11 chữ số.";
    }

    // Kiểm tra tên cửa hàng khi vai trò là Người Bán
    if (formData.roles === "3" && showShopName) {
      if (!formData.shopName.trim()) {
        errors.shopName = "Tên cửa hàng không được để trống khi vai trò là Người Bán.";
      } else if (existingShopNames.includes(formData.shopName.toLowerCase())) {
        errors.shopName = "Tên cửa hàng đã tồn tại.";
      }
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("userId", userId);
    formDataToSend.append("username", formData.username);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("phoneNumber", formData.phoneNumber);
    formDataToSend.append("roles", formData.roles);
    formDataToSend.append("address", formData.address);
    formDataToSend.append("shopName", formData.roles === "3" ? formData.shopName : "");
    formDataToSend.append("status", 1); // Default status
    
    // Append the uploaded image if available
    if (formData.uploadedImage) {
      formDataToSend.append("uploadedImage", formData.uploadedImage);
    }

    try {
      const response = await fetch("https://localhost:7098/api/UserAPI/updateUser", {
        method: "POST",
        
        body: formDataToSend,
      });

      if (response.ok) {
        setShowPopup(true); // Hiển thị popup thành công
      } else {
        const errorData = await response.json();
        throw new Error("Cập nhật người dùng không thành công: " + (errorData.message || "Lỗi không xác định."));
      }
    } catch (err) {
      console.error("Error:", err);
      setError(err.message);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    navigate("/dashboard?tab=users");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner aria-label="Loading spinner" size="xl" />
        <span className="ml-3 text-lg font-semibold">Loading...</span>
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
            <p className="text-lg font-medium">Cập nhật thông tin người dùng thành công!</p>
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
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Tên người dùng
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
          {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
        </div>
        <div className="space-y-1">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Mật khẩu (bắt buộc để thay đổi thông tin)
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
        </div>
        <div className="space-y-1">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>
        <div className="space-y-1">
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Số điện thoại
          </label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
          {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
        </div>
        <div className="space-y-1">
          <label htmlFor="roles" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Vai trò
          </label>
          <select
            id="roles"
            name="roles"
            value={formData.roles}
            onChange={handleChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          >
            <option value="2">Người Dùng</option>
            <option value="3">Người Bán</option>
          </select>
        </div>
        {showShopName && (
          <div className="space-y-1">
            <label htmlFor="shopName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Tên cửa hàng
            </label>
            <input
              type="text"
              id="shopName"
              name="shopName"
              value={formData.shopName}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
            {errors.shopName && <p className="text-red-500 text-sm">{errors.shopName}</p>}
          </div>
        )}
        <div className="space-y-1">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Địa chỉ
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div className="flex justify-between space-x-2">
          <Link to="/dashboard?tab=users" className="w-full">
            <button
              type="button"
              className="w-full px-4 py-2 bg-gray-500 text-white font-medium rounded-md shadow-sm"
            >
              Trở về
            </button>
          </Link>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-green-600 text-white font-medium rounded-md shadow-sm"
          >
            Cập nhật người dùng
          </button>
        </div>
      </form>
    </div>
  );
}
