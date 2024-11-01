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
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
export default function DashSidebar() {
  const location = useLocation();
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  return (
    <Sidebar className="w-full md:w-55 overflow-y-auto">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-2 py-2 ">
          {" "}
          {/* Adjusted gap and padding */}
          <Link to="/dashboard?tab=dash">
            <Sidebar.Item
              active={tab === "dash" || !tab}
              icon={HiChartPie}
              as="div"
            >
              Dashboard
            </Sidebar.Item>
          </Link>
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              active={tab === "profile"}
              icon={HiUser}
              labelColor="dark"
              as="div"
            >
              Hồ sơ
            </Sidebar.Item>
          </Link>
          <Link to="/dashboard?tab=posts">
            <Sidebar.Item
              active={tab === "posts"}
              icon={HiDocumentText}
              as="div"
            >
              Bài Viết
            </Sidebar.Item>
          </Link>
          <Link to="/dashboard?tab=users">
            <Sidebar.Item
              active={tab === "users"}
              icon={HiOutlineUserGroup}
              as="div"
            >
              Quản lý tài khoản
            </Sidebar.Item>
          </Link>
          <Link to="/dashboard?tab=comments">
            <Sidebar.Item
              active={tab === "comments"}
              icon={HiAnnotation}
              as="div"
            >
              Quản lý bình luận
            </Sidebar.Item>
          </Link>
          <Link to="/dashboard?tab=product">
            <Sidebar.Item
              active={tab === "product"}
              icon={AiOutlineAppstore}
              as="div"
            >
              Quản Lý Sản phẩm
            </Sidebar.Item>
          </Link>
          <Link to="/dashboard?tab=DashVerifyProduct">
            <Sidebar.Item
              active={tab === "DashVerifyProduct"}
              icon={AiOutlineAppstore}
              as="div"
            >
              Duyệt Sản Phẩm
            </Sidebar.Item>
          </Link>
          <Link to="/dashboard?tab=DashDiscount">
            <Sidebar.Item
              active={tab === "DashDiscount"}
              icon={AiOutlineAppstore}
              as="div"
            >
              Mã giảm giá
            </Sidebar.Item>
          </Link>
          <Sidebar.Item icon={HiArrowSmRight} className="cursor-pointer">
            Đăng xuất
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
