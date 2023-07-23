import { useEffect, useState } from "react"
import "./NewMessage.css"

export const NewMessage = ({ handleNewMessageClose, handleNewMessageShow, fetchMessages, selectedReceiverId, setSelectedReceiverId, message, setMessage }) => {

    const [users, setUsers] = useState([])


    const localBbUser = localStorage.getItem("bb_user")
    const bBUserObject = JSON.parse(localBbUser)

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
            date: Date.now()
        }

        if (message.body !== "" && message.receiverId) {
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
                    //clears out value of new post text area
                    setMessage({
                        body: "",
                        receiverId: 0
                    })
                    setSelectedReceiverId('')
                })
        } else {
            window.alert("New message cannot be blank and a recipient must be selected.")
        }
    }


    return (
        <>
            <form className="form form_new_message">
                <fieldset>
                    <textarea autoFocus name="newMessage" className="input input_text" placeholder="Compose Message..." rows="7" cols="30" onChange={
                        e => {
                            const copy = { ...message }
                            copy.body = e.target.value
                            setMessage(copy)
                        }
                    }
                    ></textarea>
                </fieldset>
                <fieldset>
                    <select required defaultValue={null} name="dropdown dropdown_message_receiver" className="input input_select" value={selectedReceiverId} onChange={e => {
                        setSelectedReceiverId(e.target.value)
                        const [, userId] = e.target.value.split("--")
                        let copy = { ...message }
                        copy.receiverId = parseInt(userId)
                        setMessage(copy)
                    }}>
                        <option key={`user--null`} value={null} ><span className="selection_placeholder">-select a recipient-</span></option>
                        {
                            users.map(user => {
                                return <option key={`userKey--${user.id}`} value={`user--${user.id}`}>{user.name}</option>

                            })
                        }
                    </select>
                </fieldset>
                <br />
                <button type="submit" className="btn btn_profile btn_submit" onClick={handleSubmitNewMessageClick}>Submit Message</button>
                <button type="button" className="btn btn_profile btn_close" onClick={handleNewMessageClose}>Close</button>
            </form>
        </>
    )
}
