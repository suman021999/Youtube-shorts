import React, { useRef, useState, useEffect } from 'react';
import { FaPlay, FaPause } from "react-icons/fa";
import { MdOutlineZoomOutMap } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import Sound from '../shorts/Sound';
import Scfun from '../shorts/Scfun';

const VideoCard = ({ 
  videoUrl, 
  description, 
  views, 
  id, 
  isShort = false, 
  showDetails = true,
  autoPlay = false,
  owner
}) => {
  // State and refs
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [showCenterButton, setShowCenterButton] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef(null);
  const timeoutRef = useRef(null);
  const progressBarRef = useRef(null);
  const isDraggingRef = useRef(false);
  const navigate = useNavigate();
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

 

  // Handlers
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

  const handleVideoClick = (e) => {
    if (isShort) {
      if (e.target === videoRef.current) {
        handlePlayPause();
      }
    } else {
      e.preventDefault();
      navigate(`/shorts/${id}`, { 
        state: { 
          videoUrl,
          description,
          views,
          id,
        }
      });
    }
  };

  // Progress and controls
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

  const resetTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setShowCenterButton(false), 500);
  };

  // Effects
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
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);


  //  // User data
  // const user = JSON.parse(localStorage.getItem("user"));
  // const isLoggedIn = !!user;
  // const username = user
  //   ? user.username || user.email?.split('@')[0] || 'My Channel'
  //   : 'Unknown User';

  // // Avatar render
  // const renderAvatar = () => {
  //   if (!isLoggedIn) return <span className="text-sm">?</span>;
  //   if (user.avatar) return <p>{user.avatar}</p>;
  //   const initials = user.username 
  //     ? user.username.slice(0, 2).toUpperCase()
  //     : "US";
  //   return <span className="text-sm">{initials}</span>;
  // };



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

  // Render different layouts based on isShort prop
  return isShort ? (
    // Shorts view layout
    <section className="relative group z-10 flex gap-4">
      <div className='relative flex'>
        <div className={`relative ${isShort ? 'h-[70vh]' : 'h-auto'} bg-cover md:w-[400px] max-w-sm rounded-lg shadow-md overflow-hidden`}>
          <video
            ref={videoRef}
            controls={false}
            autoPlay={autoPlay}
            loop={isShort}
            preload="auto"
            className={`${isShort ? 'h-full' : 'h-auto'} w-full object-cover`}
            onClick={handleVideoClick}
            onMouseMove={resetTimeout}
          >
            <source src={videoUrl} type="video/mp4" />
          </video>

          {/* Progress bar */}
          {isShort && (
            <div className="absolute bottom-0 left-0 right-0 pb-[2px]">
              <div 
                ref={progressBarRef}
                className="relative w-full h-1 bg-gray-600 bg-opacity-50 rounded-full cursor-pointer group"
              >
                <div 
                  className="h-full bg-red-500 rounded-full relative"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-75"></div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.1"
                  value={progress}
                  onChange={(e) => {
                    const newProgress = parseFloat(e.target.value);
                    setProgress(newProgress);
                    if (videoRef.current && duration) {
                      videoRef.current.currentTime = (newProgress / 100) * duration;
                    }
                  }}
                  className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* Video info */}
          {isShort && (
            <div className="absolute bottom-2 left-0 right-0 p-4 pb-10 z-10">
              <div className="flex items-center mb-2">
                <Link  to={`/Mychennel/@${username}`} className='flex items-center'>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-400 mr-2">
                    {renderAvatar()}
                  </div>
                  <span className="text-white font-medium text-sm">@{username}</span>
                </Link>
                <button className="ml-auto bg-white text-black px-3 py-1 rounded-full text-sm font-medium">
                  Subscribe
                </button>
              </div>
              <div>
                <p className="text-white text-sm">{description || 'No description'}</p>
              </div>
            </div>
          )}

          {/* Gradient overlay */}
          {isShort && (
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent rounded-lg opacity-30 pointer-events-none"></div>
          )}

          {/* Controls */}
          <div className="absolute overflow-hidden top-0 left-0 right-0 p-4 flex items-center justify-between z-10">
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

              {isShort && (
                <div className={isPlaying ? "opacity-0 group-hover:opacity-100" : ""}>
                  <Sound videoRef={videoRef}/>
                </div>
              )}
            </div>

            {isShort && (
              <div className="hidden lg:flex">
                <MdOutlineZoomOutMap className={`text-white text-2xl cursor-pointer hover:scale-110 transition-transform ${
                  isPlaying ? "opacity-0 group-hover:opacity-100" : ""
                }`} />
              </div>
            )}
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
      </div>

      {isShort && (
        <div className="flex absolute lg:static right-8 z-20">
          <Scfun />
        </div>
      )}
    </section>
  ) : (
    // Regular card view layout
    <div className={`${isShort ? '' : 'lg:w-[15vw] mb-20 lg:mb-0 rounded-lg'}`}>
      <Link 
        to={`/shorts/${id}`}
        onClick={handleVideoClick}
        className="block"
      >
        <div className="mb-4">
          <video
            ref={videoRef}
            src={videoUrl}
            type="video/mp4" 
            className="w-full rounded-lg"
            loop={false}
            autoPlay={false}
          />
        </div>
        
        {showDetails && (
          <div className='px-4 py-2'>


            
            <h2 className={`text-lg font-semibold mb-2 text-ellipsis overflow-hidden whitespace-nowrap ${isDarkMode ? 'text-white' : ''}`}>
              {description || 'No description'}
            </h2>
            <p className={`text-sm pb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
              {views} Views • Date
            </p>
          </div>
        )}
      </Link>
    </div>
  );
};

export default VideoCard;