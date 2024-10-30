import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaLeaf } from "react-icons/fa";
import { FaMoon, FaSun } from "react-icons/fa";
import { AiOutlineSearch } from "react-icons/ai";
import { MdOutlineShoppingCart } from "react-icons/md";
import { useState, useEffect, useRef } from "react";

export default function Header() {
  
  const path = useLocation().pathname;
  const [userId, setUserId] = useState(null);
  const [role, setURoles] = useState(null);
  const [email, setEmail] = useState(null);
  const [username, setUserName] = useState(null);
  const navigate = useNavigate();
  const timeoutRef = useRef(null);

  const INACTIVITY_LIMIT = 30 * 60 * 1000;

  const resetInactivityTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current); // Xóa timeout hiện tại nếu có
    }

    // Đặt một timeout mới sau 30 phút sẽ thực thi hàm handleSignOut
    timeoutRef.current = setTimeout(() => {
      handleSignOut(); // Xóa thông tin người dùng sau 30 phút không hoạt động
    }, INACTIVITY_LIMIT);
  };
  
  // Check localStorage for userId when the component mounts
  useEffect(() => {
    // Get userId and role from localStorage when component mounts
    const storedUserId = localStorage.getItem("userId");
    const storedRoles = localStorage.getItem("role");
    const storedEmail = localStorage.getItem("email");
    const storedUserName = localStorage.getItem("username");
    
    // Set initial user data to state
    setUserId(storedUserId);
    setURoles(storedRoles);
    setEmail(storedEmail);
    setUserName(storedUserName);
  
    // Define function to handle localStorage changes
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
     // Hàm để reset thời gian không hoạt động khi người dùng tương tác
    const handleUserActivity = () => {
      resetInactivityTimeout(); // Reset lại thời gian không hoạt động
    };
     // Thêm các sự kiện để phát hiện hoạt động của người dùng
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("mousemove", handleUserActivity);
    window.addEventListener("keydown", handleUserActivity);
    window.addEventListener("click", handleUserActivity);
  
    // Đặt lại bộ đếm thời gian không hoạt động ngay từ lúc đầu
    resetInactivityTimeout();

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("mousemove", handleUserActivity);
      window.removeEventListener("keydown", handleUserActivity);
      window.removeEventListener("click", handleUserActivity);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current); // Xóa timeout nếu component bị hủy
      }
    };
  }, []);
  // Handle sign out logic
  const handleSignOut = () => {
    localStorage.removeItem("userId"); // Remove userId from localStorage
    localStorage.removeItem("role"); // Remove role from localStorage
    setUserId(null); // Update state
    setURoles(null); // Reset role state
    navigate("/"); // Redirect to the homepage
  };// Redirect to the homepage

  return (
    <Navbar className="border-b-2">
      <Link
        to="/"
        className="self-center text-sm sm:text-xl font-semibold dark:text-white"
      >
        <div className="text-2xl flex items-center gap-2 font-bold font-averia uppercase">
          <p className="text-primary">Plant</p>
          <p className="text-secondary">Store</p>
          <FaLeaf className="text-green-500" />
        </div>
      </Link>

      {/* Conditionally render the search bar only on the /product page */}
      {path === "/product" && (
        <form>
          <TextInput
            type="text"
            placeholder="Tìm kiếm..."
            rightIcon={AiOutlineSearch}
            className="hidden lg:inline"
          />
        </form>
      )}
      <Button className="w-12 h-10 lg:hidden" color="gray" pill>
        <AiOutlineSearch />
      </Button>

      <div className="flex gap-2 md:order-2">
        <Button className="w-12 h-10 hidden sm:inline" color="gray" pill>
          <FaSun />
        </Button>
        
        {userId ? (
          // Render Sign Out button if userId exists
          <Dropdown
          arrowIcon={false}
          inline
          label={
            <Avatar alt='user' img=''rounded />
          }
        >
          <Dropdown.Header>
            <span className='block text-sm font-medium truncate'>
              Username : {username}
              </span>
            <span className='block text-sm font-medium truncate'>
             Email : {email}
            </span>
          </Dropdown.Header>
          <Link to={'/dashboard?tab=profile '}>
            <Dropdown.Item>Profile</Dropdown.Item>
          </Link>
          <Dropdown.Divider />
          <Dropdown.Item onClick={handleSignOut} >Sign out</Dropdown.Item>
        </Dropdown>
        ) : (
          // Render Sign In button if userId is null
          <Link to="/sign-in">
            <Button gradientDuoTone="greenToBlue">Đăng nhập</Button>
          </Link>
        )}

        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link active={path === "/"} as={"div"}>
          <Link to="/">Trang chủ</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/about"} as={"div"}>
          <Link to="/about">Giới thiệu</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/product"} as={"div"}>
          <Link to="/product">Sản Phẩm</Link>
        </Navbar.Link>
        { (role === '1' || role === '3') && (
          <Navbar.Link active={path === "/dashboard"} as={"div"}>
            <Link to="/dashboard">Dashboard</Link>
          </Navbar.Link>
        )}
        
        <Navbar.Link active={path === "/cart"} as={"div"}>
          <Link to="/cart" className="text-2xl">
            <MdOutlineShoppingCart />
          </Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
