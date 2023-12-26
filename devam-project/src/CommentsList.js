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
    // Fetch comments logic remains the same
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
    // Fetch child comments logic remains the same
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
    // Add the comment logic remains the same
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


  function handleLike(commentId) {
    // Placeholder for handling like functionality
    console.log(`Liked comment ${commentId}`);
  }
  
  function handleCollapseReplies(commentId) {
    // Placeholder for handling collapse replies functionality
    console.log(`Collapse replies for comment ${commentId}`);
  }

  return (
    <div className="commentsListClass">
      <p>Posted comments:</p>
      {comments.map((comment) => (
        <div key={comment.c_id} className={`comment-item indent-${comment.indentLevel}`}>
          <div className="comment-header">
            <span className="comment-username">{comment.createdBy}</span>
            <span className="comment-date">{comment.createdAt}</span>
          </div>
          <div className="comment-content">
            <p>{comment.comment}</p>
          </div>
          <div className="comment-footer">
            {/* Like button logic here */}
            <button onClick={() => handleLike(comment.c_id)}>
              {comment.likedByMe ? 'Unlike' : 'Like'}
            </button>
            <button onClick={() => handleReply(comment.c_id)}>
              Reply
            </button>
          </div>
          {comment.childComments && comment.childComments.length > 0 && (
            <div className={`nested-comments-stack ${comment.areChildrenHidden ? "hide" : ""}`}>
              <button
                className="collapse-line"
                aria-label="Hide Replies"
                onClick={() => handleCollapseReplies(comment.c_id)}
              />
              <div className="nested-comments">
                <CommentList comments={comment.childComments} />
              </div>
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
