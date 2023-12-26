import { Link, useParams } from "react-router-dom";
import { useRef } from 'react';

function AddChannel() {

  const { username } = useParams();
  //useRef() to get topic and data
  const name = useRef();
  const description = useRef();

  // Function to send data to the database
  function addChannel()
    {
        fetch('http://localhost:8080/addChannel',
        {
            method: 'POST',
            body: new URLSearchParams({
                username: username,
                name: name.current.value,
                description: description.current.value
            }),
        }).then(response => response)
        .then(data =>
          {
            console.log(data)
          }).then(alert("Channel added Successfully!")).then(name.current.value = "", description.current.value = "")
        .catch(error => console.error(error))
    }
    return (
      <>
        Add Channels from here
        <div className="addChannel">
          <br></br>
          <label htmlFor="name"> Channel Name:</label><br />
          <input type="text" id="name" ref={name} /><br />
          <label htmlFor="description"> Description:</label><br />
          <input type="text" id="description" ref={description} /><br />
          <button onClick={addChannel}>add</button><br />
          <Link to={`/getChannels/${username}`}>Channels</Link>
        </div>
      </>
    );
  }
  
  export default AddChannel;