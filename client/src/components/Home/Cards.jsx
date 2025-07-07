
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from "react-router-dom";

const Cards = () => {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  return (
    <div className={`
      lg:w-[15vw] 
      mb-20 lg:mb-0
      rounded-lg 
      
    `}>
      {/* Video placeholder */}
      <div className="mb-4 ">
        <Link>
          <video 
            src="romcom.mp4" 
            type="video/mp4" 
            className="w-full rounded-lg"
          />
        </Link>
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
          text
        </h2>
        <p className={`
          text-sm 
          pb-2 
          ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}
        `}>
          Views • Date
        </p>
      </div>
    </div>
  );
};

export default Cards;