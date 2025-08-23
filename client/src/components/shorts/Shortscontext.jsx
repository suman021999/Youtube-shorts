// import React, { useEffect, useState } from 'react'
// import VideoCard from '../videocards/VideoCard';
// import axios from 'axios';
// import { useParams } from 'react-router-dom';
// import { FaArrowDown,FaArrowUp  } from "react-icons/fa6";

// const Shortscontext = () => {
// const [videos, setVideos] = useState(null) 

//     const { id } = useParams();
//     // console.log(id)
//      useEffect(() => {
//     const fetchVideo = async () => {
     
//       try {
        
//         const token = localStorage.getItem('token');
//         const response = await axios.get(`${import.meta.env.VITE_VIDEO_URL}/${id}`, {
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         });
        
//         setVideos(response.data.data);
       
//       } catch (err) {
//       console.log(err)
//       } 

//     };

//     fetchVideo();
//   }, [id]);


//     if (!videos) {
//     return (<div className="flex flex-col gap-4 justify-center items-center h-screen w-screen">Loading...</div>)
//   }
    
//   return (
//     <>
//      <section className={` w-full   h-[80vh]`}>  
//         <div className="flex  flex-wrap justify-center items-center gap-4  ">

//           <VideoCard
//           videoUrl={videos.videoUrl}
//           description={videos.description}
//           views={videos.views}
//           autoPlay={true}
//           owner={videos.owner} 
//           id={videos._id}  
//           isShort={true}
//           />

//         </div>

//         {/* controlers */}

//          {/* <div className='flex absolute flex-col gap-4 justify-center items-center'>

//           <div className='h-16 w-16 rounded-full flex justify-center items-center bg-[#9791915a]'>
//           <FaArrowUp  className='h-6 w-6' />
//           </div>
//           <div className='h-16 w-16 rounded-full flex justify-center items-center bg-[#9791915a]'>
//           <FaArrowDown className='h-6 w-6' />
//           </div>
         
//           </div> */}
      
//       </section>
//     </>
//   )
// }

// export default Shortscontext


// import React, { useEffect, useState, useRef, useCallback } from 'react'
// import VideoCard from '../videocards/VideoCard';
// import axios from 'axios';
// import { useParams, useNavigate } from 'react-router-dom';
// import { FaArrowDown, FaArrowUp } from "react-icons/fa6";

// const Shortscontext = () => {
//   const [videos, setVideos] = useState([]);
//   const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [loadingMore, setLoadingMore] = useState(false);
//   const [hasMore, setHasMore] = useState(true);
//   const containerRef = useRef(null);
//   const videoRefs = useRef([]);
//   const navigate = useNavigate();

//   const { id } = useParams();

//   // ✅ Utility: filter duplicates by _id (force string compare)
//   const filterUniqueVideos = (videoArray) => {
//     const seen = new Set();
//     return videoArray.filter(video => {
//       const id = String(video._id);
//       if (seen.has(id)) {
//         return false;
//       }
//       seen.add(id);
//       return true;
//     });
//   };

//   // Function to load more videos
//   const loadMoreVideos = async () => {
//     if (loadingMore || !hasMore) return;
    
//     setLoadingMore(true);
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`${import.meta.env.VITE_VIDEO_URL}/scroll?limit=10`, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       let newVideos = [];
//       if (response.data) {
//         if (Array.isArray(response.data.data)) {
//           newVideos = response.data.data;
//         } else if (Array.isArray(response.data)) {
//           newVideos = response.data;
//         }
//       }

//       if (newVideos.length > 0) {
//         setVideos(prev => filterUniqueVideos([...prev, ...newVideos]));
//       } else {
//         setHasMore(false);
//       }
//     } catch (err) {
//       console.log('Error loading more videos:', err);
//     } finally {
//       setLoadingMore(false);
//     }
//   };

//   // Update URL when current video changes
//   useEffect(() => {
//     if (videos.length > 0 && currentVideoIndex < videos.length) {
//       const currentVideoId = videos[currentVideoIndex]._id;
//       navigate(`/shorts/${currentVideoId}`, { replace: true });
//     }
//   }, [currentVideoIndex, videos, navigate]);

//   // Initial fetch - load multiple videos from start
//   useEffect(() => {
//     const fetchInitialVideos = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         let allVideos = [];

//         // If there's a specific ID, fetch that video first
//         if (id) {
//           try {
//             const specificVideoResponse = await axios.get(`${import.meta.env.VITE_VIDEO_URL}/${id}`, {
//               headers: {
//                 'Authorization': `Bearer ${token}`
//               }
//             });
//             if (specificVideoResponse.data?.data) {
//               allVideos.push(specificVideoResponse.data.data);
//             }
//           } catch (err) {
//             console.log('Could not fetch specific video:', err);
//           }
//         }

//         // Load initial batch of random videos
//         try {
//           const randomVideosResponse = await axios.get(`${import.meta.env.VITE_VIDEO_URL}/scroll?limit=20`, {
//             headers: {
//               'Authorization': `Bearer ${token}`
//             }
//           });

//           let randomVideos = [];
//           if (randomVideosResponse.data) {
//             if (Array.isArray(randomVideosResponse.data.data)) {
//               randomVideos = randomVideosResponse.data.data;
//             } else if (Array.isArray(randomVideosResponse.data)) {
//               randomVideos = randomVideosResponse.data;
//             }
//           }

//           // Filter out the specific video if it's already in random videos
//           if (id && allVideos.length > 0) {
//             randomVideos = randomVideos.filter(video => String(video._id) !== String(id));
//           }

//           allVideos = [...allVideos, ...randomVideos];
//         } catch (err) {
//           console.log('Could not fetch random videos:', err);
//         }

//         // If no videos found, try a fallback
//         if (allVideos.length === 0) {
//           const fallbackResponse = await axios.get(`${import.meta.env.VITE_VIDEO_URL}`, {
//             headers: {
//               'Authorization': `Bearer ${token}`
//             }
//           });

//           if (fallbackResponse.data && Array.isArray(fallbackResponse.data.data)) {
//             allVideos = fallbackResponse.data.data.slice(0, 20);
//           }
//         }

//         setVideos(filterUniqueVideos(allVideos));
//         setLoading(false);
//       } catch (err) {
//         console.log('Error fetching initial videos:', err);
//         setLoading(false);
//       }
//     };

//     fetchInitialVideos();
//   }, [id]);

//   // Handle scroll to snap to videos and load more content
//   const handleScroll = useCallback(() => {
//     if (!containerRef.current) return;

//     const container = containerRef.current;
//     const scrollTop = container.scrollTop;
//     const videoHeight = window.innerHeight;
//     const newIndex = Math.round(scrollTop / videoHeight);
    
//     if (newIndex !== currentVideoIndex && newIndex >= 0 && newIndex < videos.length) {
//       setCurrentVideoIndex(newIndex);
//     }

//     // Load more videos when approaching the end
//     const scrollPercentage = (scrollTop + window.innerHeight) / container.scrollHeight;
//     if (scrollPercentage > 0.8 && !loadingMore && hasMore) {
//       loadMoreVideos();
//     }
//   }, [currentVideoIndex, videos.length, loadingMore, hasMore]);

//   // Add scroll event listener
//   useEffect(() => {
//     const container = containerRef.current;
//     if (!container) return;

//     container.addEventListener('scroll', handleScroll);
//     return () => container.removeEventListener('scroll', handleScroll);
//   }, [handleScroll]);

//   // Navigation functions
//   const scrollToVideo = (index) => {
//     if (!containerRef.current || index < 0 || index >= videos.length) return;
    
//     const container = containerRef.current;
//     const videoHeight = window.innerHeight;
//     container.scrollTo({
//       top: index * videoHeight,
//       behavior: 'smooth'
//     });
//   };

//   const goToNextVideo = () => {
//     if (currentVideoIndex < videos.length - 1) {
//       scrollToVideo(currentVideoIndex + 1);
//     } else if (hasMore && !loadingMore) {
//       loadMoreVideos();
//     }
//   };

//   const goToPreviousVideo = () => {
//     if (currentVideoIndex > 0) {
//       scrollToVideo(currentVideoIndex - 1);
//     }
//   };

//   // Handle keyboard navigation
//   useEffect(() => {
//     const handleKeyPress = (e) => {
//       if (e.key === 'ArrowUp') {
//         e.preventDefault();
//         goToPreviousVideo();
//       } else if (e.key === 'ArrowDown') {
//         e.preventDefault();
//         goToNextVideo();
//       }
//     };

//     window.addEventListener('keydown', handleKeyPress);
//     return () => window.removeEventListener('keydown', handleKeyPress);
//   }, [currentVideoIndex, videos.length, hasMore, loadingMore]);

//   if (loading) {
//     return (
//       <div className="flex flex-col gap-4 justify-center items-center h-screen w-screen">
//         Loading...
//       </div>
//     );
//   }

//   if (videos.length === 0) {
//     return (
//       <div className="flex flex-col gap-4 justify-center items-center h-screen w-screen">
//         <p>No videos available</p>
//         <button 
//           onClick={() => window.location.reload()} 
//           className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="relative w-full h-screen overflow-hidden">
//       {/* Video Container */}
//       <div
//         ref={containerRef}
//         className="w-full h-screen overflow-y-scroll scrollbar-hide snap-y snap-mandatory"
//         style={{
//           scrollbarWidth: 'none',
//           msOverflowStyle: 'none',
//           WebkitScrollbar: { display: 'none' }
//         }}
//       >
//         {videos.map((video, index) => (
//           <section
//             key={video._id}   // ✅ Use video._id as key to ensure proper tracking
//             ref={(el) => (videoRefs.current[index] = el)}
//             className="w-full h-screen snap-start snap-always flex justify-center items-center"
//           >
//             <VideoCard
//               videoUrl={video.videoUrl}
//               description={video.description}
//               views={video.views}
//               autoPlay={index === currentVideoIndex}
//               owner={video.owner}
//               id={video._id}
//               isShort={true}
//             />
//           </section>
//         ))}
        
//         {/* Loading indicator for more videos */}
//         {loadingMore && (
//           <section className="w-full h-screen snap-start snap-always flex justify-center items-center">
//             <div className="text-white text-lg">Loading more videos...</div>
//           </section>
//         )}
//       </div>

//       {/* Navigation Controls */}
//       <div className="fixed right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-4 z-10">
//         <button
//           onClick={goToPreviousVideo}
//           disabled={currentVideoIndex === 0}
//           className={`h-12 w-12 rounded-full flex justify-center items-center transition-all duration-200 ${
//             currentVideoIndex === 0
//               ? 'bg-gray-600 opacity-50 cursor-not-allowed'
//               : 'bg-black bg-opacity-50 hover:bg-opacity-70 active:scale-95'
//           }`}
//         >
//           <FaArrowUp className="h-5 w-5 text-white" />
//         </button>
        
//         <button
//           onClick={goToNextVideo}
//           disabled={currentVideoIndex === videos.length - 1 && !hasMore}
//           className={`h-12 w-12 rounded-full flex justify-center items-center transition-all duration-200 ${
//             currentVideoIndex === videos.length - 1 && !hasMore
//               ? 'bg-gray-600 opacity-50 cursor-not-allowed'
//               : 'bg-black bg-opacity-50 hover:bg-opacity-70 active:scale-95'
//           }`}
//         >
//           <FaArrowDown className="h-5 w-5 text-white" />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Shortscontext;








import React, { useEffect, useState, useRef, useCallback } from 'react'
import VideoCard from '../videocards/VideoCard';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowDown, FaArrowUp } from "react-icons/fa6";

const Shortscontext = () => {
  const [videos, setVideos] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [showNavigation, setShowNavigation] = useState(false);
  const containerRef = useRef(null);
  const videoRefs = useRef([]);
  const navigate = useNavigate();
  const isMobile = useRef(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  const touchStartY = useRef(0);
  const scrollTimeout = useRef(null);

  const { id } = useParams();

  // ✅ Utility: filter duplicates by _id (force string compare)
  const filterUniqueVideos = (videoArray) => {
    const seen = new Set();
    return videoArray.filter(video => {
      const id = String(video._id);
      if (seen.has(id)) {
        return false;
      }
      seen.add(id);
      return true;
    });
  };

  // Function to load more videos
  const loadMoreVideos = async () => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_VIDEO_URL}/scroll?limit=10`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      let newVideos = [];
      if (response.data) {
        if (Array.isArray(response.data.data)) {
          newVideos = response.data.data;
        } else if (Array.isArray(response.data)) {
          newVideos = response.data;
        }
      }

      if (newVideos.length > 0) {
        setVideos(prev => filterUniqueVideos([...prev, ...newVideos]));
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.log('Error loading more videos:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  // Update URL when current video changes
  useEffect(() => {
    if (videos.length > 0 && currentVideoIndex < videos.length) {
      const currentVideoId = videos[currentVideoIndex]._id;
      navigate(`/shorts/${currentVideoId}`, { replace: true });
    }
  }, [currentVideoIndex, videos, navigate]);

  // Initial fetch - load multiple videos from start
  useEffect(() => {
    const fetchInitialVideos = async () => {
      try {
        const token = localStorage.getItem('token');
        let allVideos = [];

        // If there's a specific ID, fetch that video first
        if (id) {
          try {
            const specificVideoResponse = await axios.get(`${import.meta.env.VITE_VIDEO_URL}/${id}`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            if (specificVideoResponse.data?.data) {
              allVideos.push(specificVideoResponse.data.data);
            }
          } catch (err) {
            console.log('Could not fetch specific video:', err);
          }
        }

        // Load initial batch of random videos
        try {
          const randomVideosResponse = await axios.get(`${import.meta.env.VITE_VIDEO_URL}/scroll?limit=20`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          let randomVideos = [];
          if (randomVideosResponse.data) {
            if (Array.isArray(randomVideosResponse.data.data)) {
              randomVideos = randomVideosResponse.data.data;
            } else if (Array.isArray(randomVideosResponse.data)) {
              randomVideos = randomVideosResponse.data;
            }
          }

          // Filter out the specific video if it's already in random videos
          if (id && allVideos.length > 0) {
            randomVideos = randomVideos.filter(video => String(video._id) !== String(id));
          }

          allVideos = [...allVideos, ...randomVideos];
        } catch (err) {
          console.log('Could not fetch random videos:', err);
        }

        // If no videos found, try a fallback
        if (allVideos.length === 0) {
          const fallbackResponse = await axios.get(`${import.meta.env.VITE_VIDEO_URL}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (fallbackResponse.data && Array.isArray(fallbackResponse.data.data)) {
            allVideos = fallbackResponse.data.data.slice(0, 20);
          }
        }

        setVideos(filterUniqueVideos(allVideos));
        setLoading(false);
      } catch (err) {
        console.log('Error fetching initial videos:', err);
        setLoading(false);
      }
    };

    fetchInitialVideos();
  }, [id]);

  // Handle scroll to snap to videos and load more content
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const scrollTop = container.scrollTop;
    const videoHeight = window.innerHeight;
    const newIndex = Math.round(scrollTop / videoHeight);
    
    if (newIndex !== currentVideoIndex && newIndex >= 0 && newIndex < videos.length) {
      setCurrentVideoIndex(newIndex);
    }

    // Load more videos when approaching the end
    const scrollPercentage = (scrollTop + window.innerHeight) / container.scrollHeight;
    if (scrollPercentage > 0.8 && !loadingMore && hasMore) {
      loadMoreVideos();
    }

    // Show navigation controls temporarily on scroll
    if (!isMobile.current) {
      setShowNavigation(true);
      clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => {
        setShowNavigation(false);
      }, 2000);
    }
  }, [currentVideoIndex, videos.length, loadingMore, hasMore]);

  // Add scroll event listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout.current);
    };
  }, [handleScroll]);

  // Handle touch events for mobile
  useEffect(() => {
    if (!isMobile.current) return;

    const handleTouchStart = (e) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
      const touchEndY = e.changedTouches[0].clientY;
      const diff = touchEndY - touchStartY.current;
      
      // If swipe is significant, navigate to next/previous video
      if (Math.abs(diff) > 100) {
        if (diff > 0) {
          // Swipe down - go to previous video
          goToPreviousVideo();
        } else {
          // Swipe up - go to next video
          goToNextVideo();
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('touchstart', handleTouchStart);
      container.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [currentVideoIndex, videos.length, hasMore, loadingMore]);

  // Navigation functions
  const scrollToVideo = (index) => {
    if (!containerRef.current || index < 0 || index >= videos.length) return;
    
    const container = containerRef.current;
    const videoHeight = window.innerHeight;
    container.scrollTo({
      top: index * videoHeight,
      behavior: 'smooth'
    });
  };

  const goToNextVideo = () => {
    if (currentVideoIndex < videos.length - 1) {
      scrollToVideo(currentVideoIndex + 1);
    } else if (hasMore && !loadingMore) {
      loadMoreVideos();
    }
  };

  const goToPreviousVideo = () => {
    if (currentVideoIndex > 0) {
      scrollToVideo(currentVideoIndex - 1);
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        goToPreviousVideo();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        goToNextVideo();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentVideoIndex, videos.length, hasMore, loadingMore]);

  if (loading) {
    return (
      <div className="flex flex-col gap-4 justify-center items-center h-screen w-screen">
        Loading...
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="flex flex-col gap-4 justify-center items-center h-screen w-screen">
        <p>No videos available</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Video Container */}
      <div
        ref={containerRef}
        className="w-full h-screen overflow-y-scroll scrollbar-hide snap-y snap-mandatory"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitScrollbar: { display: 'none' }
        }}
      >
        {videos.map((video, index) => (
          <section
            key={video._id}   // ✅ Use video._id as key to ensure proper tracking
            ref={(el) => (videoRefs.current[index] = el)}
            className="w-full h-screen snap-start snap-always flex justify-center items-center"
          >
            <VideoCard
              videoUrl={video.videoUrl}
              description={video.description}
              views={video.views}
              autoPlay={index === currentVideoIndex}
              owner={video.owner}
              id={video._id}
              isShort={true}
            />
          </section>
        ))}
        
        {/* Loading indicator for more videos */}
        {loadingMore && (
          <section className="w-full h-screen snap-start snap-always flex justify-center items-center">
            <div className="text-white text-lg">Loading more videos...</div>
          </section>
        )}
      </div>

      {/* Navigation Controls - Hidden on mobile */}
      {!isMobile.current && (
        <div className={`fixed right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-4 z-10 transition-opacity duration-300 ${showNavigation ? 'opacity-100' : 'opacity-0'}`}>
          <button
            onClick={goToPreviousVideo}
            disabled={currentVideoIndex === 0}
            className={`h-12 w-12 rounded-full flex justify-center items-center transition-all duration-200 ${
              currentVideoIndex === 0
                ? 'bg-gray-600 opacity-50 cursor-not-allowed'
                : 'bg-black bg-opacity-50 hover:bg-opacity-70 active:scale-95'
            }`}
          >
            <FaArrowUp className="h-5 w-5 text-white" />
          </button>
          
          <button
            onClick={goToNextVideo}
            disabled={currentVideoIndex === videos.length - 1 && !hasMore}
            className={`h-12 w-12 rounded-full flex justify-center items-center transition-all duration-200 ${
              currentVideoIndex === videos.length - 1 && !hasMore
                ? 'bg-gray-600 opacity-50 cursor-not-allowed'
                : 'bg-black bg-opacity-50 hover:bg-opacity-70 active:scale-95'
            }`}
          >
            <FaArrowDown className="h-5 w-5 text-white" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Shortscontext;
