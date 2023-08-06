import { useEffect, useState } from "react"
import "./NewMessage.css"

export const NewMessage = ({ fetchMessages, selectedReceiverId, setSelectedReceiverId, message, setMessage }) => {

    const [users, setUsers] = useState([])


    const localBbUser = localStorage.getItem("bb_user")
    const bBUserObject = JSON.parse(localBbUser)


    //openAI

    const { Configuration, OpenAIApi } = require("openai")

    const config = new Configuration({
        organization: "org-9gJSkRIUUKkBxR5r8IeKlaN5",
        apiKey: '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',
    })

    config.baseOptions.headers = {
        Authorization: "Bearer " + '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',
    };


    const openai = new OpenAIApi(config);


    const sendUserQuestionToOpenAI = async (questionString) => {
        const messages = [
            {
                role: "system",
                content: `Who you are: You are a crazy, burnt out rockstar named Johnny Silverfinger. You've lived a long life on the road as a wild steeldrum player and have seen some crazy things. You used a lot of substances in your hayday and still partake sometimes. You're a bit ecentric and all over the place, but you don't think so. You think you're a living legend. You're disgruntled, rude, and a little forgetful, but you kind of try to answer the stupid questions of people interacting with you. You don't like talking to these idiots, but you've got so much energy and love talking about your old glory days, you might as well get paid to do it.

                What you do: After many long years on the road, you were hired to work as a chat helper for a website called BandBlend. BandBlend  helps musicians and bands find each other if they're looking for new members or other colaborators. On BandBlend, can make a profile, upload pictures, make posts, comment on and like other users' content, send messages to one another, search for bands and musicians by name, genre, instrument, distance, etc. Your job is to act as a sort of conversationalist with the people who are visiting the site. You can't really be of too much help using the site, but you can amuse them with your quirky ex-rockstar behavior and short little stories and quips.`,
            },
            {
                role: "user",
                content: questionString,
            },
        ];
    
        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: messages,
            temperature: 1.0,
            max_tokens: 300
        });
    
        console.log(response);
        return response.data.choices[0].message.content;
    };



    //fetch all users for dropdown list

    useEffect(() => {
        fetch(`http://localhost:8088/users`)
            .then((res) => res.json())
            .then((data) => {
                //sort users A-Z
                const sortedUsers = data.sort((a, b) => {
                    if (a.name < b.name) {
                        return -1;
                    }
                    if (a.name > b.name) {
                        return 1;
                    }
                    return 0;
                })
                //remove current user from list
                const sortedMinusCurrent = sortedUsers.filter(user => {
                    return user.id !== bBUserObject.id
                })
                setUsers(sortedMinusCurrent);
            });
    }, []);



    //function to set new message object and send to database, close new message form and clear field on submit, update message list. Message state is held by parent and passed down as prop so that it can be used in the reply button functions


    const handleSubmitNewMessageClick = async (e) => {
        e.preventDefault();
    
        const messageObject = {
            senderId: bBUserObject.id,
            receiverId: message.receiverId,
            body: message.body,
            date: Date.now(),
            isRead: false
        }
    
        if (message.body !== "" && message.receiverId) {
            if (message.receiverId === 20) {
                try {
                    // First fetch and then wait for the response
                    await fetch(`http://localhost:8088/messages`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(messageObject)
                    });
    
                    fetchMessages();
    
                    const AiResponse = await sendUserQuestionToOpenAI(message.body);
    
                    console.log(AiResponse);
    
                    const aiMessageObject = {
                        senderId: 20,
                        receiverId: bBUserObject.id,
                        body: AiResponse,
                        date: Date.now(),
                        isRead: true
                    }
    
                    await fetch(`http://localhost:8088/messages`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(aiMessageObject)
                    });
    
                    fetchMessages();
                    // handleNewMessageClose();
                    // setMessage({
                    //     body: "",
                    //     receiverId: 0
                    // });
                    document.querySelector('.input_text_message').value = ''
                    setSelectedReceiverId('');
                } catch (error) {
                    console.error("Error sending message:", error);
                }
            } else {
                try {
                    await fetch(`http://localhost:8088/messages`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(messageObject)
                    });
    
                    fetchMessages();
                    // handleNewMessageClose();
                    // setMessage({
                    //     body: "",
                    //     receiverId: 0
                    // });
                    document.querySelector('.input_text_message').value = ''
                    setSelectedReceiverId('');
                } catch (error) {
                    console.error("Error sending message:", error);
                }
            }
        } else {
            window.alert("New message cannot be blank and a recipient must be selected.");
        }
    };


    return (
        <>
            <form className="form form_new_message">
                <textarea autoFocus name="newMessage" className="input input_text input_text_message input_field_colors" placeholder="Compose Message..." rows="7" cols="auto" onChange={
                    e => {
                        const copy = { ...message }
                        copy.body = e.target.value
                        setMessage(copy)
                    }
                }
                ></textarea>
                <select required name="dropdown dropdown_message_receiver" className="input input_select input_select_message input_field_colors" value={selectedReceiverId} onChange={e => {
                    setSelectedReceiverId(e.target.value)
                    const [, userId] = e.target.value.split("--")
                    let copy = { ...message }
                    copy.receiverId = parseInt(userId)
                    setMessage(copy)
                }}>
                    <option key={`user--null`} className="input_field_colors" value='null' >-select a recipient-</option>
                    {
                        users.map(user => {
                            return <option key={`userKey--${user.id}`} className="input_field_colors" value={`user--${user.id}`}>{user.name}</option>

                        })
                    }
                </select>
                <br />
                <div className="container container_buttons_messages_new">
                    <button type="submit" className="btn btn_message btn_submit btn_submit_message button_profile_colors" onClick={handleSubmitNewMessageClick}>Submit Message</button>
                    {/* <button type="button" className="btn btn_message btn_close button_profile_colors" onClick={handleNewMessageClose}>Close</button> */}
                </div>
            </form>
        </>
    )
}
