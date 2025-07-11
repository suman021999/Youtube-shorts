

import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';

const Chatbox = () => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showCommentInput, setShowCommentInput] = useState(false);
  const textareaRef = useRef(null);
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  const handleAddComment = () => {
    if (newComment.trim() === '') return;
    
    const comment = {
      id: Date.now(),
      author: 'You',
      text: newComment,
      likes: 0,
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

  return (
    <section className={`h-[70vh] w-[400px] rounded-lg shadow-md overflow-hidden bg-gray-100 ${isDarkMode && "dark:bg-[#121212e8]"}`}>
      <div className="p-4 h-full flex flex-col">
        <div className='flex items-center justify-between mb-4'>
          <h2 className="text-xl font-bold">Comments ({comments.length})</h2>
        </div>
        
        {/* Comments section */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {comments.length === 0 ? (
            <p className="text-gray-500 text-center mt-10">No comments yet</p>
          ) : (
            comments.map(comment => (
              <div key={comment.id} className="flex items-start space-x-2">
                <div className="w-8 h-8 bg-red-600 text-white flex items-center justify-center rounded-full">
                  {comment.author.charAt(0)}
                </div>
                <div className="flex-1 bg-white p-2 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-sm">{comment.author}</span>
                    <span className="text-gray-500 text-xs">{comment.time}</span>
                  </div>
                  <p className="text-sm mt-1">{comment.text}</p>
                  <div className="flex items-center space-x-4 mt-1">
                    <button className="text-gray-500 hover:text-gray-700 text-xs">
                      Like ({comment.likes})
                    </button>
                    <button className="text-gray-500 hover:text-gray-700 text-xs">
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* Comment input */}
        <div className="relative">
          {showCommentInput ? (
            <div className="bg-white rounded-lg p-2 shadow-sm">
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
              className="flex items-center space-x-2 bg-white p-2 rounded-full cursor-text hover:bg-gray-50"
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
