import React, { useRef, useState, useEffect } from 'react';

import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa6";
import { MdOutlineZoomInMap, MdOutlineZoomOutMap } from "react-icons/md";
import Sound from './Sound';

const Scard = () => {
  
  const [isPlaying, setIsPlaying] = useState(true);
  const [showCenterButton, setShowCenterButton] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);
  const videoRef = useRef(null);
  const timeoutRef = useRef(null);


    const toggleZoom = () => {
    setIsZoomed(!isZoomed);
    setShowCenterButton(true);
    resetTimeout();
  };

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
    <>
    <section className={`relative group transition-all duration-300 ${isZoomed ? 'scale-0' : 'scale-100'}`}>
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
      <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10">
        <div className='flex items-center justify-between'>
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
        <Sound  videoRef={videoRef}/>
           
           
        </div>
        
        
        
         <button onClick={toggleZoom}>
            <MdOutlineZoomOutMap className="text-white text-2xl cursor-pointer hover:scale-110 transition-transform" />
          </button>
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

    {/* Overlay for zoomed state */}
      {isZoomed && (
        <div 
          className="fixed inset-0 bg-[#F5F3F3] bg-opacity-70 z-100 flex items-center justify-center"
          onClick={toggleZoom}
        >
          <div className="relative max-w-4xl w-full">
            <video
              ref={videoRef}
              controls={false}
              autoPlay={isPlaying}
              loop
              preload="auto"
              className="w-full h-auto max-h-[90vh] rounded-lg  object-contain cursor-pointer"
              onClick={handleVideoClick}
            >
              <source src="1111.mp4" type="video/mp4" />
              <source src="1111.mp4" type="video/ogg" />
            </video>
            
            {/* Custom controls for zoomed state */}
            <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-50">
              <div className='flex items-center justify-between'>
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
                <Sound videoRef={videoRef}/>
              </div>
              
              <button onClick={toggleZoom}>
                <MdOutlineZoomInMap className="text-white text-2xl cursor-pointer hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Scard;
