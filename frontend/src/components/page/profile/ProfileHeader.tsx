import React, { useState } from 'react';
import ProfilePosts from './ProfilePost';
import { useQuery } from '@tanstack/react-query';
import EditProfileModal from './hooks/EditProfileModal';
import ImageModal from './ImageModal';

const ProfileHeader: React.FC = () => {
  const [profileimg, setProfileImg] = useState<string>('/default-profile.jpg');
  const [coverimg, setCoverImg] = useState<string>('/default-cover.jpg');
  const [selectedTab, setSelectedTab] = useState<'Post' | 'Save' | 'About'>('Post');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageType, setImageType] = useState<'profileimg' | 'coverimg' | null>(null);

  const { data: authUser } = useQuery({
    queryKey: ["authUser"]
  });

  const handleImageModalOpen = (type: 'profileimg' | 'coverimg') => {
    setImageType(type);
    setIsImageModalOpen(true);
  };

  const handleImageChange = (newImage: string) => {
    if (imageType === 'profileimg') {
      setProfileImg(newImage);
    } else if (imageType === 'coverimg') {
      setCoverImg(newImage);
    }
    setIsImageModalOpen(false);
  };

  return (
    <div className="profile-header bg-slate-50 shadow-md rounded-xl p-6 relative max-w-7xl mx-auto">
      <div
        className="cover-photo bg-gray-300 h-72 rounded-t-lg relative cursor-pointer overflow-hidden"
        onClick={() => handleImageModalOpen('coverimg')}
      >
        <img
          src={coverimg}
          alt="Cover"
          className="w-full h-full object-cover rounded-t-lg transition-all hover:scale-105"
        />
      </div>

      <div
        className="relative -mt-16 ml-4 cursor-pointer z-10"
        onClick={() => handleImageModalOpen('profileimg')}
      >
        <img
          src={profileimg}
          alt="Profile"
          className="w-32 h-32 rounded-full border-4 border-white shadow-lg hover:border-blue-400 transition-all"
        />
      </div>

      <div className="ml-4 mt-6">
        <h1 className="text-3xl font-bold text-gray-800">{authUser?.firstname} {authUser?.lastname}</h1>
        <p className="text-gray-600">@{authUser?.username}</p>
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="mt-3 text-white bg-blue-500 p-2 rounded-full hover:bg-blue-600 transition duration-300"
        >
          Edit Profile
        </button>
      </div>

      {isEditModalOpen && (
        <EditProfileModal
          authUser={authUser}
          closeModal={() => setIsEditModalOpen(false)}
        />
      )}

      {isImageModalOpen && imageType && (
        <ImageModal
          type={imageType}
          closeModal={() => setIsImageModalOpen(false)}
          onImageChange={handleImageChange} // Callback to update images
        />
      )}

      <div className="tabs-section mt-6 flex justify-evenly border-t border-gray-300 py-2">
        <button
          className={`w-full text-center py-2 ${selectedTab === 'Post' ? 'border-b-2 border-blue-500 font-semibold text-blue-600' : 'text-gray-700'}`}
          onClick={() => setSelectedTab('Post')}
        >
          Post
        </button>
      </div>

      <div className="mt-4">
        {selectedTab === 'Post' && <ProfilePosts />}
      </div>
    </div>
  );
};

export default ProfileHeader;
