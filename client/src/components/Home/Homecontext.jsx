import React from 'react'
import Cards from './Cards'


const Homecontext = () => {
  return (
    <>
      <section className=' w-full  md:ml-[45vh] mt-20'>  
        <div className="md:flex md:flex-wrap md:justify-center md:items-center gap-4 p-4 w-full grid grid-cols-2 ">
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


