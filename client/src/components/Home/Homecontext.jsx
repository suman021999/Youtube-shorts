import React from 'react'
import Cards from './Cards'
import { useSelector } from 'react-redux';


const Homecontext = () => {
  const isSidebarOpen = useSelector((state) => state.sidebar.isOpen);
  return (
    <>
      <section className={` w-full ${isSidebarOpen ? 'lg:ml-[45vh] ' : ''} lg:ml-8  mt-20`}>  
        <div className="lg:flex lg:flex-wrap justify-center items-center gap-4 p-4 w-full grid grid-cols-2  md:grid-cols-3 md:items-center">
          <Cards/>
          <Cards/>
          <Cards/>
          <Cards/>
          <Cards/>
          <Cards/>
          <Cards/>
          <Cards/>
          <Cards/>
          <Cards/>
          <Cards/>
          <Cards/>
        </div>
      
      </section>
    </>
  )
}

export default Homecontext


