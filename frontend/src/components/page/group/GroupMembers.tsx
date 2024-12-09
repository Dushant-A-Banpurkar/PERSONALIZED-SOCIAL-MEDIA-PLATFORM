import React from 'react';

interface Member {
  id: number;
  name: string;
  profileImage: string;
}

interface GroupMembersProps {
  members: Member[];
}

const GroupMembers: React.FC<GroupMembersProps> = ({ members }) => {
  return (
    <div className="bg-white shadow-xl rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Group Members</h2>
      <ul className="space-y-4">
        {members.map((member) => (
          <li key={member.id} className="flex items-center">
            <img src={member.profileImage} alt={member.name} className="w-12 h-12 rounded-full mr-4" />
            <div>
              <h3 className="font-semibold">{member.name}</h3>
              <a href={`/profile/${member.id}`} className="text-blue-500 hover:underline">View Profile</a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GroupMembers;
