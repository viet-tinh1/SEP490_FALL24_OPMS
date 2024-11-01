import { useState } from "react";
import { Modal, Button } from "flowbite-react";
import { FaImage, FaThumbsUp, FaComment } from "react-icons/fa";
import { FiMoreHorizontal } from "react-icons/fi";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Dropdown } from "flowbite-react";

export default function Forum() {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState([
    {
      id: 1,
      username: "Nguyễn Ngọc Nhân",
      profileImage:
        "https://scontent.fdad4-1.fna.fbcdn.net/v/t39.30808-6/464957439_3783099075334445_1801193416209890520_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=zuxQ_dDEyV8Q7kNvgHzsiWf&_nc_zt=23&_nc_ht=scontent.fdad4-1.fna&_nc_gid=AlQ5isUXxbJy3xi8RRYNWdz&oh=00_AYAz3GLlyvmMu4uot4gE5ZcLgSLkkk5brnGoDOewKIFtxg&oe=672A3853",
      postContent:
        "Kể tên một char mà thời newbie các ông từng mong ước. Tôi trước: Qiqi:))",
      postImage:
        "https://scontent.fdad4-1.fna.fbcdn.net/v/t39.30808-6/464957439_3783099075334445_1801193416209890520_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=zuxQ_dDEyV8Q7kNvgHzsiWf&_nc_zt=23&_nc_ht=scontent.fdad4-1.fna&_nc_gid=AlQ5isUXxbJy3xi8RRYNWdz&oh=00_AYAz3GLlyvmMu4uot4gE5ZcLgSLkkk5brnGoDOewKIFtxg&oe=672A3853",
      time: "12 giờ",
      comments: [
        {
          id: 1,
          username: "Bảo My",
          content: "Mình cũng thích Qiqi!",
          time: "1 giờ trước",
        },
        {
          id: 2,
          username: "Trần Hữu",
          content: "Cảm ơn vì chia sẻ nhé!",
          time: "30 phút trước",
        },
        {
          id: 3,
          username: "Minh Quang",
          content: "Qiqi đáng yêu mà!",
          time: "15 phút trước",
        },
      ],
    },
    {
      id: 2,
      username: "Hà Anh Tuấn",
      profileImage:
        "https://scontent.fdad4-1.fna.fbcdn.net/v/t39.30808-6/464957439_3783099075334445_1801193416209890520_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=zuxQ_dDEyV8Q7kNvgHzsiWf&_nc_zt=23&_nc_ht=scontent.fdad4-1.fna&_nc_gid=AlQ5isUXxbJy3xi8RRYNWdz&oh=00_AYAz3GLlyvmMu4uot4gE5ZcLgSLkkk5brnGoDOewKIFtxg&oe=672A3853",
      postContent:
        "Có một lần Momoca phát hiện ra bạn trai (cũ) của mình đang xem A::V. Tuy nhiên cô nàng không t:ứ:c g:i:ận, trái lại còn vào xem ké và cảm thấy bất ngờ vì nữ chính trong phim quá dễ thương. Nữ diễn viên được nhắc đến ở đây là Mia Nanasawa và kể từ đó Mia cũng đã trở thành một trong những nữ diễn viên yêu thích của em (ngoài ra còn có Yu Shinoda",
      postImage:
        "https://scontent.fdad4-1.fna.fbcdn.net/v/t39.30808-6/465268702_1098707525313891_1711980144806636327_n.jpg?stp=dst-jpg_s640x640&_nc_cat=102&ccb=1-7&_nc_sid=127cfc&_nc_ohc=x7oSHiayf6QQ7kNvgGvY4qo&_nc_zt=23&_nc_ht=scontent.fdad4-1.fna&_nc_gid=ARF7ycbIFrd31xJ0tBylhV2&oh=00_AYBiwjnNjipHyOQZRuakzRy5_a9PjLsZTDJtONWNem_DdQ&oe=672A53A5",
      time: "5 giờ",
      comments: [
        {
          id: 1,
          username: "Linh Lan",
          content: "Nhiệm vụ gì thế, thú vị thật!",
          time: "2 giờ trước",
        },
        {
          id: 2,
          username: "Ngọc Anh",
          content: "Chúc mừng nhé!",
          time: "1 giờ trước",
        },
        {
          id: 3,
          username: "Văn Khoa",
          content: "Tuyệt vời quá!",
          time: "10 phút trước",
        },
      ],
    },
  ]);

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    setContent("");
  };

  const handleContentChange = (value) => {
    setContent(value);
  };

  const toolbarOptions = [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    ["link"],
    ["clean"],
  ];

  const modules = {
    toolbar: toolbarOptions,
  };

  const [uploadedImage, setUploadedImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = () => {
    setUploadedImage(null);
  };

  const handleDeletePost = (postId) => {
    setPosts(posts.filter((post) => post.id !== postId));
  };

  const [showAllComments, setShowAllComments] = useState({});

  const handleShowMoreComments = (postId) => {
    setShowAllComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  return (
    <main className="bg-gray-100 min-h-screen p-4">
      <div className="max-w-full lg:max-w-lg w-full bg-white shadow-md rounded-lg mx-auto p-4 my-4">
        <div className="flex items-center border-b border-gray-200 pb-4 mb-4">
          <img
            src="https://via.placeholder.com/40"
            alt="Profile"
            className="w-10 h-10 rounded-full mr-3"
          />
          <div
            onClick={openModal}
            className="flex-grow bg-gray-100 px-4 py-2 rounded-full text-gray-500 cursor-pointer"
          >
            User ơi, bạn đang nghĩ gì thế?
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={openModal}
            className="flex items-center space-x-1 text-green-500"
          >
            <FaImage />
            <span>Ảnh</span>
          </button>
        </div>

        <Modal show={isOpen} onClose={closeModal}>
          <Modal.Header>Tạo bài viết</Modal.Header>
          <Modal.Body>
            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              <ReactQuill
                value={content}
                onChange={handleContentChange}
                modules={modules}
                placeholder="Nhân ơi, bạn đang nghĩ gì thế?"
                className="h-60"
              />
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="mt-4 mb-2 block"
            />

            {uploadedImage && (
              <div className="mt-2 flex flex-col items-center">
                <img
                  src={uploadedImage}
                  alt="Uploaded Preview"
                  className="w-48 h-auto rounded-md mb-2"
                />
                <button
                  onClick={handleDeleteImage}
                  className="text-red-500 text-sm underline hover:text-red-700"
                >
                  Xóa ảnh
                </button>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              onClick={closeModal}
              disabled={!content.trim()}
              className="w-full"
            >
              Đăng
            </Button>
          </Modal.Footer>
        </Modal>
      </div>

      <div className="space-y-4 max-w-full lg:max-w-lg mx-auto">
        {posts.map((post) => (
          <div key={post.id} className="bg-white shadow-md rounded-lg p-4">
            <div className="flex items-center mb-4">
              <img
                src={post.profileImage}
                alt="Profile"
                className="w-10 h-10 rounded-full"
              />
              <div className="ml-3 flex-grow">
                <div className="font-semibold">{post.username}</div>
                <div className="text-sm text-gray-500">{post.time} ·</div>
              </div>
              <Dropdown
                arrowIcon={false}
                inline
                label={
                  <FiMoreHorizontal className="text-gray-500 cursor-pointer" />
                }
              >
                <Dropdown.Item>Sửa bài viết</Dropdown.Item>
                <Dropdown.Item onClick={() => handleDeletePost(post.id)}>
                  Xóa bài viết
                </Dropdown.Item>
              </Dropdown>
            </div>

            <div className="mb-4">
              <p>{post.postContent}</p>
            </div>

            <div className="rounded-lg overflow-hidden mb-4">
              <img src={post.postImage} alt="Post Content" className="w-full" />
            </div>

            <div className="flex justify-around border-t border-b border-gray-200 py-2 text-gray-600">
              <button className="flex items-center space-x-1 hover:text-blue-600">
                <FaThumbsUp />
                <span>Thích</span>
              </button>
              <button className="flex items-center space-x-1 hover:text-blue-600">
                <FaComment />
                <span>Bình luận</span>
              </button>
            </div>

            <div className="mt-3">
              {/* View More Comments Button */}
              <button
                    onClick={() => handleShowMoreComments(post.id)}
                    className="text-blue-500 text-sm font-medium mt-2"
                  >
                    {showAllComments[post.id]
                      ? "Ẩn bớt bình luận"
                      : "Xem thêm bình luận"}
                  </button>

              {/* Comment Input Field */}
              <div className="flex items-center space-x-3 mb-3">
                <img
                  src={post.profileImage}
                  alt="Comment Profile"
                  className="w-8 h-8 rounded-full"
                />
                <input
                  type="text"
                  placeholder={`Bình luận dưới tên ${post.username}`}
                  className="flex-grow bg-gray-100 p-2 rounded-full outline-none text-gray-600"
                />
              </div>

              {post.comments && post.comments.length > 0 && (
                <div className="space-y-2">
                  {(showAllComments[post.id]
                    ? post.comments
                    : post.comments.slice(0, 2)
                  ).map((comment) => (
                    <div
                      key={comment.id}
                      className="flex items-start space-x-2"
                    >
                      <div className="flex items-start space-x-2">
                        <img
                          src="https://via.placeholder.com/32"
                          alt="Comment Profile"
                          className="w-8 h-8 rounded-full"
                        />
                        <div className="flex flex-col flex-1">
                          <div className="flex justify-between items-center">
                            <div className="bg-gray-100 p-2 rounded-lg">
                              <span className="font-semibold mr-1">
                                {comment.username}
                              </span>
                              <span>{comment.content}</span>
                            </div>
                            <span className="ml-2 text-gray-500 text-xs">
                              {comment.time}
                            </span>
                          </div>
                          <div className="flex space-x-4 mt-1 text-sm text-gray-500">
                            <button className="hover:underline">Thích</button>
                            <button className="hover:underline">
                              Phản hồi
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

            
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
