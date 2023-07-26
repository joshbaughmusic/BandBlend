import { useNavigate } from "react-router-dom"
import "./Post.css"
import { useEffect, useState } from "react"
import { Comment } from "./Comment.js"
import "./PostProfile.css"

//create post module that will be used to render post html from other modules like OtherProfile, MyProfile, and Homepage.

export const PostProfile = ({ userName, userId, postId, userPicture, postBody, postDate, myProfileId, setMyPosts, postKey }) => {

    const localBbUser = localStorage.getItem("bb_user")
    const bBUserObject = JSON.parse(localBbUser)
    const [commentsWithUsers, setCommentsWithUsers] = useState([])

    const navigate = useNavigate()

    //fetch all users and comments and match them up with each other

    //fetch all users with embed profiles

    useEffect(() => {
        fetch(`http://localhost:8088/users?_embed=profiles`)
            .then(res => res.json())
            .then(data => {
                //store in variable

                const usersWithProfiles = data

                //fetch all comments
                fetch(`http://localhost:8088/comments`)
                    .then(res => res.json())
                    .then(data => {
                        //store in variable

                        const rawComments = data

                        //match up all comments with their associated user/profile

                        const matchedCommentsWithUsers = rawComments.map(comment => {
                            const matchedUser = usersWithProfiles.find( user => {
                                return user.id === comment.userId
                            })

                            const combinedCommentUserObj = {
                                commentObj: comment,
                                userObj: matchedUser
                            }

                            return combinedCommentUserObj
                        })

                        //sort matchedCommentsWithUsers by date

                        const sortedMatchedCommentsWithUsers = matchedCommentsWithUsers.sort((a,b) => {
                            return b.commentObj.date - a.commentObj.date
                        })

                        setCommentsWithUsers(matchedCommentsWithUsers)

                    })

            })
    }, [])


    //set a handler function to take care of deleting posts when the button is clicked. Will also update list of posts using props passed down from MyProfile.

    const handleDeletePostClick = e => {
        e.preventDefault()

        const [, postIdToDelete] = e.target.id.split("--")

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

    if (!commentsWithUsers) {
        return null
    }
    //only give edit and delete options on the profile pages and only to owners of that post

    if (userId === bBUserObject.id) {

        return <>
        <div className="container container_post">
            <div key={postKey} id={`post--${postId}`} className="post_list_item">
                <img className="img img_post_picture" src={userPicture} />
                <h4 className="heading heading_post_name">{userName}</h4>
                <p className="text text_post_date">{convertTimestamp(postDate)}</p>
                <p className="text text_post_date">{postBody}</p>
                <button className="btn btn_edit bten_edit_post" onClick={() => { navigate(`/myprofile/edit/post/${postId}`) }}>Edit Post</button>
                <button id={`postDelete--${postId}`} className="btn btn_delete" onClick={handleDeletePostClick}>Delete Post</button>
            </div>
            <div className="container container_comments" id={`comments--${postId}`}>
                {
                    commentsWithUsers.map(comment => {
                        if (parseInt(comment.commentObj.postId) === parseInt(postId)) {
                           return <Comment
                           posterId={userId} 
                           posterName={userName} 
                           posterPicture={userPicture} posterProfileId={myProfileId} 
                           commentId={comment.commentObj.id} commentBody={comment.commentObj.body} commentDate={comment.commentObj.date}
                           commentName={comment.userObj.name} 
                           commentPicture={comment.userObj.profiles[0].picture}
                           commentProfileId={comment.userObj.profiles[0].id}
                           commentUserId={comment.userObj.id}
                           commentKey={`comment--${comment.commentObj.Id}`}
                            />
                        }
                    })
                }
            </div>  
            </div>
        </>
    } else {

        return <>
        <div className="container container_post">
            <div key={postKey} id={`post--${postId}`} className="post_list_item">
                <img className="img img_post_picture" src={userPicture} />
                <h4 className="heading heading_post_name">{userName}</h4>
                <p className="text text_post_date">{convertTimestamp(postDate)}</p>
                <p className="text text_post_body">{postBody}</p>
            </div>
            <div className="container container_comments" id={`comments--${postId}`}>
                {
                    commentsWithUsers.map(comment => {
                        if (parseInt(comment.commentObj.postId) === parseInt(postId)) {
                           return <Comment 
                           fullCommentObj={comment}
                           posterId={userId} 
                           posterName={userName} 
                           posterPicture={userPicture} posterProfileId={myProfileId} 
                           commentId={comment.commentObj.id} commentBody={comment.commentObj.body} commentDate={comment.commentObj.date}
                           commentName={comment.userObj.name} 
                           commentPicture={comment.userObj.profiles[0].picture}
                           commentProfileId={comment.userObj.profiles[0].id}
                           commentKey={`comment--${comment.commentObj.Id}`}
                            />
                        }
                    })
                }
            </div> 
            </div>
        </>
    }
}