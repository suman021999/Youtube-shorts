

import React, { useEffect, useState } from 'react'
import Cards from './Cards'
import { useSelector } from 'react-redux';
import axios from 'axios'
import VideoCard from '../videocards/VideoCard';
import error from "../../../public/404.png"

const Homecontext = () => {
  const [videos, setVideos] = useState([])
  const isSidebarOpen = useSelector((state) => state.sidebar.isOpen);
  const [loading, setLoading] = useState(true)
  
  
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const token = localStorage.getItem('token'); // Or wherever you store your token
        
        const response = await axios.get(`${import.meta.env.VITE_VIDEO_URL}/all`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        setVideos(response.data.data);
        // console.log(response.data.data[0]._id,"fklljg")
      } catch (error) {
        console.error("Error fetching videos:", error);
        // Handle specific error messages from backend
        if (error.response) {
          if (error.response.status === 401) {
            // Handle unauthorized (token issues)
            console.error("Unauthorized - please login again");
            // Optionally redirect to login
          } else if (error.response.data.message) {
            console.error("Backend error:", error.response.data.message);
          }
        }
      } finally {
        setLoading(false);
      }
    }

    fetchVideos();
  }, []);

  if (loading) {
    return <div className="flex flex-col gap-4 justify-center items-center h-screen w-screen">
      <img className='h-44 w-44 rounded-full' src={error} alt="" />
      <p>Connect to the internet</p>
    </div>
  }
  
  return (
    <>
      <section className={` w-full ${isSidebarOpen ? 'lg:ml-[45vh] ' : ''} lg:ml-8  mt-20`}>  
        <div className="lg:flex lg:flex-wrap justify-center items-center gap-4 p-4 w-full grid grid-cols-2  md:grid-cols-3 md:items-center">
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              videoUrl={video.videoUrl}
              description={video.description}
              views={video.views}
              id={video._id}  
              owner={video.owner}  
              isShort={false}
            />
          ))}
        </div>
      </section>
    </>
  )
}

export default Homecontext

