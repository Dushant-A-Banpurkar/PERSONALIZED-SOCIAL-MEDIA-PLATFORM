import React, { useEffect } from "react";
import usePosts from "../../../hooks/homepage_hooks/usePost";
import Post from "./Post";

const PostsList = ({ feedType, username, userId }: { feedType: string; username?: string; userId?: string }) => {
  const { posts, isLoading, isRefetching, refetch } = usePosts(feedType, username, userId);

  useEffect(() => {
    refetch();
  }, [feedType, username, refetch]);

  return (
    <>
      {(isLoading || isRefetching) && (
        <div className="flex flex-col justify-center">
          <p>Loading</p>
        </div>
      )}
      {!isLoading && !isRefetching && posts?.length === 0 && (
        <p className="text-center my-4">No posts in this tab. Switch 👻</p>
      )}
      {!isLoading && !isRefetching && posts && (
        <div>
          {posts.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      )}
    </>
  );
};

export default PostsList;
