import { useState, useEffect   } from "react";
import { Modal, Button } from "flowbite-react";
import { FaImage, FaThumbsUp, FaComment } from "react-icons/fa";
import { FiMoreHorizontal } from "react-icons/fi";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Dropdown } from "flowbite-react";



export default function Forum() {
  const username = localStorage.getItem("username"); // Lấy tên từ localStorage
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const userId = localStorage.getItem("userId");
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState(() => {
    const savedPosts = localStorage.getItem("posts");
    return savedPosts
      ? JSON.parse(savedPosts)
      : [
          {
            id: 1,
            username: "Nguyễn Ngọc Nhân",
            profileImage:
              "https://scontent.fdad4-1.fna.fbcdn.net/v/t39.30808-6/464957439_3783099075334445_1801193416209890520_n.jpg",
            postContent:
              "Kể tên một char mà thời newbie các ông từng mong ước. Tôi trước: Qiqi:))",
            postImage:
              "https://scontent.fdad4-1.fna.fbcdn.net/v/t39.30808-6/464957439_3783099075334445_1801193416209890520_n.jpg",
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
              "https://scontent.fdad4-1.fna.fbcdn.net/v/t39.30808-6/464957439_3783099075334445_1801193416209890520_n.jpg",
            postContent:
              "Có một lần Momoca phát hiện ra bạn trai (cũ) của mình đang xem A::V. Tuy nhiên cô nàng không t:ứ:c g:i:ận...",
            postImage:
              "https://scontent.fdad4-1.fna.fbcdn.net/v/t39.30808-6/465268702_1098707525313891_1711980144806636327_n.jpg",
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
        ];
  });

  // Mỗi khi `posts` thay đổi, lưu nó vào LocalStorage
  useEffect(() => {
    localStorage.setItem("posts", JSON.stringify(posts));
  }, [posts]);
  const [formData, setFormData] = useState({
    postId: 0,
    userId: 0,
    postContent: "",
    postImage: "",
    createdate: "",
    username: username,
  });

  

  const formatTime = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  
    if (seconds < 60) return "Vừa xong";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} phút trước`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} giờ trước`;
    const days = Math.floor(hours / 24);
    return `${days} ngày trước`;
  };
  

  const createPost = async () => {
    const payload = {
      postId: formData.postId,
      userId: userId,
      postContent: formData.postContent,
      postImage: formData.postImage
    };
    try {
     
      const response = await fetch("https://localhost:7098/api/PostAPI/createPost",{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      
      console.log("Post created successfully:", response.data);
      const newPost = {
        ...response.data,
        username: username,                // Đảm bảo tên người dùng
        postContent: formData.postContent, // Đảm bảo có nội dung bài viết
        postImage: formData.postImage,     // Đảm bảo có hình ảnh bài viết
        createdAt: new Date().toISOString(),                 // Thời gian có thể tùy chỉnh nếu cần
      };
      setPosts([newPost, ...posts]); // Thêm bài mới vào đầu danh sách
      closeModal(); // Close modal after successful post creation
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };


  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    setContent("");
  };

  const handleContentChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      postContent: value, // Update postContent in formData directly
    }));
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

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64 = await convertToBase64(file);
      setFormData((prevData) => ({
        ...prevData,
        postImage: base64, // Store the Base64 string for the image
      }));
      setImagePreviewUrl(URL.createObjectURL(file)); // Set the preview URL
    }
  };


  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]); // Only the Base64 string part
      reader.onerror = (error) => reject(error);
    });
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
                value={formData.postContent}
                onChange={handleContentChange}
                modules={modules}
                placeholder="Nhân ơi, bạn đang nghĩ gì thế?"
                className="h-60"
              />
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
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
              onClick={createPost}
              disabled={!formData.postContent.trim()}
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
                <div className="text-sm text-gray-500">{formatTime(post.createdAt)}</div>
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

            <div className="mb-4" dangerouslySetInnerHTML={{ __html: post.postContent }} />


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
