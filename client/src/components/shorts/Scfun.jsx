
import React, { useState } from 'react'
import { AiFillDislike, AiFillLike } from "react-icons/ai";
import { BsFillChatRightTextFill } from "react-icons/bs";
import { IoShareSocialSharp } from "react-icons/io5";
import Chatbox from '../Chat/Chatbox'; // Make sure the path is correct

const Scfun = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <>
      <div className='flex flex-row h-[70vh] relative'>
        {/* Left sidebar with icons */}
        <div className='flex flex-col'>
          <div className='mt-36'><AiFillLike className='text-2xl'/></div>
          <div className='mt-8'><AiFillDislike className='text-2xl'/></div>
          <div className='mt-10 cursor-pointer' onClick={toggleChat}>
            <BsFillChatRightTextFill className='text-2xl'/>
          </div> 
          <div className='mt-28'><IoShareSocialSharp className='text-2xl'/></div>
        </div>

        {/* Chatbox that appears on the right when opened */}
        {isChatOpen && (
          <div className='ml-2 '>
            <Chatbox />
          </div>
        )}
      </div>
    </>
  )
}

export default Scfun