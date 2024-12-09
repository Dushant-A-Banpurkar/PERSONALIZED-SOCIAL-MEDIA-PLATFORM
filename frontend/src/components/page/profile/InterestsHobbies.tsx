import React from 'react';
import { IconEdit } from '@tabler/icons-react';

const InterestsHobbies: React.FC = () => {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 opacity-10 transform -skew-y-6 scale-150"></div>
      <div className="relative z-10">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600 tracking-wider">
            Interests & Hobbies
          </h2>
          <button className="text-gray-600 hover:text-gray-800 transition-transform transform hover:scale-110">
            <IconEdit className="w-6 h-6" />
          </button>
        </div>
        <div className="mt-4 space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-green-600 rounded-full"></div>
            <span className="text-lg text-gray-700 font-medium">Coding</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
            <span className="text-lg text-gray-700 font-medium">Reading</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-purple-600 rounded-full"></div>
            <span className="text-lg text-gray-700 font-medium">Hiking</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-yellow-600 rounded-full"></div>
            <span className="text-lg text-gray-700 font-medium">Trading</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-red-600 rounded-full"></div>
            <span className="text-lg text-gray-700 font-medium">Photography</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-orange-600 rounded-full"></div>
            <span className="text-lg text-gray-700 font-medium">Gaming</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterestsHobbies;