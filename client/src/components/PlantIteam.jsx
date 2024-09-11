import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";
import { PiShoppingCartLight } from "react-icons/pi";

export default function PlantIteam() {
  return (
    <div className="flex flex-wrap justify-center gap-4 p-5">
      {/*card_1*/}
      <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[250px]">
        <Link>
          <img
            src={
              "https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg"
            }
            alt="listing cover"
            className="h-[200px] sm:h-[150px] w-full object-cover hover:scale-105 transition-scale duration-300"
          />
          <div className="p-2 flex flex-col gap-2 w-full">
            <p className="truncate text-md font-semibold text-slate-700">
              Plant 1
            </p>
            <div className="flex items-center gap-1">
              <MdLocationOn className="h-4 w-4 text-green-700" />
              <p className="text-sm text-gray-600 truncate w-full">address</p>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">description</p>
          </div>

          <div className="p-2 flex items-center">
            {/* review */}
            <svg
              className="h-4 w-4 text-yellow-300"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <svg
              className="h-4 w-4 text-yellow-300"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="ml-2 rounded bg-cyan-100 px-2 py-0.5 text-xs font-semibold text-cyan-800 dark:bg-cyan-200 dark:text-cyan-800">
              5.0
            </span>
          </div>

          {/* Price and button */}
          <div className="p-2 flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              $599
            </span>
            <a
              href="#"
              className="rounded-lg bg-yellow-300 px-4 py-2 text-center text-sm font-medium text-white hover:bg-yellow-400 focus:outline-none focus:ring-4 focus:ring-yellow-200 dark:bg-yellow-300 dark:hover:bg-yellow-400 dark:focus:ring-yellow-500"


            >
              <PiShoppingCartLight />
            </a>
          </div>
        </Link>
      </div>

      {/* Card 2 */}
      <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[250px]">
        <Link>
          <img
            src={
              "https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg"
            }
            alt="listing cover"
            className="h-[200px] sm:h-[150px] w-full object-cover hover:scale-105 transition-scale duration-300"
          />
          <div className="p-2 flex flex-col gap-2 w-full">
            <p className="truncate text-md font-semibold text-slate-700">
              Plant 2
            </p>
            <div className="flex items-center gap-1">
              <MdLocationOn className="h-4 w-4 text-green-700" />
              <p className="text-sm text-gray-600 truncate w-full">Address 2</p>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">Description 2</p>
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
          <div className="p-2 flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              $499
            </span>
            <a
              href="#"
              className="rounded-lg bg-cyan-700 px-4 py-2 text-center text-sm font-medium text-white hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
            >
              <PiShoppingCartLight />
            </a>
          </div>
        </Link>
      </div>
    </div>
  );
}
