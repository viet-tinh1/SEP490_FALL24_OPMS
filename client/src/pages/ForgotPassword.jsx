import { useState } from "react";
import { Button, Label, TextInput, Alert, Spinner } from "flowbite-react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch("https://opms1.runasp.net/api/UserAPI/sendOtpToEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({recipientEmail: email }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError("Không thể gửi OTP. Vui lòng thử lại.");
        return;
      }

      setSuccessMessage("OTP đã được gửi thành công!");
      setTimeout(() => {
        // Chuyển hướng đến trang verify-otp kèm theo email người dùng
        navigate("/VerifyOTP", { state: { email } });
      }, 2000);
    } catch (error) {
      setError("Kết nối API thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center mb-4">Quên mật khẩu?</h2>
        <p className="text-center text-sm mb-6">
          Vui lòng nhập email bạn đã đăng kí cho tài khoản này.
        </p>
        
        <form onSubmit={handleForgotPassword}>
          <div className="mb-4">
            <Label value="Your email" />
            <TextInput
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-2"
            />
          </div>

          {error && <Alert color="failure" className="mb-4">{error}</Alert>}
          {successMessage && <Alert color="success" className="mb-4">{successMessage}</Alert>}

          <Button
            type="submit"
            gradientDuoTone="blueToPurple"
            className="w-full"
            disabled={loading}
          >
            {loading ? <Spinner /> : "Yêu cầu đặt lại mật khẩu"}
          </Button>
        </form>

        <div className="text-center mt-4">
          <button
            onClick={() => navigate("/sign-in")}
            className="text-blue-500"
          >
            Quay lại trang đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
}
