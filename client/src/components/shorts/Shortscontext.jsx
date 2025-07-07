import React from 'react'
import { useSelector } from 'react-redux';
import Scard from './Scard';

const Shortscontext = () => {
     const isSidebarOpen = useSelector((state) => state.sidebar.isOpen);
  return (
    <>
     <section className={` w-full ${isSidebarOpen ? 'lg:ml-[45vh] ' : ''} lg:ml-8  mt-20`}>  
        <div className="lg:flex lg:flex-wrap justify-center items-center gap-4 p-4 w-full grid grid-cols-2  md:grid-cols-3 md:items-center">
          <Scard/>
          
        </div>
      
      </section>
    </>
  )
}

export default Shortscontext
