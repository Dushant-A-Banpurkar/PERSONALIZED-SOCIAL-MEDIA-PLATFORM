import Profile from "./Profile";
import PeopleSuggestion from "./PeopleSuggestion";
import Feed from "./Feed";
import { useState } from "react";
import CreatePost from "./CreatePost";


const HomePage: React.FC = () => {
  const [showPostModel,setPostModel]=useState(false);


  return (
    <div className="flex flex-col lg:flex-row justify-center">
      {/* <div className="lg:fixed lg:left-0 lg:top-0 lg:h-full w-full lg:w-64 p-4 bg-white shadow-md flex flex-col items-center ml-5">

      </div> */}
      <div className="flex-grow flex flex-col items-center lg:ml-96 lg:mr-80 mt-6 lg:mt-4">
        <div className="flex flex-col gap-4 w-full max-w-2xl">
          
          <Feed feedType={""} />
        </div>
      </div>
      <div className="lg:fixed lg:right-0 lg:top-0 lg:h-full w-full lg:w-80 p-4 bg-white shadow-md flex flex-col items-center mt-4 lg:mt-0">
        <div className="w-full">
          {" "}
          <Profile />
        </div>
        <div className="mt-4 w-full">
          <PeopleSuggestion />
          <button onClick={()=>{setPostModel(true)}} className="bg-blue-700 w-full h-11 text-white rounded-md">Post</button>
          {showPostModel && <CreatePost onClose={()=>{setPostModel(false)}}/>}
        </div>
        
      </div>
    </div>
  );
};

export default HomePage;
