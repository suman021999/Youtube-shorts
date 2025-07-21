
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from "react-router-dom";

const Cards = () => {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);


   const user = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = !!user;

  // Avatar display logic
  const renderAvatar = () => {
    if (!isLoggedIn) {
      return <span className="text-sm">?</span>;
    }
    
    // For Google users with avatar image
    if (user.avatar) {
      return (    
        <p>{user.avatar}</p>
      );
    }
    
    // For regular users - show initials
    const initials = user.username 
      ? user.username.slice(0, 2).toUpperCase()
      : "US";
    
    return <span className="text-sm">{initials}</span>;
  };
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
            src="1111.mp4" 
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
      </Link>
    </div>
    </>
  );
};

export default Cards;