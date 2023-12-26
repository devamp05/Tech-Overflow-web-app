// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import './CommentList.css';

// function CommentList() {
//   const [comments, setComments] = useState([]);
//   const [replyingTo, setReplyingTo] = useState(null); // Track the comment being replied to
//   const [newComment, setNewComment] = useState(''); // Track the content of the new comment
//   const { username, postId } = useParams();

//   useEffect(() => {
//     // Fetch comments initially
//     getComments();
//   },[]);

//   function getComments() {
//     fetch(`http://localhost:8080/getComments?postId=${postId}`, {
//       method: 'GET',
//       headers: {
//         'Content-type': 'application/x-www-form-urlencoded',
//       },
//     })
//       .then((response) => response.json())
//       .then((response) => setComments(response))
//       .catch((error) => console.error(error));
//   }

//   // function fetchChildComments(commentId, indentLevel = 1) {
//   //   fetch(`http://localhost:8080/getChildComments?parentId=${commentId}`, {
//   //     method: 'GET',
//   //     headers: {
//   //       'Content-type': 'application/x-www-form-urlencoded',
//   //     },
//   //   })
//   //     .then((response) => response.json())
//   //     .then((childComments) => {
//   //       // Recursively fetch and display child comments
//   //       childComments.forEach((childComment) => {
//   //         fetchChildComments(childComment.id, indentLevel + 1); // Increase the indent level for each level of nesting
//   //       });
//   //       setComments([...comments, { ...childComments[0], indentLevel }]);
//   //     })
//   //     .catch((error) => console.error(error));
//   // }

//   function fetchChildComments(commentId, indentLevel = 1) {
//     fetch(`http://localhost:8080/getChildComments?parentId=${commentId}`, {
//       method: 'GET',
//       headers: {
//         'Content-type': 'application/x-www-form-urlencoded',
//       },
//     })
//       .then((response) => response.json())
//       .then((childComments) => {
//         // Recursively fetch and display child comments
//         childComments.forEach((childComment) => {
//           if(childComment.number_of_child_comments > 0)
//           {
//             fetchChildComments(childComment.c_id, indentLevel + 1); // Increase the indent level for each level of nesting
//           }
//         });
  
//         // Map the child comments to include the indent level
//         const childCommentsWithIndent = childComments.map((childComment) => ({
//           ...childComment,
//           indentLevel,
//         }));
  
//         // Update the state with the new child comments
//         setComments((prevComments) => [...prevComments, ...childCommentsWithIndent]);
//       })
//       .catch((error) => console.error(error));
//   }
  
  

//   function handleReply(commentId) {
//     // Set the comment being replied to and clear the new comment input
//     setReplyingTo(commentId);
//     setNewComment('');
//   }

//   function handleCancelReply() {
//     // Clear the comment being replied to
//     setReplyingTo(null);
//   }

//   function handlePostReply(commentId) {
//     console.log(`Post reply to comment ${commentId}: ${newComment}`);

//     // Add the comment in the database
//     fetch('http://localhost:8080/addChildComment', {
//       method: 'POST',
//       body: new URLSearchParams({
//         username: username,
//         comment: newComment,
//         parentId: commentId
//       }),
//       headers: {
//         'Content-type': 'application/x-www-form-urlencoded',
//       }
//     }).then((response) => response)
//     .then((data)=> console.log(data))
//     .catch(error => console.log(error));

//     // Clear the comment being replied to and reset the new comment input
//     setReplyingTo(null);
//     setNewComment('');
//   }

//   return (
//     <div className="commentsListClass">
//       <p>Posted comments:</p>
//       {comments.map((comment) => (
//         <div key={comment.id} className={`comment-item indent-${comment.indentLevel}`}>
//           <div className="comment-content">
//             <p>
//               <span className="comment-username">{comment.createdBy}:</span> {comment.comment}
//             </p>
//           </div>
//           <div className="reply-button-container">
//             <button className="reply-button" onClick={() => handleReply(comment.c_id)}>
//               Reply <i className="fa fa-reply"></i>
//             </button>
//           </div>
//           {comment.number_of_child_comments}
//           {comment.number_of_child_comments > 0 && fetchChildComments(comment.c_id, comment.indentLevel)}
//           {replyingTo === comment.c_id && (
//             <div className="reply-input-container">
//               <input
//                 type="text"
//                 placeholder="Type your reply..."
//                 value={newComment}
//                 onChange={(e) => setNewComment(e.target.value)}
//               />
//               <button className="post-reply-button" onClick={() => handlePostReply(comment.c_id)}>
//                 Post Reply
//               </button>
//               <button className="cancel-reply-button" onClick={handleCancelReply}>
//                 Cancel
//               </button>
//             </div>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default CommentList;



// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import './CommentList.css';

// function CommentList() {
//   const [comments, setComments] = useState([]);
//   const [replyingTo, setReplyingTo] = useState(null);
//   const [newComment, setNewComment] = useState('');
//   const { username, postId } = useParams();

//   useEffect(() => {
//     // Fetch comments initially
//     getComments();
//   }, []);

//   useEffect(() => {
//     // Fetch child comments when comments state changes
//     fetchChildComments();
//   }, [comments]);

//   function getComments() {
//     fetch(`http://localhost:8080/getComments?postId=${postId}`, {
//       method: 'GET',
//       headers: {
//         'Content-type': 'application/x-www-form-urlencoded',
//       },
//     })
//       .then((response) => response.json())
//       .then((response) => setComments(response))
//       .catch((error) => console.error(error));
//   }

//   function fetchChildComments() {
//     // Iterate through comments and fetch child comments
//     comments.forEach((comment) => {
//       if (comment.number_of_child_comments > 0) {
//         fetch(`http://localhost:8080/getChildComments?parentId=${comment.c_id}`, {
//           method: 'GET',
//           headers: {
//             'Content-type': 'application/x-www-form-urlencoded',
//           },
//         })
//           .then((response) => response.json())
//           .then((childComments) => {
//             const childCommentsWithIndent = childComments.map((childComment) => ({
//               ...childComment,
//               indentLevel: comment.indentLevel + 1,
//             }));

//             // Update the state with the new child comments
//             setComments((prevComments) => [...prevComments, ...childCommentsWithIndent]);
//           })
//           .catch((error) => console.error(error));
//       }
//     });
//   }

//   function handleReply(commentId) {
//     setReplyingTo(commentId);
//     setNewComment('');
//   }

//   function handleCancelReply() {
//     setReplyingTo(null);
//   }

//   function handlePostReply(commentId) {
//     console.log(`Post reply to comment ${commentId}: ${newComment}`);

//     fetch('http://localhost:8080/addChildComment', {
//       method: 'POST',
//       body: new URLSearchParams({
//         username: username,
//         comment: newComment,
//         parentId: commentId,
//       }),
//       headers: {
//         'Content-type': 'application/x-www-form-urlencoded',
//       },
//     })
//       .then((response) => response)
//       .then((data) => console.log(data))
//       .catch((error) => console.log(error));

//     setReplyingTo(null);
//     setNewComment('');
//   }

//   return (
//     <div className="commentsListClass">
//       <p>Posted comments:</p>
//       {comments.map((comment) => (
//         <div key={comment.id} className={`comment-item indent-${comment.indentLevel}`}>
//           <div className="comment-content">
//             <p>
//               <span className="comment-username">{comment.createdBy}:</span> {comment.comment}
//             </p>
//           </div>
//           <div className="reply-button-container">
//             <button className="reply-button" onClick={() => handleReply(comment.c_id)}>
//               Reply <i className="fa fa-reply"></i>
//             </button>
//           </div>
//           {comment.number_of_child_comments > 0 && fetchChildComments(comment.c_id, comment.indentLevel)}
//           {replyingTo === comment.c_id && (
//             <div className="reply-input-container">
//               <input
//                 type="text"
//                 placeholder="Type your reply..."
//                 value={newComment}
//                 onChange={(e) => setNewComment(e.target.value)}
//               />
//               <button className="post-reply-button" onClick={() => handlePostReply(comment.c_id)}>
//                 Post Reply
//               </button>
//               <button className="cancel-reply-button" onClick={handleCancelReply}>
//                 Cancel
//               </button>
//             </div>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// }

// export default CommentList;



import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './CommentList.css';

function CommentList() {
  const [comments, setComments] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);
  const [newComment, setNewComment] = useState('');
  const { username, postId } = useParams();

  useEffect(() => {
    // Fetch comments initially
    getComments();
  }, []);

  useEffect(() => {
    // Fetch child comments when comments state changes
    fetchChildComments();
  }, [comments]);

  function getComments() {
    fetch(`http://localhost:8080/getComments?postId=${postId}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => response.json())
      .then((response) => setComments(response))
      .catch((error) => console.error(error));
  }

  function fetchChildComments() {
    comments.forEach((comment) => {
      if (comment.number_of_child_comments > 0 && !comment.childCommentsFetched) {
        fetch(`http://localhost:8080/getChildComments?parentId=${comment.c_id}`, {
          method: 'GET',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded',
          },
        })
          .then((response) => response.json())
          .then((childComments) => {
            const childCommentsWithIndent = childComments.map((childComment) => ({
              ...childComment,
              indentLevel: comment.indentLevel + 1,
            }));

            // Update the state with the new child comments
            setComments((prevComments) =>
              prevComments.map((prevComment) =>
                prevComment.c_id === comment.c_id
                  ? { ...prevComment, childCommentsFetched: true, childComments: childCommentsWithIndent }
                  : prevComment
              )
            );
          })
          .catch((error) => console.error(error));
      }
    });
  }

  function handleReply(commentId) {
    setReplyingTo(commentId);
    setNewComment('');
  }

  function handleCancelReply() {
    setReplyingTo(null);
  }

  function handlePostReply(commentId) {
    console.log(`Post reply to comment ${commentId}: ${newComment}`);

    fetch('http://localhost:8080/addChildComment', {
      method: 'POST',
      body: new URLSearchParams({
        username: username,
        comment: newComment,
        parentId: commentId,
      }),
      headers: {
        'Content-type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => response)
      .then((data) => console.log(data))
      .catch((error) => console.log(error));

    setReplyingTo(null);
    setNewComment('');
  }

  return (
    <div className="commentsListClass">
      <p>Posted comments:</p>
      {comments.map((comment) => (
        <div key={comment.id} className={`comment-item indent-${comment.indentLevel}`}>
          <div className="comment-content">
            <p>
              <span className="comment-username">{comment.createdBy}:</span> {comment.comment}
            </p>
          </div>
          <div className="reply-button-container">
            <button className="reply-button" onClick={() => handleReply(comment.c_id)}>
              Reply <i className="fa fa-reply"></i>
            </button>
          </div>
          {comment.number_of_child_comments > 0 && comment.childCommentsFetched && (
            // Render child comments here
            <div>
              {comment.childComments.map((childComment) => (
                <div key={childComment.id} className={`comment-item indent-${childComment.indentLevel}`}>
                  {/* Render child comment content here */}
                </div>
              ))}
            </div>
          )}
          {replyingTo === comment.c_id && (
            <div className="reply-input-container">
              <input
                type="text"
                placeholder="Type your reply..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button className="post-reply-button" onClick={() => handlePostReply(comment.c_id)}>
                Post Reply
              </button>
              <button className="cancel-reply-button" onClick={handleCancelReply}>
                Cancel
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default CommentList;
