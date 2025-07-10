import React, { useState, useRef, useEffect } from 'react';
import { IoVolumeHighOutline, IoVolumeMediumOutline, IoVolumeMuteOutline } from "react-icons/io5";

const Sound = ({ videoRef }) => {
  const [volume, setVolume] = useState(1); // 0 to 1
  const [isMuted, setIsMuted] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const volumeSliderRef = useRef(null);

  // Update video element volume when volume changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted, videoRef]);

  // Close volume slider when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (volumeSliderRef.current && !volumeSliderRef.current.contains(event.target)) {
        setShowVolumeSlider(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    setShowVolumeSlider(!showVolumeSlider); // Toggle visibility when clicking button
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) {
      return <IoVolumeMuteOutline />;
    } else if (volume < 0.5) {
      return <IoVolumeMediumOutline />;
    }
    return <IoVolumeHighOutline />;
  };

  return (
    <>
    <div className="relative flex items-center gap-2 ">
      <button
        onClick={toggleMute}
        className="text-white text-2xl cursor-pointer hover:scale-110 transition-transform"
      >
        {getVolumeIcon()}
      </button>

      {showVolumeSlider && (
        <div
          ref={volumeSliderRef}
          className="bg-black bg-opacity-70 rounded-lg px-3 py-2 flex items-center"
        >
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-24 h-1 accent-white cursor-pointer"
          />
        </div>
      )}
    </div>
    </>
  );
};

export default Sound;