import { Sidebar } from 'flowbite-react';
import {
  HiUser,
  HiArrowSmRight,
  HiDocumentText,
  HiOutlineUserGroup,
  HiAnnotation,
  HiChartPie,
} from 'react-icons/hi';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function DashSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [tab, setTab] = useState('');
  const [role, setURoles] = useState(null);
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
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  // Handle Sign Out function
  const handleSignOut = async () => {
    try {
      const response = await fetch('https://localhost:7098/api/Auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      // If logout is successful, clear localStorage and redirect to login
      localStorage.clear();
      navigate('/'); // Redirect to the login page after sign out
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <Sidebar className='w-full md:w-56'>
      <Sidebar.Items>
        <Sidebar.ItemGroup className='flex flex-col gap-1'>
          <Link to='/dashboard?tab=dash'>
            <Sidebar.Item active={tab === 'dash' || !tab} icon={HiChartPie} as='div'>
              Dashboard
            </Sidebar.Item>
          </Link>

          <Link to='/dashboard?tab=profile'>
            <Sidebar.Item active={tab === 'profile'} icon={HiUser} labelColor='dark' as='div'>
            Hồ sơ
            </Sidebar.Item>
          </Link>

          <Link to='/dashboard?tab=posts'>
            <Sidebar.Item active={tab === 'posts'} icon={HiDocumentText} as='div'>
            Bài Viết
            </Sidebar.Item>
          </Link>

          <>
            {role =='1'&&(
            <Link to='/dashboard?tab=users'>
              <Sidebar.Item active={tab === 'users'} icon={HiOutlineUserGroup} as='div'>
              Quản lý tài khoản 
              </Sidebar.Item>
            </Link>
            )}
            
            <Link to='/dashboard?tab=comments'>
              <Sidebar.Item active={tab === 'comments'} icon={HiAnnotation} as='div'>
              Quản lý bình luận
              </Sidebar.Item>
            </Link>
            {role=='3'&&(
              <Link to='/dashboard?tab=product'>
              <Sidebar.Item active={tab === 'product'} icon={HiAnnotation} as='div'>
              Quản Lý Sản phẩm
              </Sidebar.Item>
            </Link>
            )}           
          </>

          <Sidebar.Item icon={HiArrowSmRight} className='cursor-pointer' onClick={handleSignOut}>
          Đăng xuất
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
