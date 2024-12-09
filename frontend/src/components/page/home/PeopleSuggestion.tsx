import React from 'react';
import useSuggestion from '../../../hooks/homepage_hooks/useSuggestion';
import useFollow from '../../../hooks/homepage_hooks/useFollow';

// Define the User type
interface User {
  _id: string;
  id?: string;
  profileimg: string;
  firstname: string;
  lastname: string;
  username: string;
}

const PeopleSuggestion: React.FC = () => {
  const { data: suggestedUsers, isLoading, error } = useSuggestion<User[]>();
  const { follow, isPending } = useFollow();

  if (isLoading) {
    return <div>Loading suggestions...</div>;
  }

  if (error) {
    return <div>Error loading suggestions</div>;
  }

  return (
    <div className="p-4 bg-white border border-gray-300 rounded-md mb-4">
      <h2 className="font-bold mb-4">Suggestions For You</h2>
      {suggestedUsers?.length > 0 ? (
        suggestedUsers.map((user: User, i: number) => (
          <div key={user._id} className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full mr-3">
              <img className='rounded-full h-10 w-10' src={user.profileimg} alt="" />
            </div>
            <div>
              <p className="font-bold">{user.firstname} {user.lastname}</p>
              <p className="text-sm text-gray-500">@{user.username}</p>
            </div>
            <button
              className="ml-auto text-white font-normal border bg-blue-500 w-16 rounded-2xl h-9"
              onClick={() => {
                console.log("User Id:", user._id);
                follow(user._id); // Use _id
              }}
              disabled={isPending}
            >
              {isPending ? "Following..." : "Follow"}
            </button>
          </div>
        ))
      ) : (
        <div>No suggestions available.</div>
      )}
    </div>
  );
};

export default PeopleSuggestion;
