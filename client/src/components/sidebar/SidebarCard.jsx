import React from 'react';

import { LiaHomeSolid } from "react-icons/lia";
import { SiYoutubeshorts } from "react-icons/si";
const SidebarCard = () => {
  return (
    <>
    <section className='p-4 md:bg-[#f4f2f2e8] w-[20vw] h-[85vh] fixed z-70 md:flex  hidden'>
      <div className='bg-red-500 p-4 w-[500px] h-[30vh] rounded-lg flex flex-col gap-4'>

        <div className='bg-white h-10 flex items-center  rounded-lg'>
          <LiaHomeSolid className='h-6 w-6   mx-2 ' />
          <h2 className=''>Home</h2>
        </div>

         <div className='bg-white h-10 flex items-center  rounded-lg'>
          <SiYoutubeshorts  className='h-6 w-6   mx-2 ' />
          <h2 className=''>Home</h2>
        </div>


         <div className='bg-white h-10 flex items-center  rounded-lg'>
          <LiaHomeSolid className='h-6 w-6   mx-2 ' />
          <h2 className=''>Home</h2>
        </div>
            

           
      </div>
      
    </section>
    </>
  );
};

export default SidebarCard;
