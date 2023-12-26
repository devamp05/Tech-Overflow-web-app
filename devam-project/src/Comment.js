import React, { useRef } from 'react';
import './Comment.css';

function Comment({ postId, username }) {
  const comment = useRef();

  function addComment() {
    fetch('http://localhost:8080/addComment', {
      method: 'Post',
      body: new URLSearchParams({
        username: username,
        comment: comment.current.value,
        postId: postId,
      }),
      headers: {
        'Content-type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => response)
      .then((data) => {
        console.log(data);
      })
      .then(() => {
        comment.current.value = '';
      })
      .catch((error) => console.error(error));
  }

  return (
    <div className="commentClass">
      <label htmlFor="comment">Add comment:</label>
      <div className="comment-input">
        <input type="text" id="commentId" ref={comment} />
        <button onClick={addComment}>Post</button>
      </div>
    </div>
  );
}

export default Comment;