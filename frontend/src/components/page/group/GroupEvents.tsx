import React from 'react';

interface Event {
  id: number;
  title: string;
  date: string;
  description: string;
  link: string;
}

interface GroupEventsProps {
  events: Event[];
}

const GroupEvents: React.FC<GroupEventsProps> = ({ events }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
      <ul className="space-y-4">
        {events.map((event) => (
          <li key={event.id} className="border-b pb-4 mb-4">
            <h3 className="text-lg font-semibold">{event.title}</h3>
            <p className="text-gray-500">{event.date}</p>
            <p className="text-gray-700 mb-2">{event.description}</p>
            <a href={event.link} className="text-blue-500 hover:underline">Learn More</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GroupEvents;
