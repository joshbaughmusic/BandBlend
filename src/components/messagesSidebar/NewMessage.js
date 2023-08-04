import { useEffect, useState } from "react"
import "./NewMessage.css"
import { openAIApiKey } from "../../ApiKeys.js"

export const NewMessage = ({ handleNewMessageClose, handleNewMessageShow, fetchMessages, selectedReceiverId, setSelectedReceiverId, message, setMessage }) => {

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
        const prompt = `You are an assistant. 
    
    Q: '${questionString}'
    A: `;

    console.log(questionString)

        const response = await openai.createCompletion({
            model: "text-davinci-003",
            max_tokens: 5,
            prompt: prompt,
            temperature: 0.9,
        });

        console.log(response);
        return response.data.choices[0].text
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


    const handleSubmitNewMessageClick = e => {
        e.preventDefault()

        const messageObject = {
            senderId: bBUserObject.id,
            receiverId: message.receiverId,
            body: message.body,
            date: Date.now(),
            isRead: false
        }

        if (message.body !== "" && message.receiverId) {

            if (message.receiverId === 20) {

                fetch(`http://localhost:8088/messages`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(messageObject)
                })
                    .then(() => {
                        fetchMessages()
                        // handleNewMessageClose()
                        // //clears out value of new message text area
                        // setMessage({
                        //     body: "",
                        //     receiverId: 0
                        // })
                        // setSelectedReceiverId('')
                    })
                    .then(() => {
                        const AiResponse = sendUserQuestionToOpenAI(message.body)

                        console.log(AiResponse)

                        const parsedAiResponse = JSON.parse(AiResponse)

                        const aiMessageObject = {
                            senderId: 20,
                            receiverId: bBUserObject.id,
                            body: AiResponse.data.choices[0].text,
                            date: Date.now(),
                            isRead: false
                        }

                        fetch(`http://localhost:8088/messages`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(aiMessageObject)
                        })
                            .then(() => {
                                fetchMessages()
                                // handleNewMessageClose()
                                // //clears out value of new message text area
                                // setMessage({
                                //     body: "",
                                //     receiverId: 0
                                // })
                                // setSelectedReceiverId('')
                            })

                    })



            } else {
                fetch(`http://localhost:8088/messages`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(messageObject)
                })
                    .then(() => {
                        fetchMessages()
                        handleNewMessageClose()
                        //clears out value of new message text area
                        setMessage({
                            body: "",
                            receiverId: 0
                        })
                        setSelectedReceiverId('')
                    })
            }
        } else {
            window.alert("New message cannot be blank and a recipient must be selected.")
        }
    }


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
