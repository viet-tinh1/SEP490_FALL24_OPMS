import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashSidebar from '../components/DashSidebar';
import DashProfile from '../components/DashProfile';
import DashPosts from '../components/DashPosts';
import DashUsers from '../components/DashUsers';
import DashComments from '../components/DashComments';
import Dashproduct from '../components/Dashproduct';
import DashRegisterSeller from '../components/DashRegisterSeller';
import DashVerifyProduct from '../components/DashVerifyProduct';
import DashDiscount from "../components/DashDiscount";
import OrderManager from "../components/OrderManager";
export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState('');
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-y-auto">
      <div className="md:w-55 overflow-y-auto ">
        {/* Sidebar */}
        <DashSidebar />
      </div>
      {/* profile... */}
      {tab === "profile" && <DashProfile />}
      {/* posts... */}
      {tab === "posts" && <DashPosts />}
      {/* users */}
      {tab === "users" && <DashUsers />}
      {/* comments  */}
      {tab === "comments" && <DashComments />}
      {/* dashboard Product */}
      {tab === "product" && <Dashproduct />}
      {/* dashboard Product */}
      {tab === "DashVerifyProduct" && <DashVerifyProduct />}
      {/* DashRegister Seller */}
      {tab === "DashRegisterSeller" && <DashRegisterSeller />}
      {/* Dash Discount */}
      {tab === "DashDiscount" && <DashDiscount />}
      {tab === "OrderManager" && <OrderManager />}
    </div>
  );
}