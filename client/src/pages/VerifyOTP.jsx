import { Button, Label, TextInput, Alert, Spinner } from "flowbite-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  const location = useLocation();
  const navigate = useNavigate();

  // Extract email from the location state (passed from signup)
  const { email } = location.state || {};

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();  // Prevent page reload
    setLoading(true);
    setError(null);  // Reset any previous error message
    setSuccessMessage(null); // Reset previous success message

    try {
      // Call the OTP verification API
      const response = await fetch("https://localhost:7098/api/UserAPI/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            recipientEmail: email,  // Pass the email as "recipientEmail"
            otp: otp,       // The OTP entered by the user
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400 && data.message === "OTP has expired.") {
            setError("OTP đã hết hạn. Vui lòng yêu cầu lại OTP.");
            console.log(response.status,data.message)
        } else {
            setError("OTP không hợp lệ hoặc xác minh thất bại. Vui lòng thử lại.");
        }
        return;
    }

      // Handle successful verification
      if (data.message === "OTP is valid and has not expired.") {
        setSuccessMessage("Xác minh OTP thành công!  Đang chuyển hướng...");
        setTimeout(() => {
          navigate("/change-password", { state: { email } }); // Điều hướng đến trang đổi mật khẩu
         // navigate("/sign-in");
        }, 2000);
      } else {
        setError("Không tồn tại OTP. Vui lòng thử lại.");
      }
    } catch (error) {
      setError("Kết nối API thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Xác minh OTP</h2>
        {email && (
          <p className="text-center text-sm mb-4">
            Chúng tôi đã gửi mã OTP đến email của bạn: <strong>{email}</strong>
          </p>
        )}

        <form className="flex flex-col gap-4" onSubmit={handleVerifyOtp}>
          <div>
            <Label value="Nhập OTP" />
            <TextInput
              type="number"
              placeholder="Nhập OTP"
              value={otp}
              onChange={handleOtpChange}
              required
            />
          </div>

          {error && (
            <Alert color="failure" withBorderAccent>
              {error}
            </Alert>
          )}

          {successMessage && (
            <Alert color="success" withBorderAccent>
              {successMessage}
            </Alert>
          )}

          {loading ? (
            <Spinner aria-label="Loading" />
          ) : (
            <Button gradientDuoTone="greenToBlue" type="submit">
              Xác minh OTP
            </Button>
          )}
        </form>
      </div>
    </div>
  );
}
