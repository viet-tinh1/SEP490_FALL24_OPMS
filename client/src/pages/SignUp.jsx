import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import Imgtree from "../assets/img/tree.png";
import { Link, useNavigate } from "react-router-dom";
import { AiFillGoogleCircle } from "react-icons/ai";
import { useState } from "react";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  //Regex Password
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\S{8,50}$/;
    return passwordRegex.test(password);
  };
  //Regex Username
  const validateUsername = (username) => {
    const usernameRegex = /^[a-z0-9]{1,50}$/;
    return usernameRegex.test(username);
  };
  // Regex Email
  const validateEmail = (email) => {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email);
  };
  //kiểm tra password
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    console.log(newPassword);
    // Kiểm tra mật khẩu có hợp lệ hay không
    if (newPassword.length === 0) {
      setPasswordError('');
    }
    // Kiểm tra mật khẩu có hợp lệ hay không
    else if (!validatePassword(newPassword)) {
      setPasswordError('Password must be at least 8 characters, contain one uppercase letter, one lowercase letter, one number, and no spaces.');
    } 
    else {
      setPasswordError(''); // Nếu hợp lệ, xóa thông báo lỗi
    }
  };
  //kiểm tra username
  const handleUsernameChange = (e) => {
    const newUsername = e.target.value;
    setUsername(newUsername);
    console.log(newUsername);
    // Kiểm tra username có hợp lệ hay không
    if (newUsername.length === 0) {
      setUsernameError('');
    }
    // Kiểm tra username có hợp lệ hay không
    else if (!validateUsername(newUsername)) {
      setUsernameError('Username must be 1-50 characters and contain only lowercase letters and numbers.');
    } 
    else {
      setUsernameError(''); // Nếu hợp lệ, xóa thông báo lỗi
    }
  };
  //kiểm tra email
  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    console.log(newEmail);
    // Kiểm tra username có hợp lệ hay không
    if (newEmail.length === 0) {
      setEmailError('');
    }
    // Kiểm tra mật khẩu có hợp lệ hay không
    else if (!validateEmail(newEmail)) {
      setEmailError('Email must be a valid format, e.g. example@domain.com.');
    } 
    else {
      setEmailError(''); // Nếu hợp lệ, xóa thông báo lỗi
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn không cho form reload lại trang
    // Kiểm tra mật khẩu trước khi gửi
    if (!validatePassword(password)) {
      setPasswordError('Password must be at least 8 characters, contain one uppercase letter, one lowercase letter, one number, and no spaces.');
      return;
    }
    //kiểm tra username trước khi gửi
    if (!validateUsername(username)) {
      setUsernameError('Username must be 1-50 characters and contain only lowercase letters and numbers.');
      return;
    }
    //kiểm tra email trước khi gửi
    if (!validateEmail(email)) {
      setEmailError('Email must be a valid format, e.g. example@domain.com.');
      return;
    }
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
              <Label value="Tên của bạn" />
              <TextInput
                type="text"
                placeholder="Username"
                id="username"
                value={username}
                onChange={handleUsernameChange}             
                required
              />
              {/* Hiển thị lỗi nếu username không hợp lệ */}
              {usernameError && <p style={{ color: 'red' }}>{usernameError}</p>}
            </div>
            <div>
              <Label value="Email của bạn" />
              <TextInput
                type="email"
                placeholder="name@company.com"
                id="email"
                value={email}
                onChange={handleEmailChange}                
                required
              />
              {/* Hiển thị lỗi nếu mật khẩu không hợp lệ */}
              {emailError && <p style={{ color: 'red' }}>{emailError}</p>}
            </div>
            <div>
              <Label value="Mật khẩu của bạn" />
              <TextInput
                type="password"
                placeholder="Password"
                id="password"
                value={password}
                onChange={handlePasswordChange}
                required
              />
              {/* Hiển thị lỗi nếu mật khẩu không hợp lệ */}
              {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
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
                Đăng ký
              </Button>
            )}

            <Button type="button" gradientDuoTone="pinkToOrange" outline>
              <AiFillGoogleCircle className="w-6 h-6 mr-2" />
              Đăng nhập với google
            </Button>
          </form>

          

          <div className="flex gap-2 text-sm mt-5">
            <span>Đã có tài khoản ?</span>
            <Link to="/sign-in" className="text-blue-500">
              Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
