import React from 'react';

const ProfileContent: React.FC = () => {
  return (
    <div className="container mx-auto px-4 flex">
      <div className="w-3/4 p-4">
        {/* Posts, Friends List, Photos, etc. */}
        <div className="bg-white p-4 mb-4 shadow-sm rounded-lg">Post Content</div>
        <div className="bg-white p-4 mb-4 shadow-sm rounded-lg">Friends List</div>
        <div className="bg-white p-4 mb-4 shadow-sm rounded-lg">Photos</div>
      </div>
      <div className="w-1/4 p-4">
        {/* Sidebar Widgets */}
        <div className="bg-white p-4 mb-4 shadow-sm rounded-lg">Friend Requests</div>
        <div className="bg-white p-4 mb-4 shadow-sm rounded-lg">Upcoming Events</div>
      </div>
    </div>
  );
};

export default ProfileContent;