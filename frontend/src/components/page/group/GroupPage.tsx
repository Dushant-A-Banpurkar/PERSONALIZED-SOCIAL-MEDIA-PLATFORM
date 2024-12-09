// import React, { useState } from 'react';
// import GroupHeader from './GroupHeader';
// import GroupContent from './GroupContent';
// import GroupMembers from './GroupMembers';
// import GroupEvents from './GroupEvents';
import JoinedGroupsSidebar from './JoinedGroupsSidebar';

const GroupPage: React.FC = () => {
  // const [selectedTab, setSelectedTab] = useState('Posts');

  // const tabs = ['Posts', 'Members', 'Events'];

  // // Dynamically loaded members data
  // const members = [
  //   { id: 1, name: 'John Doe', profileImage: 'path/to/user-image1.jpg' },
  //   { id: 2, name: 'Jane Smith', profileImage: 'path/to/user-image2.jpg' },
  //   { id: 3, name: 'Alice Johnson', profileImage: 'path/to/user-image3.jpg' },
  //   // Add more members as needed
  // ];

  // // Dynamically loaded events data
  // const events = [
  //   { id: 1, title: 'Group Meetup', date: 'August 1, 2024', description: 'Join us for a group meetup at the local park.', link: '#' },
  //   { id: 2, title: 'Online Workshop', date: 'August 15, 2024', description: 'Participate in our online workshop on web development.', link: '#' },
  //   // Add more events as needed
  // ];

  return (
    <div className="min-h-screen bg-gray-100 flex ml-80">
      <div className="hidden lg:block lg:w-1/4 p-4 scroll-m-3">
        <JoinedGroupsSidebar /> {/* Sidebar for larger screens */}
      </div>
      {/* <div className="w-full lg:w-3/4 p-4 fixed">
        <GroupHeader
          initialBannerImage="path/to/initial-banner-image.jpg"
          groupName="Connectify Group"
          tabs={tabs}
          selectedTab={selectedTab}
          onSelectTab={setSelectedTab}
        />
        <div className="container mx-auto mt-6">
          {selectedTab === 'Posts' && <GroupContent />}
          {selectedTab === 'Members' && <GroupMembers members={members} />}
          {selectedTab === 'Events' && <GroupEvents events={events} />}
        </div>
      </div> */}
    </div>
  );
};

export default GroupPage;
