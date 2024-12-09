import { useQuery } from '@tanstack/react-query';
import React from 'react';

const Profile: React.FC = () => {

  const {data:authUser}=useQuery({queryKey:["authUser"]});
  return (
    <div className="bg-white border border-gray-300 rounded-md p-4 shadow-md">
      <div className="flex items-center mb-04">
        <div className="mr-3">
        <img className='w-16 h-16 rounded-full' src={authUser?.profileimg || "/avatar-placeholder.png"} />
        </div>
        <div>
          <p className="font-bold text-xl">{authUser?.firstname} {authUser?.lastname}</p>
          <p className="text-sm text-gray-500">@{authUser?.username}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="w-full aspect-w-1 aspect-h-1 bg-gray-300"></div>
        ))}
      </div>
    </div>
  );
};

export default Profile;