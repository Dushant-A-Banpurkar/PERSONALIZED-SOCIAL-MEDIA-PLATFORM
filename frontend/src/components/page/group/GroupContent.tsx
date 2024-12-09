import React from 'react';

const GroupContent: React.FC = () => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Group Posts</h2>
      {/* Sample post */}
      <div className="mb-4">
        <div className="flex items-center mb-2">
          <img src="path/to/user-image.jpg" alt="User" className="w-10 h-10 rounded-full mr-2" />
          <div>
            <h3 className="font-semibold">John Doe</h3>
            <p className="text-gray-500 text-sm">2 hours ago</p>
          </div>
        </div>
        <p className="text-gray-700 mb-2">This is a sample post content. You can customize this component to display posts dynamically.</p>
        <div className="flex space-x-4">
          <button className="text-blue-500">Like</button>
          <button className="text-blue-500">Comment</button>
          <button className="text-blue-500">Share</button>
        </div>
      </div>
    </div>
  );
};

export default GroupContent;
