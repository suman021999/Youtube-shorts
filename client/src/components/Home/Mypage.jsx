import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import VideoCard from "../videocards/VideoCard";
import error from "../../../public/404.png"

const Mypage = () => {
  const isSidebarOpen = useSelector((state) => state.sidebar.isOpen);
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState([]);
  const [channelOwner, setChannelOwner] = useState(null);

  const { username } = useParams();

  useEffect(() => {
    const fetchChannelData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // First fetch channel owner data
        const ownerResponse = await axios.get(
          `${import.meta.env.VITE_AUTH_URL}/username/${username}`,
          {
            headers: { 'Authorization': `Bearer ${token}` }
          }
        );
        setChannelOwner(ownerResponse.data.user);
        const videosResponse = await axios.get(
          `${import.meta.env.VITE_VIDEO_URL}/user/${ownerResponse.data.user._id}`,
          {
            headers: { 'Authorization': `Bearer ${token}` }
          }
        );
        setVideos(videosResponse.data.videos || videosResponse.data.data || []);
      } catch (error) {
        console.error("Error fetching channel data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChannelData();
  }, [username]);



  

const renderAvatar = () => {
  if (!channelOwner) return (
    <div className="w-full h-full bg-gray-400 rounded-full flex items-center justify-center">
      <span className="text-white">?</span>
    </div>
  );

  if (channelOwner.avatar) return (
    // <img 
    //   src= 
    //   alt="avatar" 
    //   className="w-full h-full rounded-full object-cover"
    // />

    <p>{channelOwner.avatar}</p>
  );

  // Fallback to initials
  const initials = channelOwner.username 
    ? channelOwner.username.replace(/[^a-zA-Z]/g, '').slice(0, 2).toUpperCase()
    : "??";
    
  return (
    <div className={`w-full h-full rounded-full flex items-center justify-center ${
      isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
    }`}>
      <span className="text-white font-bold">{initials}</span>
    </div>
  );
};

  if (loading) {
    return <div className="flex flex-col gap-4 justify-center items-center h-screen w-screen">
          <img className='h-44 w-44 rounded-full' src={error} alt="" />
          <p>Connect to the internet</p>
        </div>
  }

  return (
    <section className={`w-full ${isSidebarOpen ? 'lg:ml-[45vh]' : ''} lg:ml-8 mt-20`}>
      <div className={`h-44 w-full ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center px-28`}>
        <div className="flex items-center space-x-6 max-w-4xl w-full">
          <div className={`h-24 w-24 rounded-full border-2 flex items-center justify-center text-2xl font-bold overflow-hidden`}>
            {renderAvatar()}
          </div>
          <div className="flex-1">
            <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
              {channelOwner?.username ? `@${channelOwner.username}` : 'Channel'}
            </h1>
            <div className="flex items-center space-x-4 mt-2">
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {videos.length} videos
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className={`flex mb-4 ${isSidebarOpen ? 'lg:ml-[10vh]' : 'ml-20'} px-8`}>
        <Link 
          to={`/channel/${username}`}
          className={`p-2 flex items-center justify-center font-medium ${isDarkMode ? 'text-white' : 'text-black'} border-b-2 hover:border-gray-400`}
        >
          Videos
        </Link>
      </div>

      <div className="lg:flex lg:flex-wrap justify-center items-center gap-4 p-4 w-full grid grid-cols-2 md:grid-cols-3 md:items-center">
        {videos.map((video) => (
          <VideoCard
            key={video._id}
            videoUrl={video.videoUrl}
            description={video.description}
            views={video.views}
            id={video._id}
             owner={video.owner || channelOwner}
            isShort={false}
          />
        ))}
      </div>
    </section>
  );
};


export default Mypage

