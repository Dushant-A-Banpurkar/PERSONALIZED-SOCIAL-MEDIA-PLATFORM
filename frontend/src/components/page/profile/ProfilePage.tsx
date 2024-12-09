import React, { useState, useRef } from 'react';
import ProfileHeader from './ProfileHeader';
import axios from 'axios';

const ProfilePage: React.FC = () => {
  const [profilePic, setProfilePic] = useState<string>('profile-pic-url');
  const [coverPhoto, setCoverPhoto] = useState<string>('cover-photo-url');
  const [loading, setLoading] = useState<boolean>(false);
  
  const profilePicInputRef = useRef<HTMLInputElement>(null);
  const coverPhotoInputRef = useRef<HTMLInputElement>(null);

  const handleProfilePicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePic(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverPhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setCoverPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfilePicClick = () => {
    if (profilePicInputRef.current) {
      profilePicInputRef.current.click();
    }
  };

  const handleCoverPhotoClick = () => {
    if (coverPhotoInputRef.current) {
      coverPhotoInputRef.current.click();
    }
  };

  const updateProfile = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      if (profilePic) {
        formData.append('profileimg', profilePic);
      }
      if (coverPhoto) {
        formData.append('coverimg', coverPhoto);
      }
      
      const { data } = await axios.post('/api/users/update', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setProfilePic(data.profileimg);
      setCoverPhoto(data.coverimg);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 ml-96">
      <div className="container bg-white shadow-xl rounded-xl p-4 max-w-full w-full">
        <ProfileHeader
          profilePic={profilePic}
          coverPhoto={coverPhoto}
          onProfilePicChange={handleProfilePicChange}
          onCoverPhotoChange={handleCoverPhotoChange}
          onProfilePicClick={handleProfilePicClick}
          onCoverPhotoClick={handleCoverPhotoClick}
        />
        <div>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={updateProfile}
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </div>

        {/* Input fields for profile and cover photos */}
        <input
          type="file"
          ref={profilePicInputRef}
          onChange={handleProfilePicChange}
          accept="image/*"
          style={{ display: 'none' }}
        />
        <input
          type="file"
          ref={coverPhotoInputRef}
          onChange={handleCoverPhotoChange}
          accept="image/*"
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
};

export default ProfilePage;
