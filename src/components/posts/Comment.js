import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as ArrowUpturnLeft } from "../../images/svg/arrow_upturn_left.svg"
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import "./Comment.css"
import { useState } from "react";
import { ModalCommentWarning } from "../modals/ModalCommentWarning.js";



export const Comment = ({ fullCommentObj, posterId, posterName, posterPicture, posterProfileId, commentId, commentBody, commentDate, commentName, commentPicture, commentProfileId, commentUserId, commentKey, getAllComments }) => {

    const localBbUser = localStorage.getItem("bb_user")
    const bBUserObject = JSON.parse(localBbUser)

    //states to track modal open or close

    const [isModalOpen, setIsModalOpen] = useState(false);


    const navigate = useNavigate()

    //function to convert timestamp

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

    //set handler functions to take care of deleting comments when the button is clicked.

    const handleDeleteCommentClickWarning = e => {
        setIsModalOpen(true)
    }

    const handleDeleteCommentClick = commentIdToDelete => {

        return fetch(`http://localhost:8088/comments/${commentIdToDelete}`, {
            method: "DELETE",
        })
            .then(() => {
                //refetch all comments
                getAllComments()

            })

    }


    return (
        <>
        <ModalCommentWarning commentId={commentId} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} handleDeleteCommentClick={handleDeleteCommentClick}/>
            <div className="container container_comment_card" key={commentKey}>
                <div className="container container_comment_heading">
                    <img src={require("../../images/arrow_upturn_left.png")} className="icon icon_comment icon_comment_arrowup" />
                    <img src={commentPicture} alt="" className="img img_commentor" onClick={() => {
                        navigate(`/profiles/${commentProfileId}`)
                    }} />

                    {
                        // check to see if you're looking at your own profile and change up to You commented instead of so and so commented

                        fullCommentObj?.userObj.id === bBUserObject.id

                            ?

                            <h4 className="heading heading_comment_name"><Link className='heading_comment_name_link' to={`/profiles/${commentProfileId}`}>You</Link> commented:</h4>

                            :

                            <h4 className="heading heading_comment_name"><Link className='heading_comment_name_link'to={`/profiles/${commentProfileId}`}>{commentName}</Link> commented:</h4>
                    }
                    <div className="container container_comment_date_icon">
                        <p className="text text_comment_date">{convertTimestamp(commentDate)}</p>
                        <FaIcons.FaRegComments className="icon icon_comment_bubble" />
                    </div>

                </div>
                <div className="container container_comment_body">
                    <p className="text_comment_body">{commentBody}</p>
                </div>
                {
                    //if current user is the creator of comment, show delete button

                    fullCommentObj?.userObj.id === bBUserObject.id

                        ?

                        <>
                            <div className="container container_comment_edit-delete">
                                <button className="btn btn_edit btn_edit_comment button_cmt_msg_colors" id={`comment--${commentId}`} onClick={() => {
                                    navigate(`../edit/comment/${commentId}`)
                                }}>Edit</button>

                                <button className="btn btn_delete btn_delete_comment button_cmt_msg_colors" id={`comment--${commentId}`} onClick={handleDeleteCommentClickWarning}>Delete</button>
                            </div>

                        </>

                        :

                        ""
                }
            </div>
        </>
    )
}

