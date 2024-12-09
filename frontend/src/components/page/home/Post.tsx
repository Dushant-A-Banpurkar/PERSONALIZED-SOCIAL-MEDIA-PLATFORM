import React, { useState } from 'react';
import { FaRegComment, FaRegHeart, FaTrash, FaRegBookmark } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner";
import { formatPostDate } from "../../utils/date/index";

const Post: React.FC<{ post: any }> = ({ post }) => {
  const [comment, setComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const queryClient = useQueryClient();

  // Fetch authenticated user
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  // Check if the post is liked and belongs to the current user
  const isLiked = post.likes.includes(authUser._id);
  const isMyPost = authUser._id === post.user._id;

  // Formatting post date
  const formattedDate = formatPostDate(post.createdAt);

  // Mutation to delete a post
  const { mutate: deletePost, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/posts/${post._id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data;
    },
    onSuccess: () => {
      toast.success("Post deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  // Mutation to like a post
  const { mutate: likePosts, isPending: isLiking } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/posts/like/${post._id}`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data;
    },
    onSuccess: (updateLikes) => {
      queryClient.invalidateQueries(["posts"], (oldData) => {
        return oldData.map((p) => (p._id === post._id ? { ...p, likes: updateLikes } : p));
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Mutation to post a comment
  const { mutate: commentPost, isPending: isCommenting } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/posts/comment/${post._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: comment }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data;
    },
    onSuccess: () => {
      toast.success("Comment posted successfully");
      setComment("");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleDeletePost = () => deletePost();
  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (isCommenting) return;
    commentPost();
  };
  const handleLikePost = () => {
    if (!isLiking) likePosts();
  };

  return (
    <div className="border border-gray-300 bg-white rounded-lg shadow-md mb-6">
      {/* Post Header */}
      <div className="flex items-center p-4">
        <div className="w-10 h-10 rounded-full mr-3">
          <img className="rounded-full h-10 w-10" src={post.user.profileimg} alt="User" />
        </div>
        <div>
          <h2 className="font-bold">{post.user.firstname} {post.user.lastname}</h2>
          <p className="text-gray-500 text-sm">@{post.user.username} {formattedDate}</p>
        </div>
        {isMyPost && (
          <div className="ml-auto">
            {!isDeleting ? (
              <FaTrash
                className="cursor-pointer hover:text-red-500 text-gray-500"
                onClick={handleDeletePost}
              />
            ) : (
              <LoadingSpinner size="sm" />
            )}
          </div>
        )}
      </div>

      {/* Post Image */}
      <img src={post.img} alt="Post" className="w-full rounded-t-md" />

      {/* Post Actions */}
      <div className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            {/* Like Button */}
            <div className="flex items-center cursor-pointer" onClick={handleLikePost}>
              {!isLiked && !isLiking ? (
                <FaRegHeart className="w-5 h-5 text-gray-500 hover:text-pink-500" />
              ) : (
                <FaRegHeart className="w-5 h-5 text-pink-500" />
              )}
              <span className={`text-sm ml-1 ${isLiked ? "text-pink-500" : "text-gray-500"}`}>
                {post.likes.length}
              </span>
            </div>
            {/* Comment Icon */}
            <div
              className="flex items-center cursor-pointer"
              onClick={() => setShowComments((prev) => !prev)}
            >
              <FaRegComment className="w-5 h-5 text-gray-500 hover:text-sky-400" />
              <span className="text-sm ml-1 text-gray-500">{post.comments.length}</span>
            </div>
            <div className="flex items-center cursor-pointer">
              <BiRepost className="w-6 h-6 text-gray-500 hover:text-green-500" />
            </div>
          </div>
          <FaRegBookmark className="w-5 h-5 text-gray-500 cursor-pointer hover:text-blue-500" />
        </div>

        {/* Post Text */}
        <div className="mt-3">
          <strong>{post.user.firstname} {post.user.lastname}</strong> {post.text}
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="p-4 bg-gray-50">
          {/* Display Comments */}
          {post.comments.map((cmt, idx) => (
            <div key={idx} className="mb-2">
              <strong>{cmt.user.firstname} {cmt.user.lastname} :</strong> {cmt.text}
            </div>
          ))}
          {/* Comment Form */}
          <form onSubmit={handlePostComment} className="mt-4 flex items-center">
            <textarea
              className="textarea w-full p-2 rounded border border-gray-300 focus:outline-none focus:border-blue-400"
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              className="btn ml-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              disabled={isCommenting}
            >
              {isCommenting ? <LoadingSpinner size="md" /> : "Post"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Post;
