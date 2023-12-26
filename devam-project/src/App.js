import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Landing from "./Landing";
import AddPosts from './AddPosts.js';
import PostList from './PostList.js'
import Channels from "./Channels.js";
import AddChannel from "./AddChannel.js";
import Comment from "./Comment.js";
import Signup from "./Signup.js";
import Login from "./Login.js";
import Post from "./Post.js";
import SearchResultPostList from "./SearchResultPostList.js";
import ShowSearchResultUser from "./ShowSearchResultUser.js";
import ShowUserPostList from "./ShowUserPostList.js";
import ShowProfile from "./ShowProfile.js";
import AdminAccount from "./adminAccount.js";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  function setAuthenticated()
  {
    setIsAuthenticated(true);
    // alert("reached here");
    // console.log("reached");
  }
  // const [getList, setList] = useState([]);
  // // if(getList.length <1) 
  // function get() 
  // {
  //   fetch('http://localhost:8080/getPosts').then(response => response.json()).then(response => setList(response)).catch(error => console.error(error))
  // };
  return (
    <Routes>
      <Route path="/" element={<Landing setAuthenticated = {setAuthenticated}/>}/>
      <Route path="/login" element = {<Login  setAuthenticated = {setAuthenticated} />} />
      <Route path='/addPost/:username/:channelId' element = {<AddPosts />} />
      <Route path='/getPosts/:username/:channelId' element = {<PostList />} />
      <Route path="/gotoPost/:username/:channelId/:postId" element={<Post />} />
      <Route path="/getChannels/:username" element = {isAuthenticated ? <Channels /> : <Login />} />
      <Route path="/addChannel/:username" element = {<AddChannel />} />
      <Route path="/addComment/:username/:channelId/:postId" element = {<Comment />} />
      <Route path="/showResultPostList/:searchTerm/:username" element = { <SearchResultPostList />} />
      <Route path="/showSearchResultUser/:keyword/:currentUsername/:resultUsername" element= {<ShowSearchResultUser />} />
      <Route path="/showUserPostList/:searchUsername/:username" element= {<ShowUserPostList /> } />
      <Route path="/showProfile/:username" element = {<ShowProfile />} />
      <Route path="/adminAccount/:username" element = {<AdminAccount />} />
      <Route path="/signup" element = {<Signup />} />
      
    </Routes>
  );
}

export default App;
