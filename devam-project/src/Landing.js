// import { Link } from 'react-router-dom';
import Login from "./Login";
import Search from "./Search";
// import "./Landings.css"

function Landing({ setAuthenticated }) {
  function init()
  {
    // call init from here once
    fetch('http://localhost:8080/init', {
      method: 'GET'
    })
      .then(response => response.json())
      .then(data => console.log(data)).then(alert("table dropped successfully!"))
      .catch(error => console.error(error))
  }
    // return (
    //   <div className='landings'>
    //     <Link to='/getChannels'>Channels</Link>
    //     <br></br>
    //     <button onClick={init}>Drop Table</button>
    //     <br />
    //     Landings
    //   </div>
    // );
    // return (
    //   <div className='landings'>
    //     <Login setAuthenticated = {setAuthenticated}/>
    //   </div>
    // );

    return (
      <div className='landings'>
        <Login setAuthenticated={setAuthenticated} />
      </div>
    )
  }
  
  export default Landing;