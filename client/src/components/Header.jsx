import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaLeaf } from "react-icons/fa";
import React, { useContext } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import { AiOutlineSearch } from "react-icons/ai";
import { MdOutlineShoppingCart } from "react-icons/md";
import { useState, useEffect, useRef } from "react";
import ConfirmationDialog from "../components/ConfirmationDialog";

export default function Header() {

  const path = useLocation().pathname;
  const [userId, setUserId] = useState(null);
  const [role, setURoles] = useState(null);
  const [email, setEmail] = useState(null);
  const [username, setUserName] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // State for search input
  const [searchResults, setSearchResults] = useState([]); // State for search results
  const navigate = useNavigate();
  const timeoutRef = useRef(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false); // Truy cập vào context
  const INACTIVITY_LIMIT = 1440 * 60 * 1000;

  const resetInactivityTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      handleSignOut();
    }, INACTIVITY_LIMIT);
  };
  const [userImage, setUserImage] = useState(localStorage.getItem('userImage') || '');

  useEffect(() => {
    const handleStorageChange = () => {
      setUserImage(localStorage.getItem('userImage'));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
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

  useEffect(() => {
    const handleSignOutAcrossTabs = (event) => {
      if (event.key === "signOut") {
        // Clear state and navigate to home page
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
  };
  const openConfirmationDialog = () => {
    setShowConfirmation(true);
  };
  const closeConfirmationDialog = () => {
    setShowConfirmation(false);
  };
  useEffect(() => {
    const fetchUserData = async () => {
        try {
            // Lấy `userId` từ `localStorage`
            const storedUserId = localStorage.getItem("userId");
            if (!storedUserId) {
                console.error("No userId found in session");
                return;
            }

            // Gọi API để lấy thông tin người dùng
            const response = await fetch(`https://opms1.runasp.net/api/UserAPI/getUserByIds?userId=${storedUserId}`);
            if (!response.ok) {
                throw new Error("Failed to fetch user data");
            }

            const userData = await response.json();

            // Cập nhật state người dùng và ảnh
            setUsers(userData);
            if (userData.image) {
              localStorage.setItem("userImage", userData.image);
              window.dispatchEvent(new Event('storage'));
            } // Cập nhật ảnh từ dữ liệu người dùng
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    // Nếu `userId` tồn tại, gọi API để lấy dữ liệu
    if (userId) {
        fetchUserData();
    }
}, [userId]);
const handleAvatarUpdate = (newImageUrl) => {
  setUserImage(newImageUrl);
};
  const handleSearch = async () => {
    try {
      if (searchQuery.trim()) {
        const response = await fetch(
          `https://opms1.runasp.net/api/PlantAPI/searchPlants?name=${searchQuery}&categoryId=0`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch search results");
        }

        const productsData = await response.json();
        setSearchResults(productsData); // Store search results in state

        // Navigate to "/product" with the search query as a URL parameter
        navigate(`/product?search=${encodeURIComponent(searchQuery)}`, { state: { results: productsData } });
      } else {
        // Fetch all verified plants when search query is empty
        const response = await fetch(
          `https://opms1.runasp.net/api/PlantAPI/getVerifiedPlants`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch all verified plants");
        }
        const productsData = await response.json();
        setSearchResults(productsData);
        navigate(`/product`, { state: { results: productsData } });
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };
  // ko cho request link only click button
  {/*useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      handleSearch();
    }, 200); // Delay of 500ms

    return () => clearTimeout(debounceTimeout);
  }, [searchQuery]);*/}
  // cho requset link
  useEffect(() => {
    if (path === "/product") {
      const debounceTimeout = setTimeout(() => {
        handleSearch();
      }, 200); // Đợi 200ms trước khi chạy tìm kiếm

      return () => clearTimeout(debounceTimeout);
    }
  }, [searchQuery]);
  useEffect(() => {
    if (path !== "/product") {
      setSearchQuery(""); // Đặt lại tìm kiếm khi rời khỏi trang
      setSearchResults([]); // Xóa kết quả tìm kiếm cũ
    }
  }, [path]);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    const storedUserImage = localStorage.getItem("userImage");
    if (storedUserImage) {
      setUsers((prevUser) => ({
        ...prevUser,
        userImage: storedUserImage,
      }));
    }
  }, []);
  const handleLogout = () => {
    // Clear localStorage và trạng thái
    localStorage.removeItem("status");
    localStorage.clear();
    localStorage.setItem("signOut", Date.now());
    
    // Đặt lại trạng thái
    setUserId(null);
    setURoles(null);
    setEmail(null);
    setUserName(null);     
    setShowModal(false);
    navigate("/sign-in");
    window.location.reload(true); // Reload trang sau đăng xuất
    
  };
  const Block = async () => {   
    const status = localStorage.getItem("status");
    if (status === "0") {
      setShowModal(true);

      // Tạo bộ đếm thời gian (timeout) nếu không bấm
      const timer = setTimeout(() => {
        handleLogout();
      }, 3000);

      return () => clearTimeout(timer); // Dọn dẹp bộ đếm nếu người dùng bấm nút
       
    }
  }
  return (
    <Navbar className="border-b-2 sticky top-0 left-0 w-full bg-white dark:bg-gray-900 shadow-md z-50">
     
      <Link
        to={localStorage.getItem("status") === "0" ? "#" : "/"}
        onClick={(e) => {
          if (localStorage.getItem("status") === "0") {
            Block();
          }
        }}
        className="self-center text-sm sm:text-xl font-semibold dark:text-white"
      >
        <div className="text-2xl flex items-center gap-2 font-bold font-averia uppercase">
          <p className="text-primary">Plant</p>
          <p className="text-secondary">Store</p>
          <FaLeaf className="text-green-500" />
        </div>
      </Link>
      {/* <form onSubmit={handleSearch}>
        <TextInput
          type="text"
          placeholder="Tìm kiếm..."
          rightIcon={AiOutlineSearch}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="hidden lg:inline"
        />
      </form> */}
      {/* Conditionally render the search bar only on the /product page */}
      {path === "/product" && (
        <form onSubmit={handleSearch}>
          <TextInput
            type="text"
            placeholder="Tìm kiếm..."
            rightIcon={AiOutlineSearch}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="hidden lg:inline"
          />
        </form>
      )}
      <Button className="w-12 h-10 lg:hidden" color="gray" pill>
        <AiOutlineSearch />
      </Button>
      <div className="flex gap-2 md:order-2">


        {userId ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={<Avatar alt="user" img={userImage} rounded />}
          >
            <Dropdown.Header>
              <span className="block text-sm font-medium truncate">
                Tên : {username}
              </span>
              <span className="block text-sm font-medium truncate">
                Email : {email}
              </span>
              <span className="block text-sm font-medium truncate">
                Chức vụ: {" "}
                {role === "1" ? "Quản trị viên " : role === "2" ? "Người dùng" : role === "3" ? "Người bán" : "Không xác định"}
              </span>
            </Dropdown.Header>
            <Link 
            to={localStorage.getItem("status") === "0" ? "#" : "/dashboard?tab=profile"}
            onClick={(e) => {
              if (localStorage.getItem("status") === "0") {
                Block();
              }
            }}
            >
              <Dropdown.Item>Hồ sơ</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={openConfirmationDialog}>Đăng Xuất</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to="/sign-in">
            <Button gradientDuoTone="greenToBlue">Đăng nhập</Button>
          </Link>
        )}
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

        <Navbar.Toggle />
      </div>
      {/* Render Modal nếu trạng thái showModal là true */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
            <h3 className="text-lg font-semibold mb-2">Tài khoản của bạn đã bị khóa</h3>
            <p className="text-sm mb-4">Vui lòng đăng xuất hoặc đợi 3 giây để tự động chuyển sang màn hình đăng nhập</p>
            <div className="mt-4 flex justify-around">
              
            </div>
          </div>
        </div>
      )}
      <Navbar.Collapse>
        <Navbar.Link active={path === "/"} as={"div"}>
          <Link 
          to={localStorage.getItem("status") === "0" ? "#" : "/"}
          onClick={(e) => {
            if (localStorage.getItem("status") === "0") {
              Block();
            }
          }}
          >Trang chủ</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/about"} as={"div"}>
          <Link 
          to={localStorage.getItem("status") === "0" ? "#" :"/about"}
          onClick={(e) => {
            if (localStorage.getItem("status") === "0") {
              Block();
            }
          }}
          >Giới thiệu</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/product"} as={"div"}>
          <Link 
          to={localStorage.getItem("status") === "0" ? "#" :"/product"}
          onClick={(e) => {
            if (localStorage.getItem("status") === "0") {
              Block();
            }
          }}
          >Sản Phẩm</Link>
        </Navbar.Link>
        {(role === "1" || role === "3") && (
          <Navbar.Link active={path === "/dashboard"} as={"div"}>
            <Link 
            to={localStorage.getItem("status") === "0" ? "#" :"/dashboard?tab=dash"}
            onClick={(e) => {
              if (localStorage.getItem("status") === "0") {
                Block();
              }
            }}
            >           
            Bảng điều khiển</Link>
          </Navbar.Link>
        )}
        <Navbar.Link active={path === "/Forum"} as={"div"}>
          <Link 
          to={localStorage.getItem("status") === "0" ? "#" :"/Forum"}
          onClick={(e) => {
            if (localStorage.getItem("status") === "0") {
              Block();
            }
          }}
          >Diễn đàn</Link>
        </Navbar.Link>
        {(role === "2") && (
          <Navbar.Link active={path === "/order-success"} as={"div"}>
            <Link 
            to={localStorage.getItem("status") === "0" ? "#" :"/order-success"}
            onClick={(e) => {
              if (localStorage.getItem("status") === "0") {
                Block();
              }
            }}
            >Đơn Hàng</Link>
          </Navbar.Link>
        )}
        {(role === "3") && (
          <Navbar.Link active={path === `/producsSeller/${userId}`} as={"div"}>
            <Link 
            to={localStorage.getItem("status") === "0" ? "#" : `/producsSeller/${userId}`}
            onClick={(e) => {
              if (localStorage.getItem("status") === "0") {
                Block();
              }
            }}
            >Cửa hàng </Link>
          </Navbar.Link>
        )}
        <Navbar.Link active={path === "/cart"} as={"div"}>
          <Link 
          to={localStorage.getItem("status") === "0" ? "#" :"/cart"} 
          onClick={(e) => {
            if (localStorage.getItem("status") === "0") {
              Block();
            }
          }}
          className="text-2xl">
            <MdOutlineShoppingCart />
          </Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}