import React from 'react'
import { useSelector } from 'react-redux';
import Scard from './Scard';
// import { MdOutlineZoomOutMap } from "react-icons/md";

const Shortscontext = () => {
     const isSidebarOpen = useSelector((state) => state.sidebar.isOpen);
  return (
    <>
     <section className={` w-full ${isSidebarOpen ? 'lg:ml-[45vh] ' : ''} lg:ml-8  mt-20 mb-[40vh]`}>  
        <div className="flex flex-wrap justify-center items-center gap-4 p-4 w-full ">

          
             <Scard/>
          
          
          
          
        </div>
      
      </section>
    </>
  )
}

export default Shortscontext
