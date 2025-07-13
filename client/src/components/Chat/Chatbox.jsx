
import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { AiFillDislike, AiFillLike } from "react-icons/ai";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { MdEdit, MdDelete } from "react-icons/md";

const Chatbox = () => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState('');
  const [showOptions, setShowOptions] = useState(null);
  const textareaRef = useRef(null);
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  const handleAddComment = () => {
    if (newComment.trim() === '') return;
    
    const comment = {
      id: Date.now(),
      author: 'You',
      text: newComment,
      likes: 0,
      dislikes: 0,
      time: 'Just now'
    };
    
    setComments([comment, ...comments]);
    setNewComment('');
    setShowCommentInput(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  const toggleCommentInput = () => {
    setShowCommentInput(!showCommentInput);
    if (!showCommentInput && textareaRef.current) {
      setTimeout(() => textareaRef.current.focus(), 0);
    }
  };

  const handleEdit = (comment) => {
    setEditingCommentId(comment.id);
    setEditText(comment.text);
    setShowOptions(null);
  };

  const handleSaveEdit = (id) => {
    setComments(comments.map(comment => 
      comment.id === id ? { ...comment, text: editText } : comment
    ));
    setEditingCommentId(null);
    setEditText('');
  };

  const handleDelete = (id) => {
    setComments(comments.filter(comment => comment.id !== id));
    setShowOptions(null);
  };

  const toggleOptions = (id) => {
    setShowOptions(showOptions === id ? null : id);
  };

  return (
    <section className={`h-[70vh] w-[400px] rounded-lg shadow-md overflow-hidden bg-gray-100 ${isDarkMode && "dark:bg-[#121212e8] border-2"} `}>
      <div className="p-4 h-full flex flex-col">
        <div className='flex items-center justify-between mb-2'>
          <h2 className="text-xl font-bold">Comments ({comments.length})</h2>
          
        </div>
        <hr className={`bg-black w-full h1 mb-4 ${isDarkMode && "dark:bg-[#121212e8]"}`} />
        {/* Comments section with YouTube-like scroll */}
        <div className="flex-1 mb-4 space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thumb-rounded-full dark:scrollbar-thumb-gray-600">
          {comments.length === 0 ? (
            <p className="text-gray-500 text-center mt-10">No comments yet</p>
          ) : (
            comments.map(comment => (
              <div key={comment.id} className="flex items-start space-x-2 pr-2">
                <div className="w-8 h-8 bg-red-600 text-white flex items-center justify-center rounded-full">
                  {comment.author.charAt(0)}
                </div>
                <div className={`flex-1 p-2 rounded-lg relative ${isDarkMode && "dark:bg-[#121212e8]"}`}>
                  <div className='flex justify-between'>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-sm">{comment.author}</span>
                      <span className="text-gray-500 text-xs">{comment.time}</span>
                    </div>
                    <div className="relative">
                      <button 
                        onClick={() => toggleOptions(comment.id)}
                        className="p-1 rounded-full hover:bg-[#b3b0b034] "
                      >
                        <HiOutlineDotsHorizontal />
                      </button>
                      
                      {showOptions === comment.id && (
                        <div className={`absolute right-0 top-8 w-32 rounded-md shadow-lg py-1 z-10 ${isDarkMode ? 'dark:bg-[#303030]' : 'bg-white'}`}>
                          <button
                            onClick={() => handleEdit(comment)}
                            className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-[#dbe1e330]"
                          >
                            <MdEdit className="mr-2" /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(comment.id)}
                            className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-[#dbe1e330]"
                          >
                            <MdDelete className="mr-2" /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {editingCommentId === comment.id ? (
                    <div className="mt-2">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full p-2 border rounded resize-none focus:outline-none"
                        rows="3"
                        autoFocus
                      />
                      <div className="flex justify-end space-x-2 mt-2">
                        <button 
                          onClick={() => setEditingCommentId(null)}
                          className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-full"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveEdit(comment.id)}
                          disabled={!editText.trim()}
                          className={`px-3 py-1 text-sm rounded-full ${editText.trim() ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm mt-1">{comment.text}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <button className="text-gray-500 flex items-center hover:text-gray-700 text-xs">
                          <AiFillLike /> {comment.likes}
                        </button>
                        <button className="text-gray-500 flex items-center hover:text-gray-700 text-xs">
                          <AiFillDislike /> {comment.dislikes}
                        </button>
                        <button className="text-gray-500 hover:text-gray-700 text-xs">
                          Reply
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* Comment input */}
        <div className="relative">
          {showCommentInput ? (
            <div className={`bg-white rounded-lg p-2 shadow-sm ${isDarkMode && "dark:bg-[#121212e8]"}`}>
              <textarea
                ref={textareaRef}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a comment..."
                className="w-full p-2 border rounded resize-none focus:outline-none"
                rows="3"
              />
              <div className="flex justify-end space-x-2 mt-2">
                <button 
                  onClick={() => setShowCommentInput(false)}
                  className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-full"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className={`px-3 py-1 text-sm rounded-full ${newComment.trim() ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                >
                  Comment
                </button>
                
              </div>
              
            </div>
          ) : (
            <div 
              onClick={toggleCommentInput}
              className={`flex items-center space-x-2 bg-white   p-2 rounded-full cursor-text ${isDarkMode && "dark:bg-[#1b1a1ae8] shadow-2xl"}`}
            >
              <div className="w-8 h-8 bg-gray-300 text-gray-600 flex items-center justify-center rounded-full">
                Y
              </div>
              <span className="text-gray-500 text-sm">Add a comment...</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Chatbox;