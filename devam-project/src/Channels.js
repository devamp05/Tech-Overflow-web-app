import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import "./Channels.css"; // Make sure to import your CSS file
import Search from "./Search";

function Channels() {
  const { username } = useParams();
  const [getList, setList] = useState([]);

  // Use useEffect with an empty dependency array to call getChannels only once on mount
  useEffect(() => {
    getChannels();
  });

  function getChannels() {
    fetch('http://localhost:8080/getChannels', {
      method: 'GET',
      headers: {
        "Content-type": "application/x-www-form-urlencoded"
      }
    })
    .then(response => response.json())
    .then(response => setList(response))
    .catch(error => console.error(error));
  }

  // admin account delete channel
  function deleteChannel(channelId)
  {
    fetch(`http://localhost:8080/deleteChannel?channelId=${channelId}`, {
      method: 'GET',
      headers: {
        "Content-type": "application/x-www-form-urlencoded"
      }
    })
    .then(response => response.json())
    .then(response => getChannels())
    .catch(error => console.error(error));
  }

  return (
    <div className="channels">
      <Search username={username}/>
      <div className="channelsListClass">
        {getList.map(channel => (
          <div className="channelCard">
          <Link key={channel.id} to={`/getPosts/${username}/${channel.id}`} >
            <p>{channel.name}</p>
            <p>{channel.description}</p>
            <p>Created by: {channel.createdBy}</p>
          </Link>
          <br />
          {username === 'adminAccount' && (
            <button onClick={() => deleteChannel(channel.id)} >delete</button>
          )}
          </div>
        ))}
      </div>
      <div className="linkContainer">
        <Link className="linkCard" to={`/addChannel/${username}`}>
          Add
        </Link>
      </div>
      <div className="linkContainer">
        <Link className="linkCard" to={`/showProfile/${username}`}>
          See Profile
        </Link>
      </div>
      {username === 'adminAccount' && (
          <div className="linkContainer">
            <Link className="linkCard" to={`/adminAccount/${username}`}>Admin Dashboard</Link>
          </div>
        )}
      <div className="linkContainer">
        <Link className="linkCard" to="/">
          Landings
        </Link>
      </div>
    </div>
  );
  
  
}

export default Channels;
