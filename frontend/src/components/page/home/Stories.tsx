import React from 'react';

const stories = [
  { id: 1, user: 'User 1', image: 'https://via.placeholder.com/100' },
  { id: 2, user: 'User 2', image: 'https://via.placeholder.com/100' },
  { id: 3, user: 'User 3', image: 'https://via.placeholder.com/100' },
  { id: 4, user: 'User 4', image: 'https://via.placeholder.com/100' },
  { id: 5, user: 'User 5', image: 'https://via.placeholder.com/100' },
  
];

const Stories: React.FC = () => {
  return (
    <div className="flex space-x-4 mb-4 w-full max-w-3xl mx-auto">
      <div className="flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center">
          <button className="text-lg font-bold text-blue-500">+</button>
        </div>
        <span className="text-sm mt-1">Add Story</span>
      </div>
      {stories.map(story => (
        <div key={story.id} className="flex flex-col items-center">
          <img src={story.image} alt="Story" className="w-20 h-20 rounded-full" />
          <span className="text-sm mt-1">{story.user}</span>
        </div>
      ))}
    </div>
  );
};

export default Stories;