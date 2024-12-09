import React from 'react';
import { IconEdit, IconBrandLinkedin, IconWorld, IconBrandFacebook, IconBrandInstagram, IconBrandGithub, IconBrandYoutube, IconBrandX, IconPlus } from '@tabler/icons-react';

const SocialLinks: React.FC = () => {
  return (
    <div className="bg-white shadow-md rounded-xl p-6 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-100 via-green-100 to-yellow-100 opacity-40 rounded-xl"></div>
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-900">Social Links</h2>
          <button className="text-gray-700 hover:text-gray-900 transition-transform transform hover:scale-105">
            <IconEdit className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-3">
          <SocialLink
            icon={<IconBrandLinkedin className="w-5 h-5 text-blue-700" />}
            link="https://linkedin.com/in/thesaurabhkori"
            label="LinkedIn"
          />
          <SocialLink
            icon={<IconBrandX className="w-5 h-5 text-blue-500" />}
            link="https://x.com/thesaurabhkori"
            label="X"
          />
          <SocialLink
            icon={<IconWorld className="w-5 h-5 text-green-500" />}
            link="https://johndoe.com"
            label="Website"
          />
          <SocialLink
            icon={<IconBrandFacebook className="w-5 h-5 text-blue-600" />}
            link="https://facebook.com/thesaurabhkori"
            label="Facebook"
          />
          <SocialLink
            icon={<IconBrandInstagram className="w-5 h-5 text-pink-500" />}
            link="https://instagram.com/thesaurabhkori"
            label="Instagram"
          />
          <SocialLink
            icon={<IconBrandGithub className="w-5 h-5 text-gray-800" />}
            link="https://github.com/thesaurabhkori"
            label="GitHub"
          />
          <SocialLink
            icon={<IconBrandYoutube className="w-5 h-5 text-red-600" />}
            link="https://youtube.com/thesaurabhkori"
            label="YouTube"
          />
        </div>
        <div className="flex justify-center mt-6">
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105">
            <IconPlus className="w-4 h-4" />
            <span>Add Link</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const SocialLink: React.FC<{ icon: React.ReactNode, link: string, label: string }> = ({ icon, link, label }) => {
  return (
    <div className="flex items-center space-x-4">
      {icon}
      <a href={link} className="text-gray-800 font-medium hover:underline" target="_blank" rel="noopener noreferrer">
        {label}
      </a>
    </div>
  );
};

export default SocialLinks;