import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Comment from './Comment';

const Chatbox = () => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState('');
  const textareaRef = useRef(null);
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  const user = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = !!user;



const handleReply = (parentId, replyText) => {
    if (!replyText.trim()) return;
    const reply = {
      id: Date.now(),
      author: user?.username || 'You',
      text: replyText,
      likes: 0,
      dislikes: 0,
      time: 'Just now',
      timestamp: Date.now(),
      replies: []
    };
    setComments(prevComments => 
      prevComments.map(comment => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), reply]
          };
        }
        return comment;
      })
    );
  };


  const handleAddComment = () => {
    if (newComment.trim() === '') return;
    const comment = {
      id: Date.now(),
      author: user?.username || 'You',
      text: newComment,
      likes: 0,
      dislikes: 0,
      time: 'Just now',
      timestamp: Date.now(),
      replies: []
    };
    setComments([comment, ...comments]);
    setNewComment('');
    setShowCommentInput(false);
  };




  const calculateTimeAgo = (timestamp) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 10) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`;
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setComments(prevComments =>
        prevComments.map(comment => ({
          ...comment,
          time: calculateTimeAgo(comment.timestamp)
        }))
      );
    }, 60000);

    return () => clearInterval(interval);
  }, []);

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
  };

  const handleSaveEdit = (id) => {
    setComments(comments =>
      comments.map(comment =>
        comment.id === id ? { ...comment, text: editText } : comment
      )
    );
    setEditingCommentId(null);
    setEditText('');
  };

  const handleDelete = (id) => {
    // Helper to recursively delete a comment/reply by id
    const deleteRecursive = (commentsArr, deleteId) => {
      return commentsArr
        .filter(comment => comment.id !== deleteId)
        .map(comment => ({
          ...comment,
          replies: comment.replies ? deleteRecursive(comment.replies, deleteId) : []
        }));
    };
    setComments(prevComments => deleteRecursive(prevComments, id));
  };

  const renderAvatar = () => {
    if (!isLoggedIn) {
      return <span className="text-sm">?</span>;
    }
    if (user.avatar) {
      return <p>{user.avatar}</p>;
    }
    const initials = user.username
      ? user.username.slice(0, 2).toUpperCase()
      : "US";
    return <span className="text-sm">{initials}</span>;
  };

  return (
    <section className={`h-[75vh] w-[400px] rounded-lg shadow-md overflow-hidden bg-gray-100 ${isDarkMode && "dark:bg-[#121212e8] border-2"} `}>
      <div className="p-4 h-full flex flex-col">
        <div className='flex items-center justify-between mb-2'>
          <h2 className="text-xl font-bold">Comments ({comments.length})</h2>
        </div>
        <hr className={`bg-black w-full h1 mb-4 ${isDarkMode && "dark:bg-[#121212e8]"}`} />
        <div className="flex-1 mb-4 space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thumb-rounded-full dark:scrollbar-thumb-gray-600">
          {comments.length === 0 ? (
            <p className="text-gray-500 text-center mt-10">No comments yet</p>
          ) : (
            comments.map(comment => (
              <Comment
                key={comment.id}
                comment={comment}
                isDarkMode={isDarkMode}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                editingCommentId={editingCommentId}
                editText={editText}
                setEditText={setEditText}
                setEditingCommentId={setEditingCommentId}
                handleSaveEdit={handleSaveEdit}
                renderAvatar={renderAvatar}
                handleReply={handleReply}
              />
            ))
          )}
        </div>
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
              className={`flex items-center space-x-2 bg-white p-2 rounded-full cursor-text ${isDarkMode && "dark:bg-[#1b1a1ae8] shadow-2xl"}`}
            >
              <div className="w-8 h-8 bg-gray-300 text-gray-600 flex items-center justify-center rounded-full">
                {renderAvatar()}
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

