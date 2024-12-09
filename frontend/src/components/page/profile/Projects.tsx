import React, { useState } from 'react';
import { IconExternalLink } from '@tabler/icons-react';

interface Project {
  title: string;
  description: string;
  details: string;
  techStack: string[];
  link: string;
  image?: string;
  date?: string;
}

const projects: Project[] = [
  {
    title: "Connectify: A Personalize social media platform for college students",
    description:
      "Connectify is a social media platform specifically designed for college students. It aims to provide a unique and engaging online space where students can connect, collaborate, and share their academic and social experiences.",
    details:
      "social media platform specifically designed for college students. It aims to provide a unique and engaging online space where students can connect, collaborate, and share their academic and social experiences. Built using TypeScript, React.js, and TailwindCSS, Connectify stands out by offering features tailored to the academic and social needs of students, making it distinct from other traditional social networks like Twitter or Instagram.",
    techStack: ["React", "Typescript", "TailwindCSS"],
    link: "#",
    image: "https://via.placeholder.com/150",
    date: "Completed: July 2024"
  },
  {
    title: "Online Study Group",
    description:
      "A platform for students to create and join study groups, schedule sessions, and share study materials. Developed with TypeScript, React, and Node.js.",
    details:
      "This project allows students to organize their study sessions effectively, with built-in tools for sharing notes and tracking group activities.",
    techStack: ["TypeScript", "React", "Node.js"],
    link: "#",
    image: "https://via.placeholder.com/150",
    date: "Completed: June 2024"
  },
];

const Projects: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const openModal = (project: Project) => {
    setSelectedProject(project);
  };

  const closeModal = () => {
    setSelectedProject(null);
  };

  const handleAddProject = () => {
    // Implement functionality to handle adding a new project
    alert("Redirect to add new project page or open modal!");
  };

  return (
    <div className="p-6 bg-gray-50 shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Student Projects
      </h2>
      <ul className="space-y-6">
        {projects.map((project, index) => (
          <li
            key={index}
            className="bg-white p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105"
          >
            <div className="flex items-center space-x-4 mb-4">
              {project.image && (
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-16 h-16 object-cover rounded-lg"
                />
              )}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {project.title}
                </h3>
                <p className="text-gray-600">{project.description}</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.techStack.map((tech, index) => (
                <span
                  key={index}
                  className="inline-block bg-gray-200 text-gray-700 text-xs font-medium px-2 py-1 rounded-full"
                >
                  {tech}
                </span>
              ))}
            </div>
            <div className="mt-4 flex space-x-4">
              <button
                onClick={() => openModal(project)}
                className="inline-block bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded hover:bg-blue-600 transition-all duration-200"
              >
                View Details
              </button>
              <a
                href={project.link}
                className="inline-block text-blue-500 text-sm font-semibold flex items-center space-x-1 hover:text-blue-600"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>View Live Demo</span>
                <IconExternalLink className="w-4 h-4" />
              </a>
            </div>
          </li>
        ))}
      </ul>

      {/* Center the Add More Projects button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={handleAddProject}
          className="inline-block bg-green-500 text-white text-sm font-semibold px-4 py-2 rounded hover:bg-green-600 transition-all duration-200"
        >
          Add More Projects
        </button>
      </div>

      {selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded shadow-lg max-w-2xl w-full relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            >
              &times;
            </button>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              {selectedProject.title}
            </h3>
            {selectedProject.image && (
              <img
                src={selectedProject.image}
                alt={selectedProject.title}
                className="w-full h-48 object-cover rounded mb-4"
              />
            )}
            <p className="text-gray-700 mb-2">{selectedProject.details}</p>
            {selectedProject.date && (
              <p className="text-sm text-gray-500 mb-4">
                {selectedProject.date}
              </p>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedProject.techStack.map((tech, index) => (
                <span
                  key={index}
                  className="inline-block bg-gray-200 text-gray-700 text-xs font-medium px-2 py-1 rounded-full"
                >
                  {tech}
                </span>
              ))}
            </div>
            <div className="mt-6 flex justify-center space-x-4">
              <a
                href={selectedProject.link}
                className="inline-block bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded hover:bg-blue-600 transition-all duration-200"
              >
                View Live Demo
              </a>
              <button
                onClick={closeModal}
                className="inline-block bg-gray-500 text-white text-lg font-semibold px-6 py-2 rounded hover:bg-gray-600 transition-all duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;