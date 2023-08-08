import { useEffect, useState } from "react"
import "./Message.css"
import { Link, useNavigate } from "react-router-dom"
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import { ModalMessageWarning } from "../modals/ModalMessageWarning.js";
import FadeIn from 'react-fade-in';


export const Message = ({ messageKey, messageId, messageSenderId, messageReceiverId, messageBody, messageDate, messageReceiverProfileId, messageSenderProfileId, messageReceiverPicture, messageSenderPicture, messageReceiverName, messageSenderName, fetchMessages, handleNewMessageShow, setSelectedReceiverId, message, setMessage }) => {

    //getting all message details for each message as a props and function to re fetch messages from MessagesSidebar parent ^

    const [usersWithProfiles, setUsersWithProfiles] = useState([])
    const navigate = useNavigate()

    //states to track modal open or close

    const [isModalOpen, setIsModalOpen] = useState(false);

    const localBbUser = localStorage.getItem("bb_user")
    const bBUserObject = JSON.parse(localBbUser)

    //fetch all users with profiles embeded

    useEffect(() => {
        fetch(`http://localhost:8088/users?_embed=profiles`)
            .then((res) => res.json())
            .then((data) => {
                setUsersWithProfiles(data);
            });
    }, []);


    //function to convert message timestamps

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


    //handler function for delete message click

    const handleDeleteMessageClickWarning = e => {
        setIsModalOpen(true)
    }

    const handleDeleteMessageClick = messageIdToDelete => {

        return fetch(`http://localhost:8088/messages/${messageIdToDelete}`, {
            method: "DELETE",
        })
            .then(() => {
                //refetch all messages
                fetchMessages()
            })

    }

    //function to handle when the reply button is clicked. Uses message state shared from parent and sets up values on it as needed.
    const handleReplyClick = e => {
        e.preventDefault()

        handleNewMessageShow()

        const [, userId] = e.target.id.split('--')

        const copy = message
        copy.receiverId = parseInt(userId)
        copy.body = ''
        copy.date = 0
        copy.id = ''
        setMessage(copy)

        setSelectedReceiverId(`user--${userId}`)

    }

    if (!messageReceiverProfileId || !messageSenderProfileId || usersWithProfiles.length === 0) {
        return null
    }

    return (
        <>


            {
                messageSenderId === bBUserObject.id

                    ?
                    <>
                        <FadeIn>
                            <article key={messageKey} className="container container_message_card container_message_card_sender">
                                <AiIcons.AiOutlineArrowRight className="icon icon_message_arrowright" />
                                <div className="container container_message_heading">
                                    <h5 className="heading heading_message_tofrom heading_message_sender" id={`messageUser--${messageReceiverId}`}>To: <span className="message_nameLink"><Link to={`profiles/${messageReceiverId}`}>{messageReceiverName}</Link></span> </h5>
                                    <Link to={`profiles/${messageReceiverId}`}><img className="img img_message" src={messageReceiverPicture} /></Link>
                                </div>
                                <h6 className="heading heading_message_date">
                                    {convertTimestamp(messageDate)}
                                </h6>
                                <p className="text text_message_body">{messageBody}</p>
                                <div className="container container_message_buttons">
                                    <button type="button" id={`messageDelete--${messageId}`} className="btn btn_message btn_message_delete button_cmt_msg_colors" onClick={handleDeleteMessageClickWarning}>Delete</button>
                                </div>
                            </article>
                            <ModalMessageWarning messageId={messageId} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} handleDeleteMessageClick={handleDeleteMessageClick} />
                        </FadeIn>
                    </>


                    :

                    <>
                        <FadeIn>
                            <article key={messageKey} className="container container_message_card container_message_card_receiver">
                                <AiIcons.AiOutlineArrowLeft className="icon icon_message_arrowleft" />
                                <div className="container container_message_heading"><h5 className="heading heading_message_tofrom heading_message_receiver" id={`messageUser--${messageSenderId}`}>From: <span className="message_nameLink"><Link to={`profiles/${messageSenderId}`}>{messageSenderName}</Link></span> </h5>
                                    <Link to={`profiles/${messageSenderId}`}><img className="img img_message" src={messageSenderPicture} /></Link>
                                </div>
                                <h6 className="heading heading_message_date">
                                    {convertTimestamp(messageDate)}
                                </h6>
                                <p className="text text_message_body">{messageBody}</p>
                                <div className="container container_message_buttons">
                                    <button type="button" id={`messageDelete--${messageId}`} className="btn btn_message btn_message_delete button_cmt_msg_colors" onClick={handleDeleteMessageClickWarning}>Delete</button>
                                    <button type="button" className="btn btn_message btn_message_reply button_cmt_msg_colors" id={`messageReply--${messageSenderId}`} onClick={handleReplyClick}>Reply</button>
                                </div>
                            </article>
                            <ModalMessageWarning messageId={messageId} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} handleDeleteMessageClick={handleDeleteMessageClick} />
                        </FadeIn>

                    </>
            }

        </>
    )
}