  // Helper to recursively add a reply to the correct comment/reply
  // const addReplyRecursive = (commentsArr, parentId, replyObj) => {
  //   return commentsArr.map(comment => {
  //     if (comment.id === parentId) {
  //       return {
  //         ...comment,
  //         replies: comment.replies ? [replyObj, ...comment.replies] : [replyObj]
  //       };
  //     }
  //     if (comment.replies && comment.replies.length > 0) {
  //       return {
  //         ...comment,
  //         replies: addReplyRecursive(comment.replies, parentId, replyObj)
  //       };
  //     }
  //     return comment;
  //   });
  // };
