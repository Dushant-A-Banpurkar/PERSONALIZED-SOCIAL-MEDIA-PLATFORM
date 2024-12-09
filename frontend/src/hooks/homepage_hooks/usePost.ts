import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const usePosts = (feedType: string, username?: string, userId?: string) => {
  const queryClient = useQueryClient();

  const getPostEndpoint = () => {
    switch (feedType) {
      case "forYou":
        return "/api/posts/all";
      case "following":
        return "/api/posts/following";
      case "posts":
        return `/api/posts/user/${username}`;
      case "likes":
        return `/api/posts/likes/${userId}`;
      default:
        return "/api/posts/all";
    }
  };

  const POST_ENDPOINT = getPostEndpoint();

  const { data: posts, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["posts", feedType, username],
    queryFn: async () => {
      const res = await fetch(POST_ENDPOINT);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      return data;
    },
    refetchOnWindowFocus: false,
  });

  const likePost = useMutation({
    mutationFn: async (postId: string) => {
      const res = await fetch(`/api/posts/like/${postId}`, { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const commentOnPost = useMutation({
    mutationFn: async ({ postId, text }: { postId: string; text: string }) => {
      const res = await fetch(`/api/posts/comment/${postId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Something went wrong");

      return data;
    },
    onSuccess: () => {
      toast.success("Comment posted successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const deletePost = useMutation({
    mutationFn: async (postId: string) => {
      const res = await fetch(`/api/posts/${postId}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Something went wrong");

      return data;
    },
    onSuccess: () => {
      toast.success("Post deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return {
    posts,
    isLoading,
    isRefetching,
    refetch,
    likePost,
    commentOnPost,
    deletePost,
  };
};

export default usePosts;
