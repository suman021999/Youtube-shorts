
import React, { useState } from 'react'
import { AiFillDislike, AiFillLike } from "react-icons/ai";
import { BsFillChatRightTextFill } from "react-icons/bs";
import { IoShareSocialSharp } from "react-icons/io5";
import Chatbox from '../Chat/Chatbox'; 

const Scfun = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);


  

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <>
      <div className='flex flex-row h-[70vh] w-0 relative'>
        {/* Left sidebar with icons */}
        <div className='flex flex-col'>
          <div className={`mt-36 cursor-pointer  `}><AiFillLike className='text-2xl'/></div>
          <div className='mt-8 cursor-pointer '><AiFillDislike className='text-2xl'/></div>
          <div className='mt-10  cursor-pointer ' onClick={toggleChat}>
            <BsFillChatRightTextFill className='text-2xl'/>
          </div> 
          <div className='mt-28 cursor-pointer '><IoShareSocialSharp className='text-2xl'/></div>
        </div>

        {/* Chatbox that appears on the right when opened */}
        {isChatOpen && (
          <div className='ml-2 absolute -right-8 xl:static'>
            <Chatbox />
          </div>
        )}
      </div>
    </>
  )
}

export default Scfun