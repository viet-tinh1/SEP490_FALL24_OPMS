import { Modal, Table, Button } from "flowbite-react";
import { useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { TbLock, TbLockOpen } from "react-icons/tb"; // Import the lock icons
import { TextInput } from "flowbite-react";
import { AiOutlineSearch } from "react-icons/ai";
import ReactPaginate from "react-paginate"; // Import the pagination library

export default function DashComments() {
  const [users, setUsers] = useState([
    {
      id: 1,
      dateCreated: "2023-09-01",
      userImage: "https://via.placeholder.com/40",
      username: "john_doe",
      email: "john@example.com",
      phoneNumber: "123-456-7890", // New phone number field
      roles: "User", // New roles field
      fullName: "John Doe", // New full name field
      address: "123 Main St, Springfield", // New address field
      blocked: false, // Blocked state
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
      blocked: false,
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
      blocked: false,
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
      blocked: false,
    },
    // Additional users...
  ]);

  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); // Store selected user
  const [currentPage, setCurrentPage] = useState(0); // Track current page
  const usersPerPage = 3; // Limit the number of users per page


  const handleToggle = (user) => {
    setSelectedUser(user); // Set the current user
    setShowModal(true); // Show the modal
  };

  const handleConfirmBlock = () => {
    // Update the blocked state of the selected user
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === selectedUser.id ? { ...user, blocked: !user.blocked } : user
      )
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
      {/*overflow-x-auto :Hide scroll*/}
      {/*overflow-x-scroll : Open scroll*/}
      <div className="shadow-md md:mx-auto p-3  rounded-lg bg-white dark:bg-gray-800 my-4">
        <div className="mb-1 w-full">
          <div className=" mb-4">
            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">All Comments</h1>
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
            
            </div>
          </div>
        </div>
      </div>

      <div className="table-auto ">
        <Table hoverable className="shadow-md">
          <Table.Head>
            <Table.HeadCell>DateCreated</Table.HeadCell>
            <Table.HeadCell>Imgage</Table.HeadCell>{" "}
            {/* New Full Name Column */}
            <Table.HeadCell>Username</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell>PhoneNumber</Table.HeadCell>{" "}
            {/* New Phone Column */}
            <Table.HeadCell>Roles</Table.HeadCell> {/* New Roles Column */}
            <Table.HeadCell>Address</Table.HeadCell> {/* New Address Column */}
            <Table.HeadCell>Status</Table.HeadCell>
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
                <Table.Cell className="py-4">
                  {user.phoneNumber}
                </Table.Cell>{" "}
                {/* Phone Number */}
                <Table.Cell className="py-4">{user.roles}</Table.Cell>{" "}
                {/* Roles */}
                <Table.Cell className="py-4">{user.address}</Table.Cell>{" "}
                {/* Address */}
                <Table.Cell>
                  <label className="inline-flex items-center mb-5 cursor-pointer">
                    {/* Conditionally render lock or lock-open icon and the label */}
                    <span className="text-2xl  hover:underline cursor-pointer">
                      {user.blocked ? (
                        <>
                          <TbLock className="inline-block mr-2 text-red-500" />
                        </>
                      ) : (
                        <>
                          <TbLockOpen className="inline-block mr-2 text-green-500" />
                        </>
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

        {/* Modal for Block/Unblock */}
        <Modal show={showModal} onClose={handleCancel}>
          <Modal.Header>
            {selectedUser?.blocked ? "Unblock User" : "Block User"}
          </Modal.Header>
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
              <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
                Are you sure you want to{" "}
                {selectedUser?.blocked ? "Unblock" : "Block"}{" "}
                {selectedUser?.username}?
              </h3>
              <div className="flex justify-center gap-4">
                <Button color="failure" onClick={handleConfirmBlock}>
                  Yes
                </Button>
                <Button color="gray" onClick={handleCancel}>
                  No..
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </main>
  );
}
