
import React, { useEffect, useState } from 'react';
import { LiaHomeSolid } from "react-icons/lia";
import { SiYoutubeshorts } from "react-icons/si";
import { useSelector, useDispatch } from 'react-redux';
import { closeSidebar } from '../../hooks/sidebarSlice';
import { Link } from 'react-router-dom';


const SidebarCard = () => {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const isSidebarOpen = useSelector((state) => state.sidebar.isOpen);
  const [selectedItem, setSelectedItem] = useState('Home');
  const dispatch = useDispatch();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isSidebarOpen && !event.target.closest('.sidebar')) {
        dispatch(closeSidebar());
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSidebarOpen, dispatch]);

  return (
    <section className={`
      p-4 
      transition-all 
      duration-300
      h-[85vh] 
      fixed 
      z-70 
      lg:flex 
      hidden
      ${isSidebarOpen ? "w-[20vw]" : "w-[100px]"}
      ${isDarkMode ? 'bg-[#000000e8]' : ''}
      sidebar
    `}>

      <div className='p-4 w-full h-[30vh] rounded-lg flex flex-col gap-4'>

        {/* Home Item */}
        <Link to="/"
          className={`${selectedItem === 'Home' ? (isDarkMode ? 'bg-[#dbe1e330]' : 'bg-[#b3b0b034]') : 'bg-transparent'} 
          h-10 flex items-center rounded-lg cursor-pointer ${!isSidebarOpen ? 'justify-center' : ''}`}
          onClick={() => setSelectedItem('Home')}
        >
          <LiaHomeSolid className={`h-6 w-6 mx-2 flex-shrink-0 ${isDarkMode ? 'text-white' : ''}`} />
          {isSidebarOpen && <h2 className={isDarkMode ? 'text-white' : ''}>Home</h2>}
        </Link>

        {/* Shorts Item */}
        <Link to="/shorts" 
          className={`${selectedItem === 'Shorts' ? (isDarkMode ? 'bg-[#dbe1e330]' : 'bg-[#b3b0b034]') : 'bg-transparent'} 
          h-10 flex items-center rounded-lg cursor-pointer ${!isSidebarOpen ? 'justify-center' : ''}`}
          onClick={() => setSelectedItem('Shorts')}
        >
          <SiYoutubeshorts className={`h-6 w-6 mx-2 flex-shrink-0 ${isDarkMode ? 'text-white' : ''}`} />
          {isSidebarOpen && <h2 className={isDarkMode ? 'text-white' : ''}>Shorts</h2>}
        </Link>

        {/* Library Item */}
        <div 
          className={`${selectedItem === 'Library' ? (isDarkMode ? 'bg-[#dbe1e330]' : 'bg-[#b3b0b034]') : 'bg-transparent'} 
          h-10 flex items-center rounded-lg cursor-pointer ${!isSidebarOpen ? 'justify-center' : ''}`}
          onClick={() => setSelectedItem('Library')}
        >
          <LiaHomeSolid className={`h-6 w-6 mx-2 flex-shrink-0 ${isDarkMode ? 'text-white' : ''}`} />
          {isSidebarOpen && <h2 className={isDarkMode ? 'text-white' : ''}>Library</h2>}
        </div>
        
      </div>


    </section>
  );
};

export default SidebarCard;