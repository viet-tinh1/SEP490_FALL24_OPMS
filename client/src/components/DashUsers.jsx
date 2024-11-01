import { Modal, Table, Button } from "flowbite-react";
import { useState, useEffect } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { TbLock, TbLockOpen } from "react-icons/tb"; 
import { TextInput } from "flowbite-react";
import { AiOutlineSearch } from "react-icons/ai";
import ReactPaginate from "react-paginate"; 
import { Spinner } from "flowbite-react";

export default function DashUsers() {
  const [users, setUsers] = useState([]); // Initially empty, populated by the API
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [roleId, setRoleId] = useState(1);
  const [loading, setLoading] = useState(true); // Handle loading state
  const [error, setError] = useState(null); // Handle error state
  const usersPerPage = 5; 
  const [activeButton, setActiveButton] = useState(1);

  // Fetch users from API
  const fetchUsersByRole = async (roleId) => {
    try {
      const response = await fetch(
        `https://localhost:7098/api/UserAPI/getUserByRole?roleId=${roleId}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      setUsers(data); // Set the fetched users into state
      setLoading(false); // Turn off the loading state
    } catch (err) {
      setError(err.message); // Handle any errors
      setLoading(false);
    }
  }; // Empty dependency array to fetch only once on component mount

// useEffect gọi API lần đầu với roleId = 1
  useEffect(() => {
    fetchUsersByRole(roleId);
  }, [roleId]); // Thay đổi khi roleId thay đổi

// Hàm xử lý khi người dùng nhấn vào nút để thay đổi roleId
  const handleRoleChange = (newRoleId) => {
  setActiveButton(newRoleId);
  setRoleId(newRoleId);
  setCurrentPage(0); // Cập nhật roleId mới
  };
  const getRoleName = (roleId) => {
    switch(roleId) {
      case 1:
        return "Admin";
      case 2:
        return "Người dùng";
      case 3:
        return "Người bán";
      default:
        return "Unknown Role"; // Default for unexpected values
    }
  };

  const handleToggle = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleConfirmBlock = () => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === selectedUser.id ? { ...user, blocked: !user.blocked } : user
      )
    );
    setShowModal(false);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const pageCount = Math.ceil(users.length / usersPerPage);
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };
  
  const usersToDisplay = users.slice(
    currentPage * usersPerPage,
    (currentPage + 1) * usersPerPage
  );

  // Display loading or error states
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <div className="flex flex-col items-center">
          <Spinner aria-label="Loading spinner" size="xl" />
          <span className="mt-3 text-lg font-semibold">Loading...</span>
        </div>
      </div>
    );
  }
  if (error) return <div>Error: {error}</div>;

  return (
    <main className="overflow-x-auto md:mx-auto p-4">
       <div className="shadow-md rounded-lg bg-white dark:bg-gray-800 mb-6 p-6 lg:p-2">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">
            Tất cả người dùng
          </h1>
          <div className="flex flex-wrap gap-4 items-center mb-6">
          <form className="flex-grow max-w-xs w-full md:w-1/2">
              <TextInput
                type="text"
                placeholder="Tìm kiếm  ..."
                rightIcon={AiOutlineSearch}
                className="w-full"/>
            </form>           
            <Button className="flex items-center ml-auto space-x-2 sm:space-x-3">Thêm người dùng</Button>
          </div>
            <br></br>
            <div className="sm:flex space-x-4">
              <Button 
              id="1" 
              onClick={() => handleRoleChange(1)}
              className={`${
                activeButton === 1
                  ? "bg-green-600 text-white border-green-700"
                  : "bg-gray-200 text-gray-700 border-gray-300"
              } py-1 px-3 text-sm font-semibold rounded-lg shadow`}
              >
                Quản trị viên
              </Button>
              <Button 
              id="2" 
              onClick={() => handleRoleChange(2)}
              className={`${
                activeButton === 2
                  ? "bg-green-600 text-white border-green-700"
                  : "bg-gray-200 text-gray-700 border-gray-300"
              } py-1 px-3 text-sm font-semibold rounded-lg shadow`}
              >
                Người dùng
              </Button>
              <Button 
              id="3" 
              onClick={() => handleRoleChange(3)}
              className={`${
               activeButton === 3
                ? "bg-green-600 text-white border-green-700"
                : "bg-gray-200 text-gray-700 border-gray-300"
              } py-1 px-3 text-sm font-semibold rounded-lg shadow`}
              >
                Người bán
              </Button>
            </div>
          </div>       
      </div>

      <div className="overflow-x-auto shadow-md rounded-lg">
      <Table hoverable className="w-full">
          <Table.Head>
          <Table.HeadCell className="whitespace-nowrap">
          Ngày tạo
          </Table.HeadCell>
            <Table.HeadCell>Ảnh</Table.HeadCell>
            <Table.HeadCell>Tên</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell>Phone</Table.HeadCell>
            <Table.HeadCell className="whitespace-nowrap">Chức vụ</Table.HeadCell>
            <Table.HeadCell className="whitespace-nowrap">Địa chỉ</Table.HeadCell>
            <Table.HeadCell className="whitespace-nowrap">Trạng thái</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {usersToDisplay.map((user) => (
              <Table.Row
                className="bg-white dark:border-gray-700 dark:bg-gray-800 align-middle"
                key={user.userId}
              >
                <Table.Cell className="py-4"> {new Date(user.createdDate).toLocaleDateString('en-CA')}</Table.Cell>
                <Table.Cell className="py-4 flex items-center">
                  <img
                    src={user.userImage}
                    alt={user.username}
                    className="h-10 w-10 object-cover bg-gray-500 rounded-full"
                  />
                </Table.Cell>
                <Table.Cell>{user.username}</Table.Cell>
                <Table.Cell >{user.email}</Table.Cell>
                <Table.Cell className="text-center">{user.phoneNumber}</Table.Cell>
                <Table.Cell className="text-center">{getRoleName(user.roles)}</Table.Cell>
                <Table.Cell >{user.address}</Table.Cell>
                <Table.Cell  className="text-center">
                <label className="inline-flex items-center mb-5 cursor-pointer">
                    {/* Conditionally render lock or lock-open icon and the label */}
                    <span className="text-2xl  hover:underline cursor-pointer">
                      {user.blocked ? (
                         <TbLock
                         className="inline-block mr-2 text-red-500"
                         onClick={() => handleToggle(user)}
                       />
                     ) : (
                       <TbLockOpen
                         className="inline-block mr-2 text-green-500"
                         onClick={() => handleToggle(user)} />
                      )}
                   </span>
                   <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={user.blocked}
                      onChange={() => handleToggle(user)} // Pass the specific user
                    />
                    <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300"></span>
                  </label>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>

        {/* Pagination Component */}
        <div className="mt-6 flex justify-center">
          <ReactPaginate
           previousLabel={"← Sau"}
           nextLabel={"Trước →"}
            pageCount={pageCount}
            onPageChange={handlePageClick}
            containerClassName={"flex flex-wrap justify-center space-x-2 md:space-x-4"}
            pageLinkClassName={"py-2 px-3 border rounded text-sm"}
            activeClassName={"bg-blue-600 text-white"}
            disabledClassName={"opacity-50 cursor-not-allowed"}
          />
        </div>

        {/* Modal for Block/Unblock */}
        <Modal show={showModal} onClose={handleCancel}>
        <Modal.Header>
          {selectedUser?.blocked ? "Unblock User" : "Block User"}
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
          <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Bán có muốn {selectedUser?.blocked ? "Mở khóa" : "Khóa"}{" "}
              {selectedUser?.username}?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleConfirmBlock}>
                Có
              </Button>
              <Button color="gray" onClick={handleCancel}>
                Không
              </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </main>
  );
}
