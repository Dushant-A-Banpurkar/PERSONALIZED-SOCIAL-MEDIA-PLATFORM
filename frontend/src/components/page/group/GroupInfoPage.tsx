import React from 'react';

const GroupInfoPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-6">About This Group</h2>
        <p className="text-gray-700 mb-6">
          This is a sample group page to demonstrate the layout using React, TypeScript, and TailwindCSS.
        </p>
        
        <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
        <ul className="space-y-2 mb-6">
          <li><a href="#" className="text-blue-500 hover:underline">Group Rules</a></li>
          <li><a href="#" className="text-blue-500 hover:underline">Events</a></li>
          <li><a href="#" className="text-blue-500 hover:underline">Photos</a></li>
        </ul>
        
        <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
        <ul className="space-y-2">
          <li className="text-gray-600">John Doe joined the group.</li>
          <li className="text-gray-600">Jane Smith posted a new message.</li>
        </ul>
      </div>
    </div>
  );
};

export default GroupInfoPage;
