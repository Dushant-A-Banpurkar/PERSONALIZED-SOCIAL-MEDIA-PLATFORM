import React from 'react';
import { IconEdit } from '@tabler/icons-react';

const AcademicInformation: React.FC = () => {
  return (
    <div className="bg-white w-full shadow-lg rounded-2xl p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-200 via-purple-300 to-pink-200 opacity-30 transform rotate-12 scale-110 rounded-2xl"></div>
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Academic Information
          </h2>
          <button className="text-gray-700 hover:text-gray-900 transition-transform transform hover:scale-110">
            <IconEdit className="w-7 h-7" />
          </button>
        </div>
        <div className="space-y-4">
          <div className="bg-gray-100 p-4 rounded-lg border border-gray-300 shadow-sm">
            <p className="text-lg font-medium text-gray-800"><strong>University:</strong> ABC University</p>
            <p className="text-lg font-medium text-gray-800"><strong>Major:</strong> Computer Science</p>
            <p className="text-lg font-medium text-gray-800"><strong>Year:</strong> Junior</p>
            <p className="text-lg font-medium text-gray-800"><strong>Courses:</strong> Data Structures, Algorithms, AI</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademicInformation;