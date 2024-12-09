import React from 'react';

const Navbar: React.FC = () => {
  return (
    <div className="h-16 bg-white border-b border-gray-300 flex items-center justify-between px-6">
      <h1 className="font-grand-hotel text-2xl">Instagram</h1>
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-full bg-gray-300"></div>
        <div>
          <div className="font-semibold">John Doe</div>
          <div className="text-sm text-gray-500">@johndoe</div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;