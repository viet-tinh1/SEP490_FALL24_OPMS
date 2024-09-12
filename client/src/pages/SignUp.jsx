import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import Imgtree from "../assets/img/tree.png";
import { Link, useNavigate } from "react-router-dom";
import { AiFillGoogleCircle } from "react-icons/ai";

export default function Signup() {
  return (
    //min-h-screen: độ cao màn hình 100%
    <div className="min-h-min mt-10 mb-10">
      <div
        className="flex p-3 max-w-3xl mx-auto flex-col 
        md:items-center md:flex-row gap-4"
        // md:items-center: Khi ở kích thước màn hình md (768px) trở lên, căn giữa các phần tử con theo trục ngang.
        // md:flex-row: Khi ở kích thước màn hình md (768px) trở lên, thay đổi hướng sắp xếp các phần tử con thành chiều ngang (hàng).
      >
        {/*left */}
        <div className="flex-1">
        <img
          src= {Imgtree}
          alt="Project Blog Logo"
          className="w-full h-auto border-2  border-gray-400 rounded-tl-2xl"
          
        />
        </div>
        {/*right */}
        <div className="flex-1">
          <form className="flex flex-col gap-4">
            <div>
              <Label value="Your username" />
              <TextInput type="text" placeholder="Username" id="username" />
            </div>
            <div>
              <Label value="Your email" />
              <TextInput
                type="email"
                placeholder="name@company.com"
                id="email"
              />
            </div>
            <div>
              <Label value="Your password" />
              <TextInput type="password" placeholder="Password" id="password" />
            </div>
            <Button gradientDuoTone="greenToBlue" type="submit">
              Sign Up
            </Button>
            <Button type="button" gradientDuoTone="pinkToOrange" outline>
              <AiFillGoogleCircle className="w-6 h-6 mr-2" />
              Continue with Google
            </Button>
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Have an account ?</span>
            <Link to="/sign-in" className="text-blue-500">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
