
import React, { useState } from 'react';
import { AiFillDislike, AiFillLike } from "react-icons/ai";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { MdEdit, MdDelete } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";

const Comment = ({ 
  comment, 
  isDarkMode, 
  handleEdit, 
  handleDelete, 
  editingCommentId, 
  editText, 
  setEditText, 
  setEditingCommentId,
  handleSaveEdit,
  renderAvatar,
  handleReply
}) => {
  const [showOptions, setShowOptions] = useState(null);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [showReplies, setShowReplies] = useState(true);

  const toggleOptions = (id) => {
    setShowOptions(showOptions === id ? null : id);
  };
  const handleReplySubmit = () => {
    if (replyText.trim()) {
      handleReply(comment.id, replyText);
      setReplyText("");
      setShowReplyInput(false);
    }
  };
  
  const replyCount = comment.replies ? comment.replies.length : 0;
  const hasReplies = replyCount > 0;

  return (
    <>
      <div className="flex items-start space-x-2 pr-2">
        <div className="w-8 h-8 bg-red-600 text-white flex items-center justify-center rounded-full">
          {renderAvatar()}
        </div>
        <div className={`flex-1 p-2 rounded-lg relative ${isDarkMode && "dark:bg-[#121212e8]"}`}>
          <div className='flex justify-between'>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-sm">
                @{comment.author.toLowerCase()}
              </span>
              <span className="text-gray-500 text-xs">{comment.time}</span>
            </div>
            <div className="relative">
              <button 
                onClick={() => toggleOptions(comment.id)}
                className="p-1 rounded-full hover:bg-[#b3b0b034]"
              >
                <HiOutlineDotsHorizontal />
              </button>
              
              {showOptions === comment.id && (
                <div className={`absolute right-0 top-8 w-32 rounded-md shadow-lg py-1 z-10 ${isDarkMode ? 'dark:bg-[#303030]' : 'bg-white'}`}>
                  <button
                    onClick={() => {
                      handleEdit(comment);
                      setShowOptions(null);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-[#dbe1e330]"
                  >
                    <MdEdit className="mr-2" /> Edit
                  </button>
                  <button
                    onClick={() => {
                      handleDelete(comment.id);
                      setShowOptions(null);
                    }}
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
                <button 
                  className="text-gray-500 hover:text-gray-700 text-xs"
                  onClick={() => setShowReplyInput(!showReplyInput)}
                >
                  Reply
                </button>
                
              </div>

              {hasReplies && (
                  <button 
                    className="text-gray-500 hover:bg-blue-200 p-2 mt-2 rounded-full text-xs flex items-center"//hover:text-gray-700 
                    onClick={() => setShowReplies(!showReplies)}
                  >
                    {replyCount} {replyCount === 1 ? 'Reply' : 'Replies'} <IoIosArrowDown className={`ml-1 transition-transform ${showReplies ? 'rotate-180' : ''}`} />
                  </button>
                )}
              {showReplyInput && (
                <div className="mt-2">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="w-full p-2 border rounded resize-none focus:outline-none"
                    rows="2"
                    placeholder="Write a reply..."
                  />
                  <div className="flex justify-end space-x-2 mt-1">
                    <button
                      onClick={() => setShowReplyInput(false)}
                      className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded-full"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleReplySubmit}
                      disabled={!replyText.trim()}
                      className={`px-2 py-1 block text-xs rounded-full ${replyText.trim() ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                    >
                      Reply
                    </button>
                  </div>
                </div>
              )}
              {/* Render replies recursively */}
              {hasReplies && showReplies && (
                <div className="ml-8 mt-2 space-y-2">
                  {comment.replies.map((reply) => (
                    <Comment
                      key={reply.id}
                      comment={reply}
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
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Comment;