import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";
import { PiShoppingCartLight } from "react-icons/pi";

export default function PlantIteam() {
  return (
    <div className="flex flex-wrap justify-center gap-3 p-5">
      {/*Card1*/}
      <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[200px] h-auto">
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
              <p className="text-sm text-gray-600 truncate w-full">
                Cây trầu bà - trầu bà đế vương{" "}
              </p>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">
              đỏ cao 50-60cm cây phong thủy sức sống khỏe cây nội thất trồng để
              bàn và ban công
            </p>
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

      {/*Card1*/}
      <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[200px] h-auto">
        <Link>
          <div className="relative p-2.5overflow-hidden rounded-xl bg-clip-border">
            <img
              src={
                "https://firebasestorage.googleapis.com/v0/b/project-team-7-blog.appspot.com/o/459953972_945200760961542_8335195952693700393_n.jpg?alt=media&token=bd481dff-9366-4698-b8f9-a44c355d4171"
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

      {/*Card1*/}
      <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[200px] h-auto">
        <Link>
          <div className="relative p-2.5overflow-hidden rounded-xl bg-clip-border">
            <img
              src={
                "https://firebasestorage.googleapis.com/v0/b/project-team-7-blog.appspot.com/o/459957250_945559047592380_454316207498637840_n.jpg?alt=media&token=bab841bd-f7ab-41e0-88bc-8446deb028d6"
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

      {/*Card1*/}
      <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[200px] h-auto">
        <Link>
          <div className="relative p-2.5overflow-hidden rounded-xl bg-clip-border">
            <img
              src={
                "https://firebasestorage.googleapis.com/v0/b/project-team-7-blog.appspot.com/o/459961017_945559084259043_1391218507100705803_n.jpg?alt=media&token=8b7ca0ed-7b94-4a38-a6e6-525d70b3b374"
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

      {/*Card1*/}
      <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[200px] h-auto">
        <Link>
          <div className="relative p-2.5overflow-hidden rounded-xl bg-clip-border">
            <img
              src={
                "https://firebasestorage.googleapis.com/v0/b/project-team-7-blog.appspot.com/o/460197383_945200960961522_439113641349882904_n.jpg?alt=media&token=4847575a-95b2-41db-8d95-2f9f445cc52e"
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
      {/*Card1*/}
      <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[200px] h-auto">
        <Link>
          <div className="relative p-2.5overflow-hidden rounded-xl bg-clip-border">
            <img
              src={
                "https://firebasestorage.googleapis.com/v0/b/project-team-7-blog.appspot.com/o/460199978_945559070925711_8409889547864870558_n.jpg?alt=media&token=74246dab-2028-404c-b008-fde03fad54be"
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
      {/*Card1*/}
      <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[200px] h-auto">
        <Link>
          <div className="relative p-2.5overflow-hidden rounded-xl bg-clip-border">
            <img
              src={
                "https://firebasestorage.googleapis.com/v0/b/project-team-7-blog.appspot.com/o/460295849_945559117592373_644606806198542393_n.jpg?alt=media&token=808b7369-362d-4604-8f72-53a64cda6c9d"
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
      {/*Card1*/}
      <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[200px] h-auto">
        <Link>
          <div className="relative p-2.5overflow-hidden rounded-xl bg-clip-border">
            <img
              src={
                "https://firebasestorage.googleapis.com/v0/b/project-team-7-blog.appspot.com/o/460349073_945200907628194_3592993738140052944_n.jpg?alt=media&token=136ac79c-ac03-4038-95f1-f2900000afb6"
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
      {/*Card1*/}
      <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[200px] h-auto">
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
      {/*Card1*/}
      <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[200px] h-auto">
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
