import React, { useState, useEffect } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import debounce from "lodash.debounce"; // Install lodash.debounce

interface User {
  _id: string;
  profileimg: string;
  username: string;
  fullName: string;
  isFollowing: boolean;
}

const Explore: React.FC = () => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setUsers([]); // Clear users if search query is empty
      return;
    }

    // Debounced function to fetch search results
    const fetchSuggestions = debounce(async () => {
      try {
        const response = await axios.get(`/api/users/search?searchTerm=${searchQuery}`);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching user suggestions:", error);
      }
    }, 300); // Wait for 300ms after typing stops

    fetchSuggestions();
    return fetchSuggestions.cancel; // Cleanup debounce on component unmount
  }, [searchQuery]);

  const handleFollow = async (userId: string) => {
    try {
      const response = await axios.post(`/api/users/follow/${userId}`);
      // Update user follow state in the list
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, isFollowing: !user.isFollowing } : user
        )
      );
    } catch (error) {
      console.error("Error following/unfollowing user:", error);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-lg mx-auto">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          className="p-3 border rounded w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search users by name or username..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {users.length > 0 && (
          <div className="absolute bg-white border rounded shadow-lg mt-1 w-full z-10">
            {users.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between p-3 hover:bg-gray-100 cursor-pointer"
              >
                <div className="flex items-center">
                  <img
                    src={user.profileimg || "/default-profile.png"} // Fallback image
                    alt="profile"
                    className="h-10 w-10 rounded-full object-cover border"
                  />
                  <div className="ml-3">
                    <h3 className="font-medium text-gray-800">{user.firstname} {user.lastname}</h3>
                    <p className="text-sm text-gray-500">@{user.username}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleFollow(user._id)}
                  className={`px-4 py-1 rounded text-white ${
                    user.isFollowing
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
                >
                  {user.isFollowing ? "Unfollow" : "Follow"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Search Results */}
      {users.length === 0 && searchQuery.trim() && (
        <p className="text-gray-500 text-center">No users found</p>
      )}
    </div>
  );
};

export default Explore;
