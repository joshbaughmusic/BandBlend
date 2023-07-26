import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as ArrowUpturnRight } from "../../images/svg/arrow_upturn_right.svg"
import { ReactComponent as ArrowUpturnLeft } from "../../images/svg/arrow_upturn_left.svg"
import "./Comment.css"

export const Comment = ({ fullCommentObj, posterId, posterName, posterPicture, posterProfileId, commentId, commentBody, commentDate, commentName, commentPicture, commentProfileId, commentUserId, commentKey }) => {

    
    const localBbUser = localStorage.getItem("bb_user")
    const bBUserObject = JSON.parse(localBbUser)
                        

    const navigate = useNavigate()

    //function to convert timestamp

    const convertTimestamp = timestamp => {
        const messageDateFormatted = new Date(parseInt(timestamp));

        const options = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true // To display time in 12-hour format with AM/PM
        };

        const formattedDate = new Intl.DateTimeFormat('en-US', options).format(messageDateFormatted);

        return formattedDate;
    };


    return (
        <>
            <div className="container container_comment_card" key={commentKey}>
                <h5 className="comment_date">{convertTimestamp(commentDate)}</h5>
                <div className="container container_comment_heading">
                    <ArrowUpturnLeft className="icon icon_comment icon_comment_arrowup"/>
                    <img src={commentPicture} alt="" className="img img_commentor" onClick={() => {
                        navigate(`/profiles/${commentProfileId}`)
                    }} />

                    {
                        // check to see if you're looking at your own profile and change up to You commented instead of so and so commented

                        fullCommentObj?.userObj.id === bBUserObject.id
                        
                        ?

                        <h4 className="heading heading_comment_name"><Link to={`/profiles/${commentProfileId}`}>You</Link> commented:</h4>
                        
                        :
                        
                        <h4 className="heading heading_comment_name"><Link to={`/profiles/${commentProfileId}`}>{commentName}</Link> commented:</h4>
                    }
                </div>
                <div className="container container_comment_body">
                    <p className="text_comment_body">{commentBody}</p>
                </div>
            </div>
        </>
    )
}

