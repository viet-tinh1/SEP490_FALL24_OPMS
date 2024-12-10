import { useEffect, useState } from "react";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { Link, useNavigate, useLocation  } from "react-router-dom";
import { AiFillGoogleCircle } from "react-icons/ai";
import Imgtree from "../assets/img/tree.png";

export default function SignIn() {
  const [account, setAccount] = useState("");
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
    try {
      // Thực hiện gọi API Google login và điều hướng người dùng tới trang Google để đăng nhập
      window.location.href = "https://opms1.runasp.net/api/Auth/google-login";
      // Sau đó, trình duyệt sẽ điều hướng tới trang đăng nhập Google, 
      // bạn không cần gọi hàm `checkGoogleLogin()` ngay tại đây nữa.
    } catch (error) {
      console.error("Error initiating Google login:", error);
      setError("Khởi tạo đăng nhập Google không thành công. Vui lòng thử lại.");
      setLoading(false);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
  
    try {
      const response = await fetch("https://opms1.runasp.net/api/Auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ account, password }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        // Check if the account has been locked or other errors occurred
        if (response.status === 401 && data.message === "Your account has been locked ") {
            setError("Tài khoản của bạn đã bị khóa. Vui lòng liên hệ bộ phận hỗ trợ.");
        } else if (response.status === 401 && data.message !== "Your account has been locked ") {
            setError("Email, số điện thoại hoặc mật khẩu không hợp lệ.");
        } else {
            setError(`Lỗi API:  ${response.status}`);
        }
        
        return;
    } 
      // Role-based redirection
      if (data.message === "Login successful") {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("role", data.role); 
        localStorage.setItem("email", data.email);
        localStorage.setItem("username", data.username);
        localStorage.setItem("status", data.status);// Store userId in localStorage
        
        
        // Dispatch a custom event to notify other components of the login state
        window.dispatchEvent(new Event("storage"));
        if (data.role === 1) {
          navigate("/dashboard?tab=dash");
        } else if (data.role === 2) {
          navigate("/product");
        } else if (data.role === 3) {
          navigate("/dashboard?tab=dash");
        } else {
          setError("Vai trò không xác định. Vui lòng liên hệ bộ phận hỗ trợ.");
        }
      }
    } catch (error) {
      setError("Kết nối API không thành công. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };
  const validateInput = (input) => {
    const isNumeric = /^\d+$/.test(input); // Kiểm tra nếu chỉ chứa số
    const isEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(input); // Kiểm tra định dạng email
    const isPhone = /^0\d{9}$/.test(input); // Kiểm tra định dạng số điện thoại (bắt đầu bằng 0 và có 10 chữ số)
  
    if (isNumeric && !isPhone) {
      return "Số điện thoại không hợp lệ.";
    } else if (!isNumeric && !isEmail) {
      return "Email không hợp lệ.";
    }
  
    return ""; // Hợp lệ
  };
  const handleInputChange = (e) => {
    const value = e.target.value;
    setAccount(value);

    if (!value) {
      setError("");
      return;
    }
    // Kiểm tra lỗi
    const errorMessage = validateInput(value);
    setError(errorMessage);
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
              <Label value="Email hoặc số điện thoại của bạn" />
              <TextInput
                type="text"
                placeholder="Email hoặc số điện thoại của bạn"
                id="email"
                value={account}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label value="Mật khẩu của bạn" />
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
              {loading ? <Spinner size="sm" /> : "Đăng nhập"}
            </Button>
            {error && <Alert color="failure">{error}</Alert>}
            <div className="flex justify-between mt-2">
              <Link to="/forgot-password" className="text-blue-500">
              Quên mật khẩu?
              </Link>
            </div>
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
