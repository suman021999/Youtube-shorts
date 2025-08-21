import React, { useState, useEffect } from 'react'
import { AiFillDislike, AiFillLike, AiOutlineLike, AiOutlineDislike } from "react-icons/ai";
import { BsFillChatRightTextFill, BsChatRightText } from "react-icons/bs";
import { IoShareSocialSharp, IoShareSocialOutline } from "react-icons/io5";
import Chatbox from '../Chat/Chatbox';
import Share from '../share/Share';

const Scfun = ({ videoId }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isshare, setIsshare] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true); 

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };
  
  const toggleShare = () => {
    setIsshare(!isshare);
  }
  
  // auto detect screen size
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024); // lg breakpoint
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <div className="flex flex-row w-full relative">
        {/* Right sidebar with icons */}
        <div className="flex flex-col items-center lg:static absolute right-8 top-24 space-y-6">
          {/* LIKE */}
          <div className="flex flex-col items-center cursor-pointer">
            {isDesktop ? (
              <>
                <AiFillLike className="text-2xl mt-52" />
                <p>1.3k</p>
              </>
            ) : (
              <>
                <AiOutlineLike className="text-2xl text-white mt-28" />
                <p className="text-white text-sm">1.3k</p>
              </>
            )}
          </div>

          {/* DISLIKE */}
          <div className="flex flex-col items-center cursor-pointer">
            {isDesktop ? (
              <>
                <AiFillDislike className="text-2xl mt-2" />
                <span>Dislike</span>
              </>
            ) : (
              <>
                <AiOutlineDislike className="text-2xl text-white mt-2" />
                <span className="text-white text-sm">Dislike</span>
              </>
            )}
          </div>

          {/* CHAT */}
          <div className="flex flex-col items-center cursor-pointer" onClick={toggleChat}>
            {isDesktop ? (
              <BsFillChatRightTextFill className="text-2xl mt-2" />
            ) : (
              <BsChatRightText className="text-2xl text-white mt-2" />
            )}
          </div>

          {/* SHARE */}
          <div className="flex flex-col items-center cursor-pointer" onClick={toggleShare}>
            {isDesktop ? (
              <IoShareSocialSharp className="text-2xl mt-2" />
            ) : (
              <IoShareSocialOutline className="text-2xl text-white mt-2 mb-2" />
            )}
          </div>
        </div>

        {/* Chatbox */}
        {isChatOpen && (
          <div className="ml-2 absolute right-16 xl:static">
            <Chatbox videoId={videoId} onClose={toggleChat} />
          </div>
        )}
      </div>

      {/* Render Share component outside the main container */}
      {isshare && <Share onClose={toggleShare} />}
    </>
  );
};

export default Scfun;


