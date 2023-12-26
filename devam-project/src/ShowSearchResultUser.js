import { useParams, Link } from "react-router-dom";

function ShowSearchResultUser()
{
    const { keyword, currentUsername, resultUsername } = useParams();
    return(
        <>
            <h3>Showing results for: <br />{keyword}: {resultUsername}</h3>
            <br />
            <Link to={`/getChannels/${currentUsername}`}>Channels</Link>
        </>
    )
}

export default ShowSearchResultUser;