import { FaCloudArrowUp } from "react-icons/fa6";
import { MdOutlineSell } from "react-icons/md";

export default function DashProfile() {
  return (
    <div className="flex overflow-hidden bg-white pt-16 w-full">
      <main className="w-full">
        <div className="grid grid-cols-1 px-4 pt-6 xl:grid-cols-3 xl:gap-6 w-full">
          {/* User Settings */}
          <div className="col-span-full mb-4 xl:mb-0">
            <div className="mb-1 w-full">
              <div className="mb-4">
                <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
                  Cái đặt người dùng
                </h1>
              </div>
            </div>
          </div>

          {/* Profile Picture */}
          <div className="col-span-full xl:col-auto">
            <div className="bg-white shadow-lg shadow-gray-200 rounded-2xl p-4 mb-6">
              <div className="items-center sm:flex xl:block 2xl:flex sm:space-x-4 xl:space-x-0 2xl:space-x-4">
                <img
                  className="mb-4 w-28 h-28 rounded-lg sm:mb-0 xl:mb-4 2xl:mb-0 shadow-lg shadow-gray-300"
                  src="https://demos.creative-tim.com/soft-ui-flowbite-pro/images/users/jese-leos-2x.png"
                  alt="IMG"
                />
                <div>
                  <h3 className="mb-1 text-2xl font-bold text-gray-900">
                    Alec Thompson
                  </h3>

                  <div className="mb-4 text-base font-normal text-gray-500">
                    Roll / User
                  </div>

                  <a
                    href="#"
                    className="inline-flex items-center py-2 px-3 text-sm font-medium text-center text-white bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg shadow-md shadow-gray-300 hover:scale-[1.02] transition-transform"
                  >
                    <FaCloudArrowUp className="mr-2 -ml-1 w-4 h-4" />
                    Thay đổi hình ảnh
                  </a>
                </div>
              </div>
            </div>

            {/* Register to become seller */}
            <div className="bg-white shadow-lg shadow-gray-200 rounded-2xl p-4 mb-6">
              <div className="text-sm font-medium">
                *Đăng ký thành người bán cây
              </div>
              <a
                href="/dashboard?tab=DashRegisterSeller"
                className="inline-flex items-center py-2 px-3 text-sm font-medium text-center text-white bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg shadow-md shadow-gray-300 hover:scale-[1.02] transition-transform"
              >
                <MdOutlineSell className="mr-2 -ml-1 w-4 h-4" />
                Đăng ký Người bán
              </a>
            </div>
          </div>

          {/* General Information Form */}
          <div className="col-span-2">
            <div className="bg-white shadow-lg shadow-gray-200 rounded-2xl p-4 mb-6">
              <h3 className="mb-4 text-xl font-bold">Thông tin chung</h3>
              <form action="#">
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-3">
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      Tên người dùng
                    </label>
                    <input
                      type="text"
                      name="user-name"
                      id="user-name"
                      className="shadow-lg-sm border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-2 focus:ring-pink-100 focus:border-pink-300 block w-full p-2.5"
                      placeholder="Bonnie"
                      required
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      Tên của bạn
                    </label>
                    <input
                      type="text"
                      name="your-name"
                      id="your-name"
                      className="shadow-lg-sm border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-2 focus:ring-pink-100 focus:border-pink-300 block w-full p-2.5"
                      placeholder="Green"
                      required
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      Địa chỉ
                    </label>
                    <input
                      type="text"
                      name="address"
                      id="address"
                      className="shadow-lg-sm border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-2 focus:ring-pink-100 focus:border-pink-300 block w-full p-2.5"
                      placeholder="United States"
                      required
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      className="shadow-lg-sm border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-2 focus:ring-pink-100 focus:border-pink-300 block w-full p-2.5"
                      placeholder="example@company.com"
                      required
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      className="shadow-lg-sm border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-2 focus:ring-pink-100 focus:border-pink-300 block w-full p-2.5"
                      placeholder="e.g. +(12)3456 789"
                      required
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      Ngày tạo
                    </label>
                    <input
                      type="text"
                      name="birthday"
                      id="birthday"
                      className="shadow-lg-sm border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-2 focus:ring-pink-100 focus:border-pink-300 block w-full p-2.5"
                      placeholder="15/08/1990"
                      required
                    />
                  </div>

                  <div className="col-span-6">
                    <button
                      className="text-white bg-gradient-to-br from-green-500 to-blue-500 rounded-lg shadow-md shadow-gray-300 hover:scale-[1.02] transition-transform font-medium text-sm px-5 py-2.5 text-center"
                      type="submit"
                    >
                      Lưu tất cả
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Password information*/}

            <div className="bg-white shadow-lg shadow-gray-200 rounded-2xl p-4 mb-6">
              <h3 className="mb-4 text-xl font-bold">Thông tin mật khẩu</h3>
              <form action="#">
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-3">
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      Mật khẩu hiện tại
                    </label>
                    <input
                      type="password"
                      name="first-name"
                      id="first-name"
                      className="shadow-lg-sm border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-2 focus:ring-pink-100 focus:border-pink-300 block w-full p-2.5"
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      Mật khẩu mới
                    </label>
                    <input
                      type="password"
                      name="last-name"
                      id="last-name"
                      className="shadow-lg-sm border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-2 focus:ring-pink-100 focus:border-pink-300 block w-full p-2.5"
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      Xác nhận mật khẩu
                    </label>
                    <input
                      type="password"
                      name="country"
                      id="country"
                      className="shadow-lg-sm border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-2 focus:ring-pink-100 focus:border-pink-300 block w-full p-2.5"
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  <div className="col-span-6">
                    <button
                      className="text-white bg-gradient-to-br from-green-500 to-blue-500 rounded-lg shadow-md shadow-gray-300 hover:scale-[1.02] transition-transform font-medium text-sm px-5 py-2.5 text-center"
                      type="submit"
                    >
                      Lưu tất cả
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
