import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Link } from "react-router-dom";

export default function ProductCreate() {
  const [formData, setFormData] = useState({
    plantId: 0,
    plantName: "",
    categoryId: 0,
    description: "",
    price: "",
    image: null, // For file upload
    imageUrl: "", // Base64 encoded image string
    stock: "",
    status: 1,
    isVerified: 0,
    userId: 0,
    discount: "",
  });
  const [categories, setCategories] = useState([]);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const userId = localStorage.getItem("userId");
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64 = await convertToBase64(file);
      setFormData((prevData) => ({
        ...prevData,
        imageUrl: base64, // Store the Base64 string for the image
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
          "https://localhost:7098/api/CategoryAPI/getCategory"
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

    // Create JSON payload
    const payload = {
      plantId: formData.plantId,
      plantName: formData.plantName,
      categoryId: formData.categoryId,
      description: formData.description,
      price: parseFloat(formData.price),
      imageUrl: formData.imageUrl, // Base64 image string
      stock: parseInt(formData.stock),
      status: 1,
      isVerified: parseInt(formData.isVerified),
      userId: userId,
      discount: parseFloat(formData.discount),
    };

    try {
      const response = await fetch("https://localhost:7098/api/PlantAPI/createPlant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Product created successfully:", result);
        // Show success message
        alert("Product added successfully!");

        // Redirect to the product page
        navigate("/dashboard?tab=product");
      } else {
        console.error("Failed to create product");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Helper function to convert image file to Base64 string
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]); // Only the Base64 string part
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6 sm:p-8 rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
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
                onChange={handleImageChange}
                className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              />
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
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            {/* Stock Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Số lượng
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
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
