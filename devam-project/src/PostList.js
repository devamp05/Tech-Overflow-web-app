import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import "./PostList.css";

function PostList() {
  const [getList, setList] = useState([]);

  const { username, channelId } = useParams();

  // To call get() only once on mount, use an empty dependency array
  useEffect(() => {
    get();
  });

  function get() {
    fetch(`http://localhost:8080/getPosts?channelId=${channelId}`)
      .then(response => response.json())
      .then(response => setList(response))
      .catch(error => console.error(error));
  }

  // admin account delete posts
  function deletePost(channelId, postId)
  {
    fetch(`http://localhost:8080/deletePost?channelId=${channelId}&postId=${postId}`, {
      method: 'GET',
      headers: {
        "Content-type": "application/x-www-form-urlencoded"
      }
    })
    .then(response => response.json())
    .then(response => get())
    .catch(error => console.error(error));
  }

  return (
    <>
      <h2>All Posts</h2>
      <div className="post-list">
        {getList.map(post => (
          <div key={post.id} className="post-card">
            <h3>{post.topic}</h3>
            <Link to={`/gotoPost/${username}/${channelId}/${post.id}`}>Read More</Link>
            <br />
            {username === 'adminAccount' && (
              <button onClick={() => deletePost(channelId, post.id)} >delete</button>
            )}
          </div>
        ))}
      </div>
      <br />
      <Link to={`/addPost/${username}/${channelId}`}>Add Post</Link>
      <br />
      <Link to={`/getChannels/${username}`}>Channels</Link>
      <br />
      <Link to="/">Landings</Link>
    </>
  );
}

export default PostList;
