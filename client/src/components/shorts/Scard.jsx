
import React, { useRef, useState, useEffect } from 'react';
import { IoVolumeHighOutline } from "react-icons/io5";
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa6";
import { MdOutlineZoomOutMap } from "react-icons/md";

const Scard = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [showCenterButton, setShowCenterButton] = useState(true);
  const videoRef = useRef(null);
  const timeoutRef = useRef(null);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
    
    setShowCenterButton(true);
    resetTimeout();
  };

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setShowCenterButton(false);
    }, 500);
  };

  const handleVideoClick = (e) => {
   
    if (e.target === videoRef.current) {
      handlePlayPause();
    }
  };

  useEffect(() => {
    resetTimeout();
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <section className="relative group">
      <video
        ref={videoRef}
        controls={false}
        autoPlay
        loop
        preload="auto"
        className="bg-amber-500 h-[70vh] w-[300px] rounded-lg shadow-md object-cover cursor-pointer"
        onClick={handleVideoClick}
        onMouseMove={resetTimeout} 
      >
        <source src="1111.mp4" type="video/mp4" />
        <source src="1111.mp4" type="video/ogg" />
      </video>
      
      {/* Custom controls positioned absolutely on top */}
      <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-around z-10">
        <button onClick={handlePlayPause}>
          {isPlaying ? (
            <div className='Hover:h-8 Hover:w-8 hover:bg-[#b3b0b034] p-3 rounded-full flex justify-center items-center'>
              <FaPause className="text-white text-2xl cursor-pointer hover:scale-110 transition-transform" />
            </div>
          ) : (
            <div className='Hover:h-8 Hover:w-8 hover:bg-[#b3b0b034] p-3 rounded-full flex justify-center items-center '>
              <FaPlay className="text-white text-2xl cursor-pointer hover:scale-110 transition-transform translate-x-[2px]" />
            </div>
          )}
        </button>
        
        <IoVolumeHighOutline className="text-white text-2xl cursor-pointer hover:scale-110 transition-transform" />
        <MdOutlineZoomOutMap className="text-white text-2xl cursor-pointer hover:scale-110 transition-transform" />
      </div>

      {/* Centered play button - only shown when showCenterButton is true */}
 {showCenterButton && (
  <div 
    className="absolute inset-0 flex items-center justify-center z-0 cursor-pointer"
    onClick={handlePlayPause}
  >
    <div className="relative flex items-center justify-center rounded-full w-20 h-20  bg-opacity-50 transition-all pointer-events-none youtube-center-hover">
      {isPlaying ? (
        <FaPause className="text-white text-4xl transition-all yt-fade-in pointer-events-none" />
      ) : (
        <FaPlay className="text-white text-4xl transition-all yt-fade-in pointer-events-none transform translate-x-[2px]" />
      )}
    </div>
  </div>
)}

      {/* Optional: Add a gradient overlay for better visibility of controls */}
      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent rounded-lg opacity-30 pointer-events-none"></div>
    </section>
  );
}

export default Scard;