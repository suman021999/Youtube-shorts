
import React, { useState, useRef, useEffect } from 'react';
import { IoVolumeHighOutline, IoVolumeMediumOutline, IoVolumeMuteOutline } from "react-icons/io5";

const Sound = ({ videoRef, isMuted, onToggleMute }) => {
  const [volume, setVolume] = useState(1);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const volumeSliderRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
    }
  }, [volume, videoRef]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (volumeSliderRef.current && !volumeSliderRef.current.contains(event.target)) {
        setShowVolumeSlider(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0 && isMuted) {
      onToggleMute();
    }
  };

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return <IoVolumeMuteOutline />;
    if (volume < 0.5) return <IoVolumeMediumOutline />;
    return <IoVolumeHighOutline />;
  };

  return (
    <div className="relative flex items-center gap-2">
      <button
        onClick={() => {
          onToggleMute();
          setShowVolumeSlider(false);
        }}
        onMouseEnter={() => setShowVolumeSlider(true)}
        className="text-white text-2xl cursor-pointer hover:scale-110 transition-transform"
        aria-label={isMuted ?   "Mute":"Unmute"}
      >
        {getVolumeIcon()}
      </button>

      {showVolumeSlider && (
        <div
          ref={volumeSliderRef}
          className="bg-black bg-opacity-70 rounded-lg px-3 py-2 flex items-center"
          onMouseLeave={() => setShowVolumeSlider(false)}
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
  );
};

export default Sound;