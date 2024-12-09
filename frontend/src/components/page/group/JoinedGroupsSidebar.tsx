import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Group {
  id: number;
  name: string;
  description: string;
  avatar: string;
  members?: number;
  isPrivate?: boolean;
}

const JoinedGroupsSidebar: React.FC = () => {
  const navigate = useNavigate();

  const joinedGroups: Group[] = [
    { id: 1, name: 'React Developers', description: 'A group for React enthusiasts', avatar: 'path/to/avatar1.jpg' },
    { id: 2, name: 'Web Developers', description: 'A group for web developers', avatar: 'path/to/avatar2.jpg' },
    { id: 3, name: 'College Buddies', description: 'A group for college friends', avatar: 'path/to/avatar3.jpg' },
    { id: 4, name: 'AI Innovators', description: 'A group for AI and ML enthusiasts', avatar: 'path/to/avatar4.jpg' },
    { id: 5, name: 'Startup Founders', description: 'A group for aspiring entrepreneurs', avatar: 'path/to/avatar5.jpg' },
  ];

  const recommendedGroups: Group[] = [
    { id: 6, name: 'Python Programmers', description: 'A group for Python developers', avatar: 'path/to/avatar6.jpg', members: 1200, isPrivate: false },
    { id: 7, name: 'Data Science Community', description: 'A group for data science professionals', avatar: 'path/to/avatar7.jpg', members: 1500, isPrivate: true },
    { id: 8, name: 'UI/UX Designers', description: 'A group for UI/UX design enthusiasts', avatar: 'path/to/avatar8.jpg', members: 800, isPrivate: false },
    { id: 9, name: 'JavaScript Masters', description: 'A group for advanced JavaScript developers', avatar: 'path/to/avatar9.jpg', members: 1100, isPrivate: false },
    { id: 10, name: 'Blockchain Innovators', description: 'A group for blockchain technology enthusiasts', avatar: 'path/to/avatar10.jpg', members: 950, isPrivate: true },
  ];

  const handleGroupClick = (group: Group) => {
    navigate(`/group/${group.id}`);
  };

  return (
    <div className="bg-white p-4  shadow-md">
      <h2 className="text-xl font-bold mb-4">Joined Groups</h2>
      <ul className="space-y-4 mb-6">
        {joinedGroups.map(group => (
          <li 
            key={group.id} 
            className="flex items-center p-2 bg-gray-100 rounded-lg shadow-sm cursor-pointer"
            onClick={() => handleGroupClick(group)}
          >
            <img src={group.avatar} alt={group.name} className="w-10 h-10 rounded-full mr-3" />
            <div>
              <h3 className="text-md font-semibold">{group.name}</h3>
              <p className="text-sm text-gray-600">{group.description}</p>
            </div>
          </li>
        ))}
      </ul>
      
      <h2 className="text-xl font-bold mb-4">Recommended Groups</h2>
      <ul className="space-y-4">
        {recommendedGroups.map(group => (
          <li 
            key={group.id} 
            className="flex items-center p-2 bg-gray-100 rounded-lg shadow-sm cursor-pointer"
            onClick={() => handleGroupClick(group)}
          >
            <img src={group.avatar} alt={group.name} className="w-10 h-10 rounded-full mr-3" />
            <div>
              <h3 className="text-md font-semibold">{group.name}</h3>
              <p className="text-sm text-gray-600">{group.description}</p>
              <p className="text-xs text-gray-500">Members: {group.members} | {group.isPrivate ? 'Private Group' : 'Public Group'}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JoinedGroupsSidebar;
