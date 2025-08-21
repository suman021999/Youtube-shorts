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
//           <div className='h-16 w-16 rounded-full flex justify-center items-center bg-[#9791915a]'>
//           <FaArrowDown className='h-6 w-6' />
//           </div>
         
//           </div>


// import React, { useEffect, useState } from "react";
// import VideoCard from "../videocards/VideoCard";
// import axios from "axios";
// import { useParams, useNavigate } from "react-router-dom";
// import { FaArrowDown, FaArrowUp } from "react-icons/fa6";

// const Shortscontext = () => {
//   const [history, setHistory] = useState([]); // keep track of visited videos
//   const [currentIndex, setCurrentIndex] = useState(-1); // pointer in history
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const fetchVideo = async (videoId) => {
//     try {
//       const token = localStorage.getItem("token");
//       const url = videoId
//         ? `${import.meta.env.VITE_VIDEO_URL}/${videoId}`
//         : `${import.meta.env.VITE_VIDEO_URL}/random`;

//       const response = await axios.get(url, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const video = response.data.data;

//       // if this is a random fetch, push it into history
//       if (!videoId) {
//         setHistory((prev) => {
//           const newHistory = [...prev, video];
//           setCurrentIndex(newHistory.length - 1);
//           return newHistory;
//         });
//       } else {
//         // if opening directly via URL
//         setHistory([video]);
//         setCurrentIndex(0);
//       }

//       // update URL
//       navigate(`/shorts/${video._id}`, { replace: true });
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   // load initial video
//   useEffect(() => {
//     fetchVideo(id);
//   }, [id]);

//   const handleNext = () => {
//     fetchVideo(null); // fetch random and add to history
//   };

//   const handlePrev = () => {
//     if (currentIndex > 0) {
//       const prevVideo = history[currentIndex - 1];
//       setCurrentIndex((prev) => prev - 1);
//       navigate(`/shorts/${prevVideo._id}`, { replace: true });
//     }
//   };

//   if (currentIndex === -1 || history.length === 0) {
//     return (
//       <div className="flex flex-col gap-4 justify-center items-center h-screen w-screen">
//         Loading...
//       </div>
//     );
//   }

//   const currentVideo = history[currentIndex];

//   return (
//     <section className="w-full h-[80vh] relative">
//       <div className="flex flex-wrap justify-center items-center gap-4">
//         <VideoCard
//           videoUrl={currentVideo.videoUrl}
//           description={currentVideo.description}
//           views={currentVideo.views}
//           autoPlay={true}
//           owner={currentVideo.owner}
//           id={currentVideo._id}
//           isShort={true}
//         />
//       </div>

//       {/* Arrows */}
//       <div className="absolute right-6 top-1/3 flex flex-col gap-6 items-center">
//         <button
//           className="h-12 w-12 rounded-full flex justify-center items-center bg-gray-300 hover:bg-gray-400"
//           onClick={handlePrev}
//           disabled={currentIndex === 0}
//         >
//           <FaArrowUp className="h-5 w-5" />
//         </button>

//         <button
//           className="h-12 w-12 rounded-full flex justify-center items-center bg-gray-300 hover:bg-gray-400"
//           onClick={handleNext}
//         >
//           <FaArrowDown className="h-5 w-5" />
//         </button>
//       </div>
//     </section>
//   );
// };

// export default Shortscontext;

