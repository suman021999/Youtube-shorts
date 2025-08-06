
import React, { useRef, useState, useEffect } from 'react';
import { FaPlay, FaPause } from "react-icons/fa";
import { MdOutlineZoomOutMap } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import Sound from '../shorts/Sound';
import Scfun from '../shorts/Scfun';

const VideoCard = ({ 
  videoUrl, 
  description = '', 
  views = 0, 
  id, 
  isShort = false, 
  autoPlay = true,
  owner = {}
}) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [showCenterButton, setShowCenterButton] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false); 
  const [autoplayAttempted, setAutoplayAttempted] = useState(false);
  const [showDetails] = useState(!isShort); // Only show details for non-shorts
  
  const videoRef = useRef(null);
  const timeoutRef = useRef(null);
  const progressBarRef = useRef(null);
  const isDraggingRef = useRef(false);
  const navigate = useNavigate();
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
   const isSidebarOpen = useSelector((state) => state.sidebar.isOpen);

  const attemptAutoplay = async () => {
    if (!isShort || !autoPlay || !videoRef.current || autoplayAttempted) return;

    try {
    
      await videoRef.current.play();
      setIsPlaying(true);
      setIsMuted(true);
    } catch (error) {
      try {
        videoRef.current.muted = true;
        await videoRef.current.play();
        setIsPlaying(true);
        setIsMuted(true);
      } catch (mutedError) {
        console.log("Autoplay completely blocked");
      }
    }
    setAutoplayAttempted(true);
  };



  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => attemptAutoplay();
    
    video.addEventListener('canplay', handleCanPlay);
    return () => video.removeEventListener('canplay', handleCanPlay);
  }, [autoPlay, isShort, autoplayAttempted]);

  useEffect(() => {
    if (isShort) {
      attemptAutoplay();
    }
  }, [isShort]);

  const handlePlayPause = async () => {
    if (!videoRef.current) return;

    try {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        if (isMuted) {
          videoRef.current.muted = false;
          setIsMuted(false);
        }
        await videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error("Playback error:", error);
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
        state: { videoUrl, description, views, id, owner }
      });
    }
  };


  const handleChannelClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (owner?.username) {
      navigate(`/channel/${owner.username}`);
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

  const resetTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setShowCenterButton(false), 500);
  };

  useEffect(() => {
    resetTimeout();
    const video = videoRef.current;
    
    if (video) {
      video.addEventListener('loadedmetadata', () => {
        setDuration(video.duration);
      });
      
      const animationFrame = requestAnimationFrame(updateProgress);
      
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        cancelAnimationFrame(animationFrame);
      };
    }
  }, []);

  const username = owner?.username || 'Unknown User';

  const renderAvatar = () => {
    if (!owner) return <span className="text-sm">?</span>;
    if (owner.avatar) return <p>{owner.avatar}</p>;
    const initials = owner.username ? owner.username.slice(0, 2).toUpperCase() : "US";
    return <span className="text-sm">{initials}</span>;
  };

  if (!videoUrl) {
    console.error("Video URL is missing for video:", id);
    return null; // or render a placeholder
  }

  return isShort ? (
    <section className={`relative group z-10 flex gap-4  ${isSidebarOpen ? 'lg:ml-[45vh] ' : ''} lg:ml-8`}>
      <div className='relative flex'>
        <div className={`relative ${isShort ? 'h-[85vh]' : 'h-auto'} bg-cover md:w-[400px] max-w-sm rounded-lg shadow-md overflow-hidden`}>
          <video
            ref={videoRef}
            src={videoUrl}
            controls={false}
            autoPlay={autoPlay}
            loop={isShort}
            preload="auto"
            muted={isMuted}
            playsInline
            className={`${isShort ? 'h-full' : 'h-auto'} w-full object-cover`}
            onClick={handleVideoClick}
            onMouseMove={resetTimeout}
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {isShort && (
            <div className="absolute bottom-0 left-0 right-0 pb-[2px]">
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
          )}

          {isShort && (
            <div className="absolute bottom-2 left-0 right-0 p-4 pb-10 z-10">
              <div className="flex items-center mb-2">
                <Link
                  to={`/channel/${owner?.username || owner?.id}`} 
                  onClick={handleChannelClick} 
                  className='flex items-center'
                >
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

          {isShort && (
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent rounded-lg opacity-30 pointer-events-none"></div>
          )}

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
                  <Sound 
                    videoRef={videoRef}
                    isMuted={isMuted}
                    onToggleMute={() => {
                      const newMuted = !isMuted;
                      setIsMuted(newMuted);
                    }}
                  />
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
          <Scfun  /> {/* videoId={id} */}
        </div>
      )}
    </section>
  ) : (
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
            muted={false} 
          />
        </div>
        
        {showDetails && (
          <div className='px-4 py-2'>
            <h2 className={`text-lg font-semibold mb-2 text-ellipsis overflow-hidden whitespace-nowrap ${isDarkMode ? 'text-white' : ''}`}>
              {description || 'No description'}
            </h2>
            <p className={`text-sm pb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
              {views} Views
            </p>
          </div>
        )}
      </Link>
    </div>
  );
};

export default VideoCard;