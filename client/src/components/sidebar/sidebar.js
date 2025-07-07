import React, { useEffect, useState } from 'react';
import { LiaHomeSolid } from "react-icons/lia";
import { SiYoutubeshorts } from "react-icons/si";
import { useSelector, useDispatch} from 'react-redux';
import { closeSidebar } from '../../hooks/sidebarSlice';
import { Link } from 'react-router-dom';

const SidebarCard = () => {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const isSidebarOpen = useSelector((state) => state.sidebar.isOpen);
  const [selectedItem, setSelectedItem] = useState('Home');
const dispatch = useDispatch();

    // Close sidebar when clicking outside (optional)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isSidebarOpen && !event.target.closest('.sidebar')) {
        useDispatch(closeSidebar());
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSidebarOpen, dispatch]);

  if (!isSidebarOpen) return null;

  return (
    <section className={`
      p-4 
      transition-all 
      duration-300
      h-[85vh] 
      fixed 
      z-70 
      lg:flex 
      lg
      hidden
      ${isSidebarOpen ? "w-[20vw]" : "w-[60px]"}
      ${isDarkMode ? 'bg-[#000000e8]' : 'bg-[#f4f2f2e8]'}
    `}>



   


        

        {/* Shorts Item */}
        
          {isSidebarOpen?
          (
          <>
          <div className='p-4 w-full mt-4 rounded-lg flex flex-col gap-4'>
          <Link 
          className={`${selectedItem === 'Shorts' ? (isDarkMode ? 'bg-[#dbe1e330]' : 'bg-[#b3b0b034]') : 'bg-transparent'} 
          h-10 flex items-center rounded-lg cursor-pointer`}
          onClick={() => setSelectedItem('Shorts')}
        >
          <SiYoutubeshorts className={`h-6 w-6 mx-2 ${isDarkMode ? 'text-white' : ''}`} />
          <h2 className={isDarkMode ? 'text-white' : ''}>Shorts</h2>
        </Link>
          </div>
          </>
          )
          :(
          <>
          <Link 
          className={`${selectedItem === 'Shorts' ? (isDarkMode ? 'bg-[#dbe1e330]' : 'bg-[#b3b0b034]') : 'bg-transparent'} 
          h-10 flex items-center rounded-lg cursor-pointer`}
          onClick={() => setSelectedItem('Shorts')}
        >
          <SiYoutubeshorts className={`h-6 w-6 mx-2 ${isDarkMode ? 'text-white' : ''}`} />
          <h2 className={isDarkMode ? 'text-white' : ''}>Shorts</h2>
        </Link>
          </>
        )}

         


        {isSidebarOpen?
          (
          <>
          <div className='p-4 w-full mt-4 rounded-lg flex flex-col gap-4'>
          <Link 
          className={`${selectedItem === 'Shorts' ? (isDarkMode ? 'bg-[#dbe1e330]' : 'bg-[#b3b0b034]') : 'bg-transparent'} 
          h-10 flex items-center rounded-lg cursor-pointer`}
          onClick={() => setSelectedItem('Shorts')}
        >
          <SiYoutubeshorts className={`h-6 w-6 mx-2 ${isDarkMode ? 'text-white' : ''}`} />
          <h2 className={isDarkMode ? 'text-white' : ''}>Shorts</h2>
        </Link>
          </div>
          </>
          )
          :(
          <>
          <Link 
          className={`${selectedItem === 'Shorts' ? (isDarkMode ? 'bg-[#dbe1e330]' : 'bg-[#b3b0b034]') : 'bg-transparent'} 
          h-10 flex items-center rounded-lg cursor-pointer`}
          onClick={() => setSelectedItem('Shorts')}
        >
          <SiYoutubeshorts className={`h-6 w-6 mx-2 ${isDarkMode ? 'text-white' : ''}`} />
          <h2 className={isDarkMode ? 'text-white' : ''}>Shorts</h2>
        </Link>
          </>
        )}


   
      


    </section>
  );
};

export default SidebarCard;


