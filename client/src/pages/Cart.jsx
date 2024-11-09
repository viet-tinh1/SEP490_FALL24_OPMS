import { Checkbox } from "flowbite-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Spinner } from "flowbite-react";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [appliedVoucherCode, setAppliedVoucherCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [voucherCode, setVoucherCode] = useState(""); // State để lưu trữ mã voucher
  const [voucherDiscount, setVoucherDiscount] = useState(0); // State lưu trữ mức giảm giá từ voucher
  const [voucherApplied, setVoucherApplied] = useState(false); // State để theo dõi xem voucher đã được áp dụng hay chưa
  const [voucherError, setVoucherError] = useState(""); // State lưu trữ lỗi nếu voucher không hợp lệ
  const savings = 0; // Fixed savings
  const storePickup = 0; // Fixed store pickup fee
  const taxRate = 0; // Tax rate of 10%

  useEffect(() => {
    const fetchCartData = async () => {
    const userId = localStorage.getItem("userId");

      if (!userId || userId === "undefined") {
      console.error("User is not logged in or userId is invalid.");
      setError("Người dùng chưa đăng nhập hoặc không hợp lệ.");
      setLoading(false);
      return;
   }

      try {
        const response = await fetch(
          `https://localhost:7098/api/ShoppingCartAPI/getShoppingCartByUser?userId=${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        
        if (!response.ok) {
          const data = await response.json();
        
          if (response.status === 400 && data.message === "No carts found for the given user.") {
            setNotification("Bạn chưa thêm sản phẩm nào vào giỏ hàng.");
          } else if (response.status === 401) {
            setError("Unauthorized access. Please login again.");
            localStorage.clear();
            navigate("/login");
          } else if (response.status === 403) {
            setError("You do not have permission to access this resource.");
          } else if (response.status === 500) {
            setError("Internal Server Error. Please try again later.");
          } else {
            throw new Error(data.message || "Failed to fetch cart data");
          }
          return;
        }

        const data = await response.json();
        await fetchPlantDetailsForCartItems(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchPlantDetailsForCartItems = async (cartItems) => {
      const updatedCartItems = await Promise.all(
        cartItems.map(async (item) => {
          const plantResponse = await fetch(
            `https://localhost:7098/api/PlantAPI/getPlantById?id=${item.plantId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (!plantResponse.ok) {
            console.error(`Lấy dữ liệu không thành công : ${item.plantId}`);
            return item;
          }

          const plantData = await plantResponse.json();
          return {
            ...item,
            plantDetails: plantData,
          };
        })
      );
      setCartItems(updatedCartItems);
    };

    fetchCartData();
  }, []);
// Function to reset or clear voucher

  // Hàm áp dụng mã voucher
  const applyVoucher = async (e) => {
    e.preventDefault();
    if (voucherApplied) {
      return;
    }
    try {
      const response = await fetch(
        `https://localhost:7098/api/VoucherAPI/getVoucherByName?name=${voucherCode}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("không tồn tại mã giảm giá");
      }

      const voucherData = await response.json();

      // Nếu voucher hợp lệ, áp dụng mức giảm giá
      if (voucherData && voucherData.voucherPercent) {
        setAppliedVoucherCode(voucherCode);
        setVoucherDiscount(voucherData.voucherPercent); // Áp dụng mức giảm giá
        setVoucherApplied(true); // Đánh dấu voucher đã được áp dụng
        setVoucherError(""); // Xóa lỗi nếu có
      } else {
        throw new Error("Voucher not valid");
      }
    } catch (error) {
      setVoucherError("Mã giảm giá không chính xác");
      setVoucherDiscount(0); // Không áp dụng giảm giá nếu mã không hợp lệ
      setVoucherApplied(false); // Không áp dụng voucher
    }
  };
  const resetVoucher = () => {
    setAppliedVoucherCode(""); // Clear applied voucher
    setVoucherDiscount(0); // Reset discount
    setVoucherApplied(false); // Reset voucher applied state
    setVoucherError(""); // Clear any errors
  };
  
  // Input field change handler (this will remove applied voucher if the field is empty)
  const handleVoucherInputChange = (e) => {
    const inputValue = e.target.value;
    setVoucherCode(inputValue);
  
    // If the input is cleared, reset the voucher
    if (!inputValue) {
      resetVoucher();
    }
  };

  // Tính tổng tiền sau khi áp dụng voucher
  const calculateSelectedTotalWithVoucher = () => {
    const totalOriginal = calculateSelectedTotalOriginalPrice();
    const discount = totalOriginal * (voucherDiscount / 100);
    const totalWithDiscount = totalOriginal - discount;
    const tax = totalWithDiscount * taxRate;
    return (totalWithDiscount + tax - storePickup).toFixed(3);
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
    return <p>Error: {error}</p>;
  }
  const handleQuantityChange = (itemId, newQuantity) => {
    // Nếu người dùng xóa hết số lượng (giá trị rỗng), tạm thời lưu giá trị rỗng
    if (newQuantity === "") {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.shoppingCartItemId === itemId
            ? { ...item, quantity: "" } // Tạm thời đặt quantity là chuỗi rỗng
            : item
        )
      );
    } else {
      // Kiểm tra nếu giá trị nhập là số hợp lệ và lớn hơn 0
      const value = parseInt(newQuantity, 10);
      if (!isNaN(value) && value > 0) {
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.shoppingCartItemId === itemId
              ? { ...item, quantity: value }
              : item
          )
        );
      }
    }
  };
  // Function to increment quantity of an item
  const increment = (itemId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.shoppingCartItemId === itemId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // Function to decrement quantity of an item
  const decrement = (itemId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.shoppingCartItemId === itemId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const handleCheckboxChange = (itemId) => {
    setSelectedItems((prevSelectedItems) => {
      if (prevSelectedItems.includes(itemId)) {
        // Remove item if it was previously selected
        return prevSelectedItems.filter((id) => id !== itemId);
      } else {
        // Add item if it's newly selected
        return [...prevSelectedItems, itemId];
      }
    });
  };

  const calculateSelectedTotalOriginalPrice = () => {
    return cartItems.reduce((total, item) => {
      if (selectedItems.includes(item.shoppingCartItemId)) {
        const price = item.plantDetails?.price - item.plantDetails?.price * (item.plantDetails?.discount / 100 || 0);
        const quantity = item.quantity || 0;
        return total + price * quantity;
      }
      return total;
    }, 0);
  };

  const calculateSelectedTotalOriginalPriceWithoutDiscount = () => {
    return cartItems.reduce((total, item) => {
      if (selectedItems.includes(item.shoppingCartItemId)) {
        const price = item.plantDetails?.price || 0; // Full price without discount
        const quantity = item.quantity || 0;
        return total + price * quantity;
      }
      return total;
    }, 0);
  };
  const handleBlur = (itemId, quantity) => {
    if (!quantity || quantity < 1) {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.shoppingCartItemId === itemId
            ? { ...item, quantity: 1 } // Đặt lại số lượng về 1 nếu để trống hoặc không hợp lệ
            : item
        )
      );
    }
  };

  return (
    <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
          Giỏ hàng
        </h2>

        <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
          <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
            <div className="space-y-6">
              {cartItems.length === 0 ? (
                <div className="text-center text-green-600 font-semibold">
                  {notification || "Your cart is currently empty."}
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.shoppingCartItemId}
                    className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6"
                  >
                    <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        checked={selectedItems.includes(item.shoppingCartItemId)}
                        onChange={() => handleCheckboxChange(item.shoppingCartItemId)}
                      />
                      <a href="#" className="shrink-0 md:order-1">
                        <img
                          className="h-20 w-20 dark:hidden"
                          src={item.plantDetails?.imageUrl}
                          alt={item.plantDetails?.name || item.plantId}
                        />
                      </a>

                      <div className="flex items-center justify-between md:order-3 md:justify-end">
                        <div className="flex items-center">
                          <button
                            type="button"
                            onClick={() => decrement(item.shoppingCartItemId)}
                            className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
                          >
                            <svg
                              className="h-2.5 w-2.5 text-gray-900 dark:text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 18 2"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M1 1h16"
                              />
                            </svg>
                          </button>
                          <input
                            type="text"
                            className="w-16 min-w-[50px] shrink-0 border-0 bg-transparent text-center text-sm font-medium text-gray-900 focus:outline-none focus:ring-0 dark:text-white"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.shoppingCartItemId, e.target.value)}
                            onBlur={() => handleBlur(item.shoppingCartItemId, item.quantity)}
                          />
                          <button
                            type="button"
                            onClick={() => increment(item.shoppingCartItemId)}
                            className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
                          >
                            <svg
                              className="h-2.5 w-2.5 text-gray-900 dark:text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 18 18"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 1v16M1 9h16"
                              />
                            </svg>
                          </button>
                        </div>
                        <div className="text-end md:order-4 md:w-32">
                          <p className="text-base font-bold text-gray-900 dark:text-white">
                            ${(
                              (item.plantDetails?.price - item.plantDetails?.price * (item.plantDetails?.discount / 100 || 0)) * item.quantity
                            ).toFixed(3)}
                          </p>
                        </div>
                      </div>

                      <div className="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
                        <a
                          href="#"
                          className="text-base font-medium text-gray-900 hover:underline dark:text-white"
                        >
                          {item.plantDetails?.plantName || item.plantId}
                        </a>
                        <div className="flex items-center gap-4">
                          <button
                            type="button"
                            className="inline-flex items-center text-sm font-medium text-red-600 hover:underline dark:text-red-500"
                          >
                            <svg
                              className="me-1.5 h-5 w-5"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18 17.94 6M18 18 6.06 6"
                              />
                            </svg>
                            Xóa
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full">
            <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                Tổng kết đặt hàng
              </p>
              <div className="space-y-4">
                <div className="space-y-2">
                  <dl className="flex items-center justify-between gap-4">
                    <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                      Giá gốc
                    </dt>
                    <dd className="text-base font-medium text-gray-900 dark:text-white">
                      ${calculateSelectedTotalOriginalPriceWithoutDiscount().toFixed(3)}
                    </dd>
                  </dl>
                  <dl className="flex items-center justify-between gap-4">
                    <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                      Giảm Giá
                    </dt>
                    <dd className="text-base font-medium text-green-600">

                      -${((calculateSelectedTotalOriginalPriceWithoutDiscount() - calculateSelectedTotalOriginalPrice()).toFixed(3) || savings.toFixed(3))}

                    </dd>
                  </dl>
                  {/*
                  <dl className="flex items-center justify-between gap-4">
                    <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                      Trả trước 
                    </dt>
                    <dd className="text-base font-medium text-gray-900 dark:text-white">
                      ${storePickup.toFixed(2)}
                    </dd>
                  </dl>

                </div>
                
                <dl className="flex items-center justify-between gap-4">
                  <dt className="text-base font-bold text-gray-900 dark:text-white">
                    Tổng Thành tiền:


                  <dl className="flex items-center justify-between gap-4">
                    <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                      Thuế
                    </dt>
                    <dd className="text-base font-medium text-gray-900 dark:text-white">
                      ${(calculateSelectedTotalOriginalPrice() * taxRate).toFixed(2)}
                    </dd>
                  </dl>*/}
                  <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
                  <dt className="text-base font-bold text-gray-900 dark:text-white">
                    Số lượng sản phẩm:
                  </dt>
                  <dd className="text-base font-bold text-gray-900 dark:text-white">
                  {selectedItems.length || 0}
                  </dd>
                  </dl>
                  {/* Hiển thị giá trị của voucher nếu đã được áp dụng */}
                  {voucherApplied && (
                    <dl className="flex items-center justify-between gap-4">
                      <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                        Mã giảm giá đã áp dụng:
                      </dt>
                      <dd className="text-base font-medium text-gray-900 dark:text-white">
                        Mã {voucherCode} - giảm giá {voucherDiscount}% 
                      </dd>
                    </dl>
                  )}
                </div>
                <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
                  <dt className="text-base font-bold text-gray-900 dark:text-white">
                    Tổng cộng sau khi áp dụng mã giảm giá 

                  </dt>
                  <dd className="text-base font-bold text-gray-900 dark:text-white">
                    ${calculateSelectedTotalWithVoucher()}
                  </dd>
                </dl>
              
              </div>

              <Link
                to="/payment"
                className="flex w-full items-center justify-center rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-300 dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:focus:ring-emerald-800"
              >
                Tiến hành thanh toán

              </Link>


              <div className="flex items-center justify-center gap-2">
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                  hoặc
                </span>
                <Link
                  to="/product"
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary-700 underline hover:no-underline dark:text-primary-500"
                >
                  Tiếp tục mua hàng
                  <svg
                    className="h-5 w-5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 12H5m14 0-4 4m4-4-4-4"
                    />
                  </svg>
                </Link>
              </div>
            </div>

            <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
              <form className="space-y-4" onSubmit={applyVoucher}>
                <div>
                  <label
                    htmlFor="voucher"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Bạn có phiếu giảm giá hoặc thẻ quà tặng không?
                  </label>
                  <input
                    type="text"
                    id="voucher"
                    value={voucherCode}
                    onChange={handleVoucherInputChange}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                    placeholder="Nhập mã voucher"
                    required
                  />
                  {voucherError && <p className="text-red-500">{voucherError}</p>}
                </div>
                <button
                  type="submit"
                  className="flex w-full items-center justify-center rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-300 dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:focus:ring-emerald-800"
                >
                  Áp dụng Mã
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}