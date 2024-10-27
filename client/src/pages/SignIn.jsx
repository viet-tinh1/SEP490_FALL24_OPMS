import { useEffect, useState } from "react";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { Link, useNavigate, useLocation  } from "react-router-dom";
import { AiFillGoogleCircle } from "react-icons/ai";
import Imgtree from "../assets/img/tree.png";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Check API Connection when component mounts
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const userId = params.get("userId");
    const role = params.get("role");
    const token = params.get("token");

    // Chỉ lưu vào localStorage nếu các giá trị tồn tại
    if (userId && role && token) {
      setUserId(userId);
      setRole(role);
      setToken(token);

      localStorage.setItem("userId", userId);
      localStorage.setItem("role", role);
      localStorage.setItem("token", token);
    }
  }, [location]);
  // Check API Connection when component mounts
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      // Thực hiện gọi API Google login và điều hướng người dùng tới trang Google để đăng nhập
      window.location.href = "https://localhost:7098/api/Auth/google-login";
      // Sau đó, trình duyệt sẽ điều hướng tới trang đăng nhập Google, 
      // bạn không cần gọi hàm `checkGoogleLogin()` ngay tại đây nữa.
    } catch (error) {
      console.error("Error initiating Google login:", error);
      setError("Google login initiation failed. Please try again.");
      setLoading(false);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
  
    try {
      const response = await fetch("https://localhost:7098/api/Auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        // Check if the account has been locked or other errors occurred
        if (response.status === 401 && data.message === "Your account has been locked ") {
            setError("Your account has been locked. Please contact support.");
        } else if (response.status === 401 && data.message !== "Your account has been locked ") {
            setError("Invalid email or password");
        } else {
            setError(`API Error: ${response.status}`);
        }
        console.log(response.status, data.message);
        return;
    }
  
      
  
      // Role-based redirection
      if (data.message === "Login successful") {
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("role", data.role); 
        localStorage.setItem("email", data.email);
        localStorage.setItem("username", data.username);// Store userId in localStorage
        console.log("Logged in as UserId:", data.userId);
        
        // Dispatch a custom event to notify other components of the login state
        window.dispatchEvent(new Event("storage"));
        if (data.role === 1) {
          navigate("/dashboard?tab=users");
        } else if (data.role === 2) {
          navigate("/product");
        } else if (data.role === 3) {
          navigate("/dashboard?tab=product");
        } else {
          setError("Unknown role. Please contact support.");
        }
      }
    } catch (error) {
      setError("API connection failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-min mt-10 mb-10">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left */}
        <div className="flex-1">
          <img
            src={Imgtree}
            alt="Project Blog Logo"
            className="w-full h-auto border-2 border-gray-400 rounded-tl-2xl"
          />
        </div>
        {/* right */}
        <div className="flex-1">
          
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Your email" />
              <TextInput
                type="email"
                placeholder="Enter your email"
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
                placeholder="**********"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button gradientDuoTone="greenToBlue" type="submit" disabled={loading}>
              {loading ? <Spinner size="sm" /> : "Sign In"}
            </Button>
            {error && <Alert color="failure">{error}</Alert>}
            <Button 
            type="button" 
            gradientDuoTone="pinkToOrange" 
            outline
            onClick={handleGoogleLogin}>
              <AiFillGoogleCircle className="w-6 h-6 mr-2" />
              Đăng nhập với google
            </Button>
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Chưa có tài khoản ?</span>
            <Link to="/sign-up" className="text-blue-500">
              Đăng ký
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
