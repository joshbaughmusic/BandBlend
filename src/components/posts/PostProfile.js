import { useNavigate } from "react-router-dom"
import "./Post.css"
import { useEffect, useState } from "react"
import { Comment } from "./Comment.js"
import { NewComment } from "./NewComment.js"
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";


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
        getAllLikes()
    }, [])

    useEffect(() => {
        getAllComments()
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
            <div className="container_container_post_comments_full">
                <div className="container container_post container_post_profile" key={postKey} id={`post--${postId}`}>
                    <section className="post_content_except_comments">
                        <div className="container container_heading_post">
                            <div className="container container_post_img_name">
                                <img className="img img_post_picture" src={userPicture} />
                                <h4 className="heading heading_post_name">You posted:</h4>
                            </div>
                            <div className="container container_post_date_icon">
                            <p className="text text_post_date">{convertTimestamp(postDate)}</p>
                            <FaIcons.FaRegComment className="icon icon_post_bubble"/>
                            </div>
                        </div>
                        <p className="text text_post_body">{postBody}</p>
                    </section>
                    <div className="container container_footer_post">
                        <section className="container container_post_like_section">
                            {
                                !likes.length

                                    ?

                                    <p className="text text_post_likecount">Nobody has liked this yet.</p>

                                    :

                                    likes.length === 1

                                        ?

                                        <p className="text text_post_likecount">{likes.length} like</p>

                                        :

                                        <p className="text text_post_likecount">{likes.length} likes</p>

                            }
                        </section>
                        <div className="container container_post_myprofile_all_buttons">

                            {/* open comment box button below*/}
                            <button className="btn btn_post btn_open btn_reply_comment show" id={`openNewCommentBtn--${postId}`} onClick={handleOpenNewCommentFormButtonClick}>Comment</button>

                            {/* edit and delete buttons */}
                            <div className="container container_post_myprofile_edit-delete_buttons">
                                <button className="btn btn_edit btn_edit_post" onClick={() => { navigate(`/myprofile/edit/post/${postId}`) }}>Edit</button>
                                <button id={`postDelete--${postId}`} className="btn btn_delete_post" onClick={handleDeletePostClick}>Delete</button>
                            </div>
                        </div>
                    </div>
                </div>

                <NewComment postId={postId} getAllComments={getAllComments} />

                <div className="container container_commentsSection" id={`comments--${postId}`}>
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
            </div>
        </>
    } else {

        return <>
            <div className="container_container_post_comments_full">
                <div className="container container_post container_post_profile" key={postKey} id={`post--${postId}`}>
                    <section className="post_content_except_comments">
                        <div className="container container_heading_post">
                            <div className="container container_post_img_name">
                                <img className="img img_post_picture" src={userPicture} />
                                <h4 className="heading heading_post_name">{userName} posted:</h4>
                            </div>
                            <div className="container container_post_date_icon">
                            <p className="text text_post_date">{convertTimestamp(postDate)}</p>
                            <FaIcons.FaRegComment className="icon icon_post_bubble"/>
                            </div>                        </div>
                        <p className="text text_post_body">{postBody}</p>
                    </section>
                    <div className="container container_footer_post">
                        <section className="container container_post_like_section">
                            <div className="container container_post_like_icon">

                                {
                                    userLikeObj

                                        ?

                                        <img className="icon icon_like icon_liked" src={require("../../images/thumb-liked.png")} id={`likedIcon--${userLikeObj?.id}`} onClick={handleDeletePreviousLikeClick} />

                                        :

                                        <img className="icon icon_like icon_nonliked" src={require("../../images/thumb-nonliked.png")} id={`nonLikedIcon--${postId}`} onClick={handlePostNewLikeClick} />

                                }
                            </div>
                            {
                                !likes.length

                                    ?

                                    <p className="text text_post_likecount">Be the first to like this!</p>

                                    :

                                    likes.length === 1

                                        ?

                                        <p className="text text_post_likecount">{likes.length} like</p>

                                        :

                                        <p className="text text_post_likecount">{likes.length} likes</p>

                            }
                        </section>

                        {/* open comment box button below*/}
                        <button className="btn btn_post btn_open btn_reply_comment show" id={`openNewCommentBtn--${postId}`} onClick={handleOpenNewCommentFormButtonClick}>Comment</button>

                    </div>
                </div>

                <NewComment postId={postId} getAllComments={getAllComments} />

                <section className="container container_commentsSection" id={`commentsSection--${postId}`}>
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
                </section>
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