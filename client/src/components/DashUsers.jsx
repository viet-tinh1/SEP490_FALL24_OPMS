import { Modal, Table, Button } from "flowbite-react";
import { useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { TbLock, TbLockOpen } from "react-icons/tb";
import { TextInput } from "flowbite-react";
import { AiOutlineSearch } from "react-icons/ai";
import ReactPaginate from "react-paginate";

export default function DashUsers() {
  const [users, setUsers] = useState([
    {
      id: 1,
      dateCreated: "2023-09-01",
      userImage: "https://via.placeholder.com/40",
      username: "john_doe",
      email: "john@example.com",
      phoneNumber: "0905760628",
      roles: "User",
      fullName: "John Doe",
      address: "113,Huỳnh thúc kháng",
      blocked: false,
    },
    // Add more users as needed...
  ]);

  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const usersPerPage = 3;

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

  const handleCancel = () => setShowModal(false);

  const pageCount = Math.ceil(users.length / usersPerPage);
  const handlePageClick = ({ selected }) => setCurrentPage(selected);

  const usersToDisplay = users.slice(
    currentPage * usersPerPage,
    (currentPage + 1) * usersPerPage
  );

   {/* active button */}
  const [activeButton, setActiveButton] = useState(null);

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };

  return (
    <main className="overflow-x-auto md:mx-auto p-4">
      {/* Header Section */}
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
                className="w-full"
              />
            </form>
          </div>
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0 mt-4">
          <button
        onClick={() => handleButtonClick('nguoi-dung')}
        className={`px-5 py-2 rounded-md font-medium  ${
          activeButton === 'nguoi-dung' 
            ? 'bg-green-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        Người dùng
      </button>

      <button
        onClick={() => handleButtonClick('nguoi-ban')}
        className={`px-5 py-2 rounded-md font-medium ${
          activeButton === 'nguoi-ban' 
            ? 'bg-green-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        Người bán
      </button>

      <button
        onClick={() => handleButtonClick('quan-tri-vien')}
        className={`px-5 py-2 rounded-md font-medium ${
          activeButton === 'quan-tri-vien' 
            ? "bg-green-600 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        Quản trị viên
      </button>
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
            <Table.HeadCell className="whitespace-nowrap">
              Chức vụ
            </Table.HeadCell>
            <Table.HeadCell className="whitespace-nowrap">
              Địa chỉ
            </Table.HeadCell>
            <Table.HeadCell className="whitespace-nowrap">
              Trạng thái
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {usersToDisplay.map((user) => (
              <Table.Row key={user.id} className="align-middle">
                <Table.Cell>{user.dateCreated}</Table.Cell>
                <Table.Cell className="p-4 flex items-center justify-center">
                  <img
                    src={user.userImage}
                    alt={user.username}
                    className="h-10 w-10 object-cover bg-gray-500 rounded-full"
                  />
                </Table.Cell>
                <Table.Cell>{user.username}</Table.Cell>
                <Table.Cell>{user.email}</Table.Cell>
                <Table.Cell className="text-center">
                  {user.phoneNumber}
                </Table.Cell>
                <Table.Cell className="text-center">{user.roles}</Table.Cell>
                <Table.Cell>{user.address}</Table.Cell>
                <Table.Cell className="text-center">
                  {user.blocked ? (
                    <TbLock
                      className="text-red-500 text-2xl cursor-pointer hover:text-red-700"
                      onClick={() => handleToggle(user)}
                    />
                  ) : (
                    <TbLockOpen
                      className="text-green-500 text-2xl cursor-pointer hover:text-green-700"
                      onClick={() => handleToggle(user)}
                    />
                  )}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>

      <div className="mt-6 flex justify-center">
        <ReactPaginate
          previousLabel={"← Sau"}
          nextLabel={"Trước →"}
          pageCount={pageCount}
          onPageChange={handlePageClick}
          containerClassName={
            "flex flex-wrap justify-center space-x-2 md:space-x-4"
          }
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
    </main>
  );
}
