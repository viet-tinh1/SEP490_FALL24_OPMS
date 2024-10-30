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

import ForgotPassword from './pages/ForgotPassword'
import ChangePassword from './pages/ChangePassword'
import VerifyOTP from './pages/VerifyOTP'

import ProductSeller from './pages/ProductSeller'

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



    </Routes>
    <Footer/>
   </BrowserRouter>
  )
}
