import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaLeaf } from "react-icons/fa";
import { FaMoon, FaSun } from "react-icons/fa";
import { AiOutlineSearch } from "react-icons/ai";
import { MdOutlineShoppingCart } from "react-icons/md";
import { useState, useEffect } from "react";

export default function Header() {
  const path = useLocation().pathname;
  const [userId, setUserId] = useState(null);
  const [role, setURoles] = useState(null);
  const navigate = useNavigate();

  // Check localStorage for userId when the component mounts
  useEffect(() => {
    // Get userId and role from localStorage when component mounts
    const storedUserId = localStorage.getItem("userId");
    const storedRoles = localStorage.getItem("role");
    
    // Set initial user data to state
    setUserId(storedUserId);
    setURoles(storedRoles);
  
    // Define function to handle localStorage changes
    const handleStorageChange = () => {
      const updatedUserId = localStorage.getItem("userId");
      const updatedRoles = localStorage.getItem("role");
      setUserId(updatedUserId);
      setURoles(updatedRoles);
    };
  
    // Listen for storage changes
    window.addEventListener("storage", handleStorageChange);
  
    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("storage", handleStorageChange);
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

      <form>
        <TextInput
          type="text"
          placeholder="Search..."
          rightIcon={AiOutlineSearch}
          className="hidden lg:inline"
        />
      </form>
      <Button className="w-12 h-10 lg:hidden" color="gray" pill>
        <AiOutlineSearch />
      </Button>

      <div className="flex gap-2 md:order-2">
        <Button className="w-12 h-10 hidden sm:inline" color="gray" pill>
          <FaSun />
        </Button>

        {userId ? (
          // Render Sign Out button if userId exists
          <Button gradientDuoTone="greenToBlue" onClick={handleSignOut}>
            Sign Out
          </Button>
        ) : (
          // Render Sign In button if userId is null
          <Link to="/sign-in">
            <Button gradientDuoTone="greenToBlue">Sign In</Button>
          </Link>
        )}

        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link active={path === "/"} as={"div"}>
          <Link to="/">Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/about"} as={"div"}>
          <Link to="/about">About</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/product"} as={"div"}>
          <Link to="/product">Product</Link>
        </Navbar.Link>
        { role === '1' && (
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
