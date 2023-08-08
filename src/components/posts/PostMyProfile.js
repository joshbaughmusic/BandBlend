import { useNavigate } from "react-router-dom"
import "./Post.css"
import { useEffect, useState } from "react"
import { Comment } from "./Comment.js"
import { NewComment } from "./NewComment.js"
import * as FaIcons from "react-icons/fa";
import * as BiIcons from "react-icons/bi";
import { Collapse } from 'antd'
import FadeIn from 'react-fade-in';
import { ModalPostWarning } from "../modals/ModalPostWarning.js"

//create post module that will be used to render post html from other modules like OtherProfile, MyProfile, and Homepage.

export const PostMyProfile = ({ userName, userId, postId, userPicture, postBody, postDate, myProfileId, setMyPosts, postKey, likes, getAllLikes }) => {

    const navigate = useNavigate()
    const localBbUser = localStorage.getItem("bb_user")
    const bBUserObject = JSON.parse(localBbUser)

    //from antD library for collapse feature
    const { Panel } = Collapse
    const [openPanel, setOpenPanel] = useState(0)

    //states to store fetches

    const [commentsWithUsers, setCommentsWithUsers] = useState([])

    //state to store likes for only the current post

    const [currentPostLikes, setCurrentPostLikes] = useState([])

    //states to track modal open or close

    const [isModalOpen, setIsModalOpen] = useState(false);


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


    useEffect(() => {
        getAllComments()
    }, [openPanel])


    useEffect(() => {
        const matchedLikes = likes.filter(like => {
            return parseInt(like.postId) === parseInt(postId)
        })

        setCurrentPostLikes(matchedLikes)
    }, [likes])





    //set handler functions to take care of deleting posts when the button is clicked. Will also update list of posts using props passed down from MyProfile.

    const handleDeletePostClickWarning = e => {
        setIsModalOpen(true)
    }

    const handleDeletePostClick = postIdToDelete => {

        return fetch(`http://localhost:8088/posts/${postIdToDelete}`, {
            method: "DELETE",
        })
            .then(() => {
                fetch(`http://localhost:8088/posts?profileId=${myProfileId}`)
                    .then(res => res.json())
                    .then(data => {
                        setMyPosts(data)

                    })
            }).then(() => {
                //filter out comments that were attached to that post
                const commentsToDelete = commentsWithUsers.filter(comment => {
                    return comment.commentObj.postId === parseInt(postIdToDelete)
                })
                //map through and delete each one of those comments
                commentsToDelete.map(comment => {
                    fetch(`http://localhost:8088/comments/${comment.commentObj.id}`, {
                        method: "DELETE",
                    })
                })
            }).then(() => {
                //filter out likes that were attached to that post
                const likesToDelete = likes.filter(like => {
                    return like.postId === parseInt(postIdToDelete)
                })
                //map through and delete each one of those comments
                likesToDelete.map(like => {
                    fetch(`http://localhost:8088/likes/${like.id}`, {
                        method: "DELETE",
                    })
                })
            }).then(() => {
                getAllLikes()
            })
    }

    //handle opening up a new comment form for the selected post by adding a show class to that specific form

    const handleOpenNewCommentFormButtonClick = e => {
        const [, postIdToOpenNewCommentFor] = e.target.id.split('--')

        const formToOpen = document.getElementById(`newCommentForm--${postIdToOpenNewCommentFor}`)

        formToOpen.classList.add("show")

        // hide reply button

        const buttonToHide = document.getElementById(`openNewCommentBtn--${postIdToOpenNewCommentFor}`)

        buttonToHide.classList.remove("show")

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
            <FadeIn >
                <ModalPostWarning postId={postId} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} handleDeletePostClick={handleDeletePostClick} />
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
                                    <FaIcons.FaRegComment className="icon icon_post_bubble" />
                                </div>
                            </div>
                            <p className="text text_post_body">{postBody}</p>
                        </section>
                        <div className="container container_footer_post">
                            <section className="container container_post_like_section">
                                {
                                    !currentPostLikes.length

                                        ?

                                        <p className="text text_post_likecount">No likes yet</p>

                                        :

                                        currentPostLikes.length === 1

                                            ?

                                            <p className="text text_post_likecount">{currentPostLikes.length} like</p>

                                            :

                                            <p className="text text_post_likecount">{currentPostLikes.length} likes</p>

                                }
                            </section>
                            <div className="container container_post_myprofile_all_buttons">

                                {/* open comment box button below*/}
                                <button className="btn btn_post btn_open btn_reply_comment show button_cmt_msg_colors" id={`openNewCommentBtn--${postId}`} onClick={handleOpenNewCommentFormButtonClick}>Comment</button>

                                {/* edit and delete buttons */}
                                <div className="container container_post_myprofile_edit-delete_buttons">
                                    <button className="btn btn_edit btn_edit_post button_cmt_msg_colors" onClick={() => { navigate(`/myprofile/edit/post/${postId}`) }}>Edit</button>
                                    <button id={`postDelete--${postId}`} className="btn btn_delete_post button_cmt_msg_colors" onClick={handleDeletePostClickWarning}>Delete</button>

                                </div>
                            </div>
                        </div>
                    </div>

                    {
                        commentsWithUsers.some(item => item.commentObj.postId === postId)

                            ?


                            openPanel

                                ?

                                <div className="viewhide_comments_bar" id={`commentsViewHide--${postId}`} onClick={handleViewHideCommentsClick}>Hide Comments <BiIcons.BiSolidUpArrow className="icon icon_viewhide_comments" /></div>

                                :

                                <div className="viewhide_comments_bar" id={`commentsViewHide--${postId}`} onClick={handleViewHideCommentsClick}>View Comments <BiIcons.BiSolidDownArrow className="icon icon_viewhide_comments" /></div>



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
