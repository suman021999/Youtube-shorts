// import React from 'react'

// const Create = () => {
//   return (
//     <>
      
//     </>
//   )
// }

// export default Create




import React, { useRef, useState } from 'react';
import { FiUpload,  FiAlignLeft } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';
import { useSelector } from 'react-redux';


const CreateShorts = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef(null);
  const isSidebarOpen = useSelector((state) => state.sidebar.isOpen);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(URL.createObjectURL(file));
      setShowPreview(true);
    }
  };

  const handleRemoveVideo = () => {
    setSelectedFile(null);
    setShowPreview(false);
  };

  return (
    <>
    <section className={` w-full ${isSidebarOpen ? 'lg:ml-[45vh] ' : 'lg:ml-20'} mb-20 mt-8`}>
<div className="flex flex-col items-center min-h-screen    p-4">

      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6 dark:text-white">Create Short</h1>
        
        {/* Video Upload/Preview Area */}
        <div 
          className={`relative w-full aspect-[9/16] max-h-[70vh] mb-6 rounded-xl overflow-hidden ${!selectedFile ? 'border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center' : ''}`}
          onClick={() => !selectedFile && fileInputRef.current.click()}
        >
          {selectedFile && showPreview ? (
            <>
              <video 
                src={selectedFile} 
                controls 
                className="w-full h-full object-cover"
              />
              <button 
                onClick={handleRemoveVideo}
                className="absolute top-2 right-2 bg-black bg-opacity-70 text-white p-1 rounded-full"
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
          />
        </div>

        {/* Shorts Creation Tools */}
        <div className="space-y-4">

          <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <FiAlignLeft className="text-gray-600 dark:text-gray-300" />
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Add a title..."
              className="flex-1 bg-transparent outline-none dark:text-white placeholder-gray-400"
              maxLength={150}
            />
            <span className="text-xs text-gray-400">{caption.length}/150</span>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <FiAlignLeft className="text-gray-600 dark:text-gray-300" />
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Add a description..."
              className="flex-1 bg-transparent outline-none dark:text-white placeholder-gray-400"
              maxLength={150}
            />
            <span className="text-xs text-gray-400">{caption.length}/150</span>
          </div>

          

        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 mt-6">
          <button className="px-4 py-2 text-gray-600 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition">
            Discard
          </button>
          <button 
            className={`px-6 py-2 rounded-full text-white font-medium transition ${selectedFile ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-300 cursor-not-allowed'}`}
            disabled={!selectedFile}
          >
            Post
          </button>
        </div>
      </div>
      
    </div>
    </section>
    
    </>
  );
};

export default CreateShorts;

{/*    */}