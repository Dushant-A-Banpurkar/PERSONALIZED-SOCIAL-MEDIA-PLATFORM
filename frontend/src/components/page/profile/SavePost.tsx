import React, { useState } from 'react';
import { IconBookmark, IconBookmarkOff } from '@tabler/icons-react';

interface Post {
  id: number;
  title: string;
  content: string;
}

const dummyPosts: Post[] = [
  { id: 1, title: 'Post Title 1', content: 'This is the content of Post 1' },
  { id: 2, title: 'Post Title 2', content: 'This is the content of Post 2' },
  { id: 3, title: 'Post Title 3', content: 'This is the content of Post 3' }
];

const SavePost: React.FC = () => {
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);

  const toggleSave = (post: Post) => {
    setSavedPosts(prev =>
      prev.some(savedPost => savedPost.id === post.id)
        ? prev.filter(savedPost => savedPost.id !== post.id)
        : [...prev, post]
    );
  };

  return (
    <div className="save-post-section p-6 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {dummyPosts.map(post => (
          <div
            key={post.id}
            className="post bg-white shadow-lg hover:shadow-2xl rounded-xl p-5 border transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            <h3 className="text-xl font-bold text-gray-800">{post.title}</h3>
            <p className="text-gray-600 mt-3">{post.content}</p>

            <button
              onClick={() => toggleSave(post)}
              className="flex items-center justify-center bg-blue-100 hover:bg-blue-500 text-blue-600 hover:text-white rounded-full p-2 mt-4 transition-colors duration-300"
            >
              {savedPosts.some(savedPost => savedPost.id === post.id) ? (
                <IconBookmark className="w-6 h-6 animate-bounce" />
              ) : (
                <IconBookmarkOff className="w-6 h-6" />
              )}
              <span className="ml-2">
                {savedPosts.some(savedPost => savedPost.id === post.id) ? 'Saved' : 'Save Post'}
              </span>
            </button>
          </div>
        ))}
      </div>

      {/* Saved Posts Section */}
      <div className="saved-posts mt-10">
        <h2 className="text-3xl font-extrabold text-center text-green-600 mb-6">Saved Posts</h2>
        {savedPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {savedPosts.map(savedPost => (
              <div
                key={savedPost.id}
                className="post bg-green-50 shadow-lg rounded-xl p-5 border border-green-400"
              >
                <h3 className="text-xl font-bold text-green-800">{savedPost.title}</h3>
                <p className="text-gray-600 mt-3">{savedPost.content}</p>
                <span className="mt-3 inline-block text-green-700 font-semibold">Saved</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No posts saved yet.</p>
        )}
      </div>
    </div>
  );
};

export default SavePost;