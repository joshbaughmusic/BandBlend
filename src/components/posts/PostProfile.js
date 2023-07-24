import { useNavigate } from "react-router-dom"
import "./Post.css"

//create post module that will be used to render post html from other modules like OtherProfile, MyProfile, and Homepage.

export const PostProfile = ({ userName, userId, postId, userPicture, postBody, postDate, myProfileId, setMyPosts, postKey}) => {

    const localBbUser = localStorage.getItem("bb_user")
    const bBUserObject = JSON.parse(localBbUser)

    const navigate = useNavigate()

    //set a handler function to take care of deleting posts when the button is clicked. Will also update list of posts using props passed down from MyProfile.

    const handleDeletePostClick = e => {
        e.preventDefault()

        const [,postIdToDelete] = e.target.id.split("--")

        return fetch(`http://localhost:8088/posts/${postIdToDelete}`, {
            method: "DELETE",
            })
            .then(() => {
                fetch(`http://localhost:8088/posts?profileId=${myProfileId}`)
                    .then(res => res.json())
                    .then(data => {
                        setMyPosts(data)
                
                    })
            })
    }

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

    //only give edit and delete options on the profile pages and only to owners of that post

    if (userId === bBUserObject.id) {
    
    return <>
        <li key={postKey} id={`post--${postId}`} className="post_list_item">
            <img className="img img_post_picture" src={userPicture} />
            <h4 className="heading heading_post_name">{userName}</h4>
            <p className="text text_post_date">{convertTimestamp(postDate)}</p>
            <p className="text text_post_date">{postBody}</p>
            <button className="btn btn_edit bten_edit_post" onClick={() => { navigate(`/myprofile/edit/post/${postId}`)}}>Edit Post</button>
            <button id={`postDelete--${postId}`} className="btn btn_delete" onClick={handleDeletePostClick}>Delete Post</button>
        </li>
    </>
    } else {

    return <>
        <li key={postKey} id={`post--${postId}`} className="post_list_item">
            <img className="img img_post_picture" src={userPicture} />
            <h4 className="heading heading_post_name">{userName}</h4>
            <p className="text text_post_date">{convertTimestamp(postDate)}</p>
            <p className="text text_post_body">{postBody}</p>
        </li>
    </>
    }
}