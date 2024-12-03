import { useState, useEffect } from "react";
import { Spinner } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { Modal, Table, Button, TextInput, Checkbox } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [appliedVoucherCode, setAppliedVoucherCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [voucherCode, setVoucherCode] = useState("");
  const [voucherCodes, setVoucherCodes] = useState("");  // State để lưu trữ mã voucher
  const [voucherDiscount, setVoucherDiscount] = useState(0); // State lưu trữ mức giảm giá từ voucher
  const [voucherApplied, setVoucherApplied] = useState(false); // State để theo dõi xem voucher đã được áp dụng hay chưa
  const [voucherError, setVoucherError] = useState("");
  const [voucherErrors, setVoucherErrors] = useState({}); // State lưu trữ lỗi nếu voucher không hợp lệ
  const [productDiscounts, setProductDiscounts] = useState({}); // Lưu trữ giảm giá cho từng sản phẩm
  const [VoucherItem, setVoucherItem] = useState({});
  const navigate = useNavigate();
  const savings = 0; // Fixed savings
  const storePickup = 0; // Fixed store pickup fee
  const taxRate = 0; // Tax rate of 10%
  const [showModal, setShowModal] = useState(false);
  const [selectedCartId, setSelectedCartId] = useState(null);

  useEffect(() => {
    const fetchCartData = async () => {
      const userId = localStorage.getItem("userId");

      if (!userId || userId === "undefined") {
        navigate("/sign-in");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://opms1.runasp.net/api/ShoppingCartAPI/getShoppingCartByUser?userId=${userId}`,
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
            `https://opms1.runasp.net/api/PlantAPI/getPlantById?id=${item.plantId}`,
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
  const handleProceedToCheckout = () => {
    // Save selected shoppingCartItemIds to localStorage
    localStorage.setItem("selectedCartItems", JSON.stringify(selectedItems));
    navigate("/payment");
  };
  // Hàm áp dụng mã voucher
  const applyVoucher = async (e, itemId) => {
    e.preventDefault();
    const voucherCode = voucherCodes[itemId];
    if (voucherApplied) {
      return;
    }
    try {
      const response = await fetch(
        `https://opms1.runasp.net/api/VoucherAPI/getVoucherByName?name=${voucherCode}`,
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
      const cartItem = cartItems.find((item) => item.shoppingCartItemId === itemId);

      // Kiểm tra nếu sản phẩm có checkbox được chọn
      if (!selectedItems.includes(itemId)) {
        setVoucherErrors((prevErrors) => ({
          ...prevErrors,
          [itemId]: "Vui lòng chọn sản phẩm để áp dụng mã giảm giá",
        }));
        return;
      }

      // Nếu mã giảm giá hợp lệ, tiến hành gọi API để lấy chi tiết giỏ hàng và áp dụng giảm giá
      if (voucherData && voucherData.voucherPercent && cartItem.plantDetails.userId === voucherData.userId) {
        const cartResponse = await fetch(
          `https://opms1.runasp.net/api/ShoppingCartAPI/getShoppingCartById?id=${cartItem.shoppingCartItemId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!cartResponse.ok) {
          throw new Error("Không lấy được dữ liệu giỏ hàng để áp dụng giảm giá");
        }

        const cartData = await cartResponse.json();
        setVoucherItem(cartData);

        const discountResponse = await fetch(
          `https://opms1.runasp.net/api/ShoppingCartAPI/applyDiscount?cartId=${cartItem.shoppingCartItemId}&discountPercent=${voucherData.voucherPercent}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!discountResponse.ok) {
          throw new Error("Không áp dụng được giảm giá cho giỏ hàng");
        }

        setAppliedVoucherCode(voucherCode);
        setVoucherDiscount(voucherData.voucherPercent);
        setVoucherApplied(true);
        setProductDiscounts((prevDiscounts) => ({
          ...prevDiscounts,
          [itemId]: voucherData.voucherPercent,
        }));
        setVoucherErrors((prevErrors) => ({
          ...prevErrors,
          [itemId]: "",
        }));
      } else {
        throw new Error("Mã giảm giá không chính xác");
      }
    } catch (error) {
      setVoucherErrors((prevErrors) => ({
        ...prevErrors,
        [itemId]: "Mã giảm giá không chính xác",
      }));
      setVoucherDiscount(0);
      setVoucherApplied(false);
    }
  };

  const resetVoucher = () => {
    setAppliedVoucherCode(""); // Clear applied voucher
    setVoucherDiscount(0); // Reset discount
    setVoucherApplied(false); // Reset voucher applied state to allow re-entry
    setVoucherErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      Object.keys(newErrors).forEach((key) => {
        newErrors[key] = ""; // Clear each error for each item
      });
      return newErrors;
    });
  };

  // Input field change handler (this will remove applied voucher if the field is empty)
  const handleVoucherInputChange = (e, itemId) => {
    const inputValue = e.target.value;
    setVoucherCodes((prevCodes) => ({
      ...prevCodes,
      [itemId]: inputValue,
    }));

    // Nếu xóa mã giảm giá, đặt lại mức giảm giá và cho phép nhập lại mã mới
    if (!inputValue) {
      setProductDiscounts((prevDiscounts) => ({
        ...prevDiscounts,
        [itemId]: 0, // Reset discount to 0 if voucher code is cleared
      }));
      setVoucherApplied(false); // Allow re-application of voucher
    }
  };
  // Tính tổng tiền sau khi áp dụng voucher
  // const calculateSelectedTotalWithVoucher = () => {
  //   const totalOriginal = calculateSelectedTotalOriginalPrice();
  //   const discount = totalOriginal * (voucherDiscount / 100);
  //   const totalWithDiscount = totalOriginal - discount;
  //   const tax = totalWithDiscount * taxRate;
  //   return (totalWithDiscount + tax - storePickup).toFixed(3);
  // };


  // Tính tổng tiền sau khi áp dụng giảm giá của sản phẩm và voucher (nếu có)
  const calculateSelectedTotalWithVouchers = () => {
    return cartItems.reduce((total, item) => {
      if (selectedItems.includes(item.shoppingCartItemId)) {
        // Giá gốc của sản phẩm có giảm giá riêng
        const discountedProductPrice = item.plantDetails?.price * (1 - (item.plantDetails?.discount / 100 || 0));
        const originalPrice = discountedProductPrice * (item.quantity || 1);

        // Mức giảm giá từ voucher (nếu có)
        const voucherDiscount = productDiscounts[item.shoppingCartItemId] || 0;
        const finalPrice = originalPrice * (1 - voucherDiscount / 100);

        return total + finalPrice;
      }
      return total;
    }, 0);
  };
  useEffect(() => {
    const totalWithVouchers = parseFloat(calculateSelectedTotalWithVouchers());
    if (totalWithVouchers > 0) {
      localStorage.setItem("totalWithVouchers", totalWithVouchers);
    }
  }, [cartItems, selectedItems, productDiscounts]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner aria-label="Loading spinner" size="xl" />
        <span className="ml-3 text-lg font-semibold">Đang tải...</span>
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
  const handleShowDeleteModal = (cartId) => {
    setSelectedCartId(cartId); // Lưu lại ID giỏ hàng cần xóa
    setShowModal(true); // Hiển thị modal
  };
  const handleConfirmDelete = async () => {
    if (!selectedCartId) return;

    try {
      const response = await fetch(
        `https://opms1.runasp.net/api/ShoppingCartAPI/deleteShoppingCart?CartId=${selectedCartId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Không thể xóa sản phẩm khỏi giỏ hàng. Vui lòng thử lại.");
      }

      setCartItems((prevItems) =>
        prevItems.filter((item) => item.shoppingCartItemId !== selectedCartId)
      );

      setShowModal(false); // Đóng modal sau khi xóa thành công
      setSelectedCartId(null); // Reset ID giỏ hàng
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng:", error.message);
      setShowModal(false);
    }
  };

  const handleCancelDelete = () => {
    setShowModal(false); // Đóng modal
    setSelectedCartId(null); // Reset ID giỏ hàng
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
                  {notification || "Giỏ hàng của bạn hiện đang trống."}
                </div>
              ) : (
                cartItems.map((item) => {

                  const discountedProductPrice = item.plantDetails?.price * (1 - (item.plantDetails?.discount / 100 || 0));
                  const originalPrice = discountedProductPrice * (item.quantity || 1);
                  const itemVoucherDiscount = productDiscounts[item.shoppingCartItemId] || 0;
                  const finalPrice = originalPrice * (1 - itemVoucherDiscount / 100);
                  return (
                    <div
                      key={item.shoppingCartItemId}
                      className={`rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6 ${(item.plantDetails?.stock === 0 || item.plantDetails?.isVerfied === 0) ? "opacity-50 pointer-events-none" : ""
                        }`}
                    >
                      <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
                        <input
                          type="checkbox"
                          className="form-checkbox h-4 w-4 text-indigo-600 border-gray-300 rounded"
                          checked={selectedItems.includes(item.shoppingCartItemId)}
                          onChange={() => handleCheckboxChange(item.shoppingCartItemId)}
                          disabled={item.plantDetails?.stock === 0} // Vô hiệu hóa nếu hết hàng
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
                              readOnly
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
                              ₫{new Intl.NumberFormat("en-US").format(
                                finalPrice
                              )}
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
                          {/* Hiển thị trạng thái hết hàng */}
                          {item.plantDetails?.stock === 0 && (
                            <p className="text-sm font-semibold text-red-500">
                              Sản phẩm này đã hết hàng
                            </p>
                          )}
                          {item.plantDetails?.isVerfied === 0 && (
                            <p className="text-sm font-semibold text-yellow-500">
                              Sản phẩm này chưa được xác minh
                            </p>
                          )}

                          <div className="flex items-center gap-4">
                            <button
                              type="button"
                              className="inline-flex items-center text-sm font-medium text-red-600 hover:underline dark:text-red-500"
                              onClick={() => handleShowDeleteModal(item.shoppingCartItemId)}
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

                      <form className="space-y-4" onSubmit={(e) => applyVoucher(e, item.shoppingCartItemId)}>
                        <div>
                          <label htmlFor={`voucher-${item.shoppingCartItemId}`} className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                            Bạn Có mã giảm giá ?
                          </label>
                          <input
                            type="text"
                            id={`voucher-${item.shoppingCartItemId}`}
                            value={voucherCodes[item.shoppingCartItemId] || ""}
                            onChange={(e) => handleVoucherInputChange(e, item.shoppingCartItemId)}
                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900"
                            placeholder="Nhập mã giảm giá"
                          //  required
                          />
                          {voucherErrors[item.shoppingCartItemId] && (
                            <p className="text-red-500">{voucherErrors[item.shoppingCartItemId]}</p>
                          )}
                        </div>
                        <button
                          type="submit"
                          className="flex w-full items-center justify-center rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-medium text-white"
                        >
                          Áp dụng mã giảm giá
                        </button>
                      </form>
                    </div>
                  );
                })
              )}
            </div>
          </div>
          {/*Modal xóa giỏ hàng*/}
          <Modal show={showModal} onClose={handleCancelDelete}>
            <Modal.Header>Xác nhận xóa</Modal.Header>
            <Modal.Body>
              <div className="text-center">
                <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
                <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
                  Bạn có chắc chắn muốn xóa sản phẩm khỏi giỏ hàng?
                </h3>
                <div className="flex justify-center gap-4">
                  <Button color="failure" onClick={handleConfirmDelete}>
                    Có
                  </Button>
                  <Button color="gray" onClick={handleCancelDelete}>
                    Không
                  </Button>
                </div>
              </div>
            </Modal.Body>
          </Modal>
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
                      ₫{new Intl.NumberFormat("en-US").format(
                        calculateSelectedTotalOriginalPriceWithoutDiscount()
                      )}
                    </dd>
                  </dl>
                  <dl className="flex items-center justify-between gap-4">
                    <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                      Giảm Giá
                    </dt>
                    <dd className="text-base font-medium text-green-600">

                      -₫{new Intl.NumberFormat("en-US").format(((calculateSelectedTotalOriginalPriceWithoutDiscount() - calculateSelectedTotalOriginalPrice()) || savings))}

                    </dd>
                  </dl>

                  <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
                    <dt className="text-base font-bold text-gray-900 dark:text-white">
                      Số lượng sản phẩm:
                    </dt>
                    <dd className="text-base font-bold text-gray-900 dark:text-white">
                      {selectedItems.length || 0}
                    </dd>
                  </dl>


                </div>
                <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
                  <dt className="text-base font-bold text-gray-900 dark:text-white">
                    Tổng cộng sau khi áp dụng mã giảm giá
                  </dt>
                  <dd className="text-base font-bold text-gray-900 dark:text-white">
                    ₫{new Intl.NumberFormat("en-US").format(calculateSelectedTotalWithVouchers())}
                  </dd>
                </dl>

              </div>

              <button
                onClick={handleProceedToCheckout}
                disabled={calculateSelectedTotalWithVouchers() <= 0}
                className={`flex w-full items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium text-white focus:outline-none focus:ring-4 ${calculateSelectedTotalWithVouchers() > 0
                  ? "bg-emerald-700 hover:bg-emerald-800 focus:ring-emerald-300 dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:focus:ring-emerald-800"
                  : "bg-gray-400 cursor-not-allowed"
                  }`}
              >
                Tiến hành thanh toán

              </button>


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

            {/* <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
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
                    value={voucherCodes}
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
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
}