import React from 'react';
// import { FaHome, FaCompass, FaSubscript } from "react-icons/fa";

const SidebarCard = () => {
  return (
    <>
    <section className='p-4 md:bg-[#f4f2f2e8] w-[20vw] h-[85vh] fixed z-70'>
      <div className='flex flex-col gap-4'>
        <div className='flex items-center gap-2 p-2 hover:bg-gray-200 rounded-md cursor-pointer'>
          {/* <FaHome className='text-xl' /> */}
          <span className='text-lg'>Home</span>
        </div>
        <div className='flex items-center gap-2 p-2 hover:bg-gray-200 rounded-md cursor-pointer'>
          {/* <FaCompass className='text-xl' /> */}
          <span className='text-lg'>Explore</span>
        </div>
        <div className='flex items-center gap-2 p-2 hover:bg-gray-200 rounded-md cursor-pointer'>
          {/* <FaSubscript className='text-xl' /> */}
          <span className='text-lg'>Subscriptions</span>
        </div>
      </div>
    </section>
    </>
  );
};

export default SidebarCard;
