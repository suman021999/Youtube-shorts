import React, { useEffect, useState } from 'react'
import VideoCard from '../videocards/VideoCard';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FaArrowDown,FaArrowUp  } from "react-icons/fa6";

const Shortscontext = () => {
const [videos, setVideos] = useState(null) 

    const { id } = useParams();
    // console.log(id)
     useEffect(() => {
    const fetchVideo = async () => {
     
      try {
        
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_VIDEO_URL}/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        setVideos(response.data.data);
       
      } catch (err) {
      console.log(err)
      } 

    };

    fetchVideo();
  }, [id]);


    if (!videos) {
    return (<div className="flex flex-col gap-4 justify-center items-center h-screen w-screen">Loading...</div>)
  }
    
  return (
    <>
     <section className={` w-full   h-[80vh]`}>  
        <div className="flex  flex-wrap justify-center items-center gap-4  ">

          <VideoCard
          videoUrl={videos.videoUrl}
          description={videos.description}
          views={videos.views}
          autoPlay={true}
          owner={videos.owner} 
          id={videos._id}  
          isShort={true}
          />

        </div>
      
      </section>
    </>
  )
}

export default Shortscontext



//  <div className='flex flex-col gap-4 justify-center items-center'>

//           <div className='h-16 w-16 rounded-full flex justify-center items-center bg-[#9791915a]'>
//           <FaArrowUp  className='h-6 w-6' />
//           </div>
          // <div className='h-16 w-16 rounded-full flex justify-center items-center bg-[#9791915a]'>
          // <FaArrowDown className='h-6 w-6' />
          // </div>
         
//           </div>


