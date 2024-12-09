// src/components/AllGroupsPage.tsx
import React from 'react';


const groups = [
  {
    id: 1,
    name: 'Computer Science Club',
    description: 'A group for computer science enthusiasts.',
    image: 'path/to/cs-club.jpg',
  },
  {
    id: 2,
    name: 'Art Society',
    description: 'A place for art lovers to share and discuss.',
    image: 'path/to/art-society.jpg',
  },
  {
    id: 3,
    name: 'Music Band',
    description: 'Join us for jamming sessions and music discussions.',
    image: 'path/to/music-band.jpg',
  },
  // Add more groups as needed
];

const AllGroupsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">All Groups</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <div key={group.id} className="bg-white shadow-md rounded-lg p-4">
              <img
                src={group.image}
                alt={group.name}
                className="w-full h-32 object-cover rounded-t-lg"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{group.name}</h2>
                <p className="text-gray-700 mb-4">{group.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllGroupsPage;
