
import React, { useState, useEffect } from 'react'
import { AiFillDislike, AiFillLike, AiOutlineLike, AiOutlineDislike } from "react-icons/ai";
import { BsFillChatRightTextFill, BsChatRightText } from "react-icons/bs";
import { IoShareSocialSharp, IoShareSocialOutline } from "react-icons/io5";
import Chatbox from '../Chat/Chatbox';
import Share from '../share/Share';
import axios from "axios";

const API_URL = import.meta.env.VITE_VIDEO_URL;

const Scfun = ({ videoId }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isshare, setIsshare] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true); 

  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0); // Added dislike count
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);

  const token = localStorage.getItem("token");

  // ✅ Formatter for likes only
  const formatCount = (num) => {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1).replace(/\.0$/, "") + "B";
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
    }
    return num;
  };

  // ✅ Fetch initial video data (likes, dislikes, user's like status)
  const fetchVideoData = async () => {
    try {
      const response = await axios.get(`${API_URL}/${videoId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const videoData = response.data;
      setLikeCount(videoData.likes || 0);
      setDislikeCount(videoData.dislikes || 0);
      
      // Check if current user has liked/disliked this video
      const userId = videoData.currentUserId; // You might need to get this from your auth context
      setIsLiked(videoData.likedBy?.includes(userId) || false);
      setIsDisliked(videoData.dislikedBy?.includes(userId) || false);
    } catch (err) {
      console.error("Error fetching video data:", err.response?.data || err.message);
    }
  };

  // ✅ Load video data when component mounts
  useEffect(() => {
    if (videoId && token) {
      fetchVideoData();
    }
  }, [videoId, token]);

  const handleLike = async () => {
    try {
      const res = await axios.post(
        `${API_URL}/${videoId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ✅ Update state with response data
      setLikeCount(res.data.likes);
      setDislikeCount(res.data.dislikes);
      setIsLiked(!isLiked); // Toggle like state
      setIsDisliked(false); // Remove dislike if it was disliked
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  const handleDislike = async () => {
    try {
      const res = await axios.post(
        `${API_URL}/${videoId}/dislike`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ✅ Update state with response data
      setDislikeCount(res.data.dislikes);
      setLikeCount(res.data.likes);
      setIsDisliked(!isDisliked); // Toggle dislike state
      setIsLiked(false); // Remove like if it was liked
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  const toggleChat = () => setIsChatOpen(!isChatOpen);
  const toggleShare = () => setIsshare(!isshare);

  // auto detect screen size
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
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
          <div className="flex flex-col items-center cursor-pointer" onClick={handleLike}>
            {isDesktop ? (
              <>
                {isLiked ? (
                  <AiFillLike className="text-2xl mt-52 p-2 text-white bg-[#0000007b] w-8 h-8 rounded-full" />
                ) : (
                  <AiFillLike className="text-2xl mt-52" />
                )}
                <p>{formatCount(likeCount)}</p>
              </>
            ) : (
              <>
                {isLiked ? (
                  <AiFillLike className="text-2xl text-[#fffdfdb6]  mt-28" />
                ) : (
                  <AiOutlineLike className="text-2xl text-white mt-28" />
                )}
                <p className="text-white text-sm">{formatCount(likeCount)}</p>
              </>
            )}
          </div>

          {/* DISLIKE */}
          <div className="flex flex-col items-center cursor-pointer" onClick={handleDislike}>
            {isDesktop ? (
              <>
                {isDisliked ? (
                  <AiFillDislike className="text-2xl mt-2 p-2 text-white bg-[#0000007b] w-8 h-8 rounded-full" />
                ) : (
                  <AiFillDislike className="text-2xl mt-2" />
                )}
                <span>Dislike</span>
              </>
            ) : (
              <>
                {isDisliked ? (
                  <AiFillDislike className="text-2xl text-[#fffdfdb6] mt-2" />
                ) : (
                  <AiOutlineDislike className="text-2xl text-white mt-2" />
                )}
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

      {/* Render Share component */}
      {isshare && <Share onClose={toggleShare} />}
    </>
  );
};

export default Scfun;