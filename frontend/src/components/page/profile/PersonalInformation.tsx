import React from 'react';
import { IconEdit } from '@tabler/icons-react';

const PersonalInformation: React.FC = () => {
  return (
    <div className="p-6 rounded-xl shadow-lg relative text-black">
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-200 via-purple-200 to-pink-200 opacity-20 rounded-x"></div>
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold">Personal Information</h2>
          <button className="text-white hover:text-gray-200 transition-transform transform hover:scale-110">
            <IconEdit className="w-6 h-6" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Age and Gender Card */}
          <div className="bg-white bg-opacity-10 backdrop-blur-md p-4 rounded-lg flex items-center space-x-4">
            <div className="w-14 h-14 bg-pink-500 text-white rounded-full flex items-center justify-center text-2xl font-semibold">
              21
            </div>
            <div>
              <p className="text-lg">
                <strong>Age:</strong> 21
              </p>
              <p className="text-lg">
                <strong>Gender:</strong> Male
              </p>
            </div>
          </div>
          {/* Location and Email Card */}
          <div className="bg-white bg-opacity-10 backdrop-blur-md p-4 rounded-lg space-y-2">
            <p className="text-lg">
              <strong>Location:</strong> New York, NY
            </p>
            <p className="text-lg">
              <strong>Email:</strong> johndoe@example.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInformation;