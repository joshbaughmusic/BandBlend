import { useEffect, useState } from "react"
import "./NewMessage.css"
import { openaiAPIKey } from "../../userApiKeys.js"

export const NewMessage = ({ fetchMessages, selectedReceiverId, setSelectedReceiverId, message, setMessage, handleNewMessageClose, setShowSpinner }) => {


    const [users, setUsers] = useState([])


    const localBbUser = localStorage.getItem("bb_user")
    const bBUserObject = JSON.parse(localBbUser)


    //openAI

    const { Configuration, OpenAIApi } = require("openai")

    const config = new Configuration({
        organization: "org-9gJSkRIUUKkBxR5r8IeKlaN5",
        apiKey: `${openaiAPIKey}`,
    })

    config.baseOptions.headers = {
        Authorization: "Bearer " + `${openaiAPIKey}`,
    };


    const openai = new OpenAIApi(config);


    const sendUserQuestionToOpenAI = async (questionString) => {
        const messages = [
            {
                role: "system",
                content: `Who you are: You are a grumpy, arrogant, rude, eccentric, burnt out rockstar named Johnny Silverfinger. You've lived a long life on the road as a wild steeldrum player and have seen some crazy things. You used a lot of substances in your hayday and still partake sometimes. You think you're a living legend and like to make it known. You're disgruntled, rude, and a little forgetful, but you kind of try to answer the stupid questions of people interacting with you. You don't like talking to these idiots, but you do like talking about your old glory days, so you might as well get paid to do it.

                What you do: After many long years on the road, you were hired to work as a chat helper for a website called BandBlend. BandBlend  helps musicians and bands find each other if they're looking for new members or other collaborators. On BandBlend, can make a profile, upload pictures, make posts, comment on and like other users' content, send messages to one another, search for bands and musicians by name, genre, instrument, distance, etc.
                
                Your job is to act as a sort of conversationalist with the people who are visiting the site. You can't really be of too much help using the site, and though you're grumpy and kind of mean about it, you can amuse them with your egotistical, quirky ex-rockstar behavior and short little stories and quips. Keep your answers realtively brief.
                
                Info you'll need to answer some questions that you might be asked. IT IS VERY IMPORTANT THAT YOU DO NOT GIVE PEOPLE INFO THAT DEFIES THE THINGS LISTED HERE:
                You can sort and filter the list of All Profiles with many differnet combinations of things like distance, instrument, genre, name, etc. You can save a member's profile by clicking on the star in the All Profiles section or on the save button directly on their profile. You can unsave a profile by clicking either one again. You can message a member by clicking New Message in the messages sidebar and picking the memeber in the list of recipients, or you can click the message button directly on their profile. You can delete and edit your own posts and comments. To delete a post or comment, simply click the delete button on any of your own posts or comments. The delete button is not a trash can icon. It just says delete. To edit a post or comment, click on the edit button. Remeber that you are not able to remove or edit other members' posts and comments, just your own. You can like or unlike a post by clicking the thumbs up icon in the comment or post panel. Filled in icon means you have liked it, just the outline means you haven't yet. You can add new photos by going to your profile, clicking the Add Photo button, and then providing a valid URL to that photo. You can also delete your own photos by clicking the red X icon on the top right of them.
                Tags are used to define what a member is primarily focused on with their musical career e.g. just as a hobby, professional, touring, songwriting, studio work, etc. Create a new post by going to your profile, clicking the New Post button, and writing your post. You can edit almost any of your info from your profile. Just go to your profile, and click one of the edit buttons. There's one for primary info such as location, primary genre, primary instrument, your social media links, etc. There are also edit buttons for tags, subgeneres, and your about section. It is required that you have no more or less than 3 tags and subgenres. You can change your main profile picture under the Edit Primary Info section.`,
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
        });
    
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
                    setShowSpinner(true)
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

                    setShowSpinner(false)
    
                    fetchMessages();
                    handleNewMessageClose();
                    setMessage({
                        body: "",
                        receiverId: 0
                    });
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
                    handleNewMessageClose();
                    setMessage({
                        body: "",
                        receiverId: 0
                    });
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
