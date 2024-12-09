import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function About() {
  const navigate = useNavigate();
  const email = localStorage.getItem("email");
  const username = localStorage.getItem("username");
  const userid = localStorage.getItem("userId");
  const [formData, setFormData] = useState({
    name: username || "",
    email: email || "",
    feedbackText: "",
    rating: "",
  });
  const [errors, setErrors] = useState({}); // Để lưu các thông báo lỗi
  const [successMessage, setSuccessMessage] = useState("");
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };
  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Tên không được để trống.";
    if (!formData.email.trim()) newErrors.email = "Email không được để trống.";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email không hợp lệ.";
    if (!formData.feedbackText.trim()) newErrors.feedbackText = "Phản hồi không được để trống.";
    if (!formData.rating) newErrors.rating = "Vui lòng chọn đánh giá.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");
    if (!userId || userId === "undefined") {
      navigate("/sign-in");
      return;
    }
    if (validate()) {
      try {
        const response = await fetch("https://opms1.runasp.net/api/FeebbackAPI/createFeedback", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error("Không thể gửi phản hồi. Vui lòng thử lại sau.");
        }

        setSuccessMessage("Phản hồi của bạn đã được gửi. Cảm ơn!");
        setFormData({ name: "", email: "", feedbackText: "", rating: "" }); // Xóa dữ liệu sau khi gửi
        setErrors({});
        setTimeout(() => {
          setSuccessMessage("");
        }, 2000);
      } catch (error) {
        console.error("Lỗi khi gửi phản hồi:", error);
        setErrors({ apiError: "Đã xảy ra lỗi khi gửi phản hồi. Vui lòng thử lại sau." });
      }
    }
  };
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <header className="bg-green-600 text-white text-center py-8">
        <h1 className="text-4xl font-bold">Giới Thiệu Về Plant Store</h1>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto py-12 px-6">
        {/* Introduction Section */}
        <section className="mb-12">
          <h2 className="text-3xl text-green-600 font-bold mb-6">Chào mừng bạn đến với Plant Store 🌱</h2>
          <p className="text-gray-700 leading-relaxed text-lg mb-4">
            Tại Plant Store, chúng tôi không chỉ bán cây cảnh, chúng tôi mang đến cho bạn những mảnh xanh nhỏ
            của thiên nhiên, giúp bạn xoa dịu tâm hồn và làm mới không gian sống. Bắt đầu từ niềm đam mê đơn
            giản với cây cỏ, Plant Store đã trở thành một cửa hàng đáng tin cậy, nơi mọi người có thể tìm thấy
            những sản phẩm xanh tốt nhất cùng sự hỗ trợ tận tình từ đội ngũ chuyên gia của chúng tôi.
          </p>
          <p className="text-gray-700 leading-relaxed text-lg">
            Chúng tôi hiểu rằng mỗi cây xanh đều là một câu chuyện, một cảm hứng đặc biệt dành cho bạn. Vì vậy,
            chúng tôi luôn nỗ lực để mang đến những loại cây chất lượng, bền bỉ và dễ chăm sóc nhất.
          </p>
        </section>

        {/* Our Mission */}
        <section className="mb-12">
          <h2 className="text-3xl text-green-600 font-bold mb-6">Sứ Mệnh Của Chúng Tôi</h2>
          <p className="text-gray-700 leading-relaxed text-lg mb-4">
            Trong thời đại hiện đại, khi cuộc sống ngày càng trở nên bận rộn, Plant Store mong muốn trở thành
            cầu nối giữa con người và thiên nhiên. Chúng tôi tin rằng mỗi không gian, dù là văn phòng hay ngôi
            nhà nhỏ, đều cần một chút xanh tươi để làm dịu đi áp lực cuộc sống và làm phong phú tâm hồn.
          </p>
          <ul className="list-disc list-inside text-gray-700 text-lg space-y-2">
            <li>🌿 Giúp mọi người tiếp cận thiên nhiên dễ dàng hơn thông qua các sản phẩm cây cảnh.</li>
            <li>🌿 Xây dựng cộng đồng yêu cây, yêu thiên nhiên thông qua các hoạt động chia sẻ kiến thức.</li>
            <li>🌿 Tạo ra những giá trị bền vững, bảo vệ môi trường sống của chúng ta.</li>
          </ul>
        </section>

        {/* Why Choose Us */}
        <section className="mb-12">
          <h2 className="text-3xl text-green-600 font-bold mb-6">Tại Sao Chọn Plant Store?</h2>
          <p className="text-gray-700 leading-relaxed text-lg mb-4">
            Plant Store không chỉ đơn thuần là một cửa hàng bán cây. Chúng tôi là người đồng hành, người chia sẻ
            cùng bạn trong hành trình xây dựng không gian xanh. Những lý do để bạn tin tưởng chọn chúng tôi:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-white shadow rounded">
              <h3 className="text-green-600 font-bold text-xl mb-2">🌱 Đa dạng sản phẩm</h3>
              <p className="text-gray-700">
                Từ cây nội thất, cây mini để bàn, cây phong thủy đến các loại phụ kiện chăm sóc cây, chúng tôi
                luôn có sẵn những sản phẩm phù hợp với nhu cầu của bạn.
              </p>
            </div>
            <div className="p-4 bg-white shadow rounded">
              <h3 className="text-green-600 font-bold text-xl mb-2">🌱 Đội ngũ chuyên gia</h3>
              <p className="text-gray-700">
                Chúng tôi có đội ngũ tư vấn và chuyên gia với kinh nghiệm nhiều năm, sẵn sàng hỗ trợ bạn trong
                việc lựa chọn và chăm sóc cây.
              </p>
            </div>
            <div className="p-4 bg-white shadow rounded">
              <h3 className="text-green-600 font-bold text-xl mb-2">🌱 Cam kết chất lượng</h3>
              <p className="text-gray-700">
                Các sản phẩm của chúng tôi được chọn lọc kỹ lưỡng, đảm bảo sức khỏe tốt nhất cho từng cây trước
                khi đến tay bạn.
              </p>
            </div>
            <div className="p-4 bg-white shadow rounded">
              <h3 className="text-green-600 font-bold text-xl mb-2">🌱 Dịch vụ tận tâm</h3>
              <p className="text-gray-700">
                Chúng tôi không chỉ bán sản phẩm, mà còn cung cấp dịch vụ chăm sóc cây, giao hàng nhanh chóng và
                hướng dẫn chi tiết để bạn hoàn toàn yên tâm.
              </p>
            </div>
          </div>
        </section>
        {/* Feedback Section with Map */}
        <section className="mt-12 bg-white shadow rounded p-6">
          <h2 className="text-3xl text-green-600 font-bold mb-6 text-center">Gửi Phản Hồi Của Bạn</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Feedback Form */}
            <form
              className="space-y-6"
              onSubmit={handleSubmit}
            >
              {/* Tên */}
              <div>
                <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                  Tên của bạn
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full border ${errors.name ? "border-red-500" : "border-gray-300"} rounded px-4 py-2 focus:outline-none focus:ring-2 ${errors.name ? "focus:ring-red-500" : "focus:ring-green-600"
                    }`}
                  placeholder="Nhập tên của bạn"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full border ${errors.email ? "border-red-500" : "border-gray-300"} rounded px-4 py-2 focus:outline-none focus:ring-2 ${errors.email ? "focus:ring-red-500" : "focus:ring-green-600"
                    }`}
                  placeholder="Nhập email của bạn"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              {/* Nội dung phản hồi */}
              <div>
                <label htmlFor="feedbackText" className="block text-gray-700 font-medium mb-2">
                  Phản hồi
                </label>
                <textarea
                  id="feedbackText"
                  value={formData.feedbackText}
                  onChange={handleChange}
                  rows="5"
                  className={`w-full border ${errors.feedbackText ? "border-red-500" : "border-gray-300"} rounded px-4 py-2 focus:outline-none focus:ring-2 ${errors.feedbackText ? "focus:ring-red-500" : "focus:ring-green-600"
                    }`}
                  placeholder="Nhập phản hồi của bạn"
                ></textarea>
                {errors.feedbackText && <p className="text-red-500 text-sm mt-1">{errors.feedbackText}</p>}
              </div>

              {/* Đánh giá */}
              <div>
                <label htmlFor="rating" className="block text-gray-700 font-medium mb-2">
                  Đánh giá (1-5)
                </label>
                <select
                  id="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  className={`w-full border ${errors.rating ? "border-red-500" : "border-gray-300"} rounded px-4 py-2 focus:outline-none focus:ring-2 ${errors.rating ? "focus:ring-red-500" : "focus:ring-green-600"
                    }`}
                >
                  <option value="">Chọn đánh giá</option>
                  <option value="Rất tệ">1 - Rất tệ</option>
                  <option value="Tệ">2 - Tệ</option>
                  <option value="Bình thường">3 - Bình thường</option>
                  <option value="Tốt">4 - Tốt</option>
                  <option value="Tuyệt vời">5 - Tuyệt vời</option>
                </select>
                {errors.rating && <p className="text-red-500 text-sm mt-1">{errors.rating}</p>}
              </div>
              {/* Thông báo thành công */}
              {successMessage && (
                <p className="text-green-500 font-medium mb-4">{successMessage}</p>
              )}

              {/* Lỗi từ API */}
              {errors.apiError && <p className="text-red-500 font-medium mb-4">{errors.apiError}</p>}


              {/* Nút Gửi */}
              <button
                type="submit"
                className="w-full py-3 rounded font-medium transition duration-300 
                    bg-green-600 text-white hover:bg-green-700"                                   
              >
                Gửi Phản Hồi
              </button>
            </form>

            {/* Map Section */}
            <div className="flex justify-center items-center">
              {/* Google Map Embed */}
              <iframe
                title="Google Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3835.8561681211886!2d108.2583163749018!3d15.968885884696123!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3142116949840599%3A0x365b35580f52e8d5!2zxJDhuqFpIGjhu41jIEZQVCDEkMOgIE7hurVuZw!5e0!3m2!1svi!2s!4v1732008724525!5m2!1svi!2s"
                className="w-full h-80 border-0 rounded shadow"
                allowFullScreen=""
                loading="lazy"
              ></iframe>

            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
