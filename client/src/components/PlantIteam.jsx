import { Link } from "react-router-dom";
import { PiShoppingCartLight } from "react-icons/pi";
import { useState, useEffect } from "react";
import { FaShoppingCart } from "react-icons/fa";

export default function PlantItem() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Gọi API khi component được render
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://localhost:7098/api/PlantAPI/most-purchased?limit=6', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const data = await response.json();
        setProducts(data); 
        const categoryResponse = await fetch(
          "https://localhost:7098/api/CategoryAPI/getCategory"
        );
        if (!categoryResponse.ok) {
          throw new Error("Failed to fetch categories");
        }
        const categoryData = await categoryResponse.json();
        setCategories(categoryData);

        setLoading(false);// Cập nhật state với dữ liệu nhận được từ API
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.categoryId === categoryId);
    return category ? category.categoryName : "Danh mục không xác định";
  };
  const formatNumber = (number) => {
    if (number >= 100) {
      return (number / 100).toFixed(1) + "tr"; // Định dạng triệu
    } else if (number >= 10) {
      return (number / 10).toFixed(1) + "k"; // Định dạng nghìn
    }
    return number.toString(); // Trả về số gốc nếu nhỏ hơn 1,000
  };
  {/*const formatNumber = (number) => {
    if (number >= 1000000) {
      return (number / 1000000).toFixed(1) + "tr"; // Định dạng triệu
    } else if (number >= 1000) {
      return (number / 1000).toFixed(1) + "k"; // Định dạng nghìn
    }
    return number.toString(); // Trả về số gốc nếu nhỏ hơn 1,000
  };*/}

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }
 
  return (
    <div className="flex flex-wrap justify-center  gap-9 p-5">
      {/*Card1*/}
      {products.map((product) => {
        let imageSrc;

        try {
          // Giải mã Base64
          const decodedData = atob(product.imageUrl);
      
          // Kiểm tra xem chuỗi đã giải mã có phải là URL không
          if (decodedData.startsWith("http://") || decodedData.startsWith("https://")) {
            // Nếu là URL, dùng trực tiếp
            imageSrc = decodedData;
          } else {
            // Nếu không phải URL, giả định đây là dữ liệu hình ảnh
            imageSrc = `data:image/jpeg;base64,${product.imageUrl}`;
          }
        } catch (error) {
          console.error("Error decoding Base64:", error);
          imageSrc = ""; // Đặt giá trị mặc định nếu giải mã thất bại
        }
        return(
        <div
          key={product.id}
          className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[200px] h-auto"
        >
          <Link>
            <div className="relative p-2.5overflow-hidden rounded-xl bg-clip-border">
              <img
                src={imageSrc}
                alt={product.name}
                className="w-[175px] h-[200px] object-cover rounded-md hover:scale-105 transition-scale duration-300 mx-auto"
              />
            </div>
            
            <div className="p-2 flex flex-col gap-2 w-full">
              <p className="truncate text-md font-semibold text-slate-700">
                {product.plantName}
              </p>
              <p className="text-sm text-gray-600 font-semibold line-clamp-2 w-full">
                  {getCategoryName(product.categoryId)}
              </p>
            </div>

            <div className="p-2 flex items-center">
              <svg
                className="h-4 w-4 text-yellow-300"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="ml-2 rounded bg-cyan-100 px-2 py-0.5 text-xs font-semibold text-cyan-800 dark:bg-cyan-200 dark:text-cyan-800">
              {product.rating || "4.5"} 
              </span>
              <span className="ml-2 rounded text-gray-600 py-0.5 text-xs font-semibold">Đã bán: {formatNumber(product.totalPurchased)} </span>
            </div>
            {/*Price*/}
            <div className="p-2 flex items-center justify-between">
              <div className="truncate flex items-baseline text-red-600">
                <span className="text-xs font-medium mr-px space-y-14">₫</span>
                <span className="font-medium text-xl truncate"> 
                  {(  product.price -product.price * (product.discount / 100 || 0)).toFixed(3)}</span>
                <span className="text-xs space-y-14 font-medium mr-px"></span>
              </div>
              {/*discount*/}
              <div className=" rounded bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-800 dark:bg-red-200 dark:text-red-800">
                <span className="aria-label=-50%">{product.discount ? `${product.discount}%` : "0%"}</span>
              </div>

              <a
                href="#"
                className="rounded-lg bg-cyan-700 px-4 py-2 text-center text-sm font-medium text-white hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
              >
                <PiShoppingCartLight />
              </a>
            </div>
          </Link>
        </div>
      )}  
    )}  
  
    </div>
  );
}