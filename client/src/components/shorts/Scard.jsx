import React from 'react'
import { IoVolumeLowOutline, IoVolumeMediumOutline, IoVolumeHighOutline, IoVolumeOffOutline } from "react-icons/io5";
import { FaPlay } from "react-icons/fa";
import { MdOutlineZoomOutMap } from "react-icons/md";

const Scard = () => {
  return (
    <>
      <section>
      <vedio
       controls
        autoPlay
        // muted
        loop
        preload="auto"
       className="bg-amber-500 h-[70vh] w-[300px] rounded-lg shadow-md flex items-center justify-center">

        <source src="romcom.mp4"  type="video/mp4"></source>
        <source src="romcom.mp4"  type="video/ogg"></source>

        <div className="flex  items-center justify-center gap-4 bg-amber-500">
          <FaPlay className="text-white text-6xl"/>
        <MdOutlineZoomOutMap className="text-white text-6xl"/>
        <IoVolumeHighOutline className="text-white text-6xl" />
        </div>
        
        
        </vedio>
      </section>
        
      
    </>
  )
}

export default Scard
