
// import React, { useState } from 'react'
// import { AiFillDislike, AiFillLike } from "react-icons/ai";
// import { BsFillChatRightTextFill } from "react-icons/bs";
// import { IoShareSocialSharp } from "react-icons/io5";
// import { AiOutlineLike } from "react-icons/ai";
// import Chatbox from '../Chat/Chatbox'; 

// const Scfun = ({ videoId }) => {
//   const [isChatOpen, setIsChatOpen] = useState(false);
  



//   const toggleChat = () => {
//     setIsChatOpen(!isChatOpen);
//   };

//   return (
//     <>
//       <div className='flex flex-row h-[85vh] w-10 relative '>
//         {/* Left sidebar with icons */}
//         <div className='flex flex-col'>

         
//         <div className="flex flex-col items-center mt-28 ">

//         <div className={` flex flex-col justify-center items-center cursor-pointer hover:bg-[#22222223] h-10 w-10 rounded-full `}>
//             <AiFillLike className='text-2xl'/>
            
//             {/* //{likes} */}
//             </div>
//             <p>1.3k</p>


//           </div>
          

//             <div className='mt-6 mb-28 flex flex-col'>
//               <div className=' flex  justify-center items-center cursor-pointer hover:bg-[#22222223] h-10 w-10 rounded-full '>
//             <AiFillDislike className='text-2xl rotate-180'/>
//             </div>
//               <span>Dislike</span>
//             </div>
          
          
//           <div className='mt-10 mb-10 cursor-pointer ' onClick={toggleChat}>
//             <BsFillChatRightTextFill className='text-2xl'/>
//           </div> 
//           <div className='mt-28 cursor-pointer '>
//             <IoShareSocialSharp className='text-2xl'/>
//             </div>
//         </div>

//         {/* Chatbox that appears on the right when opened */}
//         {isChatOpen && (
//           <div className='ml-2 absolute right-8 xl:static'>
//             <Chatbox videoId={videoId} onClose={toggleChat} /> {/*id call here  */}
//           </div>
//         )}
//       </div>
//     </>
//   )
// }

// export default Scfun

//  lg:static 


        //  <div className={` flex flex-col justify-center items-center cursor-pointer hover:bg-[#22222223] h-10 w-10 rounded-full `}>
        //     <AiFillLike className='text-2xl'/>
            
        //     {/* //{likes} */}
        //     </div>
        //     <p>1.3k</p>


import React, { useState, useEffect } from 'react'
import { AiFillDislike, AiFillLike, AiOutlineLike, AiOutlineDislike } from "react-icons/ai";
import { BsFillChatRightTextFill, BsChatRightText } from "react-icons/bs";
import { IoShareSocialSharp, IoShareSocialOutline } from "react-icons/io5";
import Chatbox from '../Chat/Chatbox';

const Scfun = ({ videoId }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true); // desktop vs mobile

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

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
      <div className="flex flex-row  w-full  relative">
        {/* Right sidebar with icons */}
        <div className="flex flex-col items-center  lg:static absolute right-8 top-24 space-y-6">

          {/* LIKE */}
          <div className="flex flex-col items-center  cursor-pointer">
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
          <div className="flex flex-col items-center   cursor-pointer">
            {isDesktop ? (
              <>
                <AiFillDislike className="text-2xl mt-2" />
                <span >Dislike</span>
              </>
            ) : (
              <>
                <AiOutlineDislike className="text-2xl text-white mt-2" />
                <span className="text-white text-sm">Dislike</span>
              </>
            )}
          </div>

          {/* CHAT */}
          <div className="flex flex-col items-center  cursor-pointer" onClick={toggleChat}>
            {isDesktop ? (
              <BsFillChatRightTextFill className="text-2xl mt-2" />
            ) : (
              <BsChatRightText className="text-2xl text-white mt-2" />
            )}
          </div>

          {/* SHARE */}
          <div className="flex flex-col items-center cursor-pointer">
            {isDesktop ? (
              <IoShareSocialSharp className="text-2xl  mt-2" />
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
    </>
  );
};

export default Scfun;


