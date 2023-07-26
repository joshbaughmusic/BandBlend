import { useNavigate } from "react-router-dom"
import "./Post.css"
import { useEffect, useState } from "react"
import { Comment } from "./Comment.js"
import "./PostProfile.css"
import { NewComment } from "./NewComment.js"
// import { ReactComponent as ThumbLiked } from "../../images/svg/thumb-liked-2.svg"
// import { ReactComponent as ThumbNonLiked } from "../../images/svg/thumb-nonliked.svg"

//create post module that will be used to render post html from other modules like OtherProfile, MyProfile, and Homepage.

export const PostProfile = ({ userName, userId, postId, userPicture, postBody, postDate, myProfileId, setMyPosts, postKey }) => {

    const navigate = useNavigate()
    const localBbUser = localStorage.getItem("bb_user")
    const bBUserObject = JSON.parse(localBbUser)

    //states to store fetches

    const [commentsWithUsers, setCommentsWithUsers] = useState([])
    const [likes, setLikes] = useState([])

    //state to track if current user has already liked the post or not

    const [userLikeObj, setUserLikeObj] = useState([])


    //fetch all users and comments and match them up with each other:
    //fetch all users with embed profiles in a separate function to pass it down to Comment so on deletion it can rerender them

    const getAllComments = () => {
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
                            const matchedUser = usersWithProfiles.find(user => {
                                return user.id === comment.userId
                            })

                            const combinedCommentUserObj = {
                                commentObj: comment,
                                userObj: matchedUser
                            }

                            return combinedCommentUserObj
                        })

                        //sort matchedCommentsWithUsers by date

                        const sortedMatchedCommentsWithUsers = matchedCommentsWithUsers.sort((a, b) => {
                            return a.commentObj.date - b.commentObj.date
                        })

                        setCommentsWithUsers(matchedCommentsWithUsers)

                    })

            })
    }

    //get all likes for the post
    const getAllLikes = () => {
        fetch(`http://localhost:8088/likes?postId=${postId}`)
            .then(res => res.json())
            .then(data => {
                setLikes(data)
            })
    }

    useEffect(() => {
        getAllComments()
    }, [])

    useEffect(() => {
        getAllLikes()
    }, [])


    //use effect to set state of whether or not current user has like the post already or not so the right html can be generated below

    useEffect(() => {
        const searchForUserLike = likes.find(like => {
            return like.userId === bBUserObject.id
            }
        )

        setUserLikeObj(searchForUserLike)

    }, [likes])





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

    const handleOpenNewCommentFormButtonClick = e => {
        const [, postIdToOpenNewCommentFor] = e.target.id.split('--')

        const formToOpen = document.getElementById(`newCommentForm--${postIdToOpenNewCommentFor}`)

        formToOpen.classList.add("show")

        // hide reply button

        const buttonToHide = document.getElementById(`openNewCommentBtn--${postIdToOpenNewCommentFor}`)

        buttonToHide.classList.remove("show")

    }

    //handle the like button being clicked when the user hasn't already liked

    const handlePostNewLikeClick = e => {

        const newLikeObj = {
            userId: bBUserObject.id,
            postId: postId,
            date: Date.now()
        }

        fetch(`http://localhost:8088/likes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newLikeObj)
        })
            .then(() => {
                 //refetch all likes
                 getAllLikes()
            })
    }


    //handle the like button being clicked when the user HAS already liked and wants to unlike

    const handleDeletePreviousLikeClick = e => {

        const [, likeId] = e.target.id.split('--')

        return fetch(`http://localhost:8088/likes/${likeId}`, {
            method: "DELETE",
        })
            .then(() => {
                //refetch all likes
                getAllLikes()
                
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

    if (!commentsWithUsers || !likes) {
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
                    {
                        likes.length

                            ?

                            <p className="text text_post_likecount">{likes.length} likes</p>

                            :

                            <p className="text text_post_likecount">Nobody has liked this yet.</p>
                    }
                    <p className="text text_post_date">{postBody}</p>
                    <button className="btn btn_edit bten_edit_post" onClick={() => { navigate(`/myprofile/edit/post/${postId}`) }}>Edit Post</button>
                    <button id={`postDelete--${postId}`} className="btn btn_delete" onClick={handleDeletePostClick}>Delete Post</button>
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
                                    getAllComments={getAllComments}
                                />
                            }
                        })
                    }
                </div>
                <NewComment postId={postId} getAllComments={getAllComments} />
                <button className="btn btn_post btn_open btn_reply_comment show" id={`openNewCommentBtn--${postId}`} onClick={handleOpenNewCommentFormButtonClick}>Reply</button>
            </div>
        </>
    } else {

        return <>
            <div className="container container_post">
                <div key={postKey} id={`post--${postId}`} className="post_list_item">
                    <img className="img img_post_picture" src={userPicture} />
                    <h4 className="heading heading_post_name">{userName}</h4>
                    <p className="text text_post_date">{convertTimestamp(postDate)}</p>
                    {
                        likes.length

                            ?

                            <p className="text text_post_likecount">{likes.length} likes</p>

                            :

                            <p className="text text_post_likecount">Be the first to like this!</p>
                    }
                    <p className="text text_post_body">{postBody}</p>
                </div>
                <div className="container container_commentsSection" id={`commentsSection--${postId}`}>
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
                                    getAllComments={getAllComments}
                                />
                            }
                        })
                    }
                </div>
                <NewComment postId={postId} getAllComments={getAllComments} />
                <button className="btn btn_post btn_open btn_reply_comment show" id={`openNewCommentBtn--${postId}`} onClick={handleOpenNewCommentFormButtonClick}>Reply</button>
                <div className="container container_like_icon">

                {
                    userLikeObj

                        ?

                        <img className="icon icon_like icon_liked" src={require("../../images/thumb-liked.png")} id={`likedIcon--${userLikeObj?.id}`} onClick={handleDeletePreviousLikeClick}/>

                        :

                        <img className="icon icon_like icon_nonliked" src={require("../../images/thumb-nonliked.png")} id={`nonLikedIcon--${postId}`} onClick={handlePostNewLikeClick}/>

                }
                </div>
            </div>
        </>
    }
}





// userLikeObj

// ?
// <button className="icon icon_like icon_liked" src={require("../../images/svg/thumb-nonliked.svg")} id={`likedIcon--${userLikeObj?.id}`} onClick={handleDeletePreviousLikeClick}>Like</button>

// :

// <button className="icon icon_like icon_nonliked" src={require("../../images/svg/thumb-liked.svg")} id={`nonLikedIcon--${postId}`} onClick={handlePostNewLikeClick}>Unlike</button>

// }