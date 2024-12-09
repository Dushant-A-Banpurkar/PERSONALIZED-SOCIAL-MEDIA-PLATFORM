import React, { useState } from 'react';
import { IconEdit } from '@tabler/icons-react';

const Events: React.FC = () => {
  // Example event data
  const [events, setEvents] = useState([
    {
      title: 'Hackathon 2024',
      date: 'September 10, 2024',
      time: '10:00 AM - 5:00 PM',
      place: 'Campus Auditorium',
      address: '123 University Ave, Campus City',
      description: 'Join us for a full day of coding, learning, and networking. Prizes and refreshments will be provided.',
    },
    {
      title: 'Guest Lecture on AI',
      date: 'September 15, 2024',
      time: '2:00 PM - 4:00 PM',
      place: 'Room 305, Engineering Building',
      address: '456 Tech Rd, Campus City',
      description: 'A special lecture by Dr. Jane Smith on the latest advancements in artificial intelligence.',
    },
    {
      title: 'Career Fair',
      date: 'September 20, 2024',
      time: '11:00 AM - 3:00 PM',
      place: 'Student Union Hall',
      address: '789 Campus Blvd, Campus City',
      description: 'Meet recruiters from top companies and explore career opportunities in various fields.',
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '',
    place: '',
    address: '',
    description: '',
  });

  const handleAddMoreClick = () => {
    setNewEvent({ title: '', date: '', time: '', place: '', address: '', description: '' });
    setShowModal(true);
  };

  const handleSaveEvent = () => {
    setEvents([...events, newEvent]);
    setShowModal(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Upcoming Events</h2>
          <button className="text-gray-600 hover:text-gray-800 transition-transform transform hover:scale-110">
            <IconEdit className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-4">
          {events.length > 0 ? (
            events.map((event, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{event.title}</h3>
                <div className="flex flex-col space-y-1 text-gray-600">
                  <p><strong>Date:</strong> {event.date}</p>
                  <p><strong>Time:</strong> {event.time}</p>
                  <p><strong>Place:</strong> {event.place}</p>
                  <p><strong>Address:</strong> {event.address}</p>
                </div>
                <p className="mt-2 text-gray-800">{event.description}</p>
              </div>
            ))
          ) : (
            <p className="text-lg font-medium text-gray-700">No upcoming events.</p>
          )}
        </div>

        {/* Add More Events Button */}
        <div className="flex justify-center mt-8">
          <button
            className="bg-blue-500 text-white text-lg font-semibold px-6 py-1 rounded hover:bg-blue-600 transition duration-300"
            onClick={handleAddMoreClick}
          >
            Add More Events
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
            <h3 className="text-3xl flex justify-center font-bold mb-4">Add New Event</h3>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Title</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                placeholder="Enter event title"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Date</label>
              <input
                type="date"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={newEvent.date}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Time</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={newEvent.time}
                onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                placeholder="Enter event time"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Place</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={newEvent.place}
                onChange={(e) => setNewEvent({ ...newEvent, place: e.target.value })}
                placeholder="Enter event place"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Address</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={newEvent.address}
                onChange={(e) => setNewEvent({ ...newEvent, address: e.target.value })}
                placeholder="Enter event address"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Description</label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md"
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                placeholder="Enter event description"
              />
            </div>
            <div className="flex justify-center space-x-10">
              <button
                onClick={handleCloseModal}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEvent}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Save Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;