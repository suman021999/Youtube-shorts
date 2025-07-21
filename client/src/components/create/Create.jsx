
// import React, { useRef, useState } from 'react';
// import { FiUpload,  FiAlignLeft } from 'react-icons/fi';
// import { IoClose } from 'react-icons/io5';
// import { useSelector } from 'react-redux';


// const CreateShorts = () => {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [description, setDescription] = useState('');
//   const [showPreview, setShowPreview] = useState(false);
//   const fileInputRef = useRef(null);
//   const isSidebarOpen = useSelector((state) => state.sidebar.isOpen);
//   const isDarkMode = useSelector((state) => state.theme.isDarkMode);

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setSelectedFile(URL.createObjectURL(file));
//       setShowPreview(true);
//     }
//   };

//   const handleRemoveVideo = () => {
//     setSelectedFile(null);
//     setShowPreview(false);
//   };

//   return (
//     <>
//     <section className={` w-full ${isSidebarOpen ? 'lg:ml-[45vh] ' : 'lg:ml-20'} mb-20 mt-8`}>
// <div className="flex flex-col items-center min-h-screen    p-4">

//       <div className={`w-full max-w-2xl bg-white  rounded-lg shadow-lg p-6 ${isDarkMode && "dark:bg-[#302f2fe8]"}`}>
//         <h1 className="text-2xl font-bold mb-6 dark:text-white">Create Short</h1>
        
//         {/* Video Upload/Preview Area */}
//         <div 
//           className={`relative w-full aspect-[9/16] max-h-[70vh] mb-6 rounded-xl overflow-hidden ${!selectedFile ? 'border-2 border-dashed  flex items-center justify-center' : ''}`}
//           onClick={() => !selectedFile && fileInputRef.current.click()}
//         >
//           {selectedFile && showPreview ? (
//             <>
//               <video 
//                 src={selectedFile} 
//                 controls 
//                 className="w-full h-full object-cover"
//               />
//               <button 
//                 onClick={handleRemoveVideo}
//                 className="absolute top-2 right-2 bg-black bg-opacity-70 text-white p-1 rounded-full"
//               >
//                 <IoClose size={20} />
//               </button>
//             </>
//           ) : (
//             <div className="text-center p-6">
//               <FiUpload className="mx-auto text-3xl text-gray-400 dark:text-gray-500 mb-2" />
//               <p className="text-lg font-medium dark:text-gray-300">Upload video</p>
//               <p className="text-sm text-gray-500 dark:text-gray-400">or drag and drop</p>
//               <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">MP4 or WebM, 60s or less</p>
//             </div>
//           )}
//           <input 
//             type="file" 
//             ref={fileInputRef}
//             onChange={handleFileChange}
//             // accept="video/mp4,video/webm"
//             className="hidden"
//           />
//         </div>

//         {/* Shorts Creation Tools */}
//         <div className="space-y-4">

         
//           <div className={`flex items-center space-x-3 p-3 shadow-lg border-2 border-dashed  rounded-lg ${isDarkMode && "dark:bg-[#202020e8]"}`}>
//             <FiAlignLeft className="text-gray-600 dark:text-gray-300" />
//             <input
//               type="text"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               placeholder="Add a description..."
//               className={`flex-1 bg-transparent outline-none  placeholder-gray-400 ${isDarkMode && "dark:bg-[#202020e8]"}`}
//               maxLength={150}
//             />
//             <span className="text-xs text-gray-400">{description.length}/150</span>
//           </div>

          

//         </div>

//         {/* Action Buttons */}
//         <div className="flex justify-end space-x-3 mt-6">
//           <button className="px-4 py-2 text-gray-600 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition">
//             Discard
//           </button>
//           <button 
//             className={`px-6 py-2 rounded-full text-white font-medium transition ${selectedFile ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-300 cursor-not-allowed'}`}
//             disabled={!selectedFile}
//           >
//             Post
//           </button>
//         </div>
//       </div>
      
//     </div>
//     </section>
    
//     </>
//   );
// };

// export default CreateShorts;


// import React, { useRef, useState } from 'react';
// import { FiUpload, FiAlignLeft } from 'react-icons/fi';
// import { IoClose } from 'react-icons/io5';
// import { useSelector } from 'react-redux';
// import axios from 'axios';

// const Create = () => {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [actualFile, setActualFile] = useState(null);
//   const [description, setDescription] = useState('');
//   const [showPreview, setShowPreview] = useState(false);
//   const [isUploading, setIsUploading] = useState(false);
//   const fileInputRef = useRef(null);
//   const isSidebarOpen = useSelector((state) => state.sidebar.isOpen);
//   const isDarkMode = useSelector((state) => state.theme.isDarkMode);

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setSelectedFile(URL.createObjectURL(file));
//       setActualFile(file);
//       setShowPreview(true);
//     }
//   };

//   const handleRemoveVideo = () => {
//     setSelectedFile(null);
//     setActualFile(null);
//     setShowPreview(false);
//   };

//   const handleUpload = async () => {
//     if (!actualFile) return;

//     setIsUploading(true);
    
//     try {
//       const formData = new FormData();
//       formData.append('video', actualFile);
//       formData.append('title', description || 'My Short Video');
//       formData.append('description', description);

//       const token = localStorage.getItem('token');
      
//       const response = await axios.post(
//         `${import.meta.env.VITE_VEDIO_URL}/upload`, 
//         formData, 
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//             'Authorization': `Bearer ${token}`
//           }
//         }
//       );

//       alert('Video uploaded successfully!');
//       setSelectedFile(null);
//       setActualFile(null);
//       setDescription('');
//       setShowPreview(false);
//     } catch (error) {
//       console.error('Upload failed:', error);
//       alert(error.response?.data?.message || 'Upload failed. Please try again.');
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   return (
//     <>
//       <section className={`w-full ${isSidebarOpen ? 'lg:ml-[45vh]' : 'lg:ml-20'} mb-20 mt-8`}>
//         <div className="flex flex-col items-center min-h-screen p-4">
//           <div className={`w-full max-w-2xl bg-white rounded-lg shadow-lg p-6 ${isDarkMode && "dark:bg-[#302f2fe8]"}`}>
//             <h1 className="text-2xl font-bold mb-6 dark:text-white">Create Short</h1>
            
//             {/* Video Upload/Preview Area */}
//             <div 
//               className={`relative w-full aspect-[9/16] max-h-[70vh] mb-6 rounded-xl overflow-hidden ${!selectedFile ? 'border-2 border-dashed flex items-center justify-center' : ''}`}
//               onClick={() => !selectedFile && fileInputRef.current.click()}
//             >
//               {selectedFile && showPreview ? (
//                 <>
//                   <video 
//                     src={selectedFile} 
//                     controls 
//                     className="w-full h-full object-cover"
//                   />
//                   <button 
//                     onClick={handleRemoveVideo}
//                     className="absolute top-2 right-2 bg-black bg-opacity-70 text-white p-1 rounded-full"
//                   >
//                     <IoClose size={20} />
//                   </button>
//                 </>
//               ) : (
//                 <div className="text-center p-6">
//                   <FiUpload className="mx-auto text-3xl text-gray-400 dark:text-gray-500 mb-2" />
//                   <p className="text-lg font-medium dark:text-gray-300">Upload video</p>
//                   <p className="text-sm text-gray-500 dark:text-gray-400">or drag and drop</p>
//                   <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">MP4 or WebM, 60s or less</p>
//                 </div>
//               )}
//               <input 
//                 type="file" 
//                 ref={fileInputRef}
//                 onChange={handleFileChange}
//                 accept="video/mp4,video/webm"
//                 className="hidden"
//               />
//             </div>

//             {/* Shorts Creation Tools */}
//             <div className="space-y-4">
//               <div className={`flex items-center space-x-3 p-3 shadow-lg border-2 border-dashed rounded-lg ${isDarkMode && "dark:bg-[#202020e8]"}`}>
//                 <FiAlignLeft className="text-gray-600 dark:text-gray-300" />
//                 <input
//                   type="text"
//                   value={description}
//                   onChange={(e) => setDescription(e.target.value)}
//                   placeholder="Add a description..."
//                   className={`flex-1 bg-transparent outline-none placeholder-gray-400 ${isDarkMode && "dark:bg-[#202020e8]"}`}
//                   maxLength={150}
//                 />
//                 <span className="text-xs text-gray-400">{description.length}/150</span>
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex justify-end space-x-3 mt-6">
//               <button 
//                 className="px-4 py-2 text-gray-600 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
//                 onClick={() => {
//                   setSelectedFile(null);
//                   setActualFile(null);
//                   setDescription('');
//                   setShowPreview(false);
//                 }}
//               >
//                 Discard
//               </button>
//               <button 
//                 className={`px-6 py-2 rounded-full text-white font-medium transition ${selectedFile ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-300 cursor-not-allowed'}`}
//                 disabled={!selectedFile || isUploading}
//                 onClick={handleUpload}
//               >
//                 {isUploading ? 'Uploading...' : 'Post'}
//               </button>
//             </div>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// };

// export default Create;


import React, { useRef, useState } from 'react';
import { FiUpload, FiAlignLeft } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';
import { useSelector } from 'react-redux';
import axios from 'axios';

const Create = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [actualFile, setActualFile] = useState(null);
  const [description, setDescription] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const isSidebarOpen = useSelector((state) => state.sidebar.isOpen);
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  const validateFile = (file) => {
    const validTypes = ['video/mp4', 'video/webm'];
    if (!validTypes.includes(file.type)) {
      setError('Invalid file type. Please upload MP4 or WebM.');
      return false;
    }
    
    if (file.size > 50 * 1024 * 1024) { // 50MB max size example
      setError('File is too large. Maximum size is 50MB.');
      return false;
    }
    
    return true;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setError('');
    
    if (!validateFile(file)) {
      return;
    }

    setSelectedFile(URL.createObjectURL(file));
    setActualFile(file);
    setShowPreview(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files[0];
    if (file) {
      const event = { target: { files: [file] } };
      handleFileChange(event);
    }
  };

  const handleRemoveVideo = () => {
    setSelectedFile(null);
    setActualFile(null);
    setShowPreview(false);
    setError('');
  };

  const handleUpload = async () => {
    if (!actualFile) return;

    setIsUploading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('video', actualFile);
      formData.append('title', description || 'My Short Video');
      formData.append('description', description);

      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        `${import.meta.env.VITE_VEDIO_URL}/upload`, 
        formData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data && response.data.success) {
        alert('Video uploaded successfully!');
        setSelectedFile(null);
        setActualFile(null);
        setDescription('');
        setShowPreview(false);
      } else {
        throw new Error(response.data?.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      setError(error.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section 
      className={`w-full ${isSidebarOpen ? 'lg:ml-[45vh]' : 'lg:ml-20'} mb-20 mt-8`}
      aria-labelledby="create-shorts-heading"
    >
      <div className="flex flex-col items-center min-h-screen p-4">
        <div className={`w-full max-w-2xl bg-white rounded-lg shadow-lg p-6 ${isDarkMode && "dark:bg-[#302f2fe8]"}`}>
          <h1 id="create-shorts-heading" className="text-2xl font-bold mb-6 dark:text-white">Create Short</h1>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg dark:bg-red-900 dark:text-red-100">
              {error}
            </div>
          )}
          
          <div 
            className={`relative w-full aspect-[9/16] max-h-[70vh] mb-6 rounded-xl overflow-hidden ${!selectedFile ? 'border-2 border-dashed flex items-center justify-center' : ''}`}
            onClick={() => !selectedFile && fileInputRef.current.click()}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            role="button"
            aria-label="Video upload area"
            tabIndex="0"
          >
            {selectedFile && showPreview ? (
              <>
                <video 
                  src={selectedFile} 
                  controls 
                  className="w-full h-full object-cover"
                  aria-label="Video preview"
                />
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveVideo();
                  }}
                  className="absolute top-2 right-2 bg-black bg-opacity-70 text-white p-1 rounded-full"
                  aria-label="Remove video"
                >
                  <IoClose size={20} />
                </button>
              </>
            ) : (
              <div className="text-center p-6">
                <FiUpload className="mx-auto text-3xl text-gray-400 dark:text-gray-500 mb-2" />
                <p className="text-lg font-medium dark:text-gray-300">Upload video</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">or drag and drop</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">MP4 or WebM, 60s or less</p>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="video/mp4,video/webm"
              className="hidden"
              aria-label="Select video file"
            />
          </div>

          <div className="space-y-4">
            <div className={`flex items-center space-x-3 p-3 shadow-lg border-2 border-dashed rounded-lg ${isDarkMode && "dark:bg-[#202020e8]"}`}>
              <FiAlignLeft className="text-gray-600 dark:text-gray-300" />
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a description..."
                className={`flex-1 bg-transparent outline-none placeholder-gray-400 ${isDarkMode && "dark:bg-[#202020e8] dark:text-white"}`}
                maxLength={150}
                aria-label="Video description"
              />
              <span className="text-xs text-gray-400">{description.length}/150</span>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button 
              className="px-4 py-2 text-gray-600 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              onClick={() => {
                setSelectedFile(null);
                setActualFile(null);
                setDescription('');
                setShowPreview(false);
                setError('');
              }}
              disabled={isUploading}
              aria-label="Discard video"
            >
              Discard
            </button>
            <button 
              className={`px-6 py-2 rounded-full text-white font-medium transition ${selectedFile ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-300 cursor-not-allowed'}`}
              disabled={!selectedFile || isUploading}
              onClick={handleUpload}
              aria-label="Post video"
            >
              {isUploading ? 'Uploading...' : 'Post'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Create;