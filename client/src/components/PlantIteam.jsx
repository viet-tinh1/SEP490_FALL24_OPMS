import { Link } from "react-router-dom";
import { PiShoppingCartLight } from "react-icons/pi";
import { useState } from "react";

export default function PlantIteam() {
  const products =[
    {
      id: 1,
      name: "2023-09-01",
      productImage:
        "https://firebasestorage.googleapis.com/v0/b/project-team-7-blog.appspot.com/o/459575711_945200750961543_4220295711316204168_n.jpg?alt=media&token=d3c1e587-ca9f-46b5-a9ef-62de57ae0aea",
      price: "25.000",
      discount: "50%",
      rating: "4.5",
    },
    {
      id: 2,
      name: "2023-09-01",
      productImage:
        "https://firebasestorage.googleapis.com/v0/b/project-team-7-blog.appspot.com/o/459575711_945200750961543_4220295711316204168_n.jpg?alt=media&token=d3c1e587-ca9f-46b5-a9ef-62de57ae0aea",
      price: "25.000",
      discount: "50%",
      rating: "4.5",
    },
    {
      id: 3,
      name: "2023-09-01",
      productImage:
        "https://firebasestorage.googleapis.com/v0/b/project-team-7-blog.appspot.com/o/459575711_945200750961543_4220295711316204168_n.jpg?alt=media&token=d3c1e587-ca9f-46b5-a9ef-62de57ae0aea",
      price: "25.000",
      discount: "50%",
      rating: "4.5",
    },
    {
      id: 4,
      name: "2023-09-01",
      productImage:
        "https://firebasestorage.googleapis.com/v0/b/project-team-7-blog.appspot.com/o/459575711_945200750961543_4220295711316204168_n.jpg?alt=media&token=d3c1e587-ca9f-46b5-a9ef-62de57ae0aea",
      price: "25.000",
      discount: "50%",
      rating: "4.5",
    },
    {
      id: 5,
      name: "2023-09-01",
      productImage:
        "https://firebasestorage.googleapis.com/v0/b/project-team-7-blog.appspot.com/o/459575711_945200750961543_4220295711316204168_n.jpg?alt=media&token=d3c1e587-ca9f-46b5-a9ef-62de57ae0aea",
      price: "25.000",
      discount: "50%",
      rating: "4.5",
    },
    {
      id: 6,
      name: "2023-09-01",
      productImage:
        "https://firebasestorage.googleapis.com/v0/b/project-team-7-blog.appspot.com/o/459575711_945200750961543_4220295711316204168_n.jpg?alt=media&token=d3c1e587-ca9f-46b5-a9ef-62de57ae0aea",
      price: "25.000",
      discount: "50%",
      rating: "4.5",
    },
    {
      id: 7,
      name: "2023-09-01",
      productImage:
        "https://firebasestorage.googleapis.com/v0/b/project-team-7-blog.appspot.com/o/459575711_945200750961543_4220295711316204168_n.jpg?alt=media&token=d3c1e587-ca9f-46b5-a9ef-62de57ae0aea",
      price: "25.000",
      discount: "50%",
      rating: "4.5",
    },
    {
      id: 8,
      name: "2023-09-01",
      productImage:
        "https://firebasestorage.googleapis.com/v0/b/project-team-7-blog.appspot.com/o/459575711_945200750961543_4220295711316204168_n.jpg?alt=media&token=d3c1e587-ca9f-46b5-a9ef-62de57ae0aea",
      price: "25.000",
      discount: "50%",
      rating: "4.5",
    },
    {
      id: 9,
      name: "2023-09-01",
      productImage:
        "https://firebasestorage.googleapis.com/v0/b/project-team-7-blog.appspot.com/o/459575711_945200750961543_4220295711316204168_n.jpg?alt=media&token=d3c1e587-ca9f-46b5-a9ef-62de57ae0aea",
      price: "25.000",
      discount: "50%",
      rating: "4.5",
    },
    {
      id: 10,
      name: "2023-09-01",
      productImage:
        "https://firebasestorage.googleapis.com/v0/b/project-team-7-blog.appspot.com/o/459575711_945200750961543_4220295711316204168_n.jpg?alt=media&token=d3c1e587-ca9f-46b5-a9ef-62de57ae0aea",
      price: "25.000",
      discount: "50%",
      rating: "4.5",
    },
  ];

  
  return (
    <div className="flex flex-wrap justify-center gap-3 p-5">
      {/*Card1*/}

      {products.map((product)=> 
      (<div key={product.id} className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[200px] h-auto">
        <Link>
          <div className="relative p-2.5overflow-hidden rounded-xl bg-clip-border">
            <img
              src={
                "https://firebasestorage.googleapis.com/v0/b/project-team-7-blog.appspot.com/o/459575711_945200750961543_4220295711316204168_n.jpg?alt=media&token=d3c1e587-ca9f-46b5-a9ef-62de57ae0aea"
              }
              alt="listing cover"
              className="w-[175px] h-[200px]  object-cover rounded-md hover:scale-105 transition-scale duration-300 mx-auto"
            />
          </div>

          <div className="p-2 flex flex-col gap-2 w-full">
            <p className="truncate text-md font-semibold text-slate-700">
              Haewon
            </p>

            <div className="flex items-center gap-1">
              <p className="text-sm text-gray-600 line-clamp-2 w-full">
                Cây trầu bà - trầu bà đế vương đỏ cao 50-60cm cây phong thủy sức
                sống khỏe cây nội thất trồng để bàn và ban công
              </p>
            </div>

            {/*<p className="text-sm text-gray-600 line-clamp-2">
              đỏ cao 50-60cm cây phong thủy sức sống khỏe cây nội thất trồng để
              bàn và ban công
            </p>*/}
          </div>
          <div className="p-2 flex items-center">
            <svg
              className="h-4 w-4 text-yellow-300"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="ml-2 rounded bg-cyan-100 px-2 py-0.5 text-xs font-semibold text-cyan-800 dark:bg-cyan-200 dark:text-cyan-800">
              4.5
            </span>
          </div>
          {/*Price*/}
          <div className="p-2 flex items-center justify-between">
            <div className="truncate flex items-baseline text-red-600">
              <span className="text-xs font-medium mr-px space-y-14">₫</span>
              <span className="font-medium text-xl truncate">25.000</span>
              <span className="text-xs space-y-14 font-medium mr-px"></span>
            </div>
            {/*discount*/}
            <div className=" rounded bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-800 dark:bg-red-200 dark:text-red-800">
              <span className="aria-label=-50%">-50%</span>
            </div>

            <a
              href="#"
              className="rounded-lg bg-cyan-700 px-4 py-2 text-center text-sm font-medium text-white hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
            >
              <PiShoppingCartLight />
            </a>
          </div>
        </Link>
      </div>
        
      )
      
      )}
      
    </div>
  );
}
