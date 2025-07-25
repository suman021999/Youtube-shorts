import React, { useEffect, useState } from 'react'
import Scard from './Scard';
import VideoCard from '../videocards/VideoCard';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Shortscontext = () => {
  // const [videoData, setVideoData] = useState(null);
const [videos, setVideos] = useState([]) 

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
        // console.log(response.data.data, "response")
      } catch (err) {
      console.log(err)
      } 

    };

    fetchVideo();
  }, []);
     
    
  return (
    <>
     <section className={` w-full  mt-20 mb-[40vh]  h-full`}>  
        <div className="flex flex-wrap justify-center items-center gap-4 p-4 ">

          {/* {
            videos.map((video)=>( */}

              
             <VideoCard
          videoUrl={videos.videoUrl}
          description={videos.description}
          views={videos.views}
          
          autoPlay={false}
          owner={videos.owner} 
          id={videos._id}
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

