
import { IconHome, IconBell, IconUser, IconSearch, IconMessageCircle, IconUsers, IconLogout } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import useLogout from '.././hooks/login&signUp_hooks/useLogout'

const Sidebar: React.FC = () => {
  const {logout}=useLogout();
  return (
    <div className="fixed top-0 left-0 w-full md:w-1/4 lg:w-1/5 h-full bg-blue-950 p-4 md:p-6 flex flex-col items-center md:items-start shadow-lg">
      <div className="mb-8 hidden md:block">
        <h1 className="text-3xl font-bold text-white">Connectify</h1>
      </div>
      <nav className="space-y-0 w-full">
        <Link to="/" className="flex items-center justify-center md:justify-start space-x-2 text-white hover:bg-gray-700 p-4 rounded border-t border-gray-700">
          <IconHome className="w-8 h-8" />
          <span className="hidden md:block text-xl">Home</span>
        </Link>
        <Link to="/users" className="flex items-center justify-center md:justify-start space-x-2 text-white hover:bg-gray-700 p-4 rounded border-t border-gray-700">
          <IconSearch className="w-8 h-8" />
          <span className="hidden md:block text-xl">Explore</span>
        </Link>
        <Link to="/notifications" className="flex items-center justify-center md:justify-start space-x-2 text-white hover:bg-gray-700 p-4 rounded border-t border-gray-700">
          <IconBell className="w-8 h-8" />
          <span className="hidden md:block text-lg">Notifications</span>
        </Link>
        <Link to="/message" className="flex items-center justify-center md:justify-start space-x-2 text-white hover:bg-gray-700 p-4 rounded border-t border-gray-700">
          <IconMessageCircle className="w-8 h-8" />
          <span className="hidden md:block text-lg">Messages</span>
        </Link>
        <Link to="/sessions" className="flex items-center justify-center md:justify-start space-x-2 text-white hover:bg-gray-700 p-4 rounded border-t border-gray-700">
          <IconUsers className="w-8 h-8" />
          <span className="hidden md:block text-lg">Virtual Study</span>
        </Link>
        {/* <Link to="/group" className="flex items-center justify-center md:justify-start space-x-2 text-white hover:bg-gray-700 p-4 rounded border-t border-gray-700">
          <IconUsersGroup className="w-8 h-8" />
          <span className="hidden md:block text-lg">Group</span>
        </Link>
        <Link to=""  className="flex items-center justify-center md:justify-start space-x-2 text-white hover:bg-gray-700 p-4 rounded border-t border-gray-700">
          <IconSquarePlus className="w-8 h-8" />
          <span className="hidden md:block text-lg">Create</span>
        </Link> */}
        <Link to="/profile" className="flex items-center justify-center md:justify-start space-x-2 text-white hover:bg-gray-700 p-4 rounded border-t border-gray-700">
          <IconUser className="w-8 h-8" />
          <span className="hidden md:block text-lg">Profile</span>
        </Link>
        
      </nav>
      <Link to="/logout" onClick={()=> logout()} className="flex w-full items-center mt-32 justify-center md:justify-start space-x-2 text-white hover:bg-gray-700 p-4 rounded border-gray-700">
          <IconLogout className="w-8 h-8" />
          <span className="hidden md:block text-lg">Logout</span>
        </Link>
    </div>
  );
};

export default Sidebar;


