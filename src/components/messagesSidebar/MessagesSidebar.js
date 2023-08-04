import { useEffect, useState } from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import { IconContext } from "react-icons";
import "./MessagesSidebar.css"
import { Message } from "./Message.js";
import { NewMessage } from "./NewMessage.js";
import { MessageSearchSort } from "./MessageSortFilter.js";

const iteratorGenerator = function* () {
    let counter = 0
    while (true) {
        yield counter
        counter += 1
    }
}


const generator = iteratorGenerator();

export const MessagesSidebar = ({ message, setMessage, selectedReceiverId, setSelectedReceiverId, showNewMessage, setShowNewMessage, sidebar, showSidebar }) => {

    const [messages, setMessages] = useState([])

    // states to handle and hold filter/sort terms. Passing down into MessageSortFilter.js

    const [searchTerms, setSearchTerms] = useState('')
    const [sortTerms, setSortTerms] = useState('')

    //state to manage the filtered messages 

    const [filteredMessages, setFilteredMessages] = useState([])


    const localBbUser = localStorage.getItem("bb_user")
    const bBUserObject = JSON.parse(localBbUser)

    //fetch all messages, define function outside of useEffect so it can be sent to Message as well

    const fetchMessages = () => {
        fetch(`http://localhost:8088/messages`)
            .then((res) => res.json())
            .then((allMessages) => {

                //get all profiles with expanded users

                fetch(`http://localhost:8088/profiles?_expand=user`)
                    .then((res) => res.json())
                    .then((profsWithUsers) => {

                        //filter down to just messages the current user has sent or received before setting state
                        const userMessages = allMessages.filter(message => {
                            return message.senderId === bBUserObject.id || message.receiverId == bBUserObject.id
                        })

                        //sort messages by date
                        const sortedMessages = userMessages.sort((a, b) => {
                            return b.date - a.date
                        })

                        //match up all userMessages with their related user and profile based on receiverId and senderId and merge into the same object for each one.

                        const messagesWithProfiles = sortedMessages.map(singleMessage => {

                            //get receiver profile
                            const receiverProf = profsWithUsers.find(profile => {
                                return profile.userId === singleMessage.receiverId
                            })

                            //get sender profile
                            const senderProf = profsWithUsers.find(profile => {
                                return profile.userId === singleMessage.senderId
                            })

                            let combinedObj = {
                                messageObj: singleMessage,
                                senderProfileObj: senderProf,
                                receiverProfileObj: receiverProf
                            }

                            return combinedObj

                        });

                        setMessages(messagesWithProfiles);
                        setFilteredMessages(messagesWithProfiles)

                    })


            });
    }

    useEffect(() => {
        fetchMessages()
    }, []);


    //useEffect for search sort purposes

    useEffect(() => {

        //search by name or message body conent

        const searchedMessages = messages.filter(
            (message) =>
                message.senderProfileObj.user.name.toLowerCase().includes(searchTerms.toLowerCase()) ||
                message.receiverProfileObj.user.name.toLowerCase().includes(searchTerms.toLowerCase()) ||
                message.messageObj.body.toLowerCase().includes(searchTerms.toLowerCase())
        );

        let filteredData = [...searchedMessages];

        if (sortTerms === "newest") {
            filteredData = filteredData.sort((a, b) => b.messageObj.date - a.messageObj.date);
        } else if (sortTerms === "oldest") {
            filteredData = filteredData.sort((a, b) => a.messageObj.date - b.messageObj.date);
        }

        setFilteredMessages(filteredData);
    }, [searchTerms, sortTerms]);


    //handler functions for click events to take care of showing and hiding new message form

    const handleNewMessageShow = () => {
        setShowNewMessage(true)
    }

    const handleNewMessageClose = () => {
        setShowNewMessage(false)
        setSelectedReceiverId('')
    }


    return (
        <>
            <div className={sidebar ? "container container_messages_sidebar active" : "container container_messages_sidebar"}>
                <div className="container container_messages_header">
                    <div className="container container_messages_heading_close">
                        <h2 className="heading heading_messages"><span className="icon icon_messages_close" onClick={showSidebar}>X</span> Messages</h2>
                    </div>
                    <section className="container container_messages_new_button">

                        {
                            showNewMessage

                                ?

                                <button type="button" className="btn button_messages_new button_profile_colors" id={`btnNewMessage--${0}`} onClick={handleNewMessageClose}>Close</button>

                                :

                                <button type="button" className="btn button_messages_new button_profile_colors" id={`btnNewMessage--${0}`} onClick={handleNewMessageShow}>New Message</button>

                        }

                    </section>
                </div>
                    <section className="container container_messages_new">

                        {
                            showNewMessage

                                ?

                                <NewMessage handleNewMessageClose={handleNewMessageClose} fetchMessages={fetchMessages} handleNewMessageShow={handleNewMessageShow} selectedReceiverId={selectedReceiverId} setSelectedReceiverId={setSelectedReceiverId} message={message} setMessage={setMessage} />

                                :

                                ""
                        }

                    </section>
                <MessageSearchSort setSearchTerms={setSearchTerms} setSortTerms={setSortTerms} />
                <section className="container container_messages_display">
                    {
                        filteredMessages.map(message => <Message
                            messageKey={`messageCard--${message.messageObj.id}`}
                            key={`message--${message.messageObj.id}`}
                            messageId={message.messageObj.id}
                            messageSenderId={message.messageObj.senderId}
                            messageReceiverId={message.messageObj.receiverId}
                            messageBody={message.messageObj.body}
                            messageDate={message.messageObj.date}
                            messageReceiverProfileId={message.receiverProfileObj.id}
                            messageSenderProfileId={message.senderProfileObj.id}
                            messageReceiverPicture={message.receiverProfileObj.picture}
                            messageSenderPicture={message.senderProfileObj.picture}
                            messageReceiverName={message.receiverProfileObj.user.name}
                            messageSenderName={message.senderProfileObj.user.name}
                            fetchMessages={fetchMessages}
                            handleNewMessageShow={handleNewMessageShow}
                            selectedReceiverId={selectedReceiverId}
                            setSelectedReceiverId={setSelectedReceiverId}
                            message={message}
                            setMessage={setMessage} />)
                    }

                </section>

            </div>
        </>
    )
}