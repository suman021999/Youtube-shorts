




// // Cards.js
// import React from 'react';
// import { useSelector } from 'react-redux';
// import { Link, useNavigate } from "react-router-dom";

// const Cards = ({ videoUrl, description, views, videoId,id }) => {
//   const isDarkMode = useSelector((state) => state.theme.isDarkMode);
//   const navigate = useNavigate();

//   const handleClick = (e) => {
//     e.preventDefault();
//     navigate(`/shorts?video=${encodeURIComponent(videoUrl)}`, {
//       state: { 
//         videoUrl,
//         description,
//         views,
//         videoId,
//         id
//       }
//     });
//   };

//   return (
//     <div className={`lg:w-[15vw] mb-20 lg:mb-0 rounded-lg`}>
//       <Link 
//         to={`/shorts?video=${encodeURIComponent(videoUrl)}`} 
//         onClick={handleClick}
//         className="block"
//       >
//         {/* Video placeholder */}
//         <div className="mb-4">
//           <video
//             src={videoUrl}
//             type="video/mp4" 
//             className="w-full rounded-lg"
//           />
//         </div>
        
//         <div className='px-4 py-2'>
//           <h2 className={`text-lg font-semibold mb-2 text-ellipsis overflow-hidden whitespace-nowrap ${isDarkMode ? 'text-white' : ''}`}>
//             {description || 'No description'}
//           </h2>
//           <p className={`text-sm pb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
//             {views} Views • Date
//           </p>
//         </div>
//       </Link>
//     </div>
//   );
// };

// export default Cards;



import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from "react-router-dom";

const Cards = ({ videoUrl, description, views, id }) => { // Changed from creator to id
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const navigate = useNavigate();

 
  const handleClick = (e) => {
    e.preventDefault();
    navigate(`/shorts?video=${encodeURIComponent(videoUrl)}`, {
      state: { 
        videoUrl,
        description,
        views,
        id // Passing id instead of creator
      }
    });
  };

  return (
    <div className={`lg:w-[15vw] mb-20 lg:mb-0 rounded-lg`}>
      <Link 
        to={`/shorts?video=${encodeURIComponent(videoUrl)}`} 
        onClick={handleClick}
        className="block"
      >
        <div className="mb-4">
          <video
            src={videoUrl}
            type="video/mp4" 
            className="w-full rounded-lg"
          />
        </div>
        
        <div className='px-4 py-2'>
          <h2 className={`text-lg font-semibold mb-1 text-ellipsis overflow-hidden whitespace-nowrap ${isDarkMode ? 'text-white' : 'text-black'}`}>
            {description || 'No description'}
          </h2>
          <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
            {views} Views
          </p>
        </div>
      </Link>
    </div>
  );
};

export default Cards;



