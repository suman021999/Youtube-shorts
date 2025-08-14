// import React, { useState, useRef, useEffect } from 'react';
// import { useSelector } from 'react-redux';
// import Comment from './Comment';
// import { IoCloseOutline } from 'react-icons/io5';


// const Chatbox = ({ videoId,onClose }) => {
//   // Load comments from localStorage on initial render
//   const [comments, setComments] = useState(() => {
//     try {
//       const savedComments = localStorage.getItem('chatbox-comments');
//       return savedComments ? JSON.parse(savedComments) : [];
//     } catch (error) {
//       console.error('Failed to load comments', error);
//       return [];
//     }
//   });

//   const [newComment, setNewComment] = useState('');
//   const [showCommentInput, setShowCommentInput] = useState(false);
//   const [editingCommentId, setEditingCommentId] = useState(null);
//   const [editText, setEditText] = useState('');
//   const textareaRef = useRef(null);
//   const isDarkMode = useSelector((state) => state.theme.isDarkMode);

//   const user = JSON.parse(localStorage.getItem("user"));
//   const isLoggedIn = !!user;

//   // Save comments to localStorage whenever they change
//   useEffect(() => {
//     try {
//       localStorage.setItem('chatbox-comments', JSON.stringify(comments));
//     } catch (error) {
//       console.error('Failed to save comments', error);
//     }
//   }, [comments]);

//   const handleReply = (parentId, replyText) => {
//     if (!replyText.trim()) return;
    
//     const reply = {
//       id: Date.now(),
//       author: user?.username || 'You',
//       text: replyText,
//       likes: 0,
//       dislikes: 0,
//       time: 'Just now',
//       timestamp: Date.now(),
//       replies: []
//     };
    
//     const findRootParent = (comments, targetId) => {
//       for (let comment of comments) {
//         if (comment.id === targetId) return comment.id;
//         if (comment.replies?.length) {
//           for (let reply of comment.replies) {
//             if (reply.id === targetId) return comment.id;
//           }
//         }
//       }
//       return targetId;
//     };
    
//     setComments(prevComments => 
//       prevComments.map(comment => {
//         const rootParentId = findRootParent(prevComments, parentId);
//         if (comment.id === rootParentId) {
//           return {
//             ...comment,
//             replies: [...(comment.replies || []), reply]
//           };
//         }
//         return comment;
//       })
//     );
//   };

//   const handleAddComment = () => {
//     if (!newComment.trim()) return;
//     const comment = {
//       id: Date.now(),
//       author: user?.username || 'You',
//       text: newComment,
//       likes: 0,
//       dislikes: 0,
//       time: 'Just now',
//       timestamp: Date.now(),
//       replies: []
//     };
//     setComments([comment, ...comments]);
//     setNewComment('');
//     setShowCommentInput(false);
//   };

//   const calculateTimeAgo = (timestamp) => {
//     const seconds = Math.floor((Date.now() - timestamp) / 1000);
//     if (seconds < 10) return 'Just now';
//     const minutes = Math.floor(seconds / 60);
//     if (minutes < 60) return `${minutes} min${minutes === 1 ? '' : 's'} ago`;
//     const hours = Math.floor(minutes / 60);
//     if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
//     const days = Math.floor(hours / 24);
//     if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`;
//     const weeks = Math.floor(days / 7);
//     if (weeks < 4) return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
//     return new Date(timestamp).toLocaleDateString();
//   };

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setComments(prevComments =>
//         prevComments.map(comment => ({
//           ...comment,
//           time: calculateTimeAgo(comment.timestamp)
//         }))
//       );
//     }, 60000);

//     return () => clearInterval(interval);
//   }, []);

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleAddComment();
//     }
//   };

//   const toggleCommentInput = () => {
//     setShowCommentInput(!showCommentInput);
//     if (!showCommentInput && textareaRef.current) {
//       setTimeout(() => textareaRef.current.focus(), 0);
//     }
//   };

//   const handleEdit = (comment) => {
//     setEditingCommentId(comment.id);
//     setEditText(comment.text);
//   };

//   const handleSaveEdit = (id) => {
//     setComments(comments =>
//       comments.map(comment =>
//         comment.id === id ? { ...comment, text: editText } : comment
//       )
//     );
//     setEditingCommentId(null);
//     setEditText('');
//   };

//   const handleDelete = (id) => {
//     const deleteRecursive = (commentsArr, deleteId) => {
//       return commentsArr
//         .filter(comment => comment.id !== deleteId)
//         .map(comment => ({
//           ...comment,
//           replies: comment.replies ? deleteRecursive(comment.replies, deleteId) : []
//         }));
//     };
//     setComments(prevComments => deleteRecursive(prevComments, id));
//   };

//   const renderAvatar = () => {
//     if (!isLoggedIn) return <span className="text-sm">?</span>;
//     if (user.avatar) return <p>{user.avatar}</p>;
//     const initials = user.username
//       ? user.username.slice(0, 2).toUpperCase()
//       : "US";
//     return <span className="text-sm">{initials}</span>;
//   };

//   return (
//     <section className={`h-[85vh] w-[400px] rounded-lg shadow-md overflow-hidden bg-gray-100 ${isDarkMode && "dark:bg-[#121212e8] border-2"}`}>
//       <div className="p-4 h-full flex flex-col">
//         <div className='flex items-center justify-between mb-2'>
//           <h2 className="text-xl font-bold">Comments ({comments.length})</h2>
//           <button 
//             onClick={onClose}
//             className="flex items-center cursor-pointer space-x-1 text-gray-500 hover:text-gray-700"
//           >
//             <IoCloseOutline className='h-8 w-8'/>  
//           </button>
//         </div>
//         <hr className={`bg-black w-full h1 mb-4 ${isDarkMode && "dark:bg-[#121212e8]"}`} />
//         <div className="flex-1 mb-4 space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thumb-rounded-full dark:scrollbar-thumb-gray-600">
//           {comments.length === 0 ? (
//             <p className="text-gray-500 text-center mt-10">No comments yet</p>
//           ) : (
//             comments.map(comment => (
//               <Comment
//                 key={comment.id}
//                 comment={comment}
//                 isDarkMode={isDarkMode}
//                 handleEdit={handleEdit}
//                 handleDelete={handleDelete}
//                 editingCommentId={editingCommentId}
//                 editText={editText}
//                 setEditText={setEditText}
//                 setEditingCommentId={setEditingCommentId}
//                 handleSaveEdit={handleSaveEdit}
//                 renderAvatar={renderAvatar}
//                 handleReply={handleReply}
//               />
//             ))
//           )}
//         </div>
//         <div className="relative">
//           {showCommentInput ? (
//             <div className={`bg-white rounded-lg p-2 shadow-sm ${isDarkMode && "dark:bg-[#121212e8]"}`}>
//               <textarea
//                 ref={textareaRef}
//                 value={newComment}
//                 onChange={(e) => setNewComment(e.target.value)}
//                 onKeyPress={handleKeyPress}
//                 placeholder="Add a comment..."
//                 className="w-full p-2 border rounded resize-none focus:outline-none"
//                 rows="3"
//               />
//               <div className="flex justify-end space-x-2 mt-2">
//                 <button
//                   onClick={() => {
//                     setShowCommentInput(false);
//                     setNewComment('');
//                   }}
//                   className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-full"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleAddComment}
//                   disabled={!newComment.trim()}
//                   className={`px-3 py-1 text-sm rounded-full ${newComment.trim() ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
//                 >
//                   Comment
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <div
//               onClick={toggleCommentInput}
//               className={`flex items-center space-x-2 bg-white p-2 rounded-full cursor-text ${isDarkMode && "dark:bg-[#1b1a1ae8] shadow-2xl"}`}
//             >
//               <div className="w-8 h-8 bg-gray-300 text-gray-600 flex items-center justify-center rounded-full">
//                 {renderAvatar()}
//               </div>
//               <span className="text-gray-500 text-sm">Add a comment...</span>
//             </div>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Chatbox;
//----------------------------------
// import React, { useState, useRef, useEffect } from 'react';
// import { useSelector } from 'react-redux';
// import Comment from './Comment';
// import { IoCloseOutline } from 'react-icons/io5';
// import {
//   getComments,
//   createComment,
//   updateComment,
//   deleteComment,
//   likeComment,
//   dislikeComment
// } from '../../service/chat.service';

// const Chatbox = ({ videoId, onClose }) => {
//   const [comments, setComments] = useState([]);
//   const [newComment, setNewComment] = useState('');
//   const [showCommentInput, setShowCommentInput] = useState(false);
//   const [editingCommentId, setEditingCommentId] = useState(null);
//   const [editText, setEditText] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [submitting, setSubmitting] = useState(false);
//   const textareaRef = useRef(null);
//   const isDarkMode = useSelector((state) => state.theme.isDarkMode);

//   const user = JSON.parse(localStorage.getItem("user"));
//   const isLoggedIn = !!user;

//   // Load comments from API on component mount
//   useEffect(() => {
//     const loadComments = async () => {
//       if (!videoId) return;
      
//       try {
//         setLoading(true);
//         setError(null);
//         const commentsData = await getComments(videoId);
        
//         // Ensure commentsData is an array
//         const commentsArray = Array.isArray(commentsData) 
//           ? commentsData 
//           : commentsData?.comments || commentsData?.data || [];
        
//         setComments(commentsArray);
//       } catch (error) {
//         console.error('Failed to load comments:', error);
//         setError('Failed to load comments. Please try again.');
//         // Fallback to localStorage if API fails
//         try {
//           const savedComments = localStorage.getItem(`chatbox-comments-${videoId}`);
//           if (savedComments) {
//             const parsedComments = JSON.parse(savedComments);
//             setComments(Array.isArray(parsedComments) ? parsedComments : []);
//           }
//         } catch (localError) {
//           console.error('Failed to load from localStorage:', localError);
//           setComments([]); // Ensure it's always an array
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadComments();
//   }, [videoId]);

//   // Backup to localStorage whenever comments change
//   useEffect(() => {
//     if (comments.length > 0 && videoId) {
//       try {
//         localStorage.setItem(`chatbox-comments-${videoId}`, JSON.stringify(comments));
//       } catch (error) {
//         console.error('Failed to backup comments to localStorage:', error);
//       }
//     }
//   }, [comments, videoId]);

//   const handleReply = async (parentId, replyText) => {
//     if (!replyText.trim() || !isLoggedIn) return;
    
//     try {
//       setSubmitting(true);
//       // For now, treating replies as regular comments with parent reference
//       // You may need to modify your API to handle replies differently
//       const newReplyData = await createComment(videoId, replyText);
      
//       const reply = {
//         id: newReplyData.id || Date.now(),
//         author: user?.username || 'You',
//         text: replyText,
//         likes: 0,
//         dislikes: 0,
//         time: 'Just now',
//         timestamp: Date.now(),
//         replies: []
//       };
      
//       const findRootParent = (comments, targetId) => {
//         for (let comment of comments) {
//           if (comment.id === targetId) return comment.id;
//           if (comment.replies?.length) {
//             for (let reply of comment.replies) {
//               if (reply.id === targetId) return comment.id;
//             }
//           }
//         }
//         return targetId;
//       };
      
//       setComments(prevComments => 
//         prevComments.map(comment => {
//           const rootParentId = findRootParent(prevComments, parentId);
//           if (comment.id === rootParentId) {
//             return {
//               ...comment,
//               replies: [...(comment.replies || []), reply]
//             };
//           }
//           return comment;
//         })
//       );
//     } catch (error) {
//       console.error('Failed to add reply:', error);
//       setError('Failed to add reply. Please try again.');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleAddComment = async () => {
//     if (!newComment.trim() || !isLoggedIn || submitting) return;
    
//     try {
//       setSubmitting(true);
//       setError(null);
      
//       const commentData = await createComment(videoId, newComment);
      
//       // Handle different API response formats
//       const newCommentObj = {
//         id: commentData.id || commentData._id || Date.now(),
//         author: commentData.author || commentData.user?.username || user?.username || 'You',
//         text: commentData.text || commentData.content || newComment,
//         likes: commentData.likes || 0,
//         dislikes: commentData.dislikes || 0,
//         time: 'Just now',
//         timestamp: commentData.timestamp || commentData.createdAt || Date.now(),
//         replies: commentData.replies || []
//       };
      
//       setComments(prevComments => {
//         const currentComments = Array.isArray(prevComments) ? prevComments : [];
//         return [newCommentObj, ...currentComments];
//       });
//       setNewComment('');
//       setShowCommentInput(false);
//     } catch (error) {
//       console.error('Failed to add comment:', error);
//       setError('Failed to add comment. Please try again.');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const calculateTimeAgo = (timestamp) => {
//     const seconds = Math.floor((Date.now() - timestamp) / 1000);
//     if (seconds < 10) return 'Just now';
//     const minutes = Math.floor(seconds / 60);
//     if (minutes < 60) return `${minutes} min${minutes === 1 ? '' : 's'} ago`;
//     const hours = Math.floor(minutes / 60);
//     if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
//     const days = Math.floor(hours / 24);
//     if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`;
//     const weeks = Math.floor(days / 7);
//     if (weeks < 4) return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
//     return new Date(timestamp).toLocaleDateString();
//   };

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setComments(prevComments =>
//         prevComments.map(comment => ({
//           ...comment,
//           time: calculateTimeAgo(comment.timestamp),
//           replies: comment.replies?.map(reply => ({
//             ...reply,
//             time: calculateTimeAgo(reply.timestamp)
//           })) || []
//         }))
//       );
//     }, 60000);

//     return () => clearInterval(interval);
//   }, []);

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleAddComment();
//     }
//   };

//   const toggleCommentInput = () => {
//     if (!isLoggedIn) {
//       setError('Please log in to add comments.');
//       return;
//     }
//     setShowCommentInput(!showCommentInput);
//     if (!showCommentInput && textareaRef.current) {
//       setTimeout(() => textareaRef.current.focus(), 0);
//     }
//   };

//   const handleEdit = (comment) => {
//     setEditingCommentId(comment.id);
//     setEditText(comment.text);
//   };

//   const handleSaveEdit = async (id) => {
//     if (!editText.trim() || submitting) return;
    
//     try {
//       setSubmitting(true);
//       setError(null);
      
//       await updateComment(id, editText);
      
//       setComments(comments =>
//         comments.map(comment =>
//           comment.id === id ? { ...comment, text: editText } : comment
//         )
//       );
//       setEditingCommentId(null);
//       setEditText('');
//     } catch (error) {
//       console.error('Failed to update comment:', error);
//       setError('Failed to update comment. Please try again.');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (submitting) return;
    
//     try {
//       setSubmitting(true);
//       setError(null);
      
//       await deleteComment(id);
      
//       const deleteRecursive = (commentsArr, deleteId) => {
//         return commentsArr
//           .filter(comment => comment.id !== deleteId)
//           .map(comment => ({
//             ...comment,
//             replies: comment.replies ? deleteRecursive(comment.replies, deleteId) : []
//           }));
//       };
//       setComments(prevComments => deleteRecursive(prevComments, id));
//     } catch (error) {
//       console.error('Failed to delete comment:', error);
//       setError('Failed to delete comment. Please try again.');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleLike = async (commentId) => {
//     if (!isLoggedIn || submitting) return;
    
//     try {
//       setSubmitting(true);
//       await likeComment(commentId);
      
//       setComments(prevComments =>
//         prevComments.map(comment =>
//           comment.id === commentId
//             ? { ...comment, likes: comment.likes + 1 }
//             : comment
//         )
//       );
//     } catch (error) {
//       console.error('Failed to like comment:', error);
//       setError('Failed to like comment.');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleDislike = async (commentId) => {
//     if (!isLoggedIn || submitting) return;
    
//     try {
//       setSubmitting(true);
//       await dislikeComment(commentId);
      
//       setComments(prevComments =>
//         prevComments.map(comment =>
//           comment.id === commentId
//             ? { ...comment, dislikes: comment.dislikes + 1 }
//             : comment
//         )
//       );
//     } catch (error) {
//       console.error('Failed to dislike comment:', error);
//       setError('Failed to dislike comment.');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const renderAvatar = () => {
//     if (!isLoggedIn) return <span className="text-sm">?</span>;
//     if (user.avatar) return <p>{user.avatar}</p>;
//     const initials = user.username
//       ? user.username.slice(0, 2).toUpperCase()
//       : "US";
//     return <span className="text-sm">{initials}</span>;
//   };

//   return (
//     <section className={`h-[85vh] w-[400px] rounded-lg shadow-md overflow-hidden bg-gray-100 ${isDarkMode && "dark:bg-[#121212e8] border-2"}`}>
//       <div className="p-4 h-full flex flex-col">
//         <div className='flex items-center justify-between mb-2'>
//           <h2 className="text-xl font-bold">Comments ({comments.length})</h2>
//           <button 
//             onClick={onClose}
//             className="flex items-center cursor-pointer space-x-1 text-gray-500 hover:text-gray-700"
//           >
//             <IoCloseOutline className='h-8 w-8'/>  
//           </button>
//         </div>
//         <hr className={`bg-black w-full h1 mb-4 ${isDarkMode && "dark:bg-[#121212e8]"}`} />
        
//         {/* Error message */}
//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-4 text-sm">
//             {error}
//             <button 
//               onClick={() => setError(null)} 
//               className="ml-2 text-red-500 hover:text-red-700"
//             >
//               ×
//             </button>
//           </div>
//         )}
        
//         <div className="flex-1 mb-4 space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thumb-rounded-full dark:scrollbar-thumb-gray-600">
//           {loading ? (
//             <div className="text-center mt-10">
//               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
//               <p className="text-gray-500 mt-2">Loading comments...</p>
//             </div>
//           ) : comments.length === 0 ? (
//             <p className="text-gray-500 text-center mt-10">No comments yet</p>
//           ) : (
//             comments.map(comment => (
//               <Comment
//                 key={comment.id}
//                 comment={comment}
//                 isDarkMode={isDarkMode}
//                 handleEdit={handleEdit}
//                 handleDelete={handleDelete}
//                 handleLike={handleLike}
//                 handleDislike={handleDislike}
//                 editingCommentId={editingCommentId}
//                 editText={editText}
//                 setEditText={setEditText}
//                 setEditingCommentId={setEditingCommentId}
//                 handleSaveEdit={handleSaveEdit}
//                 renderAvatar={renderAvatar}
//                 handleReply={handleReply}
//                 submitting={submitting}
//               />
//             ))
//           )}
//         </div>
        
//         <div className="relative">
//           {showCommentInput ? (
//             <div className={`bg-white rounded-lg p-2 shadow-sm ${isDarkMode && "dark:bg-[#121212e8]"}`}>
//               <textarea
//                 ref={textareaRef}
//                 value={newComment}
//                 onChange={(e) => setNewComment(e.target.value)}
//                 onKeyPress={handleKeyPress}
//                 placeholder="Add a comment..."
//                 className="w-full p-2 border rounded resize-none focus:outline-none"
//                 rows="3"
//                 disabled={submitting}
//               />
//               <div className="flex justify-end space-x-2 mt-2">
//                 <button
//                   onClick={() => {
//                     setShowCommentInput(false);
//                     setNewComment('');
//                   }}
//                   className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-full"
//                   disabled={submitting}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleAddComment}
//                   disabled={!newComment.trim() || submitting}
//                   className={`px-3 py-1 text-sm rounded-full ${
//                     newComment.trim() && !submitting 
//                       ? 'bg-blue-500 text-white hover:bg-blue-600' 
//                       : 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                   }`}
//                 >
//                   {submitting ? 'Posting...' : 'Comment'}
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <div
//               onClick={toggleCommentInput}
//               className={`flex items-center space-x-2 bg-white p-2 rounded-full cursor-text ${isDarkMode && "dark:bg-[#1b1a1ae8] shadow-2xl"}`}
//             >
//               <div className="w-8 h-8 bg-gray-300 text-gray-600 flex items-center justify-center rounded-full">
//                 {renderAvatar()}
//               </div>
//               <span className="text-gray-500 text-sm">
//                 {isLoggedIn ? 'Add a comment...' : 'Log in to add comments...'}
//               </span>
//             </div>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Chatbox;