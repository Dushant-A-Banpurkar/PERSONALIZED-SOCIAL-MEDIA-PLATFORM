import React, { useEffect } from "react";
import usePosts from "../../../hooks/homepage_hooks/usePost"; // Assuming this hook fetches posts
import Post from "../home/Post"; // Importing the Post component

const ProfilePosts = ({ username, userId }: { username?: string; userId?: string }) => {
  const { posts, isLoading, isRefetching, refetch } = usePosts("profile", username, userId); // Assuming "profile" as feedType for ProfilePosts

  // Refetch posts when feedType or username changes
  useEffect(() => {
    refetch();
  }, [username, userId, refetch]);

  return (
    <>
      {/* Loading state */}
      {(isLoading || isRefetching) && (
        <div className="flex flex-col justify-center items-center">
          <p>Loading...</p>
        </div>
      )}

      {/* No posts available */}
      {!isLoading && !isRefetching && posts?.length === 0 && (
        <p className="text-center my-4">No posts in this profile.</p>
      )}

      {/* Display posts when available */}
      {!isLoading && !isRefetching && posts && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {posts.map((post) => (
            <div key={post._id} className="post bg-white shadow-md rounded-lg p-4 relative">
              {/* Each post is rendered here */}
              <Post post={post} />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default ProfilePosts;
