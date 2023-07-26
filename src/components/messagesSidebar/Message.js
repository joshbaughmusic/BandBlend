import { useEffect, useState } from "react"
import "./Message.css"
import { Link, useNavigate } from "react-router-dom"

export const Message = ({ messageKey, messageId, messageSenderId, messageReceiverId, messageBody, messageDate, messageReceiverProfileId, messageSenderProfileId, messageReceiverPicture, messageSenderPicture, messageReceiverName, messageSenderName, fetchMessages, handleNewMessageShow, selectedReceiverId, setSelectedReceiverId, message, setMessage}) => {

    //getting all message details for each message as a props and function to re fetch messages from MessagesSidebar parent ^

    const [usersWithProfiles, setUsersWithProfiles] = useState([])
    const navigate = useNavigate()

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

    const handleMessageDeleteClick = e => {
        e.preventDefault()

        const [, messageId] = e.target.id.split('--')

        return fetch(`http://localhost:8088/messages/${messageId}`, {
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

        const [,userId] = e.target.id.split('--')

        const copy = message
        copy.receiverId = parseInt(userId)
        copy.body = ''
        copy.date = 0
        copy.id = ''
        setMessage(copy)

        setSelectedReceiverId(`user--${userId}`)
        
    }

    if (!messageReceiverProfileId || !messageSenderProfileId ||usersWithProfiles.length === 0) {
        return null
    }

    return (
        <>
            <article key={messageKey} className="container container_message_card">
                {
                    messageSenderId === bBUserObject.id

                        ?
                        <>
                        <h5 className="heading heading_message_tofrom heading_message_to" id={`messageUser--${messageReceiverId}`}>To: <span className="message_nameLink"><Link to={`profiles/${messageReceiverId}`}>{messageReceiverName}</Link></span> </h5>
                        <img className="img img_message" src={messageReceiverPicture}/>
                        </>
                        

                        :
                        <>
                        <h5 className="heading heading_message_tofrom heading_message_from" id={`messageUser--${messageSenderId}`}>From: <span className="message_nameLink"><Link to={`profiles/${messageSenderId}`}>{messageSenderName}</Link></span> </h5>
                        <img className="img img_message" src={messageSenderPicture}/>
                        </>
                }
                <h6 className="heading heading_message_date">
                    {convertTimestamp(messageDate)}
                </h6>
                <p className="text text_message_body">{messageBody}</p>
                <div className="container container_message_buttons">
                    {
                        messageSenderId === bBUserObject.id

                        ?

                        ''

                        :

                        <button type="button" className="btn btn_message btn_message_reply" id={`messageReply--${messageSenderId}`} onClick={handleReplyClick}>Reply</button>

                    }
                    <button type="button" id={`messageDelete--${messageId}`} className="btn btn_message btn_message_delete" onClick={handleMessageDeleteClick}>Delete</button>
                </div>
            </article>
        </>
    )
}