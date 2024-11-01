import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import { FaLeaf } from "react-icons/fa";
import { FaMoon, FaSun } from "react-icons/fa";
import { AiOutlineSearch } from "react-icons/ai";
import { MdOutlineShoppingCart } from "react-icons/md";
export default function Header() {
  const path = useLocation().pathname;
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
          placeholder="Tìm kiếm..."
          rightIcon={AiOutlineSearch}
          className="hidden lg:inline"
        />
      </form>
      <Button className="w-12 h-10 lg:hidden" color="gray" pill>
        <AiOutlineSearch />
      </Button>

      <div className="flex gap-2 md:order-2">
        <Dropdown
          arrowIcon={false}
          inline
          label={<Avatar alt="user" img="" rounded />}
        >
          <Dropdown.Header>
            <span className="block text-sm">Username</span>
            <span className="block text-sm font-medium truncate">Email</span>
          </Dropdown.Header>
          <Link to={"/dashboard?tab=profile "}>
            <Dropdown.Item>Profile</Dropdown.Item>
          </Link>
          <Dropdown.Divider />
          <Dropdown.Item>Sign out</Dropdown.Item>
        </Dropdown>

        <Link to="/sign-in">
          <Button gradientDuoTone="greenToBlue">Đăng nhập</Button>
        </Link>
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
        <Navbar.Link active={path === "/dashboard"} as={"div"}>
          <Link to="/dashboard">dashboard</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/dashboard"} as={"div"}>
          <Link to="/Forum">Diễn đàn</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/cart"} as={"div"}>
          <Link to="/cart" className="text-2xl">
            <MdOutlineShoppingCart />
          </Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
