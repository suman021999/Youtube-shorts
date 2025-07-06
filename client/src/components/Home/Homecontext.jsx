import React from 'react'
import Cards from './Cards'


const Homecontext = () => {
  return (
    <>
      <section className=' w-full  lg:ml-[45vh] mt-20'>  
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


