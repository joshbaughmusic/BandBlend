import { useNavigate } from "react-router-dom"
import "./Post.css"
import { useEffect, useState } from "react"
import { Comment } from "./Comment.js"
import { NewComment } from "./NewComment.js"
import * as FaIcons from "react-icons/fa";
import { Collapse } from 'antd'
import FadeIn from 'react-fade-in';

//create post module that will be used to render post html from other modules like OtherProfile, MyProfile, and Homepage.

export const PostProfile = ({ userName, userId, postId, userPicture, postBody, postDate, myProfileId, postKey }) => {

    const localBbUser = localStorage.getItem("bb_user")
    const bBUserObject = JSON.parse(localBbUser)

    //from antD library for collapse feature
    const { Panel } = Collapse
    const [openPanel, setOpenPanel] = useState(0)

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
    }, [openPanel])

    //use effect to set state of whether or not current user has like the post already or not so the right html can be generated below

    useEffect(() => {
        const searchForUserLike = likes.find(like => {
            return like.userId === bBUserObject.id
        }
        )

        setUserLikeObj(searchForUserLike)

    }, [likes])


    //handle opening up a new comment form for the selected post by adding a show class to that specific form

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

    const handleOpenCommentsOnNewComment = e => {
        const [, commentPanelToOpen] = e.target.id.split('--')

        setOpenPanel(parseInt(commentPanelToOpen))
    }

    const handleViewHideCommentsClick = e => {
        const [, commentSectionToOpen] = e.target.id.split('--')

        if (openPanel) {
            setOpenPanel(0)
        } else {
            setOpenPanel(parseInt(commentSectionToOpen))
        }
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

        return <>
            <FadeIn>
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
                                    <FaIcons.FaRegComment className="icon icon_post_bubble" />
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
                            <button className="btn btn_post btn_open btn_reply_comment show button_cmt_msg_colors" id={`openNewCommentBtn--${postId}`} onClick={handleOpenNewCommentFormButtonClick}>Comment</button>


                        </div>
                    </div>

                    {
                        commentsWithUsers.some(item => item.commentObj.postId === postId)

                            ?


                            openPanel

                                ?

                                <div className="viewhide_comments_bar" id={`commentsViewHide--${postId}`} onClick={handleViewHideCommentsClick}>Hide Comments</div>

                                :

                                <div className="viewhide_comments_bar" id={`commentsViewHide--${postId}`} onClick={handleViewHideCommentsClick}>View Comments</div>



                            :

                            ""
                    }




                    <NewComment postId={postId} getAllComments={getAllComments} handleOpenCommentsOnNewComment={handleOpenCommentsOnNewComment} />

                    {

                        commentsWithUsers.some(item => item.commentObj.postId === postId)

                            ?

                            <>

                                <div className="container container_commentsSection" id={`comments--${postId}`}>
                                    <Collapse activeKey={openPanel} ghost size='small' >
                                        <Panel className="panel_comment_colapsible" header="View Comments" key={postId}>


                                            {
                                                commentsWithUsers.map((comment, index) => {
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
                                                            key={`comment--${index}`}
                                                            commentKey={`commentCard--${comment.commentObj.Id}`}
                                                            getAllComments={getAllComments}
                                                        />
                                                    }
                                                })
                                            }
                                        </Panel>
                                    </Collapse>
                                </div>


                            </>

                            :

                            ""

                    }


                </div>
            </FadeIn>
        </>
}
