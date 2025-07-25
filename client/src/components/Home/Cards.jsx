
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from "react-router-dom";

const Cards = ({ videoUrl, description, views}) => {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  return (
    <>
    <div className={`
      lg:w-[15vw] 
      mb-20 lg:mb-0
      rounded-lg 
      
    `}>
   <Link to="/shorts" className="block">
      {/* Video placeholder */}
      <div className="mb-4 ">
        
          <video
            src={videoUrl}
            type="video/mp4" 
            className="w-full rounded-lg"
          />
        
      </div>
      
      <div className='px-4 py-2'>
        <h2 className={`
          text-lg 
          font-semibold 
          mb-2 
          text-ellipsis 
          overflow-hidden 
          whitespace-nowrap 
          ${isDarkMode ? 'text-white' : ''}
        `}>
          {description || 'No description'}
        </h2>
        <p className={`
          text-sm 
          pb-2 
          ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}
        `}>
          {views}Views • Date
        </p>
      </div>
      </Link>
    </div>
    </>
  );
};

export default Cards;




