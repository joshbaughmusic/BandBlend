import { useEffect, useState } from "react"
import "./Message.css"

export const Message = ({ messageKey, messageId, messageSenderId, messageReceiverId, messageBody, messageDate, fetchMessages, handleNewMessageShow}) => {
    //getting all message details for each message as a props and function to re fetch messages from MessagesSidebar parent ^

    const [usersWithProfiles, setUsersWithProfiles] = useState([])

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


    //function to match up a userId on a message with one in the usersWithProfiles list. Should get the object and return it.

    const findUser = userId => {
        const foundUser = usersWithProfiles.find(user => {
            return user.id === userId
        })
        return foundUser
    }


    //function to convert message timestamps

    const convertTimestamp = timestamp => {

        const messageDateFormatted = new Date(parseInt(timestamp));
        const formattedDate = (messageDateFormatted.getMonth() + 1) + "/" + messageDateFormatted.getDate() + "/" + messageDateFormatted.getFullYear();

        return formattedDate
    }


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

     //function to handle when the reply button is clicked
     const handleReplyClick = e => {
        e.preventDefault()

        handleNewMessageShow()
    }


    return (
        <>
            <article key={messageKey} className="container container_message_card">
                {
                    messageSenderId === bBUserObject.id

                        ?

                        <h5 className="heading heading_message_tofrom heading_message_to">To: {findUser(messageReceiverId)?.name}</h5>

                        :

                        <h5 className="heading heading_message_tofrom heading_message_from">From: {findUser(messageSenderId)?.name}</h5>
                }
                <h6 className="heading heading_message_date">
                    {convertTimestamp(messageDate)}
                </h6>
                <p className="text text_message_body">{messageBody}</p>
                <div className="container container_message_buttons">
                    <button type="button" className="btn btn_message btn_message_reply" id={`messageReply--${messageId}`} onClick={handleReplyClick}>Reply</button>
                    <button type="button" id={`messageDelete--${messageId}`} className="btn btn_message btn_message_delete" onClick={handleMessageDeleteClick}>Delete</button>
                </div>
            </article>
        </>
    )
}