import React, { useEffect, useState } from 'react'
import VideoCard from '../videocards/VideoCard';
import axios from 'axios';
import { useParams } from 'react-router-dom';

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
     <section className={` w-full  mt-20 mb-[40vh]  h-full`}>  
        <div className="flex flex-wrap justify-center items-center gap-4 p-4 ">

          

              
             <VideoCard
          videoUrl={videos.videoUrl}
          description={videos.description}
          views={videos.views}
          autoPlay={true}
          owner={videos.owner} 
           id={videos._id}  // Handle both cases
          
          isShort={true}   
          
             />
{/* 
            ))
          } */}

        </div>
      
      </section>
    </>
  )
}

export default Shortscontext

