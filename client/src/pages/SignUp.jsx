import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import Imgtree from "../assets/img/tree.png";
import { Link, useNavigate } from "react-router-dom";
import { AiFillGoogleCircle } from "react-icons/ai";
import { useState } from "react";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn không cho form reload lại trang

    setLoading(true); // Bắt đầu hiển thị spinner hoặc trạng thái loading
    setError(null); // Reset lỗi trước khi gửi

    try {
      const response = await fetch("https://localhost:7098/api/Auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
          roles: 2, // Giả sử 2 là giá trị mặc định cho role
          status: 1, // Giả sử 1 là giá trị mặc định cho status
        }),
      });
      
      const data = await response.json();
      if (!response.ok) {
        // Check if the account has been locked or other errors occurred
        if (response.status === 400 && data.message === "Username or Email already exists") {
            setError("Username or Email already exists");
        } else if (response.status === 400 && data.message !== "Username or Email already exists") {
            setError("Invalid data");
        } else {
            setError(`API Error: ${response.status}`);
        }
        console.log(response.status, data.message);
        return;
    }

      // Nếu đăng ký thành công
      
      console.log("Đăng ký thành công:", data);
      // Điều hướng người dùng tới trang khác, ví dụ trang đăng nhập
      if (data.message === "User registered successfully") {
        navigate("/sign-in");
      }
      
    } catch (error) {
      setError("API connection failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-min mt-10 mb-10">
      <div
        className="flex p-3 max-w-3xl mx-auto flex-col 
        md:items-center md:flex-row gap-4"
      >
        {/*left */}
        <div className="flex-1">
          <img
            src={Imgtree}
            alt="Project Blog Logo"
            className="w-full h-auto border-2 border-gray-400 rounded-tl-2xl"
          />
        </div>
        {/*right */}
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Your username" />
              <TextInput
                type="text"
                placeholder="Username"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <Label value="Your email" />
              <TextInput
                type="email"
                placeholder="name@company.com"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label value="Your password" />
              <TextInput
                type="password"
                placeholder="Password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
            <Alert color="failure" withBorderAccent>
              {error}
            </Alert>
          )}
            {loading ? (
              <Spinner aria-label="Loading" />
            ) : (
              <Button gradientDuoTone="greenToBlue" type="submit">
                Sign Up
              </Button>
            )}

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
