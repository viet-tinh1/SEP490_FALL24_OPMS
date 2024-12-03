import { PiShoppingCartLight } from "react-icons/pi";
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { Spinner } from "flowbite-react";
export default function PlantItem() {

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState('');
  const [ratingData, setRatingData] = useState({});
  // Gọi API khi component được render
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://opms1.runasp.net/api/PlantAPI/most-purchased?limit=3', {
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
          "https://opms1.runasp.net/api/CategoryAPI/getCategory"
        );
        if (!categoryResponse.ok) {
          throw new Error("Failed to fetch categories");
        }
        const categoryData = await categoryResponse.json();
        setCategories(categoryData);
        const ratings = await fetchRatings(data);
        setRatingData(ratings);
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
    if (number >= 1000000) {
      return (number / 1000000).toFixed(1) + "tr"; // Định dạng triệu
    } else if (number >= 1000) {
      return (number / 1000).toFixed(1) + "k"; // Định dạng nghìn
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
const addToCart = async (productId, quantity) => {
    const userId = localStorage.getItem("userId");
    if (!userId || userId === "undefined") {
      navigate("/sign-in");
      return;
  }
    try {
      const response = await fetch('https://opms1.runasp.net/api/ShoppingCartAPI/createShoppingCart', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plantId: productId,
          quantity: quantity,
          userId: userId,
        }),
      });
      
      if (response.ok) {

        setSuccessMessage('Sản phẩm đã được thêm vào giỏ hàng!');
      } else {
        const errorData = await response.json(); // Lấy dữ liệu phản hồi lỗi từ server
        if (response.status === 404 && errorData.message === "Not enough stock available.") {
          setSuccessMessage("Không đủ hàng trong kho.");
        } else {
          setSuccessMessage("Đã xảy ra lỗi. Vui lòng thử lại.");
        }
      }
    } catch (err) {
      console.error("Lỗi thêm sản phẩm vào giỏ hàng:", err);
      setSuccessMessage("Đã xảy ra lỗi khi thêm sản phẩm vào giỏ hàng.");
    }
    finally {

      setTimeout(() => {
        setSuccessMessage('');
      }, 2000);
    }
  };
  const fetchRatings = async (products) => {
    const ratings = {};
    try {
      await Promise.all(
        products.map(async (product) => {
          const response = await fetch(
            `https://opms1.runasp.net/api/ReviewAPI/getProductRatingSummary?plantId=${product.plantId}`
          );
          const data = await response.json();
          ratings[product.plantId] = data; // Gán dữ liệu đánh giá vào object
        })
      );
    } catch (err) {
      console.error("Lỗi khi lấy dữ liệu đánh giá:", err);
    }
    return ratings;
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <div className="flex flex-col items-center">
          <Spinner aria-label="Loading spinner" size="xl" />
          <span className="mt-3 text-lg font-semibold">Đang tải...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <p>Error: {error}</p>;
  }
 
  return (
    <div className="flex flex-wrap justify-center  gap-9 p-5">
      {/*Card1*/}
      {successMessage && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="bg-green-500 text-white text-lg font-semibold py-2 px-6 rounded-lg shadow-lg transform -translate-y-60">
                {successMessage}
              </div>
            </div>
          )}
      {products.map((product) => { 
        const rating = ratingData[product.plantId] || {
          totalReviews: 0,
          totalRating: 0,
        };
        const averageRating =
          rating.totalReviews > 0
            ? (rating.totalRating / rating.totalReviews).toFixed(1)
            : "0.0";

        return(
        <div
          key={product.plantId}
          className={`relative bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[200px] h-auto ${product.stock === 0 ? "opacity-98" : ""
          }`}
      >
          {product.stock === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
              <span className="text-red-400 font-bold text-lg">Hết hàng</span>
            </div>
          )}
          {/* Liên kết đến trang chi tiết sản phẩm */}
          <Link
            to={product.stock === 0 ? "#" : `/productdetail/${product.plantId}`}
            className={`${product.stock === 0 ? "pointer-events-none" : ""}`}
          >
            <div className="relative p-2.5overflow-hidden rounded-xl bg-clip-border">
              <img
                src={product.imageUrl}
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
              {averageRating} ({rating.totalReviews} đánh giá)
              </span>
             
            </div>
            <span className="ml-2 rounded text-gray-600 py-0.5 text-xs font-semibold">Đã bán: {formatNumber(product.totalPurchased)} </span>
            </Link>
            {/*Price*/}
            <div className="p-2 flex items-center justify-between">
              <div className="truncate flex items-baseline text-red-600">
                <span className="text-xs font-medium mr-px space-y-14">₫</span>
                <span className="font-medium text-xl truncate"> 
                  {(  product.price -product.price * (product.discount / 100 || 0))}</span>
                <span className="text-xs space-y-14 font-medium mr-px"></span>
              </div>
              {/*discount*/}
              <div className=" rounded bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-800 dark:bg-red-200 dark:text-red-800">
                <span className="aria-label=-50%">{product.discount ? `${product.discount}%` : "0%"}</span>
              </div>

              <button
                onClick={() => addToCart(product.plantId, 1)}
                className="rounded-lg bg-cyan-700 px-4 py-2 text-center text-sm font-medium text-white hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
              >
                <PiShoppingCartLight />
              </button>
            </div>
          
        </div>
      )}  
    )}  
  
    </div>
  );
}