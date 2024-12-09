import React from 'react';

interface Participant {
  id: string;
  name: string;
  profileImage: string;
}

interface GridProps {
  participants: Participant[];
}

const Grid: React.FC<GridProps> = ({ participants }) => {
  return (
    <div className="w-full h-screen flex flex-col">
      {/* Header Section */}
      <header className="bg-blue-900 text-white p-4 flex justify-between items-center">
        <div className="text-2xl font-bold">Connectify</div>
        <button className="bg-red-600 text-white px-4 py-2 rounded">End Session</button>
      </header>

      {/* Main Session Body */}
      <div className="flex flex-1 p-4">
        {/* Video Grid Section */}
        <div className="grid grid-cols-4 gap-4 w-full">
          {participants.map((participant) => (
            <div key={participant.id} className="bg-gray-200 p-4 rounded-lg relative">
              {/* Profile Image */}
              <div className="w-full h-48 bg-gray-300 rounded-lg overflow-hidden mb-2">
                <img
                  src={participant.profileImage}
                  alt={participant.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Participant Name */}
              <div className="text-center font-semibold text-lg">{participant.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls Section (Mic, Handraise) */}
      <div className="bg-gray-900 text-white p-4 flex justify-around items-center">
        <button className="bg-green-500 text-white px-4 py-2 rounded">Mic</button>
        <button className="bg-yellow-500 text-white px-4 py-2 rounded">Handraise</button>
      </div>
    </div>
  );
};

export default Grid;
