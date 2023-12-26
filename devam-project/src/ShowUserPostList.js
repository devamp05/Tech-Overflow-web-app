import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function ShowUserPostList()
{
    
    const { searchUsername, username } = useParams();
    const [postList, setPostList] = useState([]);
    
    useEffect(() => {
        const getPosts = async () => {
        try {
            const response = await fetch(
            `http://localhost:8080/contentByUser?searchUsername=${searchUsername}`
            );
            const data = await response.json();
            setPostList(data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
        };
    
        getPosts();
    }, [searchUsername]);
    
    return (
        <>
        <h2>Search result posts for user: {searchUsername}: </h2>
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

export default ShowUserPostList;