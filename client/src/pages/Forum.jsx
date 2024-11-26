import { useState, useEffect } from "react";
import { Modal, Button, Spinner } from "flowbite-react";
import { FaThumbsUp, FaComment } from "react-icons/fa";
import { FiMoreHorizontal } from "react-icons/fi";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Dropdown } from "flowbite-react";

function formatTimeDifference(timestamp) {
  const now = new Date();
  const time = new Date(timestamp);
  const differenceInSeconds = Math.floor((now - time) / 1000);

  if (differenceInSeconds < 60) {
    return `${differenceInSeconds} giây trước`;
  } else if (differenceInSeconds < 3600) {
    const minutes = Math.floor(differenceInSeconds / 60);
    return `${minutes} phút trước`;
  } else if (differenceInSeconds < 86400) {
    const hours = Math.floor(differenceInSeconds / 3600);
    return `${hours} giờ trước`;
  } else if (differenceInSeconds < 2592000) {
    const days = Math.floor(differenceInSeconds / 86400);
    return `${days} ngày trước`;
  } else if (differenceInSeconds < 31104000) {
    const months = Math.floor(differenceInSeconds / 2592000);
    return `${months} tháng trước`;
  } else {
    const years = Math.floor(differenceInSeconds / 31104000);
    return `${years} năm trước`;
  }
}

function CommentSection({ postId, userId, refreshPosts }) {
  const [comments, setComments] = useState([]);

  const [deleteCommentPopup, setDeleteCommentPopup] = useState(false);
  const [updateCommentPopup, setUpdateCommentPopup] = useState(false);
  const [updateContent, setUpdateContent] = useState("");
  const [visibleComments, setVisibleComments] = useState(3);
  const [commentContent, setCommentContent] = useState("");
  const [loadingComments, setLoadingComments] = useState(true);
  const [ReplyCommentContent, setReplyCommentContent] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyingToUsername, setReplyingToUsername] = useState("");
  const role = localStorage.getItem("role");
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [commentToUpdate, setCommentToUpdate] = useState(null);
  const [confirmupdateModal, setConfirmUpdateModal] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      setLoadingComments(true);
      try {
        const response = await fetch(`https://opms1.runasp.net/api/CommentAPI/getCommentByPostId?postId=${postId}`);
        if (!response.ok) throw new Error("Failed to fetch comments");
        const commentsData = await response.json();

        // Fetch user images and basic info for each comment
        const commentsWithUserImages = await Promise.all(
          commentsData.map(async (comment) => {
            try {
              const userResponse = await fetch(
                `https://opms1.runasp.net/api/UserAPI/getUserById?userId=${comment.userId}`
              );
              if (!userResponse.ok) throw new Error("Failed to fetch user data");
              const userData = await userResponse.json();

              // Fetch replies for each comment
              const repliesResponse = await fetch(
                `https://opms1.runasp.net/api/ReplyCommentAPI/getReplyCommentByCommentId?commentId=${comment.commentId}`
              );
              const repliesData = repliesResponse.ok ? await repliesResponse.json() : [];

              // Fetch user data for each reply
              const repliesWithUserData = await Promise.all(
                repliesData.map(async (reply) => {
                  try {
                    const replyUserResponse = await fetch(
                      `https://opms1.runasp.net/api/UserAPI/getUserById?userId=${reply.userId}`
                    );
                    if (!replyUserResponse.ok) throw new Error("Failed to fetch user data for reply");
                    const replyUserData = await replyUserResponse.json();

                    return {
                      ...reply,
                      username: replyUserData.username,
                      userImage: replyUserData.userImage || "https://via.placeholder.com/40"
                    };
                  } catch (error) {
                    console.error("Error fetching user data for reply:", error);
                    return {
                      ...reply,
                      username: "Unknown",
                      userImage: "https://via.placeholder.com/40"
                    };
                  }
                })
              );

              return {
                ...comment,
                userImage: userData.userImage || "https://via.placeholder.com/40",
                username: userData.username,
                replies: repliesWithUserData
              };
            } catch (error) {
              console.error("Error fetching user image or replies for comment:", error);
              return {
                ...comment,
                userImage: "https://via.placeholder.com/40",
                username: "Unknown",
                replies: []
              };
            }
          })
        );

        setComments(commentsWithUserImages);
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setLoadingComments(false);
      }
    };
    fetchComments();
  }, [postId]);

  const handleAddComment = async () => {
    if (!userId) {
      window.location.href = "/sign-in";
      return;
    }
    if (!commentContent.trim()) return;

    try {
      const response = await fetch("https://opms1.runasp.net/api/CommentAPI/createComment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
          userId,
          commentsContent: commentContent,
          commentTime: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setCommentContent("");
        refreshPosts();
      } else {
        console.error("Failed to add comment");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleReply = (commentId, username) => {
    setReplyingTo(commentId);
    setReplyingToUsername(username);
  };

  const handleAddReply = async () => {
    if (!userId) {
      window.location.href = "/sign-in";
      return;
    }
    if (!ReplyCommentContent.trim()) return;

    try {
      const response = await fetch("https://opms1.runasp.net/api/ReplyCommentAPI/createReplyComment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          commentId: replyingTo,
          userId,
          ReplyCommentContent,
          replyTime: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setReplyCommentContent("");
        setReplyingTo(null);
        setReplyingToUsername("");
        refreshPosts();
      } else {
        console.error("Failed to add reply");
      }
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  const confirmUpdateComment = (comment) => {
    setCommentToUpdate(comment); // Đặt comment cần cập nhật
    setUpdateContent(comment.commentsContent); // Lưu nội dung vào state
    setConfirmUpdateModal(true); // Mở modal
  };
  const confirmDeleteComment = (commentId) => {
    setCommentToDelete(commentId);
    setConfirmDeleteModal(true);
  };
  const handleDeleteComment = async () => {
    try {
      const response = await fetch(
        `https://opms1.runasp.net/api/CommentAPI/deleteComment?id=${commentToDelete}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        refreshPosts();
        setConfirmDeleteModal(false);
        setDeleteCommentPopup(true);
        setTimeout(() => setDeleteCommentPopup(false), 2000);
      } else {
        console.error("Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };
  const handleUpdateComment = async () => {
    try {
      const response = await fetch("https://opms1.runasp.net/api/CommentAPI/updateComment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId: commentToUpdate.postId,
          userId: commentToUpdate.userId,
          commentId: commentToUpdate.commentId,
          commentsContent: updateContent,
        }),
      });

      if (response.ok) {
        refreshPosts();
        setConfirmUpdateModal(false);
        setUpdateCommentPopup(true);
        setTimeout(() => setUpdateCommentPopup(false), 2000);
      } else {
        console.error("Failed to update comment");
      }
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };
  const handleLikeComment = async (comment) => {
    if (!userId) {
      window.location.href = "/sign-in";
      return;
    }
    try {


      const response = await fetch(
        `https://opms1.runasp.net/api/CommentAPI/likeComment?id=${comment.commentId}`,
        {
          method: "POST",
        }
      );

      if (response.ok) {

      } else {
        console.error("Failed to update like status");
      }
    } catch (error) {
      console.error("Error updating like status:", error);
    }
  };

  return (
    <div className="mt-4">
      {loadingComments ? (
        <div className="text-center">
          <Spinner size="lg" aria-label="Đang tải bình luận..." />
          <p className="text-gray-500">Đang tải bình luận...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.slice(0, visibleComments).map((comment) => (
            <div key={comment.commentId} className="flex flex-col space-y-2">
              {/* Main Comment */}
              <div className="flex items-start space-x-4">
                <img
                  src={comment.userImage || "https://via.placeholder.com/40"}
                  alt="Hình đại diện"
                  className="w-12 h-12 rounded-full"
                  onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/40"; }}
                />
                <div className="flex flex-col flex-1">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <span className="font-semibold text-base mr-1">
                      {comment.username}
                    </span>
                    <br />
                    <span className="text-base">{comment.commentsContent}</span>
                  </div>
                  <div className="mt-1 text-sm text-gray-500 flex items-center space-x-4">
                    <span>
                      {comment.updatedAt && new Date(comment.updatedAt) > new Date(comment.commentTime)
                        ? formatTimeDifference(comment.updatedAt)
                        : formatTimeDifference(comment.commentTime)}
                    </span>
                    <div className="flex items-center space-x-2">
                      <button
                        className={`flex items-center space-x-1 ${comment.hasLiked ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
                          }`}
                        onClick={() => handleLikeComment(comment)}
                      >
                        <FaThumbsUp />

                      </button>
                      <span className="text-sm text-gray-500">
                        {comment.likeComment} lượt thích
                      </span>
                    </div>
                    <button
                      className="flex items-center space-x-1 text-gray-600 hover:text-blue-600"
                      onClick={() => handleReply(comment.commentId, comment.username)}
                    >
                      <FaComment />
                      <span>Phản hồi</span>
                    </button>
                  </div>
                  {/* Reply Input Field */}
                  {replyingTo === comment.commentId && (
                    <div className="flex items-center mt-2">
                      <input
                        type="text"
                        value={ReplyCommentContent}
                        onChange={(e) => setReplyCommentContent(e.target.value)}
                        placeholder={`Trả lời bình luận của ${replyingToUsername}`}
                        className="flex-grow p-3 border rounded-full bg-gray-100"
                      />
                      <Button
                        onClick={handleAddReply}
                        className="ml-2 text-lg"
                        disabled={!ReplyCommentContent.trim()}
                      >
                        Gửi
                      </Button>
                    </div>
                  )}
                </div>
                {/*add delete coment */}
                {(comment.userId === userId || role === "1") && (
                  <Dropdown
                    arrowIcon={false}
                    inline
                    label={<FiMoreHorizontal className="text-gray-500 cursor-pointer" />}
                  >
                    {comment.userId === userId && (
                      <Dropdown.Item onClick={() => confirmUpdateComment(comment)}>Sửa bình luận</Dropdown.Item>
                    )}
                    <Dropdown.Item onClick={() => confirmDeleteComment(comment.commentId)}>
                      Xóa bình luận
                    </Dropdown.Item>
                  </Dropdown>
                )}
              </div>
              {deleteCommentPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="bg-white p-6 rounded-lg shadow-md text-center space-y-3">
                    <p className="text-lg font-semibold text-green-600">
                      Xóa bình luận thành công!
                    </p>
                  </div>
                </div>
              )}
              <Modal
                show={confirmupdateModal}
                onClose={() => setConfirmUpdateModal(false)}
                size="md"
                popup={true}
              >
                <Modal.Header className="text-lg font-semibold text-red-600">
                  chỉnh sửa bình luận
                </Modal.Header>

                <Modal.Footer>
                  <input
                    type="text"
                    name="comment"
                    value={updateContent}
                    onChange={(e) => setUpdateContent(e.target.value)}
                    placeholder={`Chỉnh sửa bình luận`}
                    className="flex-grow p-3 border rounded-full bg-gray-100"
                  />
                  <Button
                    onClick={handleUpdateComment}
                    className="ml-2 text-lg"
                    disabled={!updateContent.trim()}
                  >
                    Gửi
                  </Button>
                </Modal.Footer>
              </Modal>
              <Modal
                show={confirmDeleteModal}
                onClose={() => setConfirmDeleteModal(false)}
                size="md"
                popup={true}
              >
                <Modal.Header className="text-lg font-semibold text-red-600">
                  Xác nhận xóa
                </Modal.Header>
                <Modal.Body>
                  <p className="text-sm text-gray-700">
                    Bạn có chắc chắn muốn xóa bình luận này không? Hành động này không thể hoàn tác.
                  </p>
                </Modal.Body>
                <Modal.Footer>
                  <Button onClick={() => setConfirmDeleteModal(false)} color="gray">
                    Hủy
                  </Button>
                  <Button onClick={handleDeleteComment} color="red">
                    Xóa
                  </Button>
                </Modal.Footer>
              </Modal>
              {/* Replies to the Comment */}
              {comment.replies && comment.replies.map((reply) => (
                <div key={reply.replyId} className="ml-12 mt-2 flex items-start space-x-4">
                  <img
                    src={reply.userImage || "https://via.placeholder.com/40"}
                    alt="Hình đại diện"
                    className="w-10 h-10 rounded-full"
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/40"; }}
                  />
                  <div className="flex flex-col flex-1">
                    <div className="bg-gray-100 p-2 rounded-lg">
                      <span className="font-semibold text-sm mr-1">
                        {reply.username}
                      </span>
                      <br />
                      <span className="text-sm">{reply.replyCommentContent}</span>
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      <span>{formatTimeDifference(reply.createAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
          {comments.length > visibleComments && (
            <button
              onClick={() => setVisibleComments((prev) => prev + 3)}
              className="text-blue-600 text-sm underline hover:text-blue-800"
            >
              Xem thêm bình luận
            </button>
          )}
        </div>
      )}

      {/* Add New Comment Section */}
      <div className="flex items-center mt-4">
        <input
          type="text"
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
          placeholder={`Bình luận dưới tên ${userId ? "của bạn" : "Khách"}`}
          className="flex-grow p-3 border rounded-full bg-gray-100"
        />
        <Button
          onClick={handleAddComment}
          className="ml-2 text-lg"
          disabled={!commentContent.trim()}
        >
          Gửi
        </Button>
      </div>
    </div>
  );
}

export default function Forum() {
  const userId = parseInt(localStorage.getItem("userId"), 10);
  const role = localStorage.getItem("role");

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deletePopup, setDeletePopup] = useState(false);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState([]);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [postToDelete, setPostToDelete] = useState(null);
  const [postToUpdate, setPostToUpdate] = useState(null);
  const [userImage, setUserImage] = useState("https://via.placeholder.com/40");

  useEffect(() => {
    const fetchUserImage = async () => {
      if (userId) {
        try {
          const response = await fetch(`https://opms1.runasp.net/api/UserAPI/getUserById?userId=${userId}`);
          if (response.ok) {
            const userData = await response.json();
            setUserImage(userData.userImage || "https://via.placeholder.com/40");
          } else {
            console.error("Failed to fetch user data");
          }
        } catch (error) {
          console.error("Error fetching user image:", error);
        }
      }
    };
    fetchUserImage();
    fetchPosts();
  }, [userId]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://opms1.runasp.net/api/PostAPI/getPost");
      if (!response.ok) throw new Error("Failed to fetch posts");
      const postData = await response.json();

      const likedPostsResponse = await fetch(`https://opms1.runasp.net/api/PostAPI/getUserLikedPosts?userId=${userId}`);
      const likedPosts = likedPostsResponse.ok ? await likedPostsResponse.json() : [];

      localStorage.setItem("likedPosts", JSON.stringify(likedPosts));

      const postsWithUsernames = await Promise.all(
        postData.map(async (post) => {
          try {
            const userResponse = await fetch(
              `https://opms1.runasp.net/api/UserAPI/getUserById?userId=${post.userId}`
            );
            if (!userResponse.ok) throw new Error("Failed to fetch user data");
            const userData = await userResponse.json();

            const hasLiked = likedPosts.includes(post.postId);
            const likeCount = post.likePost || 0;

            return {
              ...post,
              username: userData.username,
              userImage: userData.userImage || "https://via.placeholder.com/40",
              hasLiked,
              likePost: likeCount,
            };
          } catch (error) {
            console.error("Error fetching post details:", error);
            return { ...post, username: "Unknown", userImage: "https://via.placeholder.com/40", hasLiked: false, likePost: 0 };
          }
        })
      );

      const sortedPosts = postsWithUsernames.sort(
        (a, b) => new Date(b.createdate) - new Date(a.createdate)
      );
      setPosts(sortedPosts);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setLoading(false);
    }
  };

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    setContent("");
    setUploadedImage(null);
    setImagePreviewUrl("");
  };

  const handleContentChange = (value) => setContent(value);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedImage(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDeleteImage = () => {
    setUploadedImage(null);
    setImagePreviewUrl("");
  };

  const createPost = async () => {
    const formData = new FormData();
    formData.append("postId", 0);
    formData.append("userId", userId);
    formData.append("postContent", content);
    formData.append("createdate", new Date().toISOString());

    if (uploadedImage) {
      formData.append("uploadedImage", uploadedImage);
    }

    try {
      const response = await fetch("https://opms1.runasp.net/api/PostAPI/createPost", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        await fetchPosts();
        closeModal();
      } else {
        const errorText = await response.text();
        console.error("Failed to create post:", errorText);
        alert("Error creating post: " + errorText);
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const confirmDeletePost = (postId) => {
    setPostToDelete(postId);
    setConfirmDeleteModal(true);
  };

  const handleDeletePost = async () => {
    try {
      const response = await fetch(
        `https://opms1.runasp.net/api/PostAPI/deletePost?id=${postToDelete}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        setConfirmDeleteModal(false);
        await fetchPosts();
        setDeletePopup(true);
        setTimeout(() => setDeletePopup(false), 2000);
      } else {
        console.error("Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const confirmUpdatePost = (post) => {
    setPostToUpdate(post);
    setIsOpen(true);
    setContent(post.postContent);
    if (post.postImage) {
      setImagePreviewUrl(post.postImage);
    }
  };

  const handleUpdatePost = async () => {
    const formData = new FormData();
    formData.append("postId", postToUpdate.postId);
    formData.append("userId", userId);
    formData.append("postContent", content);
    formData.append("createdate", postToUpdate.createdate);

    if (uploadedImage) {
      formData.append("uploadedImage", uploadedImage);
    }

    try {
      const response = await fetch("https://opms1.runasp.net/api/PostAPI/updatePost", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        await fetchPosts();
        closeModal();
      } else {
        const errorText = await response.text();
        console.error("Failed to update post:", errorText);
        alert("Error updating post: " + errorText);
      }
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const formatLikes = (likes) => {
    if (likes >= 1000000) return `${Math.floor(likes / 1000000)}tr`;
    if (likes >= 1000) return `${Math.floor(likes / 1000)}k`;
    return likes;
  };

  const handleLikePost = async (post) => {
    if (!userId) {
      window.location.href = "/sign-in";
      return;
    }
    try {
      const isLiked = post.hasLiked;
      const likeValue = isLiked ? 0 : 1;

      const response = await fetch(
        `https://opms1.runasp.net/api/PostAPI/likePost?like=${likeValue}&postId=${post.postId}&userId=${userId}`,
        {
          method: "POST",
        }
      );

      if (response.ok) {
        const updatedLikedPosts = JSON.parse(localStorage.getItem("likedPosts")) || [];
        if (likeValue === 1) {
          updatedLikedPosts.push(post.postId);
        } else {
          const index = updatedLikedPosts.indexOf(post.postId);
          if (index > -1) {
            updatedLikedPosts.splice(index, 1);
          }
        }
        localStorage.setItem("likedPosts", JSON.stringify(updatedLikedPosts));

        setPosts((prevPosts) =>
          prevPosts.map((p) =>
            p.postId === post.postId
              ? {
                ...p,
                likePost: isLiked ? p.likePost - 1 : p.likePost + 1,
                hasLiked: !isLiked,
              }
              : p
          )
        );
      } else {
        console.error("Failed to update like status");
      }
    } catch (error) {
      console.error("Error updating like status:", error);
    }
  };

  return (
    <main className="bg-gray-100 min-h-screen p-4">
      {loading ? (
        <div className="flex items-center justify-center h-screen w-full">
          <div className="flex flex-col items-center">
            <Spinner aria-label="Loading spinner" size="xl" />
            <span className="mt-3 text-lg font-semibold">Đang tải...</span>
          </div>
        </div>
      ) : (
        <>
          <div className="max-w-full lg:max-w-lg w-full bg-white shadow-md rounded-lg mx-auto p-4 my-4">
            <div className="flex items-center border-b border-gray-200 pb-4 mb-4">
              <img
                src={userImage}
                alt="Profile"
                className="w-12 h-12 rounded-full mr-4"
                onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/40"; }}
              />
              <div
                onClick={openModal}
                className="flex-grow bg-gray-100 px-4 py-3 rounded-full text-gray-500 cursor-pointer text-lg"
              >
                User ơi, bạn đang nghĩ gì thế?
              </div>
            </div>

            <Modal show={isOpen} onClose={closeModal} size="lg">
              <Modal.Header>{postToUpdate ? "Sửa bài viết" : "Tạo bài viết"}</Modal.Header>
              <Modal.Body>
                <div className="space-y-4 max-h-[500px] overflow-y-auto">
                  <ReactQuill
                    value={content}
                    onChange={handleContentChange}
                    placeholder="Bạn đang nghĩ gì thế?"
                    className="h-60"
                  />
                </div>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="mt-4 mb-2 block"
                />

                {imagePreviewUrl && (
                  <div className="mt-2 flex flex-col items-center">
                    <img
                      src={imagePreviewUrl}
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
                  onClick={postToUpdate ? handleUpdatePost : createPost}
                  disabled={!content.trim()}
                  className="w-full text-lg"
                >
                  {postToUpdate ? "Cập nhật" : "Đăng"}
                </Button>
              </Modal.Footer>
            </Modal>
          </div>

          {deletePopup && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-md text-center space-y-3">
                <p className="text-lg font-semibold text-green-600">
                  Xóa bài đăng thành công!
                </p>
              </div>
            </div>
          )}

          <Modal
            show={confirmDeleteModal}
            onClose={() => setConfirmDeleteModal(false)}
            size="md"
            popup={true}
          >
            <Modal.Header className="text-lg font-semibold text-red-600">
              Xác nhận xóa
            </Modal.Header>
            <Modal.Body>
              <p className="text-sm text-gray-700">
                Bạn có chắc chắn muốn xóa bài viết này không? Hành động này không thể hoàn tác.
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={() => setConfirmDeleteModal(false)} color="gray">
                Hủy
              </Button>
              <Button onClick={handleDeletePost} color="red">
                Xóa
              </Button>
            </Modal.Footer>
          </Modal>

          <div className="space-y-4 max-w-full lg:max-w-lg mx-auto">
            {posts.map((post) => (
              <div key={post.postId} className="bg-white shadow-md rounded-lg p-4">
                <div className="flex items-center mb-4">
                  <img
                    src={post.userImage}
                    alt="Profile"
                    className="w-12 h-12 rounded-full"
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/40"; }}
                  />
                  <div className="ml-4 flex-grow">
                    <div className="font-semibold text-lg">{post.username}</div>
                    <div className="text-sm text-gray-500">
                      <span>
                        {post.updatedate && new Date(post.updatedAt) > new Date(post.createdate)
                          ? formatTimeDifference(post.updatedAt)
                          : formatTimeDifference(post.createdate)}
                      </span>
                    </div>
                  </div>
                  {(post.userId === userId || role === "1") && (
                    <Dropdown
                      arrowIcon={false}
                      inline
                      label={<FiMoreHorizontal className="text-gray-500 cursor-pointer" />}
                    >
                      {post.userId === userId && (
                        <Dropdown.Item onClick={() => confirmUpdatePost(post)}>Sửa bài viết</Dropdown.Item>
                      )}
                      <Dropdown.Item onClick={() => confirmDeletePost(post.postId)}>
                        Xóa bài viết
                      </Dropdown.Item>
                    </Dropdown>
                  )}
                </div>

                <div
                  className="mb-4 text-lg"
                  dangerouslySetInnerHTML={{ __html: post.postContent }}
                />

                {post.postImage && (
                  <div className="rounded-lg overflow-hidden mb-4">
                    <img
                      src={post.postImage}
                      alt="Post Content"
                      className="w-full"
                      onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/40"; }}
                    />
                  </div>
                )}

                <div className="flex justify-between border-t border-b border-gray-200 py-4 text-gray-600">
                  <div className="flex items-center space-x-2">
                    <button
                      className={`flex items-center space-x-1 ${post.hasLiked ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
                        }`}
                      onClick={() => handleLikePost(post)}
                    >
                      <FaThumbsUp />
                      <span className="text-lg">Thích</span>
                    </button>
                    <span className="text-sm text-gray-500">
                      {formatLikes(post.likePost)} lượt thích
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      className="flex items-center space-x-1 hover:text-blue-600"
                      onClick={() => { }}
                    >
                      <FaComment />
                      <span className="text-lg">Bình luận</span>
                    </button>
                  </div>
                </div>

                <CommentSection postId={post.postId} userId={userId} refreshPosts={fetchPosts} />
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}