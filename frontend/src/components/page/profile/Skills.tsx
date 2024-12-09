import React from 'react';
import { IconEdit } from '@tabler/icons-react';

const Skills: React.FC = () => {
  return (
    <div className="bg-gray-100 shadow-md rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-700">Skills</h2>
        <button className="text-gray-500 hover:text-gray-700">
          <IconEdit className="w-5 h-5" />
        </button>
      </div>

      {/* Programming Languages Section */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-gray-600">Programming Languages</h3>
        <ul className="list-disc list-inside mt-2 text-gray-700">
          <li>JavaScript</li>
          <li>Python</li>
          <li>TypeScript</li>
          <li>C++</li>
        </ul>
      </div>

      {/* Frameworks & Libraries Section */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-600">Frameworks & Libraries</h3>
        <ul className="list-disc list-inside mt-2 text-gray-700">
          <li>React</li>
          <li>Node.js</li>
          <li>TailwindCSS</li>
          <li>Express.js</li>
        </ul>
      </div>

      {/* Tools & Technologies Section */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-600">Tools & Technologies</h3>
        <ul className="list-disc list-inside mt-2 text-gray-700">
          <li>Git</li>
          <li>Docker</li>
          <li>VS Code</li>
          <li>Webpack</li>
        </ul>
      </div>

      {/* Languages Section */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-600">Languages</h3>
        <ul className="list-disc list-inside mt-2 text-gray-700">
          <li>English</li>
          <li>Hindi</li>
          <li>Spanish</li>
        </ul>
      </div>

      {/* Soft Skills Section */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-600">Soft Skills</h3>
        <ul className="list-disc list-inside mt-2 text-gray-700">
          <li>Communication</li>
          <li>Teamwork</li>
          <li>Problem-Solving</li>
          <li>Time Management</li>
        </ul>
      </div>
    </div>
  );
};

export default Skills;