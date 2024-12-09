import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import Imgtree from "../assets/img/tree.png";
import { Link, useNavigate, useLocation  } from "react-router-dom";
import { AiFillGoogleCircle } from "react-icons/ai";
import { useState,useEffect } from "react";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
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
      setPasswordError('Mật khẩu phải có ít nhất 8 ký tự, bao gồm một chữ cái viết hoa, một chữ cái viết thường, một số và không có khoảng trắng.');
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
      setUsernameError('Tên người dùng phải có từ 1-50 ký tự và chỉ chứa các chữ cái thường và số.');
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
      setEmailError('Email phải có định dạng hợp lệ, ví dụ: example@domain.com.');
    } 
    else {
      setEmailError(''); // Nếu hợp lệ, xóa thông báo lỗi
    }
  };
  const handlePhoneChange = (e) => {
    const newPhone = e.target.value;
    setPhoneNumber(newPhone);
    console.log(newPhone);

    // Kiểm tra số điện thoại có hợp lệ hay không
    if (newPhone.length === 0) {
        setPhoneError(''); // Nếu không nhập gì, không hiện lỗi
    } 
    else if (!validatePhone(newPhone)) {
        setPhoneError('Số điện thoại phải có định dạng hợp lệ, ví dụ: 0123456789.'); // Hiển thị lỗi nếu không hợp lệ
    } 
    else {
        setPhoneError(''); // Nếu hợp lệ, xóa thông báo lỗi
    }
};

// Hàm validate số điện thoại
const validatePhone = (phoneNumber) => {
    // Điều kiện kiểm tra số điện thoại (chỉ chấp nhận 10 số bắt đầu bằng 0)
    const phoneRegex = /^0\d{9}$/;
    return phoneRegex.test(phoneNumber);
};
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
    e.preventDefault(); // Ngăn không cho form reload lại trang
    // Kiểm tra mật khẩu trước khi gửi
    if (!validatePassword(password)) {
      setPasswordError('Mật khẩu phải có ít nhất 8 ký tự, bao gồm một chữ cái viết hoa, một chữ cái viết thường, một số và không có khoảng trắng.');
      return;
    }
    //kiểm tra username trước khi gửi
    if (!validateUsername(username)) {
      setUsernameError('Tên người dùng phải có từ 1-50 ký tự và chỉ chứa các chữ cái thường và số.');
      return;
    }
    //kiểm tra email trước khi gửi
    if (!validateEmail(email)) {
      setEmailError('Email phải có định dạng hợp lệ, ví dụ: example@domain.com.');
      return;
    }
    if (!validatePhone(phoneNumber)) {
      setPhoneError('Số điện thoại phải có định dạng hợp lệ, ví dụ: 0123456789.');
      return;
    }
    setLoading(true); // Bắt đầu hiển thị spinner hoặc trạng thái loading
    setError(null); // Reset lỗi trước khi gửi

    try {
      const response = await fetch("https://opms1.runasp.net/api/Auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
          phoneNumber,
          roles: 2, // Giả sử 2 là giá trị mặc định cho role
          status: 1, // Giả sử 1 là giá trị mặc định cho status
        }),
      });
      
      const data = await response.json();
      if (!response.ok) {
        // Check if the account has been locked or other errors occurred
        if (response.status === 400 && data.message === "Username already exists") {
            setUsernameError("Tên người dùng đã tồn tại.");
        } else if (response.status === 400 && data.message !== "Username already exists" && data.message === "Email already exists") {
            setEmailError("Email đã tồn tại.");
        } else if (response.status === 400 && data.message === "Phone already exists") {
           setPhoneError("Số điện thoại đã được đăng kí.");
        } else if (response.status === 400 && data.message !== "Username already exists" && data.message !== "Email already exists" && data.message !== "Phone already exists") {
            setError("Dữ liệu không hợp lệ.");
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
        const emailResponse = await fetch("https://opms1.runasp.net/api/SendMailAPI/send-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,           // Pass the registered username
            recipientEmail: email,        // Pass the recipient's email (the registered email)
          }),
        });
  
        const emailData = await emailResponse.json();
  
        if (!emailResponse.ok) {
          setError("Gửi email OTP không thành công. Vui lòng thử lại.");
          return;
        }
  
        // Navigate to the OTP verification page if email sending is successful
        navigate("/verify_otp", { state: { email: email } });
      }
      
    } catch (error) {
      setError("Kết nối API không thành công. Vui lòng thử lại.");
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
              <Label value="Tên đăng nhập của bạn " />
              <TextInput
                type="text"
                placeholder="Tên đăng nhập"
                id="username"
                value={username}
                onChange={handleUsernameChange}             
                required
              />
              {/* Hiển thị lỗi nếu username không hợp lệ */}
              {usernameError && <p style={{ color: 'red' }}>{usernameError}</p>}
            </div>
            <div>
              <Label value="Email của bạn " />
              <TextInput
                type="email"
                placeholder="Email"
                id="email"
                value={email}
                onChange={handleEmailChange}                
                required
              />
              {/* Hiển thị lỗi nếu mật khẩu không hợp lệ */}
              {emailError && <p style={{ color: 'red' }}>{emailError}</p>}
            </div>
            <div>
              <Label value="Số diện thoại của bạn " />
              <TextInput
                type="text"
                placeholder="Số điện thoái"
                id="phoneNumber"
                value={phoneNumber}
                onChange={handlePhoneChange}                
                required
              />
              {/* Hiển thị lỗi nếu số điện thoại không hợp lệ */}
              {phoneError && <p style={{ color: 'red' }}>{phoneError}</p>}
            </div>
            <div>
              <Label value="Mật khẩu của bạn " />
              <TextInput
                type="password"
                placeholder="Mật khẩu"
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
