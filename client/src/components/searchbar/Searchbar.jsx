

// import React from 'react'

// const Searchbar = ({ isOpen, onClose }) => {
//   if (!isOpen) return null;

//   return (
//     <div className='fixed top-20 left-1/2 transform -translate-x-1/2 min-h-40 w-[500px] bg-white dark:bg-[#212121] rounded-lg shadow-xl z-50 p-4 border border-gray-300 dark:border-gray-600'>
//       <div className='flex items-center justify-between mb-4'>
//         <h3 className='text-lg font-medium dark:text-white'>Recent searches</h3>
//         <button 
//           onClick={onClose}
//           className='text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100'
//         >
//           ✕
//         </button>
//       </div>
//       <div className='space-y-2'>
//         <div className='flex items-center p-2 hover:bg-gray-100 dark:hover:bg-[#303030] rounded cursor-pointer'>
//           <span className='text-gray-600 dark:text-gray-300'>React tutorials</span>
//         </div>
//         <div className='flex items-center p-2 hover:bg-gray-100 dark:hover:bg-[#303030] rounded cursor-pointer'>
//           <span className='text-gray-600 dark:text-gray-300'>Redux toolkit</span>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Searchbar


import React, { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';

const Searchbar = ({ isOpen, onClose }) => {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const searchbarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && searchbarRef.current && !searchbarRef.current.contains(event.target)) {
        onClose();
      }
    };

    // Add when the component mounts
    document.addEventListener('mousedown', handleClickOutside);
    
    // Return function to be called when unmounted
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 md:right-48 flex justify-center pt-20 px-4`}>
      <div 
        ref={searchbarRef}
        className={`w-screen max-w-[500px]  min-h-40 bg-white rounded-lg shadow-xl p-4 border border-gray-300 dark:border-gray-600 ${isDarkMode && "dark:bg-[#121212e8]"}`}
      >
        <div className='flex items-center justify-between mb-4'>
          <h3 className='text-lg font-medium dark:text-white'>Recent searches</h3>
          <button 
            onClick={onClose}
            className='text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100'
          >
            ✕
          </button>
        </div>
        <div className='space-y-2'>
          <div className='flex items-center p-2 hover:bg-gray-100 dark:hover:bg-[#303030] rounded cursor-pointer'>
            <span className='text-gray-600 dark:text-gray-300'>React tutorials</span>
          </div>
          <div className='flex items-center p-2 hover:bg-gray-100 dark:hover:bg-[#303030] rounded cursor-pointer'>
            <span className='text-gray-600 dark:text-gray-300'>Redux toolkit</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Searchbar;