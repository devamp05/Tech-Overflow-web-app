import { Link, useParams } from "react-router-dom";
import { useRef } from 'react';
import "./AddPosts.css"

function AddPosts() {

  const {username, channelId} = useParams();
  //useRef() to get topic and data
  const topic = useRef();
  const data = useRef();

  // Function to send data to the database
  function send()
  {
    // console.log(data.current.value)
    // Get topic and data to put into the database
    // topic.current.value;
    fetch('http://localhost:8080/addPost', {
      method: 'POST',
      body: new URLSearchParams({
        username: username,
        topic: topic.current.value,
        data: data.current.value,
        channelId: channelId
        }).toString(),
      headers: {
        "Content-type": "application/x-www-form-urlencoded"
      }
    })
      .then(response => response)
      .then(data =>
        {
          console.log(data)
        }).then(alert("Post added Successfully!")).then(topic.current.value = "").then(data.current.value = "")
      .catch(error => console.error(error))
  }
    return (
      <>
        Add Posts from here
        <div className="addPost">
          <br></br>
          <label htmlFor="topic"> Topic:</label><br />
          <input type="text" id="topic" ref={topic} /><br />
          <label htmlFor="data"> Data:</label><br />
          <input type="text" id="data" ref={data} /><br />
          <input type="file" accept="image/*" id="data" onChange={()=>alert("image added")} /> <br />
          <button onClick={send}>add post</button><br />
          <Link to={`/getPosts/${username}/${channelId}`}>posts</Link>
          <br></br>
          <Link to='/'>Landings</Link>
        </div>
      </>
    );
  }
  
  export default AddPosts;