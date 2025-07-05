import React from 'react'
import Cards from './Cards'


const Homecontext = () => {
  return (
    <>
      <section className=' w-full  md:ml-[45vh]'>

        <div className="flex flex-wrap justify-center items-center gap-4 p-4 w-full ">
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


