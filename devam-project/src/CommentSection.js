import Comment from "./Comment";
import CommentLists from "./CommentsList";

function CommentSection({ postId, username })
{
    return(
        <div className="CommentSectionClass">
            <Comment postId={ postId } username={username}/>
            <CommentLists postId={ postId } />
        </div>
    )
};

export default CommentSection;