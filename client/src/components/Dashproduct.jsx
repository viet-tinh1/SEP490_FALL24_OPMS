import { Modal, Table, Button, TextInput } from "flowbite-react";
import { useState, useEffect } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import { AiOutlineSearch } from "react-icons/ai";
import { MdDelete, MdEdit } from "react-icons/md";
import { Spinner } from "flowbite-react";
import ReactPaginate from "react-paginate";

export default function DashProduct() {
  const [plants, setPlants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [role, setURoles] = useState(null);
  const [loading, setLoading] = useState(true);
  const plantsPerPage = 3;
  const [activeButton, setActiveButton] = useState(1);

 // Reusable function to fetch plants
 const fetchPlants = async () => {
  const userId = localStorage.getItem("userId");
  const storedRoles = localStorage.getItem("role");
  setURoles(storedRoles);
  setActiveButton(1);
  if (!userId || userId === "undefined") {
    console.error("User is not logged in or userId is invalid.");
    setLoading(false);
    return;
  }

  try {
    let response;
    if (storedRoles === '3') {
      response = await fetch(`https://localhost:7098/api/PlantAPI/getPlantByUser?UserId=${userId}`);
    } else if (storedRoles === '1') {
      response = await fetch("https://localhost:7098/api/PlantAPI/getVerifiedPlants");
    }

    if (response && response.ok) {
      const data = await response.json();
      setPlants(data);

      // Fetch categories
      const categoryResponse = await fetch("https://localhost:7098/api/CategoryAPI/getCategory");
      if (!categoryResponse.ok) throw new Error("Failed to fetch categories");
      const categoryData = await categoryResponse.json();
      setCategories(categoryData);
    } else {
      throw new Error("Failed to fetch plants");
    }
  } catch (error) {
    console.error("Error fetching plants:", error);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  
  fetchPlants(); // Call the reusable fetch function in useEffect
}, []);

  // Hàm xử lý sự kiện click của các button
  const handleRoleChange = async (buttonId) => {
    setActiveButton(buttonId);
    if (role === '1') {
      setLoading(true);
      try {
        let response;
        if (buttonId === 1) {
          response = await fetch("https://localhost:7098/api/PlantAPI/getVerifiedPlants");
        } else if (buttonId === 2) {
          response = await fetch("https://localhost:7098/api/PlantAPI/getNonVerifiedPlants");
        }

        if (response && response.ok) {
          const data = await response.json();
          setPlants(data);
          
        } else {
          throw new Error("Failed to fetch plants based on button selection");
        }
      } catch (error) {
        console.error("Error fetching plants:", error);
      } finally {
        setLoading(false);
      }
    }
    
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.categoryId === categoryId);
    return category ? category.categoryName : "Danh mục không xác định";
  };
  const handleDelete = (plant) => {
    setSelectedPlant(plant);
    setShowModal(true);
  };

  const handleEdit = (plant) => {
    console.log("Edit plant", plant);
  };

  const handleConfirmDelete = () => {
    setPlants((prevPlants) =>
      prevPlants.filter((plant) => plant.id !== selectedPlant.id)
    );
    setShowModal(false);
  };

  const handleCancel = () => {
    setShowModal(false);
  };
  // Hàm handleVerify kiểm tra trạng thái isVerified và gọi API thích hợp
  const handleVerify = async (plant) => {
    try {
      let apiUrl;
      if (plant.isVerfied === 1) {
        apiUrl = `https://localhost:7098/api/PlantAPI/updateNonVerifyStatus?plantId=${plant.plantId}`;
      } else {
        apiUrl = `https://localhost:7098/api/PlantAPI/updateVerifyStatus?plantId=${plant.plantId}`;
      }

      // Gọi API
      await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': '*/*',
        },
      });
      await fetchPlants();

      // Cập nhật trạng thái sau khi xác thực/hủy xác thực thành công
      setPlants((prevPlants) =>
        prevPlants.map((p) =>
          p.id === plant.id ? { ...p, isVerified: plant.isVerified === 1 ? 0 : 1 } : p
        )
      );
      setActiveButton(1); 
    } catch (error) {
      console.error('Error updating verify status:', error);
    }
  };
  // Pagination
  const pageCount = Math.ceil(plants.length / plantsPerPage);
  const handlePageClick = ({ selected }) => setCurrentPage(selected);
  const plantsToDisplay = plants.slice(currentPage * plantsPerPage, (currentPage + 1) * plantsPerPage);
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
  return (
    <main className="overflow-x-auto md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      <div className="shadow-md md:mx-auto p-3 rounded-lg bg-white dark:bg-gray-800 my-4">
        <div className="mb-1 w-full">
          <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">All Products</h1>
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
          {role !== '1' && (
          <div className="flex items-center ml-auto space-x-2 sm:space-x-3">
            <Button>Add Product</Button>
          </div>
          )}
           
          </div>
          <br></br>
          {role == '1' && (
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
        Cây đã xác thực
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
        Cây chưa xác thực
      </Button>           
            </div>)}
        </div>
      </div>

      <div className="table-auto">
        <Table hoverable className="shadow-md">
          <Table.Head>          
            <Table.HeadCell>Image</Table.HeadCell>
            <Table.HeadCell>Category</Table.HeadCell>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>Description</Table.HeadCell>
            <Table.HeadCell>Price</Table.HeadCell>
            <Table.HeadCell>Stock</Table.HeadCell>
            <Table.HeadCell>Discount</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
            <Table.HeadCell>Verify</Table.HeadCell>
            <Table.HeadCell className="text-center" >Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {plantsToDisplay.map((plant) => (
              <Table.Row
                className="bg-white dark:border-gray-700 dark:bg-gray-800 align-middle"
                key={plant.id}
              >
                
                <Table.Cell className="py-4 flex items-center">
                  <img
                    src={plant.imageUrl || "https://via.placeholder.com/40"}
                    alt={plant.name}
                    className="h-10 w-10 object-cover bg-gray-500 rounded-full"
                  />
                </Table.Cell>
                <Table.Cell className="py-4">{getCategoryName(plant.categoryId)}</Table.Cell>
                <Table.Cell className="py-4">{plant.plantName}</Table.Cell>
                <Table.Cell className="py-4">{plant.description}</Table.Cell>
                <Table.Cell className="py-4">{(plant.price).toFixed(3)}</Table.Cell>
                <Table.Cell className="py-4">{(plant.stock)}</Table.Cell>
                <Table.Cell className="py-4">{(plant.discount)|| 0}%</Table.Cell>
                <Table.Cell className="py-4">
                    {plant.status === 1 ? "Còn hàng" : "Hết hàng"}
                </Table.Cell>
                <Table.Cell className="py-4">{plant.isVerfied === 1 ? "Đã xác thực" : "Chưa xác thực"}</Table.Cell>
                <Table.Cell className="py-4 flex space-x-2">
                  {role !== '1' ? (
                  <>
                  <MdEdit
                    onClick={() => handleEdit(plant)}
                    style={{ cursor: "pointer", fontSize: "20px", color: "blue" }}
                  />
                  <MdDelete
                    onClick={() => handleDelete(plant)}
                    style={{ cursor: "pointer", fontSize: "20px", color: "red" }}
                  />
                  </>
                  ) : (
                    <Button onClick={() => handleVerify(plant)}
                    className={`py-0.5 px-1 text-xs font-medium rounded-xl whitespace-nowrap text-center text-white 
                      ${plant.isVerfied === 1 ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
                    >
                    {plant.isVerfied === 1 ? (
                    <>
                    <AiOutlineClose className="mr-1 mt-1" /> Hủy xác thực
                    </>
                    ) : (
                    <>
                   <AiOutlineCheck className="mr-1 mt-1" /> Xác thực
                     </>
                    )}
                  </Button>
                  )}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>

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

        <Modal show={showModal} onClose={handleCancel}>
          <Modal.Header>Delete Plant</Modal.Header>
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
              <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
                Are you sure you want to delete {selectedPlant?.name}?
              </h3>
              <div className="flex justify-center gap-4">
                <Button color="failure" onClick={handleConfirmDelete}>Yes</Button>
                <Button color="gray" onClick={handleCancel}>No</Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </main>
  );
}
