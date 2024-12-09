import React, { useState } from 'react';

const Achievements: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [newAchievement, setNewAchievement] = useState({
    title: '',
    description: '',
  });

  const handleAddMoreClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setNewAchievement({ title: '', description: '' }); // Clear the form on close
  };

  const handleSaveAchievement = () => {
    // Logic for saving the new achievement (e.g., adding it to state or sending it to an API)
    console.log('Achievement Saved:', newAchievement);
    handleCloseModal(); // Close the modal after saving
  };

  return (
    <div className="bg-gradient-to-br p-8 rounded-3xl shadow-lg relative">
      <div className="absolute inset-0 bg-gradient-to-r opacity-20 rounded-3xl transform scale-125 -rotate-6"></div>
      <div className="relative z-10">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          🌟 <span className="underline decoration-wavy decoration-yellow-500">Noteworthy Achievements</span> 🌟
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Existing achievements */}
          <div className="achievement-card bg-white p-4 rounded-2xl shadow-md transition duration-300 transform hover:scale-105 hover:shadow-2xl">
            <div className="flex items-center justify-center bg-blue-500 text-white w-10 h-10 rounded-full font-bold text-xl">1</div>
            <p className="text-gray-700 mt-3 text-lg text-center font-semibold">Completed a research project on AI and machine learning.</p>
          </div>

          <div className="achievement-card bg-white p-4 rounded-2xl shadow-md transition duration-300 transform hover:scale-105 hover:shadow-2xl">
            <div className="flex items-center justify-center bg-green-500 text-white w-10 h-10 rounded-full font-bold text-xl">2</div>
            <p className="text-gray-700 mt-3 text-lg text-center font-semibold">Awarded Dean's List for academic excellence in the past two semesters.</p>
          </div>

          <div className="achievement-card bg-white p-4 rounded-2xl shadow-md transition duration-300 transform hover:scale-105 hover:shadow-2xl">
            <div className="flex items-center justify-center bg-yellow-500 text-white w-10 h-10 rounded-full font-bold text-xl">3</div>
            <p className="text-gray-700 mt-3 text-lg text-center font-semibold">Coordinated a successful hackathon with over 200 participants.</p>
          </div>
        </div>

        {/* Add More Button */}
        <div className="flex justify-center mt-8">
          <button
            className="bg-blue-500 text-white text-lg font-semibold px-6 py-1 rounded hover:bg-blue-600 transition duration-300"
            onClick={handleAddMoreClick}
          >
            Add More
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
            <h3 className="text-2xl font-bold mb-4">Add New Achievement</h3>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Title</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={newAchievement.title}
                onChange={(e) => setNewAchievement({ ...newAchievement, title: e.target.value })}
                placeholder="Enter achievement title"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Description</label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md"
                value={newAchievement.description}
                onChange={(e) => setNewAchievement({ ...newAchievement, description: e.target.value })}
                placeholder="Enter achievement description"
              />
            </div>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleCloseModal}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAchievement}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Save Achievement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Achievements;