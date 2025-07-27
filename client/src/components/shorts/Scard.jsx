
import React, { useRef, useState, useEffect } from 'react';
import { FaPlay, FaPause } from "react-icons/fa";
import { MdOutlineZoomOutMap } from "react-icons/md";
import {Link} from "react-router-dom"
import Sound from './Sound';
import Scfun from './Scfun';

const Scard = ({ videoUrl,  id }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [showCenterButton, setShowCenterButton] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef(null);
  const timeoutRef = useRef(null);
  const progressBarRef = useRef(null);
  const isDraggingRef = useRef(false);

  // Play/pause handler
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

  // Reset controls hide timeout
  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setShowCenterButton(false);
    }, 500);
  };

  // Video click handler
  const handleVideoClick = (e) => {
    if (e.target === videoRef.current) {
      handlePlayPause();
    }
  };

  // Update progress bar
  const updateProgress = () => {
    if (!isDraggingRef.current && videoRef.current && videoRef.current.readyState > 0) {
      const currentTime = videoRef.current.currentTime;
      const duration = videoRef.current.duration || 0;
      const newProgress = duration > 0 ? (currentTime / duration) * 100 : 0;
      setProgress(newProgress);
      setDuration(duration);
    }
    requestAnimationFrame(updateProgress);
  };

  // Click on progress bar
  const handleProgressClick = (e) => {
    if (videoRef.current && progressBarRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const clickPosition = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
      const seekTime = (clickPosition / rect.width) * videoRef.current.duration;
      
      videoRef.current.currentTime = seekTime;
      setProgress((seekTime / videoRef.current.duration) * 100);
    }
  };

  // Handle input range changes
  const handleProgressChange = (e) => {
    const newProgress = parseFloat(e.target.value);
    setProgress(newProgress);
    
    if (videoRef.current && duration) {
      videoRef.current.currentTime = (newProgress / 100) * duration;
    }
  };

  // Drag handlers
  const handleDragStart = () => {
    isDraggingRef.current = true;
  };

  const handleDragEnd = () => {
    isDraggingRef.current = false;
  };

  // Set up event listeners
  useEffect(() => {
    resetTimeout();
    const video = videoRef.current;
    
    if (video) {
      video.addEventListener('loadedmetadata', () => {
        setDuration(video.duration);
      });
      updateProgress();
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);



    // Remove the logged-in user data section and replace with creator data
  const username = owner?.username || 'Unknown User';

  // Avatar render using creator data
const renderAvatar = () => {
  if (!owner) return <span className="text-sm">?</span>;
  if (owner.avatar) return(
    <p>{owner.avatar}</p>
  );
  // <img src= alt={username} className="w-full h-full rounded-full" />
  const initials = owner.username  // Changed from user.username to owner.username
    ? owner.username.slice(0, 2).toUpperCase()
    : "US";
  return <span className="text-sm">{initials}</span>;
};
 


  return (
    <>
    <section className="relative group z-10 flex gap-4">

      <div className='relative flex '>

        <div className="relative h-[70vh]  bg-cover md:w-[400px] max-w-sm rounded-lg shadow-md overflow-hidden">
        <video
           ref={videoRef}
           controls={false}
           autoPlay
           loop
           preload="auto"
           className="h-full w-full object-cover"
           onClick={handleVideoClick}
           onMouseMove={resetTimeout}
               >
         <source src={videoUrl} type="video/mp4" />
         </video>

        {/* Progress bar with input range */}
        <div className="absolute bottom-0 left-0 right-0  pb-[2px]">
          <div 
            ref={progressBarRef}
            className="relative w-full h-1 bg-gray-600 bg-opacity-50 rounded-full cursor-pointer group"
            onClick={handleProgressClick}
          >
            {/* Visual progress indicator */}
            <div 
              className="h-full bg-red-500 rounded-full relative"
              style={{ width: `${progress}%` }}
            >
              {/* Thumb that appears on hover */}
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-75"></div>
            </div>
            
            {/* Actual input range (hidden but functional) */}
            <input
              type="range"
              min="0"
              max="100"
              step="0.1"
              value={progress}
              onChange={handleProgressChange}
              onMouseDown={handleDragStart}
              onMouseUp={handleDragEnd}
              onTouchStart={handleDragStart}
              onTouchEnd={handleDragEnd}
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </div>

        {/* YouTube Shorts style text section */}
        <div className="absolute bottom-2 left-0 right-0 p-4 pb-10 z-10">
          <div className="flex items-center mb-2">
            <Link to="/Mychennel" className='flex items-center'><div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-400 mr-2">{renderAvatar()}</div>
            <span className="text-white font-medium text-sm">@{username}</span></Link>
            <button className="ml-auto bg-white text-black px-3 py-1 rounded-full text-sm font-medium">
              Subscribe
            </button>
          </div>
          
          <div>
            {/* <h2 className="text-white font-bold text-lg">Video Title</h2> */}
            <p className="text-white text-sm">Video description</p>
          </div>
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent rounded-lg opacity-30 pointer-events-none"></div>
      </div>

      {/* Controls */}
      <div className="absolute overflow-hidden top-0 left-0 right-0 p-4 flex items-center justify-between z-10 ">
        <div className='flex items-center justify-between'>
          <button onClick={handlePlayPause}>
            {isPlaying ? (
              <div className='hover:bg-[#b3b0b034] p-3 rounded-full flex justify-center items-center'>
                <FaPause className="text-white opacity-0 group-hover:opacity-100 text-2xl cursor-pointer hover:scale-110 transition-transform" />
              </div>
            ) : (
              <div className='hover:bg-[#b3b0b034] p-3 rounded-full flex justify-center items-center'>
                <FaPlay className="text-white text-2xl cursor-pointer hover:scale-110 transition-transform translate-x-[2px]" />
              </div>
            )}
          </button>

          <div className={isPlaying ? "opacity-0 group-hover:opacity-100" : ""}>
            <Sound videoRef={videoRef}/>
          </div>
        </div>

       
        <div className="hidden lg:flex">
 <MdOutlineZoomOutMap className={`text-white text-2xl cursor-pointer hover:scale-110 transition-transform ${
          isPlaying ? "opacity-0 group-hover:opacity-100" : ""
        }`} />
        </div>
      </div>

      {/* Centered play button */}
      {showCenterButton && (
        <div 
          className="absolute inset-0 flex items-center justify-center z-0 cursor-pointer"
          onClick={handlePlayPause}
        >
          <div className="relative flex items-center justify-center rounded-full w-20 h-20 bg-opacity-50 transition-all pointer-events-none youtube-center-hover">
            {isPlaying ? (
              <FaPause className="text-white text-4xl transition-all pointer-events-none " />
            ) : (
              <FaPlay className="text-white text-4xl transition-all pointer-events-none transform translate-x-[2px]" />
            )}
          </div>
        </div>
      )}

      </div>


       <div className="flex absolute lg:static  right-8 z-20">
          <Scfun />
        </div>
    </section>

    


    {/* zoom in function
    div */}
    </>
  );
};

export default Scard;





