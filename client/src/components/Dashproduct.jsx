import { Modal, Table, Button } from "flowbite-react";
import { useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { AiOutlineSearch } from "react-icons/ai";
import { MdDelete, MdEdit } from "react-icons/md"; // Import delete and edit icons
import ReactPaginate from "react-paginate"; // Import the pagination library
import { TextInput } from "flowbite-react";

export default function Dashproduct() {
  const [users, setUsers] = useState([
    {
      id: 1,
      dateCreated: "2023-09-01",
      userImage: "https://via.placeholder.com/40",
      username: "john_doe",
      email: "john@example.com",
      phoneNumber: "123-456-7890",
      roles: "User",
      fullName: "John Doe",
      address: "123 Main St, Springfield",
    },
    {
      id: 2,
      dateCreated: "2023-09-02",
      userImage: "https://via.placeholder.com/40",
      username: "jane_smith",
      email: "jane@example.com",
      phoneNumber: "987-654-3210",
      roles: "Admin",
      fullName: "Jane Smith",
      address: "456 Elm St, Shelbyville",
    },
    {
      id: 3,
      dateCreated: "2023-09-03",
      userImage: "https://via.placeholder.com/40",
      username: "samuel_lee",
      email: "samuel@example.com",
      phoneNumber: "555-123-4567",
      roles: "Seller",
      fullName: "Samuel Lee",
      address: "789 Oak St, Ogdenville",
    },
    {
      id: 4,
      dateCreated: "2023-09-04",
      userImage: "https://via.placeholder.com/40",
      username: "linda_jones",
      email: "linda@example.com",
      phoneNumber: "111-222-3333",
      roles: "User",
      fullName: "Linda Jones",
      address: "555 Pine St, Springfield",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); // Store selected user
  const [currentPage, setCurrentPage] = useState(0); // Track current page
  const usersPerPage = 3; // Limit the number of users per page

  const handleDelete = (user) => {
    setSelectedUser(user); // Set the current user
    setShowModal(true); // Show the modal for deletion
  };

  const handleEdit = (user) => {
    // Logic for editing user (can show a form or redirect to another page)
    console.log("Edit user", user);
  };

  const handleConfirmDelete = () => {
    // Remove the selected user
    setUsers((prevUsers) =>
      prevUsers.filter((user) => user.id !== selectedUser.id)
    );
    setShowModal(false); // Close the modal
  };

  const handleCancel = () => {
    setShowModal(false); // Close the modal without making changes
  };

  // Pagination: Calculate the number of pages
  const pageCount = Math.ceil(users.length / usersPerPage);

  // Handle page click
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  // Get users to display on the current page
  const usersToDisplay = users.slice(
    currentPage * usersPerPage,
    (currentPage + 1) * usersPerPage
  );

  return (
    <main className="overflow-x-auto md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      <div className="shadow-md md:mx-auto p-3 rounded-lg bg-white dark:bg-gray-800 my-4">
        <div className="mb-1 w-full">
          <div className="mb-4">
            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
              All Products
            </h1>
            <div className="sm:flex">
              <div className="hidden items-center mb-3 sm:flex sm:divide-x sm:divide-gray-100 sm:mb-0">
                <form>
                  <TextInput
                    type="text"
                    placeholder="Search..."
                    rightIcon={AiOutlineSearch}
                    className="hidden lg:inline"
                  />
                </form>
              </div>
              <div className="flex items-center ml-auto space-x-2 sm:space-x-3">
                <Button>Add Product</Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="table-auto ">
        <Table hoverable className="shadow-md">
          <Table.Head>
            <Table.HeadCell>Date Created</Table.HeadCell>
            <Table.HeadCell>Image</Table.HeadCell>
            <Table.HeadCell>Username</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell>Phone Number</Table.HeadCell>
            <Table.HeadCell>Roles</Table.HeadCell>
            <Table.HeadCell>Address</Table.HeadCell>
            <Table.HeadCell>Edit / Delete</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {usersToDisplay.map((user) => (
              <Table.Row
                className="bg-white dark:border-gray-700 dark:bg-gray-800 align-middle"
                key={user.id}
              >
                <Table.Cell className="py-4">{user.dateCreated}</Table.Cell>
                <Table.Cell className="py-4 flex items-center">
                  <img
                    src={user.userImage}
                    alt={user.username}
                    className="h-10 w-10 object-cover bg-gray-500 rounded-full"
                  />
                </Table.Cell>
                <Table.Cell className="py-4">{user.username}</Table.Cell>
                <Table.Cell className="py-4">{user.email}</Table.Cell>
                <Table.Cell className="py-4">{user.phoneNumber}</Table.Cell>
                <Table.Cell className="py-4">{user.roles}</Table.Cell>
                <Table.Cell className="py-4">{user.address}</Table.Cell>
                <Table.Cell className="py-4 flex space-x-2">
                  {/* Edit Icon */}
                  <span
                    onClick={() => handleEdit(user)}
                    style={{
                      cursor: "pointer",
                      fontSize: "20px",
                      color: "blue",
                    }}
                  >
                    <MdEdit className="mr-2" />
                  </span>

                  {/* Delete Icon */}
                  <span
                    onClick={() => handleDelete(user)}
                    style={{
                      cursor: "pointer",
                      fontSize: "20px",
                      color: "red",
                    }}
                  >
                    <MdDelete className="mr-2" />
                  </span>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>

        {/* Pagination Component */}
        <div className="mt-4">
          <ReactPaginate
            previousLabel={"← Previous"}
            nextLabel={"Next →"}
            pageCount={pageCount}
            onPageChange={handlePageClick}
            containerClassName={"flex justify-center space-x-4"}
            pageLinkClassName={"py-2 px-4 border rounded"}
            activeClassName={"bg-blue-600 text-white"}
            disabledClassName={"opacity-50 cursor-not-allowed"}
          />
        </div>

        {/* Modal for Delete Confirmation */}
        <Modal show={showModal} onClose={handleCancel}>
          <Modal.Header>Delete User</Modal.Header>
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
              <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
                Are you sure you want to delete {selectedUser?.username}?
              </h3>
              <div className="flex justify-center gap-4">
                <Button color="failure" onClick={handleConfirmDelete}>
                  Yes
                </Button>
                <Button color="gray" onClick={handleCancel}>
                  No
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </main>
  );
}
