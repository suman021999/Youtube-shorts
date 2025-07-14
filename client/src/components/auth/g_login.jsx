import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const Login = () => {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  return (
    <>
      <div className="relative">
        <div 
          className="w-10 h-10 bg-red-800 text-amber-50 flex items-center justify-center rounded-full cursor-pointer"
          onClick={() => setShowLogoutPopup(!showLogoutPopup)}
        >
          BE
        </div>
        
        {showLogoutPopup && (
          <div className={`absolute top-12 right-0 rounded-lg p-2 w-40 z-50 ${isDarkMode ? "dark:bg-[#030303e4]" : "bg-[#b3b0b034]"}`}>
            <div className={`py-2 px-3 rounded cursor-pointer ${isDarkMode ? "dark:hover:bg-[#dbe1e330]" : "hover:bg-[#b3b0b043] hover:bg-opacity-20"}`}>
              Sign out
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
            <div className={`py-2 px-3 rounded cursor-pointer ${isDarkMode ? "dark:hover:bg-[#dbe1e330]" : "hover:bg-[#b3b0b043] hover:bg-opacity-20"}`}>
              Switch account
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Login;
