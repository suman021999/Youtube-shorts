
// import React, { useState } from 'react'
// import { AiFillDislike, AiFillLike } from "react-icons/ai";
// import { BsFillChatRightTextFill } from "react-icons/bs";
// import { IoShareSocialSharp } from "react-icons/io5";
// import Chatbox from '../Chat/Chatbox'; 

// const Scfun = ({ videoId }) => {
//   const [isChatOpen, setIsChatOpen] = useState(false);


  

//   const toggleChat = () => {
//     setIsChatOpen(!isChatOpen);
//   };

//   return (
//     <>
//       <div className='flex flex-row h-[85vh] w-0 relative'>
//         {/* Left sidebar with icons */}
//         <div className='flex flex-col'>
//           <div className={`mt-28 cursor-pointer  `}><AiFillLike className='text-2xl'/></div>
//           <div className='mt-8 mb-28 cursor-pointer '><AiFillDislike className='text-2xl'/></div>
//           <div className='mt-10 mb-10 cursor-pointer ' onClick={toggleChat}>
//             <BsFillChatRightTextFill className='text-2xl'/>
//           </div> 
//           <div className='mt-28 cursor-pointer '><IoShareSocialSharp className='text-2xl'/></div>
//         </div>

//         {/* Chatbox that appears on the right when opened */}
//         {isChatOpen && (
//           <div className='ml-2 absolute -right-8 xl:static'>
//             <Chatbox videoId={videoId} />
//           </div>
//         )}
//       </div>
//     </>
//   )
// }

// export default Scfun


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
          <div className={`mt-28 cursor-pointer  `}><AiFillLike className='text-2xl'/></div>
          <div className='mt-8 mb-28 cursor-pointer '><AiFillDislike className='text-2xl'/></div>
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