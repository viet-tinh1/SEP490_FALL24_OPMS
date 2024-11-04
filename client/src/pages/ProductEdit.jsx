import { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Link, useParams, useNavigate } from "react-router-dom";

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

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]); // Only the Base64 part
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64 = await convertToBase64(file);
      setFormData((prevData) => ({
        ...prevData,
        imageUrl: base64, // Store Base64 for API submission
      }));
      setImagePreviewUrl(URL.createObjectURL(file)); // Set preview URL
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

    const payload = {
      plantId: plantId,
      categoryId: formData.category,
      plantName: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      discount: parseFloat(formData.discount),
      imageUrl: formData.imageUrl,
      userId: formData.userId,
    };

    try {
      const response = await fetch("https://localhost:7098/api/PlantAPI/updatePlant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
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
          category: data.categoryId || "",
          name: data.plantName || "",
          description: data.description || "",
          price: data.price || "",
          stock: data.stock || "",
          discount: data.discount || "",
          userId: data.userId || "",
        });

        setImagePreviewUrl(`data:image/jpeg;base64,${data.imageUrl}`);
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

  if (loading) return <div>Loading...</div>;
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
                value={formData.category}
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
                value={formData.name}
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
