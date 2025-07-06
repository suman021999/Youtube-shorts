
import React from 'react';
import { LiaHomeSolid } from "react-icons/lia";
import { SiYoutubeshorts } from "react-icons/si";
import { useSelector } from 'react-redux';
 
const SidebarCard = () => {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  return (
    <section className={`
      p-4 
      w-[20vw] 
      h-[85vh] 
      fixed 
      z-70 
      lg:flex 
      hidden
      ${isDarkMode ? 'bg-gray-800' : 'bg-[#f4f2f2e8]'}
    `}>
      <div className='p-4 w-full h-[30vh] rounded-lg flex flex-col gap-4'>
        {/* Home Item */}
        <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-white'} h-10 flex items-center rounded-lg`}>
          <LiaHomeSolid className={`h-6 w-6 mx-2 ${isDarkMode ? 'text-white' : ''}`} />
          <h2 className={isDarkMode ? 'text-white' : ''}>Home</h2>
        </div>

        {/* Shorts Item */}
        <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-white'} h-10 flex items-center rounded-lg`}>
          <SiYoutubeshorts className={`h-6 w-6 mx-2 ${isDarkMode ? 'text-white' : ''}`} />
          <h2 className={isDarkMode ? 'text-white' : ''}>Shorts</h2>
        </div>

        {/* Another Item */}
        <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-white'} h-10 flex items-center rounded-lg`}>
          <LiaHomeSolid className={`h-6 w-6 mx-2 ${isDarkMode ? 'text-white' : ''}`} />
          <h2 className={isDarkMode ? 'text-white' : ''}>Library</h2>
        </div>
      </div>
    </section>
  );
};

export default SidebarCard;
