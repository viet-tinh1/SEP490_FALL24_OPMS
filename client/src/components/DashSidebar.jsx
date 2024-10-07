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
              Profile
            </Sidebar.Item>
          </Link>

          <Link to='/dashboard?tab=posts'>
            <Sidebar.Item active={tab === 'posts'} icon={HiDocumentText} as='div'>
              Posts
            </Sidebar.Item>
          </Link>

          <>
            <Link to='/dashboard?tab=users'>
              <Sidebar.Item active={tab === 'users'} icon={HiOutlineUserGroup} as='div'>
                Users
              </Sidebar.Item>
            </Link>
            <Link to='/dashboard?tab=comments'>
              <Sidebar.Item active={tab === 'comments'} icon={HiAnnotation} as='div'>
                Comments
              </Sidebar.Item>
            </Link>
            <Link to='/dashboard?tab=product'>
              <Sidebar.Item active={tab === 'product'} icon={HiAnnotation} as='div'>
                Product
              </Sidebar.Item>
            </Link>
          </>

          <Sidebar.Item icon={HiArrowSmRight} className='cursor-pointer' onClick={handleSignOut}>
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
