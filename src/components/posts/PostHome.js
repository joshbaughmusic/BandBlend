import { Link, useNavigate } from "react-router-dom"
import "./Post.css"

//create post module that will be used to render post html from other modules like OtherProfile, MyProfile, and Homepage.

export const PostHome = ({ userName, profileId, userPicture, postBody, postDate, postKey }) => {

    const navigate = useNavigate()

    //format post date

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



    return <>
        <li key={postKey} className="post_list_item">
            <Link to={`/profiles/${profileId}`}><img className="img img_post_picture" src={userPicture} /></Link>
            <Link to={`/profiles/${profileId}`}><h4 className="heading heading_post_name">{userName}</h4></Link>
            <p className="text text_post_date">{convertTimestamp(postDate)}</p>
            <p className="text text_post_body">{postBody}</p>
        </li>
    </>

}