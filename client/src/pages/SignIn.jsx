import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { AiFillGoogleCircle } from "react-icons/ai";
import Imgtree from "../assets/img/tree.png";
export default function SignIn() {
  return (
    <div className="min-h-min mt-10 mb-10">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left */}
        <div className="flex-1">
        <img
          src= {Imgtree}
          alt="Project Blog Logo"
          className="w-full h-auto border-2  border-gray-400 rounded-tl-2xl"
          
        />
        </div>
        {/* right */}

        <div className="flex-1">
          <form className="flex flex-col gap-4">
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
              <TextInput
                type="password"
                placeholder="**********"
                id="password"
              />
            </div>
            <Button gradientDuoTone="greenToBlue" type="submit">
              Sign In
            </Button>
            <Button type="button" gradientDuoTone="pinkToOrange" outline>
              <AiFillGoogleCircle className="w-6 h-6 mr-2" />
              Continue with Google
            </Button>
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Dont Have an account?</span>
            <Link to="/sign-up" className="text-blue-500">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
