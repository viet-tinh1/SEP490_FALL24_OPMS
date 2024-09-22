import { Sidebar } from "flowbite-react";
import { TbShoppingBagSearch } from "react-icons/tb";
import PlantIteam from "../components/PlantIteam";

export default function Product() {
  const flowers = [
    { name: "Cây hoa hồng", quantity: "450k+" },
    { name: "Hoa cúc", quantity: "320k+" },
    { name: "Cây bàng", quantity: "150k+" },
    { name: "Hoa lan", quantity: "250k+" },
  ];

  return (
    <main>
      <div className="flex flex-col md:flex-row">
        <div className="md:w-56">
          <Sidebar className="w-full md:w-56">
            <Sidebar.Items>
              <Sidebar.ItemGroup>
                <Sidebar.Item icon={TbShoppingBagSearch} as="div">
                  Search by category
                </Sidebar.Item>

                {/* Hiển thị danh sách loại hoa và số lượng */}
                <ul className="ml-6 mt-2 space-y-2">
                  {flowers.map((flower, index) => (
                    <li key={index} className="flex items-center justify-between">
                      {/* Checkbox bên trái */}
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="form-checkbox h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        />
                        <span>{flower.name}</span>
                      </div>

                      {/* Số lượng hoa */}
                      <span className=" text-sm	text-gray-500">({flower.quantity})</span>
                    </li>
                  ))}
                </ul>
              </Sidebar.ItemGroup>
            </Sidebar.Items>
          </Sidebar>
        </div>
        
        <div className="flex flex-wrap gap-4">
            <PlantIteam />
          </div>



      </div>
      
    </main>
  );
}
