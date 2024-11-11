import React, { useEffect, useState } from 'react';
import { FaCloudArrowUp } from 'react-icons/fa6';
import { MdOutlineSell } from 'react-icons/md';
import { Spinner } from "flowbite-react";
import { useRef } from "react";

export default function DashProfile() {
  // Khởi tạo state `user`, `error` và `loading`
  const [user, setUserData] = useState({});
  const [role, setURoles] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [LimitPasswordError, setLimitPasswordError] = useState('');
  const fileInputRef = useRef(null);

  // Hàm lấy dữ liệu người dùng từ API
  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem("userId");
      const storedRoles = localStorage.getItem("role");
      setURoles(storedRoles);
      if (!userId || userId === "undefined") {
        console.error("User is not logged in or userId is invalid.");
        setError("User is not logged in or userId is invalid.");
        setLoading(false);
        return;
      }
      try {
        const userResponse = await fetch(`https://localhost:7098/api/UserAPI/getUserById?userId=${userId}`);
        const userData = await userResponse.json();

        if (!userResponse.ok) {
          throw new Error("Failed to fetch user data");
        }

        if (userData.message === "No user available currently.") {
          setError("No user available currently.");
          setUserData({});  // Xóa dữ liệu người dùng nếu không có
        } else {
          setUserData(userData);  // Cập nhật state với dữ liệu người dùng
        }
        setLoading(false);  // Kết thúc trạng thái loading
      } catch (err) {
        setError(err.message);  // Hiển thị thông báo lỗi nếu có
        setLoading(false);
      }
    }

    fetchUserData();
  }, []);

  // Hàm xử lý khi submit form cho thông tin người dùng
  const handleUserSubmit = async (event) => {
    event.preventDefault();
  
    const formData = new FormData();
    formData.append("UserId", user.userId);
    formData.append("Username", user.username);
    formData.append("Password", user.password || "");
    formData.append("Email", user.email);
    formData.append("PhoneNumber", user.phoneNumber);
    formData.append("Roles", user.roles);
    formData.append("FullName", user.fullName);
    formData.append("Address", user.address);
    formData.append("UserImage", user.userImage || "");  // You can update this if you have a file
    formData.append("Status", user.status);
    formData.append("ShopName", user.shopName || "");
    
    // Assuming you have a file input and you want to upload an image
    if (user.uploadedImage) {
      formData.append("uploadedImage", user.uploadedImage);
    }
  
    try {
      const response = await fetch('https://localhost:7098/api/UserAPI/updateUser', {
        method: 'POST',
        body: formData
      });
  
      if (!response.ok) {
        throw new Error('Failed to update user');
      }
  
      alert("User information updated successfully!");
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  // Hàm xử lý khi submit form cho mật khẩu
  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setPasswordError('');
    setConfirmPasswordError('');
    setLimitPasswordError('');

    try {
      if (newPassword.length < 7) {
        setLimitPasswordError("Mật khẩu mới phải từ 7 chữ trở lên.");
        return;
      }

      const validatePassword = (password) => {
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
        return passwordRegex.test(password);
      };

      if (!validatePassword(newPassword)) {
        setLimitPasswordError("Mật khẩu mới phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.");
        return;
      }



      if (newPassword !== confirmPassword) {
        setConfirmPasswordError("Mật khẩu xác nhận phải giống với mật khẩu mới.");
        return;
      }

      const response = await fetch('https://localhost:7098/api/UserAPI/changePassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          id: user.userId  // Gửi ID người dùng
        })
      });

      if (!response.ok) {
        if (response.status === 400) {
          setPasswordError("Mật khẩu hiện tại không đúng.");
        } else {
          throw new Error('Failed to update password');
        }
        return;
      }

      alert("Password updated successfully!");
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error("Lỗi khi cập nhật mật khẩu:", error);
    }
  };

  // Hàm xử lý khi thay đổi giá trị input
  const handleChange = (e) => {
    setUserData({
      ...user,
      [e.target.name]: e.target.value
    });
  };

  // Hàm mô tả vai trò
  const getRoleDescription = (role) => {
    switch (role) {
      case 1:
        return 'Quản lí';  // Vai trò Admin
      case 2:
        return 'Người dùng';   // Vai trò Người dùng
      case 3:
        return 'Người bán'; // Vai trò Người bán
      default:
        return 'Unknown Role'; // Nếu không có vai trò nào phù hợp
    }
  };
  // đổi avatar
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };
  // hàm api 
  const handleFileChange = async (event) => {
    const userId = localStorage.getItem("userId");
    const file = event.target.files[0];
    if (!file || !userId) {
      alert("User ID is missing or no file selected.");
      return;
    }

    const formData = new FormData();
    formData.append("newImage", file);

    try {
      const response = await fetch(`https://localhost:7098/api/UserAPI/updateUserImage?userId=${userId}`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        alert("Image updated successfully!");
        console.log("Updated image URL:", data.imageUrl);
        setUserData((prevUser) => ({
          ...prevUser,
          userImage: data.imageUrl, // Assuming `data.imageUrl` is the new image URL
        }));
      } else {
        const errorData = await response.json();
        alert("Image update failed: " + errorData.message);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image");
    }
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
    return <div>{error}</div>;  // Hiển thị lỗi nếu có
  }
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

 

  return (
    <div className="flex overflow-hidden bg-white pt-16 w-full">
      <main className="w-full">
        <div className="grid grid-cols-1 px-4 pt-6 xl:grid-cols-3 xl:gap-6 w-full">
          {/* User Settings */}
          <div className="col-span-full mb-4 xl:mb-0">
            <div className="mb-1 w-full">
              <div className="mb-4">
                <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">User settings</h1>
              </div>
            </div>
          </div>

          {/* Profile Picture */}
          <div className="col-span-full xl:col-auto">
            <div className="bg-white shadow-lg shadow-gray-200 rounded-2xl p-4 mb-6">
              <div className="items-center sm:flex xl:block 2xl:flex sm:space-x-4 xl:space-x-0 2xl:space-x-4">
                <img
                  className="mb-4 w-28 h-28 rounded-lg sm:mb-0 xl:mb-4 2xl:mb-0 shadow-lg shadow-gray-300"
                  src={user.userImage} // Hình ảnh người dùng
                  alt={user.userImage}
                />
                <div>
                  <h3 className="mb-1 text-2xl font-bold text-gray-900">
                    {user.username || 'No username available'}  {/* Username */}
                  </h3>
                  <div className="mb-4 text-base font-normal text-gray-500">
                    {user.status === 1 ? (
                      <span className="text-green-500">Hoạt động </span>
                    ) : user.status === 0 ? (
                      <span className="text-red-500">Khóa</span>
                    ) : (
                      'Status not available'
                    )}
                  </div>
                  <div className="mb-4 text-base font-normal text-gray-500">
                    Role: {getRoleDescription(user.roles)}  {/* Hiển thị mô tả vai trò */}
                  </div>
                  {/* Automatically trigger file input onChange */}
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                  <button
                    onClick={() => fileInputRef.current.click()}
                    className="inline-flex items-center py-2 px-3 text-sm font-medium text-center text-white bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg shadow-md shadow-gray-300 hover:scale-[1.02] transition-transform"
                  >
                    <FaCloudArrowUp className="mr-2 -ml-1 w-4 h-4" />
                    Change picture
                  </button>
                </div>
              </div>
            </div>

            {/* Register to become seller */}{
              (user.roles !== 3 && user.roles !== 1) && (
                <div className="bg-white shadow-lg shadow-gray-200 rounded-2xl p-4 mb-6">
                  <div className="text-sm font-medium">
                    *Đăng ký thành người bán cây
                  </div>
                  <a
                    href="/dashboard?tab=DashRegisterSeller"
                    className="inline-flex items-center py-2 px-3 text-sm font-medium text-center text-white bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg shadow-md shadow-gray-300 hover:scale-[1.02] transition-transform"
                  >
                    <MdOutlineSell className="mr-2 -ml-1 w-4 h-4" />
                    Đăng Ký Người Bán
                  </a>
                </div>
              )
            }

          </div>

          {/* General Information Form */}
          <div className="col-span-2">
            <div className="bg-white shadow-lg shadow-gray-200 rounded-2xl p-4 mb-6">
              <h3 className="mb-4 text-xl font-bold">Thông Tin Chung</h3>
              <form onSubmit={handleUserSubmit}>
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-3">
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      Tên Người Dùng
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={user.username || ''}  // User Name
                      onChange={handleChange}
                      className="shadow-lg-sm border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-2 focus:ring-pink-100 focus:border-pink-300 block w-full p-2.5"
                      required
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      Tên Của Bạn

                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={user.fullName || ''}
                      onChange={handleChange}
                      className="shadow-lg-sm border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-2 focus:ring-pink-100 focus:border-pink-300 block w-full p-2.5"
                      required
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      Email
                    </label>
                    <div className="flex items-center">
                      <input
                        type="email"
                        name="email"
                        value={user.email || ''}
                        onChange={handleChange}
                        className="shadow-lg-sm border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-2 focus:ring-pink-100 focus:border-pink-300 block w-full p-2.5"
                        required
                      />
                      {user.isVerifyEmail === 1 && (
                        <span className="ml-2 text-green-600">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </span>
                      )}
                      {user.isVerifyEmail === 0 && (
                        <span className="ml-2 text-red-600">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      Số Điện Thoại
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={user.phoneNumber || ''}  // Phone Number
                      onChange={handleChange}
                      className="shadow-lg-sm border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-2 focus:ring-pink-100 focus:border-pink-300 block w-full p-2.5"
                      required
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      Địa Chỉ
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={user.address || ''}  // Address
                      onChange={handleChange}
                      className="shadow-lg-sm border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-2 focus:ring-pink-100 focus:border-pink-300 block w-full p-2.5"
                      required
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      Ngày Tạo
                    </label>
                    <input
                      type="text"
                      name="createdDate"
                      value={user.createdDate || ''}  // Created Date
                      onChange={handleChange}
                      className="shadow-lg-sm border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-2 focus:ring-pink-100 focus:border-pink-300 block w-full p-2.5"
                      required
                    />
                  </div>

                  <div className="col-span-6">
                    <button
                      className="text-white bg-gradient-to-br from-green-500 to-blue-500 rounded-lg shadow-md shadow-gray-300 hover:scale-[1.02] transition-transform font-medium text-sm px-5 py-2.5 text-center"
                      type="submit"
                    >
                      Lưu Tất Cả
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Password information*/}
            <div className="bg-white shadow-lg shadow-gray-200 rounded-2xl p-4 mb-6">
              <h3 className="mb-4 text-xl font-bold">Thông Tin Mật Khẩu</h3>
              <form onSubmit={handlePasswordSubmit}>
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-3">
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      Mật Khẩu Hiện Tại
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="shadow-lg-sm border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-2 focus:ring-pink-100 focus:border-pink-300 block w-full p-2.5"
                      placeholder="••••••••"
                      required
                    />
                    {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
                  </div>


                  <div className="col-span-6 sm:col-span-3">
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      Mật Khẩu Mới
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="shadow-lg-sm border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-2 focus:ring-pink-100 focus:border-pink-300 block w-full p-2.5"
                      placeholder="••••••••"
                      required
                    />
                    {LimitPasswordError && <p className="text-red-500 text-sm mt-1">{LimitPasswordError}</p>}
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      Xác Nhận Mật Khẩu
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="shadow-lg-sm border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-2 focus:ring-pink-100 focus:border-pink-300 block w-full p-2.5"
                      placeholder="••••••••"
                      required
                    />
                    {confirmPasswordError && <p className="text-red-500 text-sm mt-1">{confirmPasswordError}</p>}
                  </div>

                  <div className="col-span-6">
                    <button
                      className="text-white bg-gradient-to-br from-green-500 to-blue-500 rounded-lg shadow-md shadow-gray-300 hover:scale-[1.02] transition-transform font-medium text-sm px-5 py-2.5 text-center"
                      type="submit"
                    >
                      Lưu Mật Khẩu
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
