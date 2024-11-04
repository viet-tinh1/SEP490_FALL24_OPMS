import { useState } from "react";
import { Button, Label, TextInput, Alert, Spinner, Card } from "flowbite-react";
import { useLocation, useNavigate } from "react-router-dom";

export default function ChangePassword() {
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const { email } = location.state || {};

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("https://localhost:7098/api/UserAPI/changePassword_Email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, newPassword }),
      });

      if (!response.ok) {
        setError("Không thể thay đổi mật khẩu. Vui lòng thử lại.");
        return;
      }

      navigate("/sign-in");
    } catch (error) {
      setError("Kết nối API thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-6 space-y-4 shadow-lg">
        <form onSubmit={handleChangePassword} className="space-y-4">
          <h2 className="text-xl font-semibold text-center text-gray-700">Thay đổi mật khẩu</h2>
          <Label value="Nhập mật khẩu mới" className="text-gray-600" />
          <TextInput
            type="password"
            placeholder="********"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {error && <Alert color="failure" className="text-sm">{error}</Alert>}
          <Button type="submit" gradientDuoTone="purpleToBlue" className="w-full">
            {loading ? <Spinner /> : "Thay đổi mật khẩu"}
          </Button>
        </form>
      </Card>
    </div>
  );
}