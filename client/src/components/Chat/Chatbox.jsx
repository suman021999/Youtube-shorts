
import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Comment from './Comment';
import { IoCloseOutline } from 'react-icons/io5';
import { getComments, createComment, updateComment, deleteComment, likeComment, dislikeComment } from '../../service/chat.service'; // Import your API functions

const Chatbox = ({ videoId, onClose }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const textareaRef = useRef(null);
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  const user = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = !!user;

  // Load comments from API on initial render
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getComments(videoId);
        if (response.success) {
          setComments(response.comments);
        }
      } catch (error) {
        console.error('Failed to load comments', error);
        setError('Failed to load comments. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (videoId) {
      fetchComments();
    }
  }, [videoId]);

  const handleReply = async (parentId, replyText) => {
    if (!replyText.trim()) return;
    
    try {
      // Find the root parent comment ID (main comment, not a reply)
      const findRootParent = (comments, targetId) => {
        for (let comment of comments) {
          if (comment.id === targetId) return comment.id; // This is already a main comment
          if (comment.replies?.length) {
            for (let reply of comment.replies) {
              if (reply.id === targetId) return comment.id; // Return the main comment ID
            }
          }
        }
        return targetId; // Fallback
      };
      
      const rootParentId = findRootParent(comments, parentId);
      
      const response = await createComment(videoId, replyText, rootParentId);
      if (response.success) {
        // Add the reply to the root parent comment
        setComments(prevComments => 
          prevComments.map(comment => {
            if (comment.id === rootParentId) {
              return {
                ...comment,
                replies: [...(comment.replies || []), response.comment]
              };
            }
            return comment;
          })
        );
      }
    } catch (error) {
      console.error('Failed to add reply:', error);
      setError('Failed to add reply. Please try again.');
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    
    try {
      const response = await createComment(videoId, newComment);
      if (response.success) {
        setComments([response.comment, ...comments]);
        setNewComment('');
        setShowCommentInput(false);
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
      setError('Failed to add comment. Please try again.');
    }
  };

  const calculateTimeAgo = (timestamp) => {
    const date = new Date(timestamp);
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 10) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min${minutes === 1 ? '' : 's'} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`;
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
    return date.toLocaleDateString();
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setComments(prevComments =>
        prevComments.map(comment => ({
          ...comment,
          time: calculateTimeAgo(comment.timestamp || comment.createdAt),
          replies: comment.replies?.map(reply => ({
            ...reply,
            time: calculateTimeAgo(reply.timestamp || reply.createdAt)
          })) || []
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

  const handleSaveEdit = async (id) => {
    try {
      const response = await updateComment(id, editText);
      if (response.success) {
        setComments(comments =>
          comments.map(comment => {
            if (comment.id === id) {
              return { ...comment, text: editText };
            }
            // Check in replies too
            if (comment.replies?.length) {
              const updatedReplies = comment.replies.map(reply =>
                reply.id === id ? { ...reply, text: editText } : reply
              );
              return { ...comment, replies: updatedReplies };
            }
            return comment;
          })
        );
        setEditingCommentId(null);
        setEditText('');
      }
    } catch (error) {
      console.error('Failed to update comment:', error);
      setError('Failed to update comment. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await deleteComment(id);
      if (response.success) {
        const deleteRecursive = (commentsArr, deleteId) => {
          return commentsArr
            .filter(comment => comment.id !== deleteId)
            .map(comment => ({
              ...comment,
              replies: comment.replies ? deleteRecursive(comment.replies, deleteId) : []
            }));
        };
        setComments(prevComments => deleteRecursive(prevComments, id));
      }
    } catch (error) {
      console.error('Failed to delete comment:', error);
      setError('Failed to delete comment. Please try again.');
    }
  };

  const handleLike = async (id) => {
    try {
      const response = await likeComment(id);
      if (response.success) {
        setComments(prevComments =>
          prevComments.map(comment => {
            if (comment.id === id) {
              return { ...comment, likes: comment.likes + 1 };
            }
            // Check in replies too
            if (comment.replies?.length) {
              const updatedReplies = comment.replies.map(reply =>
                reply.id === id ? { ...reply, likes: reply.likes + 1 } : reply
              );
              return { ...comment, replies: updatedReplies };
            }
            return comment;
          })
        );
      }
    } catch (error) {
      console.error('Failed to like comment:', error);
      setError('Failed to like comment. Please try again.');
    }
  };

  const handleDislike = async (id) => {
    try {
      const response = await dislikeComment(id);
      if (response.success) {
        setComments(prevComments =>
          prevComments.map(comment => {
            if (comment.id === id) {
              return { ...comment, dislikes: comment.dislikes + 1 };
            }
            // Check in replies too
            if (comment.replies?.length) {
              const updatedReplies = comment.replies.map(reply =>
                reply.id === id ? { ...reply, dislikes: reply.dislikes + 1 } : reply
              );
              return { ...comment, replies: updatedReplies };
            }
            return comment;
          })
        );
      }
    } catch (error) {
      console.error('Failed to dislike comment:', error);
      setError('Failed to dislike comment. Please try again.');
    }
  };

  const renderAvatar = (author, avatar) => {
    if (!isLoggedIn && !author) return <span className="text-sm">?</span>;
    if (avatar) return <p>{avatar}</p>;
    const initials = author
      ? author.slice(0, 2).toUpperCase()
      : (user?.username ? user.username.slice(0, 2).toUpperCase() : "US");
    return <span className="text-sm">{initials}</span>;
  };

  if (loading) {
    return (
      <section className={`h-[85vh]   w-[400px] rounded-lg shadow-md overflow-hidden bg-gray-100 ${isDarkMode && "dark:bg-[#121212e8] border-2"}`}>
        <div className="p-4 h-full flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-gray-500">Loading comments...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`h-[85vh] w-[400px] rounded-lg shadow-md overflow-hidden bg-gray-100 ${isDarkMode && "dark:bg-[#121212e8] border-2"}`}>
      <div className="p-4 h-full flex flex-col">
        <div className='flex items-center justify-between mb-2'>
          <h2 className="text-xl font-bold">Comments ({comments.length})</h2>
          <button 
            onClick={onClose}
            className="flex items-center cursor-pointer space-x-1 text-gray-500 hover:text-gray-700"
          >
            <IoCloseOutline className='h-8 w-8'/>  
          </button>
        </div>
        <hr className={`bg-black w-full h1 mb-4 ${isDarkMode && "dark:bg-[#121212e8]"}`} />
        
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">
            {error}
            <button 
              onClick={() => setError(null)}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        )}

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
                renderAvatar={(author, avatar) => renderAvatar(author || comment.author, avatar || comment.avatar)}
                handleReply={handleReply}
               handleLike={handleLike}
               handleDislike={handleDislike}
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
                  onClick={() => {
                    setShowCommentInput(false);
                    setNewComment('');
                  }}
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
                {renderAvatar(user?.username, user?.avatar)}
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