import React from 'react'
import { useSelector } from 'react-redux';
import Scard from './Scard';


const Shortscontext = () => {
     const isSidebarOpen = useSelector((state) => state.sidebar.isOpen);
    
  return (
    <>
     <section className={` w-full  mt-20 mb-[40vh]  h-full`}>  
        <div className="flex flex-wrap justify-center items-center gap-4 p-4 ">

          
             <Scard/>
          
          
          
          
        </div>
      
      </section>
    </>
  )
}

export default Shortscontext