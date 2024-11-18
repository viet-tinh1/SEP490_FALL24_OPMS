import { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Spinner } from "flowbite-react";

export default function ProductEdit() {
  const { plantId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    imageUrl: "", // Store the Base64 image here
    category: "",
    name: "",
    description: "",
    price: "",
    quantity: "",
    discountCode: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [categories, setCategories] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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
    setFormData((prevData) => ({
      ...prevData,
      description: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("FormData before sending:", formData);
    const formDataToSend = new FormData();
    formDataToSend.append("plantId", plantId);
    formDataToSend.append("userId", formData.userId);
    formDataToSend.append("plantName", formData.plantName || "");
    formDataToSend.append("categoryId", formData.categoryId || "");
    formDataToSend.append("description", formData.description || "");
    formDataToSend.append("price", parseFloat(formData.price));
    formDataToSend.append("stock", parseInt(formData.stock));
    formDataToSend.append("status", formData.status || 1); // Set default status if not provided
    formDataToSend.append("discount", parseFloat(formData.discount) || 0);
    
    // Check if an image is provided in Base64 or file format
    if (formData.imageFile) {
      // If there's a file uploaded, append it
      formDataToSend.append("uploadedImage", formData.imageFile);
    } else if (formData.imageUrl) {
      // Otherwise, use the Base64 image if provided
      formDataToSend.append("imageUrl", formData.imageUrl);
    }

    try {
      const response = await fetch("https://localhost:7098/api/PlantAPI/updatePlant", {
        method: "POST",       
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Cập nhật sản phẩm thất bại");
      }

      alert("Sản phẩm đã được cập nhật thành công");
      navigate("/dashboard?tab=product");

    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await fetch(
          `https://localhost:7098/api/PlantAPI/getPlantById?id=${plantId}`
        );
        if (!response.ok) throw new Error("Không thể lấy dữ liệu sản phẩm");
        const data = await response.json();

        setFormData({
          imageUrl: data.imageUrl || "",
          categoryId: data.categoryId || "",
          plantName: data.plantName || "",
          description: data.description || "",
          price: data.price || "",
          stock: data.stock || "",
          discount: data.discount || "",
          userId: data.userId || "",
        });

        setImagePreviewUrl(data.imageUrl);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [plantId]);


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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner aria-label="Loading spinner" size="xl" />
        <span className="ml-3 text-lg font-semibold">Loading...</span>
      </div>
    );
  }
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 sm:p-8 rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-1/2 space-y-6">
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
                  alt="Product Preview"
                  className="mt-4 w-48 h-48 rounded-md shadow-md"
                />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Loại sản phẩm
              </label>
              <select
                name="category"
                value={formData.categoryId}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Chọn loại sản phẩm</option>
                {categories.map((category) => (
                  <option key={category.categoryId} value={category.categoryId}>
                    {category.categoryName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Tên sản phẩm
              </label>
              <input
                type="text"
                name="name"
                value={formData.plantName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Số lượng
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.stock}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
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
        <div className="flex gap-4">
          <Link
            to="/dashboard?tab=product"
            className="w-1/2 flex justify-center items-center bg-gray-500 text-white py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Trở về
          </Link>
          <button
            type="submit"
            className="w-1/2 bg-green-600 text-white py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sửa sản phẩm
          </button>
        </div>
      </form>
    </div>
  );
}
