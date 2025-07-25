
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Cards from './Cards'
import axios from 'axios'

const Mypage = () => {
  const isSidebarOpen = useSelector((state) => state.sidebar.isOpen)
  const isDarkMode = useSelector((state) => state.theme.isDarkMode)
  const [loading, setLoading] = useState(true)
  const [videos, setVideos] = useState([])

  //user shortname
  const user = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = !!user;



  useEffect(() => {
  const fetchVideos = async () => {
    try {
      const token = localStorage.getItem('token'); // Or wherever you store your token
      
      const response = await axios.get(`${import.meta.env.VITE_VIDEO_URL}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setVideos(response.data.data);
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

  // Avatar display logic
  const renderAvatar = () => {
    if (!isLoggedIn) {
      return <span className="text-sm">?</span>;
    }
    
    // For Google users with avatar image
    if (user.avatar) {
      return (    
        <p>{user.avatar}</p>
      );
    }
    
    // For regular users - show initials
    const initials = user.username 
      ? user.username.slice(0, 2).toUpperCase()
      : "US";
    
    return <span className="text-sm">{initials}</span>;
  };

      if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <section className={`w-full ${isSidebarOpen ? 'lg:ml-[45vh]' : ''} lg:ml-8 mt-20`}>
      {/* YouTube-style navigation tabs */}
      

      {/* Your original channel header section */}
      <div className={`h-44 w-full  ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center px-28`}>
        <div className="flex items-center space-x-6 max-w-4xl w-full">
          <div className={`h-24 w-24 rounded-full border-2 flex items-center justify-center text-2xl font-bold`}>
            {renderAvatar()}
          </div>
          <div className="flex-1">
            <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>Shad0w_Edit0r</h1>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>@shadow-52I</p>
            <div className="flex items-center space-x-4 mt-2">
              {/* <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>3.18K subscribers</p> */}
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{videos.length} videos</p>
            </div>
            {/* <button className={`mt-3 px-4 py-1 rounded-full ${isDarkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'} text-sm font-medium transition-colors`}>
              Subscribe
            </button> */}
          </div>
        </div>
      </div>
      <div className={`flex mb-4 ${isSidebarOpen ? 'lg:ml-[10vh]' : 'ml-20'}  ${isDarkMode ? 'border-gray-200' : 'border-gray-800'} px-8`}>
        
        <Link 
          
          className={`p-2 flex items-center justify-center  font-medium ${isDarkMode ? 'text-white' : 'text-black'} border-b-2  hover:border-gray-400`}
        >
          Shorts
        </Link>
      </div>

      {/* Your original videos grid section */}
      <div className="lg:flex lg:flex-wrap justify-center items-center gap-4 p-4 w-full grid grid-cols-2 md:grid-cols-3 md:items-center">
     
            {videos.map((video) => (
          <Cards 
            key={video._id}
            videoUrl={video.videoUrl}
            description={video.description}
            views={video.views}
            videoId={video._id}
            

          />
        ))}
          
      </div>
    </section>
  )
}

export default Mypage
