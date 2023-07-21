import "./Post.css"

//create post module that will be used to render post html from other modules like OtherProfile, MyProfile, and Homepage

export const PostHome = ({ userName, userId, postId, userPicture, postBody, postDate, postKey }) => {

    return <>
        <li id={postId} className="post_list_item">
            <img className="img img_post_picture" src={userPicture} />
            <h4 className="heading heading_post_name">{userName}</h4>
            <p className="text text_post_date">{postDate}</p>
            <p className="text text_post_date">{postBody}</p>
        </li>
    </>
}