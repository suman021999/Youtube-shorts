import React from 'react'
import { AiFillDislike,AiFillLike } from "react-icons/ai";
import { BsFillChatRightTextFill } from "react-icons/bs";
import { IoShareSocialSharp } from "react-icons/io5";


const Scfun = () => {
  return (
    <>
      <div className='flex flex-col h-[70vh]  '>

        
            
<div className='mt-40 mb-4'><AiFillDislike className='text-4xl'/></div>
<div className=''><AiFillLike className='text-4xl'/></div>
<div className='mt-10'><BsFillChatRightTextFill className='text-4xl'/></div>
<div className='mt-28'><IoShareSocialSharp className='text-4xl'/></div>



        

      </div>
    </>
  )
}

export default Scfun
