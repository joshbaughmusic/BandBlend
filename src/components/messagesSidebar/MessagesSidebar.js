import { useEffect, useState } from "react";
import "./MessagesSidebar.css"
import { Message } from "./Message.js";
import { NewMessage } from "./NewMessage.js";

export const MessagesSidebar = () => {
    const [messages, setMessages] = useState([])
    const [filteredMessages, setFilteredMessages] = useState([])

    //being defined here so they can both go to the children compoinetns to handle reply being selected
    const [selectedReceiverId, setSelectedReceiverId] = useState('');
    const [message, setMessage] = useState({
        body: "",
        receiverId: ''
    })

    

    //state to handle whether or not to show new message form

    const [showNewMessage, setShowNewMessage] = useState(false);

    const localBbUser = localStorage.getItem("bb_user")
    const bBUserObject = JSON.parse(localBbUser)

    //fetch all messages, define function outside of useEffect so it can be sent to Message as well

    const fetchMessages = () => {
        fetch(`http://localhost:8088/messages`)
            .then((res) => res.json())
            .then((data) => {
                //filter down to just messages the current user has sent or received before setting state
                const userMessages = data.filter(message => {
                    return message.senderId === bBUserObject.id || message.receiverId == bBUserObject.id
                })
                
                //sort messages by date
                const sortedMessages = userMessages.sort((a,b) => {
                    return b.date - a.date
                })

                setMessages(userMessages);
                setFilteredMessages(userMessages)
            });
    }

    useEffect(() => {
        fetchMessages()
    }, []);

    //handler functions for click events to take care of showing and hiding new message form

    const handleNewMessageShow = () => {
        setShowNewMessage(true)
    }

    const handleNewMessageClose = () => {
        setShowNewMessage(false)
    }


    return (
        <>
            <div className="container container_messages_sidebar">
                <h2 className="heading heading_messages">Messages</h2>
                <section className="container container_messages_display">
                    {
                        messages.map(message => <Message messageKey={`message--${message.id}`} messageId={message.id} messageSenderId={message.senderId} messageReceiverId={message.receiverId} messageBody={message.body} messageDate={message.date} fetchMessages={fetchMessages} handleNewMessageShow={handleNewMessageShow} selectedReceiverId={selectedReceiverId} setSelectedReceiverId={setSelectedReceiverId} message={message} setMessage={setMessage}/>)
                    }

                </section>
                <section className="container container_messages_new">

                    {
                        showNewMessage

                            ?

                            <NewMessage handleNewMessageClose={handleNewMessageClose} fetchMessages={fetchMessages} handleNewMessageShow={handleNewMessageShow} selectedReceiverId={selectedReceiverId} setSelectedReceiverId={setSelectedReceiverId} message={message} setMessage={setMessage}/>

                            :

                            <button type="button" className="btn button_messages_new" id={`btnNewMessage--${0}`} onClick={handleNewMessageShow}>New Message</button>

                    }

                </section>
            </div>
        </>
    )
}