import React from 'react'
import {  Link } from "react-router-dom"


const Cards = () => {

  return (
    <>

      <div className="md:w-[15vw]  bg-white rounded-lg shadow-lg ">
        {/* Video placeholder */}
        <div className="mb-4">
          <Link>
           <video src="romcom.mp4" type="video/mp4" className="w-full  rounded-lg"/>
          </Link>
         
          
        </div>
        
        <div className='px-4 py-2'>
          <h2 className="text-lg font-semibold mb-2  text-ellipsis overflow-hidden whitespace-nowrap">text</h2>
          <p className="text-gray-500 text-sm pb-2">Views • Date</p>
        </div>
     

      </div>
    
    </>
  )
}

export default Cards
