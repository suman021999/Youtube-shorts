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

//-----------------------------------_____________________________-----------------_________________________

// import React, { useState, useRef, useEffect } from 'react';
// import { useSelector } from 'react-redux';
// import { chatService } from '../../service/chat.service';
// import Comment from './Comment';
// import { IoCloseOutline } from "react-icons/io5";


// const Chatbox = ({ videoId,onClose }) => {
//   const [comments, setComments] = useState([]);
//   const [newComment, setNewComment] = useState('');
//   const [showCommentInput, setShowCommentInput] = useState(false);
//   const [editingCommentId, setEditingCommentId] = useState(null);
//   const [editText, setEditText] = useState('');
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const textareaRef = useRef(null);
//   const isDarkMode = useSelector((state) => state.theme.isDarkMode);

//   const user = JSON.parse(localStorage.getItem("user"));
//   const isLoggedIn = !!user;

//   // Load comments when component mounts or videoId changes
//   useEffect(() => {
//     const loadComments = async () => {
//       try {
//         setIsLoading(true);
//         const data = await chatService.getCommentsByVideo(videoId);
//         setComments(data.comments || []);
//         setError(null);
//       } catch (err) {
//         console.error('Failed to load comments:', err);
//         setError('Failed to load comments. Please try again.');
//         // Fallback to localStorage if API fails
//         try {
//           const savedComments = localStorage.getItem(`chatbox-comments-${videoId}`);
//           if (savedComments) setComments(JSON.parse(savedComments));
//         } catch (e) {
//           console.error('Failed to load local comments:', e);
//         }
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     if (videoId) loadComments();
//   }, [videoId]);

//   // Save comments to localStorage as fallback
//   useEffect(() => {
//     if (videoId && comments.length > 0) {
//       try {
//         localStorage.setItem(`chatbox-comments-${videoId}`, JSON.stringify(comments));
//       } catch (error) {
//         console.error('Failed to save comments locally', error);
//       }
//     }
//   }, [comments, videoId]);

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

//   const handleReply = async (parentId, replyText) => {
//     if (!replyText.trim() || !isLoggedIn) return;
    
//     try {
//       const newReply = await chatService.createComment(videoId, replyText, parentId);
//       newReply.time = 'Just now';
//       newReply.timestamp = Date.now();
      
//       setComments(prevComments => {
//         const addReplyToComment = (comments) => {
//           return comments.map(comment => {
//             if (comment.id === parentId) {
//               return {
//                 ...comment,
//                 replies: [...(comment.replies || []), newReply]
//               };
//             }
//             if (comment.replies?.length) {
//               return {
//                 ...comment,
//                 replies: addReplyToComment(comment.replies)
//               };
//             }
//             return comment;
//           });
//         };
        
//         return addReplyToComment(prevComments);
//       });
//     } catch (err) {
//       console.error('Failed to post reply:', err);
//       // Fallback to local state if API fails
//       const reply = {
//         id: Date.now(),
//         author: user?.username || 'You',
//         text: replyText,
//         likes: 0,
//         dislikes: 0,
//         time: 'Just now',
//         timestamp: Date.now(),
//         replies: []
//       };
      
//       setComments(prevComments => 
//         prevComments.map(comment => {
//           if (comment.id === parentId) {
//             return {
//               ...comment,
//               replies: [...(comment.replies || []), reply]
//             };
//           }
//           return comment;
//         })
//       );
//     }
//   };

//   const handleAddComment = async () => {
//     if (!newComment.trim() || !isLoggedIn) return;
    
//     try {
//       const comment = await chatService.createComment(videoId, newComment);
//       comment.time = 'Just now';
//       comment.timestamp = Date.now();
//       setComments([comment, ...comments]);
//       setNewComment('');
//       setShowCommentInput(false);
//     } catch (err) {
//       console.error('Failed to post comment:', err);
//       // Fallback to local state if API fails
//       const localComment = {
//         id: Date.now(),
//         author: user?.username || 'You',
//         text: newComment,
//         likes: 0,
//         dislikes: 0,
//         time: 'Just now',
//         timestamp: Date.now(),
//         replies: []
//       };
//       setComments([localComment, ...comments]);
//       setNewComment('');
//       setShowCommentInput(false);
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleAddComment();
//     }
//   };

//   const toggleCommentInput = () => {
//     if (!isLoggedIn) {
//       alert('Please log in to comment');
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
//     try {
//       await chatService.updateComment(id, editText);
//       setComments(comments =>
//         comments.map(comment =>
//           comment.id === id ? { ...comment, text: editText } : comment
//         )
//       );
//       setEditingCommentId(null);
//       setEditText('');
//     } catch (err) {
//       console.error('Failed to update comment:', err);
//       // Fallback to local state if API fails
//       setComments(comments =>
//         comments.map(comment =>
//           comment.id === id ? { ...comment, text: editText } : comment
//         )
//       );
//       setEditingCommentId(null);
//       setEditText('');
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await chatService.deleteComment(id);
//       setComments(prevComments =>
//         prevComments.filter(comment => comment.id !== id)
//       );
//     } catch (err) {
//       console.error('Failed to delete comment:', err);
//       // Fallback to local state if API fails
//       setComments(prevComments =>
//         prevComments.filter(comment => comment.id !== id)
//       );
//     }
//   };

//   const handleLike = async (commentId) => {
//     if (!isLoggedIn) {
//       alert('Please log in to like comments');
//       return;
//     }
//     try {
//       await chatService.likeComment(commentId);
//       setComments(prevComments =>
//         prevComments.map(comment => {
//           if (comment.id === commentId) {
//             return { ...comment, likes: comment.likes + 1 };
//           }
//           return comment;
//         })
//       );
//     } catch (err) {
//       console.error('Failed to like comment:', err);
//     }
//   };

//   const handleDislike = async (commentId) => {
//     if (!isLoggedIn) {
//       alert('Please log in to dislike comments');
//       return;
//     }
//     try {
//       await chatService.dislikeComment(commentId);
//       setComments(prevComments =>
//         prevComments.map(comment => {
//           if (comment.id === commentId) {
//             return { ...comment, dislikes: comment.dislikes + 1 };
//           }
//           return comment;
//         })
//       );
//     } catch (err) {
//       console.error('Failed to dislike comment:', err);
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
//             className="flex items-center space-x-1 text-gray-500 hover:text-gray-700"
//           >
//             <IoCloseOutline className='h-8 w-8'/>  
//           </button>
//         </div>
//         <hr className={`bg-black w-full h1 mb-4 ${isDarkMode && "dark:bg-[#121212e8]"}`} />
        
//         {isLoading ? (
//           <div className="flex-1 flex items-center justify-center">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
//           </div>
//         ) : error ? (
//           <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
//             <p className="text-red-500 mb-2">{error}</p>
//             <p className="text-sm text-gray-500">Showing locally saved comments</p>
//           </div>
//         ) : (
//           <div className="flex-1 mb-4 space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thumb-rounded-full dark:scrollbar-thumb-gray-600">
//             {comments.length === 0 ? (
//               <div className="text-center mt-10">
//                 <p className="text-gray-500">No comments yet</p>
//                 <button 
//                   onClick={toggleCommentInput}
//                   className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 text-sm"
//                 >
//                   Be the first to comment
//                 </button>
//               </div>
//             ) : (
//               comments.map(comment => (
//                 <Comment
//                   key={comment.id}
//                   comment={comment}
//                   isDarkMode={isDarkMode}
//                   handleEdit={handleEdit}
//                   handleDelete={handleDelete}
//                   editingCommentId={editingCommentId}
//                   editText={editText}
//                   setEditText={setEditText}
//                   setEditingCommentId={setEditingCommentId}
//                   handleSaveEdit={handleSaveEdit}
//                   renderAvatar={renderAvatar}
//                   handleReply={handleReply}
//                   handleLike={handleLike}
//                   handleDislike={handleDislike}
//                 />
//               ))
//             )}
//           </div>
//         )}

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
//------------------------------------------------------------------------------------

// import React, { useState, useRef, useEffect } from 'react';
// import { useSelector } from 'react-redux';
// import Comment from './Comment';
// import { IoCloseOutline } from 'react-icons/io5';
// import { chatService } from '../../service/chat.service';

// const Chatbox = ({ videoId, onClose }) => {
//   const [comments, setComments] = useState([]);
//   const [newComment, setNewComment] = useState('');
//   const [showCommentInput, setShowCommentInput] = useState(false);
//   const [editingCommentId, setEditingCommentId] = useState(null);
//   const [editText, setEditText] = useState('');
//   const [isLoading, setIsLoading] = useState(true);
//   const textareaRef = useRef(null);
//   const isDarkMode = useSelector((state) => state.theme.isDarkMode);

//   const user = JSON.parse(localStorage.getItem("user"));
//   const isLoggedIn = !!user;

//   // Initialize socket and load comments
//   useEffect(() => {
//     const socket = chatService.connectSocket();
    
//     const loadComments = async () => {
//       try {
//         const loadedComments = await chatService.getCommentsByVideo(videoId);
//         setComments(loadedComments);
//         setIsLoading(false);
//       } catch (error) {
//         console.error('Failed to load comments', error);
//         setIsLoading(false);
//       }
//     };

//     loadComments();

//     // Subscribe to real-time comments
//     const handleNewComment = (comment) => {
//       setComments(prev => {
//         if (comment.parentId) {
//           // Handle replies
//           return prev.map(c => {
//             if (c.id === comment.parentId) {
//               return { ...c, replies: [...(c.replies || []), comment] };
//             }
//             // Check replies of replies
//             if (c.replies?.length) {
//               const updatedReplies = c.replies.map(reply => {
//                 if (reply.id === comment.parentId) {
//                   return { ...reply, replies: [...(reply.replies || []), comment] };
//                 }
//                 return reply;
//               });
//               return { ...c, replies: updatedReplies };
//             }
//             return c;
//           });
//         } else {
//           // Handle new top-level comments
//           return [comment, ...prev];
//         }
//       });
//     };

//     chatService.subscribeToComments(videoId, handleNewComment);

//     return () => {
//       chatService.unsubscribeFromComments(videoId);
//       // Don't disconnect socket here as it might be used by other components
//     };
//   }, [videoId]);

//   const handleReply = async (parentId, replyText) => {
//     if (!replyText.trim() || !isLoggedIn) return;
    
//     try {
//       const reply = await chatService.createComment(videoId, replyText, parentId);
//       setComments(prevComments => 
//         prevComments.map(comment => {
//           if (comment.id === parentId) {
//             return {
//               ...comment,
//               replies: [...(comment.replies || []), reply]
//             };
//           }
//           return comment;
//         })
//       );
//     } catch (error) {
//       console.error('Failed to post reply', error);
//     }
//   };

//   const handleAddComment = async () => {
//     if (!newComment.trim() || !isLoggedIn) return;
    
//     try {
//       const comment = await chatService.createComment(videoId, newComment);
//       setComments(prev => [comment, ...prev]);
//       setNewComment('');
//       setShowCommentInput(false);
//     } catch (error) {
//       console.error('Failed to post comment', error);
//     }
//   };

//   const calculateTimeAgo = (timestamp) => {
//     if (!timestamp) return 'Just now';
//     const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
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
//           time: calculateTimeAgo(comment.createdAt || comment.timestamp)
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
//       // You might want to redirect to login here
//       alert('Please log in to comment');
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
//     try {
//       await chatService.updateComment(id, editText);
//       setComments(comments =>
//         comments.map(comment =>
//           comment.id === id ? { ...comment, text: editText } : comment
//         )
//       );
//       setEditingCommentId(null);
//       setEditText('');
//     } catch (error) {
//       console.error('Failed to update comment', error);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await chatService.deleteComment(id);
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
//       console.error('Failed to delete comment', error);
//     }
//   };

//   const handleLike = async (commentId) => {
//     try {
//       await chatService.likeComment(commentId);
//       // Update local state to reflect the like
//       setComments(prev => 
//         prev.map(comment => 
//           comment.id === commentId 
//             ? { ...comment, likes: (comment.likes || 0) + 1 } 
//             : comment
//         )
//       );
//     } catch (error) {
//       console.error('Failed to like comment', error);
//     }
//   };

//   const handleDislike = async (commentId) => {
//     try {
//       await chatService.dislikeComment(commentId);
//       // Update local state to reflect the dislike
//       setComments(prev => 
//         prev.map(comment => 
//           comment.id === commentId 
//             ? { ...comment, dislikes: (comment.dislikes || 0) + 1 } 
//             : comment
//         )
//       );
//     } catch (error) {
//       console.error('Failed to dislike comment', error);
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
//         <div className="flex-1 mb-4 space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thumb-rounded-full dark:scrollbar-thumb-gray-600">
//           {isLoading ? (
//             <p className="text-gray-500 text-center mt-10">Loading comments...</p>
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
//                 editingCommentId={editingCommentId}
//                 editText={editText}
//                 setEditText={setEditText}
//                 setEditingCommentId={setEditingCommentId}
//                 handleSaveEdit={handleSaveEdit}
//                 renderAvatar={renderAvatar}
//                 handleReply={handleReply}
//                 handleLike={handleLike}
//                 handleDislike={handleDislike}
//                 isLoggedIn={isLoggedIn}
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
//---------------------------------------------

import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { chatService } from '../../service/chat.service';
import Comment from './Comment';
import { IoCloseOutline } from "react-icons/io5";


const Chatbox = ({ videoId,onClose }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState('');
  const [error, setError] = useState(null);
  const textareaRef = useRef(null);
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  const user = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = !!user;

  // Load comments when component mounts or videoId changes
  useEffect(() => {
    const loadComments = async () => {
      try {
        const data = await chatService.getCommentsByVideo(videoId);
        setComments(data.comments || []);
        setError(null);
      } catch (err) {
        console.error('Failed to load comments:', err);
        setError('Failed to load comments. Please try again.');
        // Fallback to localStorage if API fails
        try {
          const savedComments = localStorage.getItem(`chatbox-comments-${videoId}`);
          if (savedComments) setComments(JSON.parse(savedComments));
        } catch (e) {
          console.error('Failed to load local comments:', e);
        }
      }
    };

    if (videoId) loadComments();
  }, [videoId]);

  // Save comments to localStorage as fallback
  useEffect(() => {
    if (videoId && comments.length > 0) {
      try {
        localStorage.setItem(`chatbox-comments-${videoId}`, JSON.stringify(comments));
      } catch (error) {
        console.error('Failed to save comments locally', error);
      }
    }
  }, [comments, videoId]);

  const calculateTimeAgo = (timestamp) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 10) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min${minutes === 1 ? '' : 's'} ago`;
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

  const handleReply = async (parentId, replyText) => {
    if (!replyText.trim() || !isLoggedIn) return;
    
    try {
      const newReply = await chatService.createComment(videoId, replyText, parentId);
      newReply.time = 'Just now';
      newReply.timestamp = Date.now();
      
      setComments(prevComments => {
        const addReplyToComment = (comments) => {
          return comments.map(comment => {
            if (comment.id === parentId) {
              return {
                ...comment,
                replies: [...(comment.replies || []), newReply]
              };
            }
            if (comment.replies?.length) {
              return {
                ...comment,
                replies: addReplyToComment(comment.replies)
              };
            }
            return comment;
          });
        };
        
        return addReplyToComment(prevComments);
      });
    } catch (err) {
      console.error('Failed to post reply:', err);
      // Fallback to local state if API fails
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
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !isLoggedIn) return;
    
    try {
      const comment = await chatService.createComment(videoId, newComment);
      comment.time = 'Just now';
      comment.timestamp = Date.now();
      setComments([comment, ...comments]);
      setNewComment('');
      setShowCommentInput(false);
    } catch (err) {
      console.error('Failed to post comment:', err);
      // Fallback to local state if API fails
      const localComment = {
        id: Date.now(),
        author: user?.username || 'You',
        text: newComment,
        likes: 0,
        dislikes: 0,
        time: 'Just now',
        timestamp: Date.now(),
        replies: []
      };
      setComments([localComment, ...comments]);
      setNewComment('');
      setShowCommentInput(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  const toggleCommentInput = () => {
    if (!isLoggedIn) {
      alert('Please log in to comment');
      return;
    }
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
      await chatService.updateComment(id, editText);
      setComments(comments =>
        comments.map(comment =>
          comment.id === id ? { ...comment, text: editText } : comment
        )
      );
      setEditingCommentId(null);
      setEditText('');
    } catch (err) {
      console.error('Failed to update comment:', err);
      // Fallback to local state if API fails
      setComments(comments =>
        comments.map(comment =>
          comment.id === id ? { ...comment, text: editText } : comment
        )
      );
      setEditingCommentId(null);
      setEditText('');
    }
  };

  const handleDelete = async (id) => {
    try {
      await chatService.deleteComment(id);
      setComments(prevComments =>
        prevComments.filter(comment => comment.id !== id)
      );
    } catch (err) {
      console.error('Failed to delete comment:', err);
      // Fallback to local state if API fails
      setComments(prevComments =>
        prevComments.filter(comment => comment.id !== id)
      );
    }
  };

  const handleLike = async (commentId) => {
    if (!isLoggedIn) {
      alert('Please log in to like comments');
      return;
    }
    try {
      await chatService.likeComment(commentId);
      setComments(prevComments =>
        prevComments.map(comment => {
          if (comment.id === commentId) {
            return { ...comment, likes: comment.likes + 1 };
          }
          return comment;
        })
      );
    } catch (err) {
      console.error('Failed to like comment:', err);
    }
  };

  const handleDislike = async (commentId) => {
    if (!isLoggedIn) {
      alert('Please log in to dislike comments');
      return;
    }
    try {
      await chatService.dislikeComment(commentId);
      setComments(prevComments =>
        prevComments.map(comment => {
          if (comment.id === commentId) {
            return { ...comment, dislikes: comment.dislikes + 1 };
          }
          return comment;
        })
      );
    } catch (err) {
      console.error('Failed to dislike comment:', err);
    }
  };

  const renderAvatar = () => {
    if (!isLoggedIn) return <span className="text-sm">?</span>;
    if (user.avatar) return <p>{user.avatar}</p>;
    const initials = user.username
      ? user.username.slice(0, 2).toUpperCase()
      : "US";
    return <span className="text-sm">{initials}</span>;
  };

  return (
    <section className={`h-[85vh] w-[400px] rounded-lg shadow-md overflow-hidden bg-gray-100 ${isDarkMode && "dark:bg-[#121212e8] border-2"}`}>
      <div className="p-4 h-full flex flex-col">
        <div className='flex items-center justify-between mb-2'>
          <h2 className="text-xl font-bold">Comments ({comments.length})</h2>
          <button 
            onClick={onClose}
            className="flex items-center space-x-1 text-gray-500 hover:text-gray-700"
          >
            <IoCloseOutline className='h-8 w-8'/>  
          </button>
        </div>
        <hr className={`bg-black w-full h1 mb-4 ${isDarkMode && "dark:bg-[#121212e8]"}`} />
        
        {error ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
            <p className="text-red-500 mb-2">{error}</p>
            <p className="text-sm text-gray-500">Showing locally saved comments</p>
          </div>
        ) : (
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
                  handleLike={handleLike}
                  handleDislike={handleDislike}
                />
              ))
            )}
          </div>
        )}

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