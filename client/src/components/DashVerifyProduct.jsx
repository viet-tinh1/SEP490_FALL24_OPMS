import { Modal, Table, Button } from "flowbite-react";
import { useState, useEffect } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import ReactPaginate from "react-paginate";
import { TextInput } from "flowbite-react";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Spinner } from "flowbite-react";

export default function DashVerifyProduct() {
  const [role, setURoles] = useState(null);
  const [plants, setPlants] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [activeButton, setActiveButton] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const plantsPerPage = 3;

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
      if (storedRoles === '1') {
        response = await fetch("https://opms1.runasp.net/api/PlantAPI/getVerifiedPlants");
      }

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


  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };
  const handleRoleChange = async (buttonId) => {
    setCurrentPage(0);
    setActiveButton(buttonId);
    if (role === '1') {
      setLoading(true);
      try {
        let response;
        if (buttonId === 1) {
          response = await fetch("https://opms1.runasp.net/api/PlantAPI/getVerifiedPlants");
        } else if (buttonId === 2) {
          response = await fetch("https://opms1.runasp.net/api/PlantAPI/getNonVerifiedPlants");
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
  const toggleVerifyStatus = (productId) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId
          ? {
            ...product,
            verify:
              product.verify === "Verified" ? "Not Verified" : "Verified",
          }
          : product
      )
    );
    setShowModal(false);
  };
  const handleVerify = async (plant) => {
    try {
      let apiUrl;
      if (plant.isVerfied === 1) {
        apiUrl = `https://opms1.runasp.net/api/PlantAPI/updateNonVerifyStatus?plantId=${plant.plantId}`;
      } else {
        apiUrl = `https://opms1.runasp.net/api/PlantAPI/updateVerifyStatus?plantId=${plant.plantId}`;
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
  const handleCancel = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const handleConfirmDelete = () => {
    if (selectedProduct) {
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== selectedProduct.id)
      );
      setShowModal(false);
      setSelectedProduct(null);
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
          <span className="mt-3 text-lg font-semibold">Đang tải...</span>
        </div>
      </div>
    );
  }
  return (
    <main className="overflow-x-auto md:mx-auto p-4">
      <div className="shadow-md rounded-lg bg-white dark:bg-gray-800 mb-6 p-6 lg:p-2">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">
            Duyệt sản phẩm
          </h1>
          <div className="flex justify-between items-center mb-6">
            <form className="flex-grow max-w-xs">
              <TextInput
                type="text"
                placeholder="Tìm kiếm  ..."
                rightIcon={AiOutlineSearch}
                className="hidden lg:inline w-full"
              />
            </form>
          </div>
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0 mt-4">
            <button
              id="1"
              onClick={() => handleRoleChange(1)}
              className={`px-5 py-2 rounded-md font-medium  ${activeButton === 1
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}>
              Sản phẩm đã duyệt
            </button>


            <button
              id="2"
              onClick={() => handleRoleChange(2)}
              className={`px-5 py-2 rounded-md font-medium ${activeButton === 2
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
            >
              Sản phẩm chưa duyệt
            </button>
          </div>
        </div>
      </div>
      {/* bảng */}
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
            <Table.HeadCell className="w-32 whitespace-nowrap">Hành động</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {plantsToDisplay.map((plant) => {
              return (
                <Table.Row
                  className="bg-white dark:border-gray-700 dark:bg-gray-800 align-middle"
                  key={plant.plantId}
                >
                  <Table.Cell className="p-4 flex items-center justify-center">
                    <img
                      src={plant.imageUrl || "https://via.placeholder.com/40"}
                      alt={plant.name}
                      className="h-10 w-10 object-cover bg-gray-500 rounded-full"
                    />
                  </Table.Cell>
                  <Table.Cell className="p-4">{getCategoryName(plant.categoryId)}</Table.Cell>
                  <Table.Cell className="p-4">{plant.plantName}</Table.Cell>
                  <Table.Cell className="p-4 line-clamp-2" dangerouslySetInnerHTML={{ __html: plant.description }} />
                  <Table.Cell className="p-4 text-center">{plant.price.toFixed(3)}</Table.Cell>
                  <Table.Cell className="p-4 text-center">{plant.stock}</Table.Cell>
                  <Table.Cell className="p-4 text-center">{plant.discount || 0}%</Table.Cell>
                  <Table.Cell className="p-4 text-center">{plant.status === 1 ? "Còn hàng" : "Hết hàng"}</Table.Cell>
                  <Table.Cell className="p-4 text-center">{plant.isVerfied === 1 ? "Đã xác thực" : "Chưa xác thực"}</Table.Cell>
                  <Table.Cell className="py-4 flex space-x-2">
                    <Button
                      onClick={() => handleVerify(plant)}
                      className={
                        plant.isVerfied === 1
                          ? "bg-red-600 py-0.5 px-1 text-xs font-medium rounded-xl text-white hover:bg-red-700"
                          : "bg-green-600 py-0.5 px-1 text-xs font-medium rounded-xl text-white hover:bg-green-700"
                      }
                    >
                      {plant.isVerfied === 1 ? (
                        <AiOutlineClose className="text-white" />
                      ) : (
                        <AiOutlineCheck className="text-white" />
                      )}
                    </Button>
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </div>


      <div className="mt-6 flex justify-center">
        <ReactPaginate
          previousLabel={"← Sau"}
          nextLabel={"Trước →"}
          pageCount={pageCount > 0 ? pageCount : 1}
          onPageChange={handlePageClick}
          forcePage={pageCount > 0 ? currentPage : 0}
          containerClassName={
            "flex flex-wrap justify-center space-x-2 md:space-x-4"
          }
          pageLinkClassName={"py-2 px-4 border rounded"}
          activeClassName={"bg-blue-600 text-white"}
          disabledClassName={"opacity-50 cursor-not-allowed"}
        />
      </div>

      <Modal show={showModal} onClose={handleCancel}>
        <Modal.Header>Delete Product</Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500">
              Are you sure you want to delete {selectedProduct?.name}?
            </h3>
            <div className="flex justify-center gap-4 mt-6">
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
    </main>

  );
}
