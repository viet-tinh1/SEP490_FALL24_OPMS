import {BrowserRouter, Route, Routes} from 'react-router-dom'
import { useState, useEffect } from 'react'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Dashboard from './pages/Dashboard'
import About from './pages/About'
import Header from './components/Header'
import Footer from './components/Footer'
import Product from './pages/Product'
import Cart from './pages/Cart'
import ProductDetail from './pages/ProductDetail'
import Payment from './pages/Payment'
import Verify_Otp from './pages/Verify_otp'
import ProductEdit from "./pages/ProductEdit";
import ProductCreate from "./pages/ProductCreate";
import DiscountEdit from "./pages/DiscountEdit";
import DiscountUpdate from "./pages/DiscountUpdate";
import ForgotPassword from './pages/ForgotPassword'
import ChangePassword from './pages/ChangePassword'
import VerifyOTP from './pages/VerifyOTP'
import Forum from "./pages/Forum";
import UserCreate from"./pages/UserCreate";
import UserEdit from "./pages/UserEdit";
import PaymentFailure from "./pages/PaymentFailure";
import PaymentSuccess from "./pages/PaymentSuccess";
import OrderSuccess from './pages/Order-Success';
import ProductSeller from './pages/ProductSeller';


export default function App() {
  const [status, setStatus] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("status");
    localStorage.clear();
    window.location.href = "/sign-in"; // Chuyển hướng về trang đăng nhập
  };

  // Hàm gọi API để lấy status
  const fetchStatus = async () => {
    try {
      const userId = localStorage.getItem("userId"); // Lấy userId từ localStorage
      if (!userId) {
        console.error("Không tìm thấy userId trong localStorage.");
        return;
      }

      const response = await fetch(`https://opms1.runasp.net/api/UserAPI/getUserById?userId=${userId}`);
      if (!response.ok) {
        throw new Error(`Lỗi HTTP: ${response.status}`);
      }

      const data = await response.json();
      const newStatus = data.status;

      // Kiểm tra nếu status thay đổi
      if (newStatus !== status) {
        setStatus(newStatus);
        localStorage.setItem("status", newStatus);

        // Nếu status là "0", xử lý hiển thị Modal
        if (newStatus == 0) {
          setShowModal(true);

          // Tự động đăng xuất sau 3 giây
          const timer = setTimeout(() => {
            handleLogout();
          }, 3000);

          return () => clearTimeout(timer); // Dọn dẹp timeout nếu cần
        }
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error.message);
    }
  };

  // Gọi API mỗi 2 giây
  useEffect(() => {
    const intervalId = setInterval(fetchStatus, 2000);
    return () => clearInterval(intervalId); // Dọn dẹp interval khi component bị unmount
  }, [status]);
  return (   
    <BrowserRouter>
    <Header/>
    <Routes>
        
          <Route path='/' element={<Home/>}/>
          <Route path='/about' element={<About/>}/>
          <Route path='/sign-in' element={<SignIn/>}/>
          <Route path='/sign-up' element={<SignUp/>}/>
          <Route path='/dashboard' element={<Dashboard/>}/>
          <Route path='/product' element={<Product/>}/>
          <Route path='/payment' element={<Payment/>}/>
          <Route path='/cart' element={<Cart/>}/>
          <Route path="/productdetail/:plantId" element={<ProductDetail />} />
          <Route path='/verify_otp' element={<Verify_Otp/>} />
          <Route path="/forgot-password" element={<ForgotPassword/>}/>
          <Route path="/change-password" element={<ChangePassword/>}/>
          <Route path='/verifyOTP' element={<VerifyOTP/>} />
          <Route path='/producsSeller/:userIdPlant' element={<ProductSeller/>}/>
          <Route path="/ProductEdit/:plantId" element={<ProductEdit />} />
          <Route path="/ProductCreate" element={<ProductCreate />} />
          <Route path="/DiscountEdit" element={<DiscountEdit />} />
          <Route path="/DiscountUpdate" element={<DiscountUpdate />} />
          <Route path="/Forum" element={<Forum />} />
          <Route path="/UserCreate" element={<UserCreate/>}/>
          <Route path="/UserEdit" element={<UserEdit/>}/>
          <Route path="/PaymentSuccess" element={<PaymentSuccess/>}/>
          <Route path="/PaymentFailure" element={<PaymentFailure/>}/>
          <Route path="/order-success" element={<OrderSuccess/>}/>
    </Routes>
    <Footer/>
    {/* Modal */}
    {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
            <h3 className="text-lg font-semibold mb-2">Tài khoản của bạn đã bị khóa</h3>
            <p className="text-sm mb-4">
              Bạn sẽ được đăng xuất sau 3 giây. Vui lòng liên hệ quản trị viên để được hỗ trợ.
            </p>
          </div>
        </div>
      )}
   </BrowserRouter>  
  )
}
