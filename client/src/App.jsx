import {BrowserRouter, Route, Routes} from 'react-router-dom'
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
import ProductSeller from './pages/ProductSeller'

///
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC7B91SK1Yp6Si1evFZLFbI8K7itc6XgTI",
  authDomain: "opms-86acd.firebaseapp.com",
  projectId: "opms-86acd",
  storageBucket: "opms-86acd.firebasestorage.app",
  messagingSenderId: "140772389695",
  appId: "1:140772389695:web:92a9491d5f5fa6e1cad98a",
  measurementId: "G-J2E8T4V2G7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
///
export default function App() {
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
   </BrowserRouter>
  )
}
