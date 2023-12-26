import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PostData from "./PostData";
import PostTopic from "./PostTopic";
import CommentSection from "./CommentSection";
import "./Post.css"

function Post() {
  const { username, channelId, postId } = useParams();
  const [post, setPost] = useState({});
  const [isLiked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [disLiked, setDisLiked] = useState(false);

  useEffect(() => {
    fetchPostDetails();
    fetchLikesCount();
    checkLiked();
    checkDisliked();
  }, []);

  const fetchPostDetails = async () => {
    console.log("fetching posts");
    try {
      const response = await fetch(`http://localhost:8080/getPost?postId=${postId}`);
      const data = await response.json();
      setPost(data[0]); // Assuming the response is an array with one post
    } catch (error) {
      console.error("Error fetching post details:", error);
    }
  };

  const fetchLikesCount = async () => {
    try {
      const response = await fetch(`http://localhost:8080/getLikesPost?postId=${postId}`);
      const data = await response.json();
      setLikesCount(data.likes);
    } catch (error) {
      console.error("Error fetching likes count:", error);
    }
  };

  async function checkLiked()
  {
    const response = await fetch(`http://localhost:8080/checkLiked?postId=${postId}&username=${username}`)

    const data = await response.json();

    if(data.length > 0)
    {
      setLiked(true);
    }
    else
    {
      setLiked(false);
    }
  }


  async function checkDisliked()
  {
    const response = await fetch(`http://localhost:8080/checkDisiked?postId=${postId}&username=${username}`);

    const data = await response.json();

    if(data.length > 0)
    {
      setDisLiked(true);
    }
    else
    {
      setDisLiked(false);
    }
  }

  async function addLike()
  {
    if(!isLiked)
    {
      fetch(`http://localhost:8080/addLikePost`,{
        method: 'POST',
        body:
        new URLSearchParams({
          username: username,
          postId: postId
        }),
        headers:
        {
          'Content-type': 'application/x-www-form-urlencoded',
        }
      }).then(fetchLikesCount).then(changeColorLike())
      .catch(error=> console.log(error));
    }
    else
    {
      fetch(`http://localhost:8080/removeLikePost`,{
        method: 'POST',
        body:
        new URLSearchParams({
          username: username,
          postId: postId
        }),
        headers:
        {
          'Content-type': 'application/x-www-form-urlencoded',
        }
      }).then(fetchLikesCount).then(changeColorLike())
      .catch(error=> console.log(error));
    }
  }

  async function addDislike()
  {
    if(!disLiked)
    {
      fetch(`http://localhost:8080/addDislikePost`,{
        method: 'POST',
        body:
        new URLSearchParams({
          username: username,
          postId: postId
        }),
        headers:
        {
          'Content-type': 'application/x-www-form-urlencoded',
        }
      }).then(fetchLikesCount).then(changeColorDislike())
      .catch(error=> console.log(error));
    }
    else
    {
      fetch(`http://localhost:8080/removeDislikePost`,{
        method: 'POST',
        body:
        new URLSearchParams({
          username: username,
          postId: postId
        }),
        headers:
        {
          'Content-type': 'application/x-www-form-urlencoded',
        }
      }).then(fetchLikesCount).then(changeColorDislike())
      .catch(error=> console.log(error));
    }
  }

  function changeColorLike()
  {
    setLiked(!isLiked);
  }

  function changeColorDislike()
  {
    setDisLiked(!disLiked);
  }

  // like button style
  const likeButtonStyle = {
    width: 0,
    height: 0,
    borderLeft: '15px solid transparent',
    borderRight: '15px solid transparent',
    borderBottom: '30px solid ' + (isLiked ? '#3897f0' : '#555'), // Change color here
  };

  const dislikeButtonStyle = {
    width: 0,
    height: 0,
    borderLeft: '15px solid transparent',
    borderRight: '15px solid transparent',
    borderTop: '30px solid' + (disLiked ? '#3897f0' : '#555'),
  }

return (
    <div className="post-container">
      <div className="post-header">
        <PostTopic topic={post.topic} />
      </div>
      <div className="post-content">
        <PostData data={post.data} />
      </div>
      <div className="post-likes">
        <h1 className="triangle-up" style={likeButtonStyle} onClick={addLike}></h1>
        <p className="like-count">{likesCount}</p>
        <h1 className="triangle-down" style={dislikeButtonStyle} onClick={addDislike}></h1>
      </div>
      <div className="comment-section">
        <CommentSection postId={post.id} username={username} />
      </div>
    </div>
  );
}

export default Post;