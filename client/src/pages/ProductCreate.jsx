import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Link } from "react-router-dom";
import { Spinner } from "flowbite-react";
import { useRef } from "react";
import { FaCloudArrowUp } from 'react-icons/fa6';
export default function ProductCreate() {
  const userId = localStorage.getItem("userId");
  const [formData, setFormData] = useState({
    plantId: 0,
    plantName: "",
    categoryId: 0,
    description: "",
    price: "",
    image: null, // For file upload
    imageUrl: "a", // Base64 encoded image string
    stock: "",
    status: 1,
    isVerified: 0,
    userId: userId,
    discount: "",
  });
  const [errorStock, setErrorStock] = useState("");
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [categories, setCategories] = useState([]);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (name === "stock") {
      // Chỉ giữ số hợp lệ và giới hạn khoảng từ 1 đến 100
      let numericValueStock = value === "" ? "" : Number(value);
     
      if (!isNaN(numericValueStock) && numericValueStock !== null) {
        setFormData((prevData) => ({
          ...prevData,
          [name]: numericValueStock,
        }));
      }   
    } else if (name === "price" || name === "discount") {
      // Loại bỏ tất cả dấu . khỏi chuỗi nhập
      const numericValue = value.replace(/\./g, "").replace(/,/g, "");
      setFormData((prevData) => ({
        ...prevData,
        [name]: numericValue,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleBlur = () => {
    const numericValue = parseFloat(formData.price.replace(/\./g, "").replace(/,/g, ""));
    if(formData.price ===""){ setError("");}
    else if (isNaN(numericValue) || numericValue === 0) {
      setError("Giá sản phẩm không hợp lệ.");
    } else if (numericValue < 10000) {
      setError("Giá sản phẩm phải lớn hơn hoặc bằng 10.000");
    } else {
      setFormData((prevData) => ({
        ...prevData,
        price: new Intl.NumberFormat("en-US").format(numericValue), // Định dạng giá trị với dấu phẩy
      }));
      setError("");
    }
  };
  const handleStockBlur = () => {
    const numericValueStock = parseInt(formData.stock, 10);
  
   // Nếu ô trống thì không báo lỗi
  if (formData.stock === "" ) {
    setErrorStock("");
    return;
   // Nếu ô trống thì không báo lỗi
    } else if ( isNaN(numericValueStock) || numericValueStock <= 0 ) {
      setErrorStock("Số lượng không hợp lệ.");
    } else if (numericValueStock < 1 || numericValueStock > 100) {
      setErrorStock("Số lượng phải nằm trong khoảng từ 1 đến 100.");
    } else {
      setFormData((prevData) => ({
        ...prevData,
        stock: numericValueStock,
      }));
      setErrorStock("");
    }
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        image: file, // Store the file for form submission
      }));
      setImagePreviewUrl(URL.createObjectURL(file)); // Set the preview URL
    }
  };

  const handleDescriptionChange = (value) => {
    // Kiểm tra độ dài của giá trị nhập vào
    if (value.length <= 1500) {
      setFormData((prevData) => ({
        ...prevData,
        description: value,
      }));
    } else {
      // Nếu vượt quá 1000 ký tự, có thể hiển thị cảnh báo hoặc cắt ngắn giá trị
      setFormData((prevData) => ({
        ...prevData,
        description: value.slice(0, 1000), // Cắt ngắn xuống 1000 ký tự
      }));
      alert("Mô tả không được vượt quá 1000 ký tự.");
    }
  };
  useEffect(() => {
    const Categories = async () => {
      try {

        //lấy category
        const categoryResponse = await fetch(
          "https://opms1.runasp.net/api/CategoryAPI/getCategory"
        );
        if (!categoryResponse.ok) {
          throw new Error("Failed to fetch categories");
        }
        const categoryData = await categoryResponse.json();
        setCategories(categoryData);

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    Categories();
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    const numericPrice = parseFloat(formData.price.replace(/,/g, "").replace(/\./g, ""));
    const formDataToSend = new FormData();
    formDataToSend.append("plantId", formData.plantId);
    formDataToSend.append("userId", formData.userId);
    formDataToSend.append("plantName", formData.plantName || "");
    formDataToSend.append("imageUrl", formData.imageUrl || "");
    formDataToSend.append("categoryId", formData.categoryId || "");
    formDataToSend.append("description", formData.description || "");
    formDataToSend.append("price", numericPrice);
    formDataToSend.append("stock", parseInt(formData.stock));
    formDataToSend.append("status", formData.status || 1); // Set default status if not provided
    formDataToSend.append("discount", parseFloat(formData.discount) || 0);

    if (formData.image) {
      // If there's a file uploaded, append it
      formDataToSend.append("uploadedImage", formData.image);
    }
    try {
      const response = await fetch("https://opms1.runasp.net/api/PlantAPI/createPlant", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        // Try to read as text instead of JSON to capture plain text error message
        const errorText = await response.text();
        console.error("Lôi:", errorText);
        alert("Lỗi: " + errorText);
      } else {
        setShowPopup(true);
      }
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner aria-label="Loading spinner" size="xl" />
        <span className="ml-3 text-lg font-semibold">Đang tải...</span>
      </div>
    );
  }
  const closePopup = () => {
    setShowPopup(false);
    navigate("/dashboard?tab=product");
  };

  return (
    <div className="max-w-7xl mx-auto p-6 sm:p-8 rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-md text-center">
            <p className="text-lg font-medium">Tạo Sản phẩm thành công!</p>
            <button
              onClick={closePopup}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Section */}
          <div className="w-full lg:w-1/2 space-y-6">
            {/* Image Upload */}
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Thêm ảnh
              </label>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                style={{ display: "none" }} // Ẩn input file
                className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              />

              {/* Nút thay đổi ảnh */}
              <button
                type="button"
                onClick={() => fileInputRef.current.click()} // Kích hoạt click trên input file
                className="inline-flex items-center py-2 px-3 text-sm font-medium text-center text-white bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg shadow-md shadow-gray-300 hover:scale-[1.02] transition-transform"
              >
                <FaCloudArrowUp className="mr-2 -ml-1 w-4 h-4" />
                Tải ảnh cây của bạn lên tại đây
              </button>

              {imagePreviewUrl && (
                <img
                  src={imagePreviewUrl}
                  alt="Image preview"
                  className="mt-4 w-48 h-48 rounded-md shadow-md"
                />
              )}
            </div>

            {/* Category ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Loại sản phẩm
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm max-h-32 overflow-y-auto"
              >
                <option value="">Chọn loại sản phẩm</option>
                {categories.map((category) => (
                  <option key={category.categoryId} value={category.categoryId}>
                    {category.categoryName}
                  </option>
                ))}
              </select>
            </div>
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Tên sản phẩm
              </label>
              <input
                type="text"
                name="plantName"
                value={formData.plantName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Giá
              </label>
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm focus:ring-indigo-500 ${error ? "border-red-500 focus:border-red-500" : "border-gray-300"
                  }`}               
              />
              {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
              )}
            </div>
            {/* Stock Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Số lượng
              </label>
              <input
                type="text"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                onBlur={handleStockBlur}
                className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm focus:ring-indigo-500 ${error ? "border-red-500 focus:border-red-500" : "border-gray-300"
                }`}
              />
              {errorStock  && (
                <p className="mt-2 text-sm text-red-600">{errorStock }</p>
              )}
            </div>
            {/* Discount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Giảm giá
              </label>
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          {/* Right Section */}
          <div className="w-full lg:w-1/2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Mô tả sản phẩm
            </label>
            <ReactQuill
              value={formData.description}
              onChange={handleDescriptionChange}
              className="mt-1"
              theme="snow"
            />
          </div>
        </div>
        {/* Action Buttons */}
        <div className="flex gap-4">
          <Link
            to="/dashboard?tab=product" // Replace with the actual route for navigation
            className="w-1/2 flex justify-center items-center bg-gray-500 text-white py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Trở về
          </Link>
          <button
            type="submit"
            className="w-1/2 bg-green-600 text-white py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Thêm sản phẩm
          </button>
        </div>
      </form>
    </div>
  );
}
