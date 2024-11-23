import { Modal, Table, Button, TextInput } from "flowbite-react";
import { useState, useEffect } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import { AiOutlineSearch } from "react-icons/ai";
import { MdDelete, MdEdit } from "react-icons/md";
import { Spinner } from "flowbite-react";
import ReactPaginate from "react-paginate";
import { Link, useLocation, useNavigate } from "react-router-dom";

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
    
      response = await fetch(`https://opms1.runasp.net/api/PlantAPI/getPlantByUser?UserId=${userId}`);
    
      

    if (response && response.ok) {
      const data = await response.json();
      setPlants(data);

      // Fetch categories
      const categoryResponse = await fetch("https://opms1.runasp.net/api/CategoryAPI/getCategory");
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
  

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.categoryId === categoryId);
    return category ? category.categoryName : "Danh mục không xác định";
  };
  const handleDelete = (plant) => {
    setSelectedPlant(plant);
    setShowModal(true);
  };

  

  const handleConfirmDelete = async () => {
    if (!selectedPlant) return;
  
    try {
      // API call to delete the plant
      const response = await fetch(`https://opms1.runasp.net/api/PlantAPI/deletePlant?PlantId=${selectedPlant.plantId}`, {
        method: "GET",
      });
  
      if (response.ok) {
        // If successful, remove the plant from local state
        setPlants((prevPlants) => prevPlants.filter((plant) => plant.id !== selectedPlant.id));
        setShowModal(false);
      } else {
        console.error("Failed to delete plant:", response.statusText);
        // Handle unsuccessful delete (e.g., show an error message)
      }
    } catch (error) {
      console.error("Error deleting plant:", error);
      // Handle fetch error
    }
  };

  const handleCancel = () => {
    setShowModal(false);
  };
  // Hàm handleVerify kiểm tra trạng thái isVerified và gọi API thích hợp
  
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
  ///ui
  return (
    <main className="overflow-x-auto md:mx-auto p-4">
      <div className="shadow-md rounded-lg bg-white dark:bg-gray-800 mb-6 p-4">
        <div className="mb-4">  
        <h1 className="text-2xl font-semibold text-gray-900">Tất cả sản phẩm</h1>
        <div className="flex flex-wrap gap-4 justify-between mt-4">
          
        <form className="flex-grow max-w-xs w-full md:w-1/2">
        <TextInput 
        type="text"
        placeholder="Search..."
        rightIcon={AiOutlineSearch}
        className="hidden lg:inline"
        />
        </form>              
          <Link to="/ProductCreate">
          <Button className="w-full md:w-auto">Thêm sản phẩm</Button>
        </Link>                   
          </div>         
        </div>
      </div>

      <div className="overflow-x-auto w-full shadow-md rounded-lg">
      <Table hoverable className="min-w-full">
      <Table.Head>
      <Table.HeadCell className="w-20">Ảnh</Table.HeadCell>
      <Table.HeadCell className="w-28">Loại</Table.HeadCell>
      <Table.HeadCell className="w-32">Tên</Table.HeadCell>
      <Table.HeadCell className="w-64">Mô tả</Table.HeadCell>
      <Table.HeadCell className="w-20">Giá</Table.HeadCell>
      <Table.HeadCell className="w-20 whitespace-nowrap">Số lượng</Table.HeadCell>
      <Table.HeadCell className="w-20 whitespace-nowrap">Giảm giá</Table.HeadCell>
      <Table.HeadCell className="w-28 whitespace-nowrap">Trạng thái</Table.HeadCell>
      <Table.HeadCell className="w-28 whitespace-nowrap">Xác thực</Table.HeadCell>
      <Table.HeadCell className="w-32 whitespace-nowrap">Sửa/Xóa</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {plantsToDisplay.map((plant) => {
              return (
              <Table.Row
                className="bg-white dark:border-gray-700 dark:bg-gray-800 align-middle"
                key={plant.plantId}
              >
                
                <Table.Cell className="py-4 flex items-center">
                  <img
                    src={plant.imageUrl || "https://via.placeholder.com/40"}
                    alt={plant.name}
                    className="h-10 w-10 object-cover bg-gray-500 rounded-full"
                  />
                </Table.Cell>
                <Table.Cell className="p-4">{getCategoryName(plant.categoryId)}</Table.Cell>
                <Table.Cell className="p-4">{plant.plantName}</Table.Cell>
                <Table.Cell className="p-4 line-clamp-2" dangerouslySetInnerHTML={{ __html: plant.description }} />
                <Table.Cell className="p-4 text-center">{(plant.price).toFixed(3)}</Table.Cell>
                <Table.Cell className="p-4 text-center">{(plant.stock)}</Table.Cell>
                <Table.Cell className="p-4 text-center">{(plant.discount)|| 0}%</Table.Cell>
                <Table.Cell className="p-4 text-center">
                    {plant.status === 1 ? "Còn hàng" : "Hết hàng"}
                </Table.Cell>
                <Table.Cell className="p-4 text-center">{plant.isVerfied === 1 ? "Đã xác thực" : "Chưa xác thực"}</Table.Cell>
                <Table.Cell className="py-4 flex space-x-2">                 
                  <>
                   <Link to={`/ProductEdit/${plant.plantId}`}>
                    <MdEdit className="cursor-pointer text-green-600" size={20} />
                  </Link>
                  <MdDelete
                    onClick={() => handleDelete(plant)}
                    className="cursor-pointer text-red-600"
                    size={20}
                  />
                  </>                                       
                </Table.Cell>
              </Table.Row>
            )}
            )}
          </Table.Body>   
        </Table>
        </div>
        <div className="mt-4">
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
        <Modal show={showModal} onClose={handleCancel}>
        <Modal.Header>Xóa sản phẩm</Modal.Header>
          <Modal.Body>
            <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 mb-4 mx-auto" />
              <h3 className="mb-5 text-lg text-gray-500">
              Bạn có chắc chắn muốn xóa sản phẩm {selectedPlant}?
              </h3>
              <div className="flex justify-center space-x-4 mt-4">
                <Button color="failure" onClick={handleConfirmDelete}>Có</Button>
                <Button color="gray" onClick={handleCancel}>Không</Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>     
    </main>
  );
}
