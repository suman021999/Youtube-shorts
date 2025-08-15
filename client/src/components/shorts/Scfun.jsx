
import React, { useState } from 'react'
import { AiFillDislike, AiFillLike } from "react-icons/ai";
import { BsFillChatRightTextFill } from "react-icons/bs";
import { IoShareSocialSharp } from "react-icons/io5";
import Chatbox from '../Chat/Chatbox'; 

const Scfun = ({ videoId }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <>
      <div className='flex flex-row h-[85vh] w-0 relative'>
        {/* Left sidebar with icons */}
        <div className='flex flex-col'>

          <div className="flex flex-col items-center mt-28">
         <div className={` flex flex-col justify-center items-center cursor-pointer hover:bg-[#22222223] h-10 w-10 rounded-full `}>
            <AiFillLike className='text-2xl'/>
            
            {/* //{likes} */}
            </div>
            <p>1.3k</p>
          </div>
          

            <div className='mt-6 mb-28 flex flex-col'>
              <div className=' flex  justify-center items-center cursor-pointer hover:bg-[#22222223] h-10 w-10 rounded-full '>
            <AiFillDislike className='text-2xl rotate-180'/>
            </div>
              <span>Dislike</span>
            </div>
          
          
          <div className='mt-10 mb-10 cursor-pointer ' onClick={toggleChat}>
            <BsFillChatRightTextFill className='text-2xl'/>
          </div> 
          <div className='mt-28 cursor-pointer '><IoShareSocialSharp className='text-2xl'/></div>
        </div>

        {/* Chatbox that appears on the right when opened */}
        {isChatOpen && (
          <div className='ml-2 absolute -right-8 xl:static'>
            <Chatbox videoId={videoId} onClose={toggleChat} /> {/*id call here  */}
          </div>
        )}
      </div>
    </>
  )
}

export default Scfun