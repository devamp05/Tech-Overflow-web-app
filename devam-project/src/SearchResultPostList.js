import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function SearchResultPostList() 
{
  const { searchTerm, username } = useParams();
  const [postList, setPostList] = useState([]);

  useEffect(() => {
    const getPosts = async () => {
      try {
        // while(!searchTerm){}; did this because it was having searchTerm undefined so I thought it was due to it not getting loaded but then realised there was a typo in the Route
        const response = await fetch(
          `http://localhost:8080/searchContent?searchTerm=${searchTerm}`
        );
        const data = await response.json();
        setPostList(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    getPosts();
  }, [searchTerm]);

  return (
    <>
      <h2>Search result posts: </h2>
      <div className="post-list">
        {postList.map((post) => (
          <div key={post.id} className="post-card">
            <h3>{post.topic}</h3>
            <Link to={`/gotoPost/${username}/${post.channel_id}/${post.id}`}>
              Read More
            </Link>
          </div>
        ))}
      </div>
      <br />
      <Link to={`/getChannels/${username}`}>Channels</Link>
      <br />
    </>
  );
}

export default SearchResultPostList;
