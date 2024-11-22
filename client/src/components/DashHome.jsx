import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaFileAlt,
  FaCommentDots,
  FaBox,
  FaTags,
  FaUsers,
  FaClipboardCheck,
  FaShoppingCart,
} from "react-icons/fa";

export default function Dashboard() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  console.log(role)
  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 overflow-x-hidden">
      {/* Header */}
      <header className="bg-white shadow w-full">
        <div className="px-8 py-6">
        <h1 className="text-2xl font-bold text-gray-800">
  {role === '3'
    ? "Bảng điều khiển của Người bán"
    : role === '1'
    ? "Bảng điều khiển của Quản trị viên"
    : "Admin Dashboard"}
</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full px-8 py-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-6">
          {role === '3'
            ? "Chào mừng đến với Bảng điều khiển của Người bán"
            : role === '1'
              ? "Chào mừng đến với Bảng điều khiển của Quản trị viên"
              : ""}
        </h2>

        {/* Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          {(role === '1' || role === '3') && (
            <Link to="/dashboard?tab=profile"
              className="p-6 bg-white shadow rounded-lg hover:shadow-lg cursor-pointer"
            >
              <FaUser className="text-4xl text-blue-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-800">Hồ sơ</h3>
              <p className="text-gray-600">Quản lý thông tin tài khoản của bạn.</p>
            </Link>
          )}
          {/* Card 2 */}
          {/*role === '1' || role === '3'*/ }
          {(role === '1' ) && (
            <Link to="/dashboard?tab=feedback"
              className="p-6 bg-white shadow rounded-lg hover:shadow-lg cursor-pointer"
            >
              <FaFileAlt className="text-4xl text-green-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-800">Danh sách phản hồi</h3>
              <p className="text-gray-600">Quản lý các phản hồi của người dùng trên hệ thống.</p>
            </Link>
          )}
          {/* Card 3 */}
          {/*role === '1' || role === '3'*/ }
          {(role === '1' && role === '3') && (
            <Link to="/dashboard?tab=comments"
              className="p-6 bg-white shadow rounded-lg hover:shadow-lg cursor-pointer"
            >
              <FaCommentDots className="text-4xl text-purple-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-800">
                Quản lý bình luận
              </h3>
              <p className="text-gray-600">Duyệt và quản lý các bình luận.</p>
            </Link>
          )}
          {/* Card 4 */}
          {(role === '3') && (
            <Link to="/dashboard?tab=product"
              className="p-6 bg-white shadow rounded-lg hover:shadow-lg cursor-pointer"
            >
              <FaBox className="text-4xl text-yellow-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-800">
                Quản Lý Sản phẩm
              </h3>
              <p className="text-gray-600">Thêm, sửa và quản lý sản phẩm.</p>
            </Link>
          )}
          {/* Card 5 */}
          {(role === '3') && (
            <Link
              to="/dashboard?tab=DashDiscount"
              className="p-6 bg-white shadow rounded-lg hover:shadow-lg cursor-pointer"
            >
              <FaTags className="text-4xl text-red-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-800">Mã giảm giá</h3>
              <p className="text-gray-600">Quản lý các mã khuyến mãi.</p>
            </Link>
          )}
          {/* Card 6: Quản lý tài khoản */}
          {(role === '1') && (
            <Link to="/dashboard?tab=users"
              className="p-6 bg-white shadow rounded-lg hover:shadow-lg cursor-pointer"
            >
              <FaUsers className="text-4xl text-cyan-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-800">
                Quản lý tài khoản
              </h3>
              <p className="text-gray-600">Quản lý tài khoản người dùng.</p>
            </Link>
          )}
          {/* Card 7: Duyệt sản phẩm */}
          {(role === '1') && (
            <Link to="/dashboard?tab=DashVerifyProduct"
              className="p-6 bg-white shadow rounded-lg hover:shadow-lg cursor-pointer"
            >
              <FaClipboardCheck className="text-4xl text-teal-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-800">
                Duyệt Sản Phẩm
              </h3>
              <p className="text-gray-600">
                Kiểm duyệt sản phẩm trước khi xuất hiện trên hệ thống.
              </p>
            </Link>
          )}
          {/* Card 8: Quản lý đặt hàng */}
          {(role === '1' || role === '3') && (
            <Link
              to="/dashboard?tab=OrderManager"
              className="p-6 bg-white shadow rounded-lg hover:shadow-lg cursor-pointer"
            >
              <FaShoppingCart className="text-4xl text-orange-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-800">
                Quản lý đặt hàng
              </h3>
              <p className="text-gray-600">Quản lý và xử lý các đơn hàng.</p>
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}