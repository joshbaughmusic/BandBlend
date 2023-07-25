import { useEffect, useState } from "react";
import "./MessagesSidebar.css"
import { Message } from "./Message.js";
import { NewMessage } from "./NewMessage.js";
import { MessageSearchSort } from "./MessageSortFilter.js";

export const MessagesSidebar = ({ message, setMessage, selectedReceiverId, setSelectedReceiverId, showNewMessage, setShowNewMessage }) => {
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

                            // console.log("sortedMessages:",sortedMessages)
                            // console.log("receiverProfiles:",receiverProfile)
                            // console.log("senderProfiles:",senderProfile)
                            console.log("combinedObj", combinedObj)

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
            <div className="container container_messages_sidebar">
                <h2 className="heading heading_messages">Messages</h2>
                <section className="container container_messages_new">

                    {
                        showNewMessage

                            ?

                            <NewMessage handleNewMessageClose={handleNewMessageClose} fetchMessages={fetchMessages} handleNewMessageShow={handleNewMessageShow} selectedReceiverId={selectedReceiverId} setSelectedReceiverId={setSelectedReceiverId} message={message} setMessage={setMessage} />

                            :

                            <button type="button" className="btn button_messages_new" id={`btnNewMessage--${0}`} onClick={handleNewMessageShow}>New Message</button>

                    }

                </section>
                <MessageSearchSort setSearchTerms={setSearchTerms} setSortTerms={setSortTerms}/>
                <section className="container container_messages_display">
                    {
                        filteredMessages.map(message => <Message        
                            messageKey={`message--${message.messageObj.id}`}
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