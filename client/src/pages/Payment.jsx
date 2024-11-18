import { useState, useEffect } from "react";
import { FaCcVisa } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { Spinner } from "flowbite-react";

export default function Payment() {
  const userIds = localStorage.getItem("userId");
  const selectedCartItems = JSON.parse(localStorage.getItem("selectedCartItems")) || [];
  const totalWithVouchers = parseFloat(localStorage.getItem("totalWithVouchers") || 0);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    district: "",
    ward: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("payOS");
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    // Fetch user information using userId
    const fetchUserData = async () => {
      if (!userIds) return;

      setLoading(true);
      try {
        const response = await fetch(`https://localhost:7098/api/UserAPI/getUserById?userId=${userIds}`);

        if (!response.ok) {
          throw new Error("Failed to fetch user data.");
        }

        const userData = await response.json();
        setFormData((prevFormData) => ({
          ...prevFormData,
          name: userData.username || "", // Assuming `name` is the field for the user's name
          phone: userData.phoneNumber || "", // Assuming `phone` is the field for the user's phone
        }));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userIds]);
  useEffect(() => {
    // Fetch cities using fetch API
    fetch(
      "https://viet-tinh1.github.io/Geography/data.json"
    )
      .then((response) => response.json())
      .then((data) => setCities(data))
      .catch((error) => console.error("Error fetching cities:", error));
  }, []);

  // Handle city change
  const handleCityChange = (e) => {
    const selectedCityId = e.target.value;
    const selectedCity = cities.find((city) => city.Id === selectedCityId);
    setFormData({ ...formData, city: selectedCityId, district: "", ward: "" });
    setDistricts(selectedCity ? selectedCity.Districts : []);
    setWards([]);
  };
  // Handle district change
  const handleDistrictChange = (e) => {
    const selectedDistrictId = e.target.value;
    const selectedDistrict = districts.find(
      (district) => district.Id === selectedDistrictId
    );
    setFormData({ ...formData, district: selectedDistrictId, ward: "" });
    setWards(selectedDistrict ? selectedDistrict.Wards : []);
  };
  // Handle ward change
  const handleWardChange = (e) => {
    setFormData({ ...formData, ward: e.target.value });
  };
  // Handle input change for other form fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
    console.log("Selected payment method:", e.target.value); // Log here instead
  };
  useEffect(() => {
    console.log("Payment method updated to:", paymentMethod);
  }, [paymentMethod]);
  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent additional submissions
    setIsSubmitting(true);
    // Construct the full address
    const city = cities.find((city) => city.Id === formData.city)?.Name || "";
    const district = districts.find((district) => district.Id === formData.district)?.Name || "";
    const ward = wards.find((ward) => ward.Id === formData.ward)?.Name || "";
    let fullAddress = formData.address;

    if (!fullAddress.includes(ward)) {
      fullAddress += `, ${ward}`;
    }

    if (!fullAddress.includes(district)) {
      fullAddress += `, ${district}`;
    }

    if (!fullAddress.includes(city)) {
      fullAddress += `, ${city}`;
    }

    const orderData = {
      userId: parseInt(userIds),
      shoppingCartItemIds: selectedCartItems,
      totalAmount: totalWithVouchers,
      shippingAddress: fullAddress,
      paymentMethod: paymentMethod,
      isSuccess: 0 // Adjust based on the actual status needed
    };

    try {
      // Call createOrder API
      const orderResponse = await fetch("https://localhost:7098/api/OrderAPI/createOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!orderResponse.ok) throw new Error("Order creation failed.");

      const orderResult = await orderResponse.json();
      const orderId = orderResult.orders?.[0]?.orderId;
      if (orderId) {
        localStorage.setItem("orderId", orderId); // Save orderId to localStorage
      }
      if (!orderId) {
        throw new Error("Missing orderId in order creation response.");
      }
      console.log("Order created successfully:", orderResult);
      console.log("Current payment method at submit:", paymentMethod);
      // Check if payment method is payOS to initiate online payment
      if (paymentMethod === "payOS") {
        // Ensure orderResult contains the expected orderId
        if (!orderId) {
          throw new Error("Missing orderId in order creation response.");
        }

        // Call create-payment-link API with raw integer as body
        const paymentResponse = await fetch("https://localhost:7098/api/PaymentAPI/create-payment-link", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify([orderId]), // Ensure this matches the API's expected format
        });

        if (!paymentResponse.ok) throw new Error("Failed to create payment link.");

        const paymentLinkData = await paymentResponse.json();
        console.log("Payment link created successfully:", paymentLinkData);
        const checkoutUrl = paymentLinkData.data.checkoutUrl;
        if (checkoutUrl) {
          window.location.href = checkoutUrl; // Direct browser redirect
        } else {
          throw new Error("Missing checkout URL in payment link response.");
        }
      } else {
        // For other payment methods, navigate to the success page or show a success message
        alert("Order created successfully!");
        navigate("/order-success");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error creating order or payment link. Please try again.");
    }
    setIsSubmitting(false);
  };

  useEffect(() => {
    console.log("Selected Cart Items:", selectedCartItems);
    console.log("totalWithVouchers Cart Items:", totalWithVouchers);
  }, [selectedCartItems]);
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
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800 m-24">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        Thông tin giao hàng
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Input */}
        <div>
          <label
            htmlFor="name"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Tên người nhận:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="block w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Nhập tên người nhận"
            required
          />
        </div>
        {/* Phone Input */}
        <div>
          <label
            htmlFor="phone"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Số điện thoại:
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="block w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Nhập số điện thoại"
            required
          />
        </div>
        {/* Dropdown Row */}
        <div className="flex space-x-4">
          {/* City Dropdown */}
          <div className="flex-1">
            <label
              htmlFor="city"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Tỉnh thành:
            </label>
            <select
              id="city"
              value={formData.city}
              onChange={handleCityChange}
              className="block w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">Chọn tỉnh thành</option>
              {cities.map((city) => (
                <option key={city.Id} value={city.Id}>
                  {city.Name}
                </option>
              ))}
            </select>
          </div>
          {/* District Dropdown */}
          <div className="flex-1">
            <label
              htmlFor="district"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Quận huyện:
            </label>
            <select
              id="district"
              value={formData.district}
              onChange={handleDistrictChange}
              className="block w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              disabled={!formData.city}
            >
              <option value="">Chọn quận huyện</option>
              {districts.map((district) => (
                <option key={district.Id} value={district.Id}>
                  {district.Name}
                </option>
              ))}
            </select>
          </div>
          {/* Ward Dropdown */}
          <div className="flex-1">
            <label
              htmlFor="ward"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Phường xã:
            </label>
            <select
              id="ward"
              value={formData.ward}
              onChange={handleWardChange}
              className="block w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              disabled={!formData.district}
            >
              <option value="">Chọn phường xã</option>
              {wards.map((ward) => (
                <option key={ward.Id} value={ward.Id}>
                  {ward.Name}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* Address Input */}
        <div>
          <label
            htmlFor="address"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Địa chỉ:
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="block w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Nhập thông tin chi tiết địa chỉ nhận hàng ...."
            required
          />
        </div>
        <div className="flex flex-col gap-4">
          <label
            htmlFor="payment-method"
            className="text-base font-bold text-gray-900 dark:text-white"
          >
            Chọn phương thức thanh toán:
          </label>
          <div className="relative inline-block">
            <select
              id="payment-method"
              value={paymentMethod}
              onChange={handlePaymentMethodChange}
              className="block w-full px-4 py-2 pr-8 leading-tight text-gray-900 bg-white border border-gray-300 rounded-lg shadow appearance-none dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:outline-none focus:border-blue-500"
            >
              <option value="payOS">payOS</option>
              <option value="Visa"><FaCcVisa />
                Visa</option>
              <option value="Cash on Delivery">Thanh toán khi nhận hàng </option>
            </select>
            {/* Dropdown arrow */}
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-700 dark:text-white"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          {/* Displaying selected payment method logos */}
          <div className="mt-4">
            <div className="flex items-center gap-4">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png"
                alt="Visa"
                className="h-8"
              />
              <img
                src="https://i.ibb.co/qmdZzTw/image.png"
                alt="payOS"
                className="h-8"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png"
                alt="Momo"
                className="h-8"
              />
            </div>
          </div>
        </div>
        {/* Buttons Row */}
        <div className="flex justify-between mt-6">
          {/* Back Link */}
          <Link
            to="/cart" // Replace with the actual route you want to navigate to
            className="px-4 py-2 text-white bg-gray-500 rounded-lg hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700"
          >
            Trở về
          </Link>
          {/* Submit Button */}
          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            Đặt hàng
          </button>
        </div>
      </form>
    </div>
  );
}