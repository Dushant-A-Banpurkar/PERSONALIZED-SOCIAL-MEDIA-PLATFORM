import React, { useState, useRef } from 'react';

interface GroupHeaderProps {
  initialBannerImage: string;
  groupName: string;
  tabs: string[];
  selectedTab: string;
  onSelectTab: (tab: string) => void;
}

const GroupHeader: React.FC<GroupHeaderProps> = ({ initialBannerImage, groupName, tabs, selectedTab, onSelectTab }) => {
  const [bannerImage, setBannerImage] = useState(initialBannerImage);
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for the file input

  const handleBannerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setBannerImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger the file input click
    }
  };

  return (
    <div>
      <div className="relative">
        <img 
          src={bannerImage} 
          alt="Banner" 
          className="w-full h-64 object-cover cursor-pointer" 
          onClick={handleEditClick} // Handle click on the image
        />
        <div className="absolute bottom-4 left-4 text-slate-900">
          <h1 className="text-4xl font-bold">{groupName}</h1>
        </div>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleBannerChange} 
          className="hidden" 
          ref={fileInputRef} // Attach ref to the file input
        />
      </div>
      <div className="bg-white shadow-md">
        <div className="container mx-auto flex space-x-4 p-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 ${selectedTab === tab ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-600'}`}
              onClick={() => onSelectTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GroupHeader;
