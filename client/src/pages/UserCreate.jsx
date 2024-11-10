import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function UserCreate() {
  const [formData, setFormData] = useState({
    userId: 0,
    username: "",
    password: "",
    email: "",
    phoneNumber: "",
    roles: 2, // Mặc định là 2 (Người Mua) vì Admin bị ẩn
    fullName: "",
    address: "",
    userImage: null, // Hình ảnh luôn là null cho tất cả vai trò
    status: 1,
    shopName: "",
  });
  const [errors, setErrors] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [users, setUsers] = useState([]); // Danh sách tất cả người dùng
  const navigate = useNavigate();

  // Lấy danh sách người dùng từ API khi component được render
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("https://localhost:7098/api/UserAPI/getUser");
        if (response.ok) {
          const data = await response.json();
          setUsers(data); // Lưu danh sách người dùng vào state
        } else {
          console.error("Error fetching users:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&]).{8,}$/;
    return passwordRegex.test(password);
  };

  const validateForm = () => {
    const errors = {};

    // Kiểm tra tên người dùng không được để trống và không chứa dấu cách
    if (!formData.username.trim()) {
      errors.username = "Tên người dùng không được để trống.";
    } else if (/\s/.test(formData.username)) {
      errors.username = "Tên người dùng không được chứa dấu cách.";
    } else if (users.some((user) => user.username === formData.username)) {
      errors.username = "Tên người dùng đã tồn tại.";
    }

    // Kiểm tra mật khẩu
    if (!formData.password.trim()) {
      errors.password = "Mật khẩu không được để trống.";
    } else if (!validatePassword(formData.password)) {
      errors.password = "Mật khẩu phải có ít nhất 8 ký tự, chứa một chữ cái viết hoa, một chữ cái viết thường và một ký tự đặc biệt.";
    }

    // Kiểm tra email
    if (!formData.email.trim()) {
      errors.email = "Email không được để trống.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email không hợp lệ.";
    } else if (users.some((user) => user.email === formData.email)) {
      errors.email = "Email đã tồn tại.";
    }

    // Kiểm tra số điện thoại đã tồn tại
    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = "Số điện thoại không được để trống.";
    } else if (!/^[0-9]{10,11}$/.test(formData.phoneNumber)) {
      errors.phoneNumber = "Số điện thoại phải có 10-11 chữ số.";
    } else if (users.some((user) => user.phoneNumber === formData.phoneNumber)) {
      errors.phoneNumber = "Số điện thoại đã tồn tại.";
    }

    // Kiểm tra Tên Cửa Hàng nếu vai trò là Người Bán và đảm bảo tính duy nhất của nó
    if (formData.roles === "3") {
      if (!formData.shopName.trim()) {
        errors.shopName = "Tên cửa hàng không được để trống khi vai trò là Người Bán.";
      } else if (users.some((user) => user.shopName === formData.shopName)) {
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

    const data = { ...formData, userImage: null }; // Đảm bảo userImage luôn là null trong payload
    console.log("Payload being sent to backend:", data);
    console.log(shopName);
    try {
      const response = await fetch("https://localhost:7098/api/UserAPI/createUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setShowPopup(true);
      } else {
        const errorData = await response.json();
        console.error("Failed to create user:", errorData);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    navigate("/dashboard?tab=users");
  };

  return (
    <div className="max-w-md mx-auto p-4 sm:p-6 rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-md text-center">
            <p className="text-lg font-medium">Tạo người dùng thành công!</p>
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
            Mật khẩu
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
            <option value="2">Người Mua</option>
            <option value="3">Người Bán</option>
          </select>
        </div>
        {formData.roles === "3" && (
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
          <Link to="/dashboard" className="w-full">
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
            Thêm người dùng
          </button>
        </div>
      </form>
    </div>
  );
}
