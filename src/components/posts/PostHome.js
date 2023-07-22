import { Link, useNavigate } from "react-router-dom"
import "./Post.css"

//create post module that will be used to render post html from other modules like OtherProfile, MyProfile, and Homepage.

export const PostHome = ({ userName, profileId, userPicture, postBody, postDate, postKey}) => {

    const navigate = useNavigate()

    //format post date

    const postDateFormated = new Date(parseInt(postDate)).getMonth() + "/" + new Date(parseInt(postDate)).getDate() + "/"+ new Date(parseInt(postDate)).getFullYear()


    return <>
        <li key={postKey} className="post_list_item">
        <Link to={`/profiles/${profileId}`}><img className="img img_post_picture" src={userPicture} /></Link>
            <h4 className="heading heading_post_name">{userName}</h4>
            <p className="text text_post_date">{postDateFormated}</p>
            <p className="text text_post_body">{postBody}</p>
        </li>
    </>
    
}