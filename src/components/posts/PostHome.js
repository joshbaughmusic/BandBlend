import { Link, useNavigate } from "react-router-dom"
import "./Post.css"
import { useEffect, useState } from "react"
import * as FaIcons from "react-icons/fa";

//create post module that will be used to render post html from other modules like OtherProfile, MyProfile, and Homepage.

export const PostHome = ({ userName, profileId, userPicture, postBody, postId, postDate, postKey }) => {

    const navigate = useNavigate()
    const localBbUser = localStorage.getItem("bb_user")
    const bBUserObject = JSON.parse(localBbUser)

    const [likes, setLikes] = useState([])

    //state to track if current user has already liked the post or not
    const [userLikeObj, setUserLikeObj] = useState([])

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

    //use effect to set state of whether or not current user has like the post already or not so the right html can be generated below

    useEffect(() => {
        const searchForUserLike = likes.find(like => {
            return like.userId === bBUserObject.id
        }
        )

        setUserLikeObj(searchForUserLike)

    }, [likes])


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

    if (!likes) {
        return null
    }


    return <>
        <div className="container container_post container_post_home" key={postKey} id={`post--${postId}`}>
            <div className="container container_heading_post">
                <div className="container container_post_img_name">
                    <Link to={`/profiles/${profileId}`}><img className="img img_post_picture" src={userPicture} /></Link>
                    <h4 className="heading heading_post_name_home"><Link to={`/profiles/${profileId}`}><span className="post_home_name">{userName}</span></Link> posted:</h4>
                </div>
                <div className="container container_post_date_icon">
                    <p className="text text_post_date">{convertTimestamp(postDate)}</p>
                    <FaIcons.FaRegComment className="icon icon_post_bubble" />
                </div>
            </div>
            <p className="text text_post_body">{postBody}</p>
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
            </div>
        </div>
    </>

}