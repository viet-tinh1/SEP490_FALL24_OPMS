import { Sidebar } from "flowbite-react";
import {
  HiUser,
  HiArrowSmRight,
  HiDocumentText,
  HiOutlineUserGroup,
  HiAnnotation,
  HiChartPie,
} from "react-icons/hi";
import { AiOutlineAppstore } from "react-icons/ai";
import { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ConfirmationDialog from "../components/ConfirmationDialog";

export default function DashSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [tab, setTab] = useState("");
  const [role, setURoles] = useState(null);
  const [userId, setUserId] = useState(null);
  const timeoutRef = useRef(null);
  const [email, setEmail] = useState(null);
  const [username, setUserName] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  //check timeout
  const INACTIVITY_LIMIT = 30 * 60 * 1000;

  const resetInactivityTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      handleSignOut();
    }, INACTIVITY_LIMIT);
  };
  
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedRoles = localStorage.getItem("role");
    const storedEmail = localStorage.getItem("email");
    const storedUserName = localStorage.getItem("username");

    setUserId(storedUserId);
    setURoles(storedRoles);
    setEmail(storedEmail);
    setUserName(storedUserName);

    const handleStorageChange = () => {
      const updatedUserId = localStorage.getItem("userId");
      const updatedRoles = localStorage.getItem("role");
      const updatedEmail = localStorage.getItem("email");
      const updatedUserName = localStorage.getItem("username");
      setUserId(updatedUserId);
      setURoles(updatedRoles);
      setEmail(updatedEmail);
      setUserName(updatedUserName);
    };

    const handleUserActivity = () => {
      resetInactivityTimeout();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("mousemove", handleUserActivity);
    window.addEventListener("keydown", handleUserActivity);
    window.addEventListener("click", handleUserActivity);

    resetInactivityTimeout();

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("mousemove", handleUserActivity);
      window.removeEventListener("keydown", handleUserActivity);
      window.removeEventListener("click", handleUserActivity);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  //kết thúc hàm check timeout 
  useEffect(() => {
    const handleSignOutAcrossTabs = (event) => {
      if (event.key === "Đăng xuất") {
        setUserId(null);
        setURoles(null);
        setEmail(null);
        setUserName(null);
        navigate("/");
      }
    };

    window.addEventListener("storage", handleSignOutAcrossTabs);

    return () => {
      window.removeEventListener("storage", handleSignOutAcrossTabs);
    };
  }, []);
  //lấy sesion
  useEffect(() => {
    // Fetch role from localStorage during the initial mount
    const storedRoles = localStorage.getItem("role");
    setURoles(storedRoles); // Assuming role is stored as string in localStorage

    // Listen for changes to localStorage (cross-tab synchronization)
    const handleStorageChange = () => {
      const updatedRoles = localStorage.getItem("role");
      setURoles(updatedRoles);
    };

    window.addEventListener("storage", handleStorageChange);

    // Clean up the event listener when component unmounts
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  // Handle Sign Out function
  const handleSignOut = () => {
    // Xóa tất cả các mục trong localStorage
    localStorage.clear();

    // Phát sự kiện đăng xuất
    localStorage.setItem("signOut", Date.now());

    // Đặt lại trạng thái
    setUserId(null);
    setURoles(null);
    setEmail(null);
    setUserName(null);
    navigate("/");
    window.location.reload();
    
  };
  const openConfirmationDialog = () => {
    setShowConfirmation(true);
  };
  const closeConfirmationDialog = () => {
    setShowConfirmation(false);
  };
  return (
    <Sidebar className="w-full md:w-55 overflow-y-auto">
      <Sidebar.Items>
        <Sidebar.ItemGroup className='flex flex-col gap-1'>
        {(role === '1' || role === '3') &&(
          <Link to="/dashboard?tab=dash">
          <Sidebar.Item active={tab === "dash" || !tab} icon={HiChartPie} as="div">
            Dashboard
          </Sidebar.Item>
        </Link>
        )}
          

          <Link to="/dashboard?tab=profile">
            <Sidebar.Item  active={tab === "profile"} icon={HiUser}  labelColor="dark" as="div">
            Hồ sơ
            </Sidebar.Item>
          </Link>
          {(role === '1' || role === '3') &&(
            <Link to="/dashboard?tab=posts">
            <Sidebar.Item active={tab === "posts"} icon={HiDocumentText} as="div">
            Bài Viết
            </Sidebar.Item>
          </Link>
          )}
          

          <>
            {role =='1'&&(
            <Link to="/dashboard?tab=users">
              <Sidebar.Item active={tab === "users"} icon={HiOutlineUserGroup} as="div">
              Quản lý tài khoản 
              </Sidebar.Item>
            </Link>
            )}
            {(role === '1' || role === '3') &&(
            <Link to="/dashboard?tab=comments">
              <Sidebar.Item active={tab === "comments"} icon={HiAnnotation} as="div">
              Quản lý bình luận
              </Sidebar.Item>
            </Link>
            )}
            {/*Quản lý cây của role người bán */ }  
            {(role === '3') &&(
              <Link to="/dashboard?tab=product">
              <Sidebar.Item active={tab === "product"} icon={HiAnnotation} as="div">
              Quản Lý Sản phẩm
              </Sidebar.Item>
            </Link>
            )}
            {/*xác thực cây trc khi bán */ }          
            {role =='1'&&(
            <Link to="/dashboard?tab=DashVerifyProduct">
              <Sidebar.Item
                active={tab === "product"}
                icon={AiOutlineAppstore}
                as="div"
              >
                Duyệt Sản Phẩm
              </Sidebar.Item>
            </Link>
            )}

            {/*quản lý mã giảm giá của role người bán  */ }  
            {role == 3 &&(
              <Link to="/dashboard?tab=DashDiscount">
              <Sidebar.Item
                active={tab === "DashDiscount"}
                icon={AiOutlineAppstore}
                as="div"
              >
                Mã giảm giá
              </Sidebar.Item>
            </Link>
            )}
            
            </>
          <Sidebar.Item icon={HiArrowSmRight} className='cursor-pointer' onClick={openConfirmationDialog}>
          Đăng xuất
          </Sidebar.Item>
          {/* Hiển thị hộp thoại xác nhận nếu `showConfirmation` là true */}
          {showConfirmation && (
          <ConfirmationDialog
          message="Bạn có chắc chắn muốn đăng xuất không?"
          onConfirm={() => {
            handleSignOut();
            closeConfirmationDialog();
          }}
          onCancel={closeConfirmationDialog}
          />
        )}
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
