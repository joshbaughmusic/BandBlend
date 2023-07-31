import { Link, NavLink, useNavigate } from "react-router-dom"
import bb_logo from "../../images/Bandblend_Logos/Logo-nav-black.png"
import "./NavBar.css"
import * as GoIcons from "react-icons/go";
import { useEffect, useState } from "react"



export const Navbar = ({ sidebar, showSidebar, setSidebar }) => {

    //set up new messaage notifications

    const [myReceivedMessages, setMyReceivedMessages] = useState([])
    const [newMessages, setNewMessages] = useState([])

    //fetch all messages that the receiver Id mataches the id of the current logged in user and filter for newMessages and set that too

    const localBbUser = localStorage.getItem("bb_user")
    const bBUserObject = JSON.parse(localBbUser)

    const getMessages = () => {

        fetch(`http://localhost:8088/messages?receiverId=${bBUserObject.id}`)
            .then((res) => res.json())
            .then((receivedMessages) => {
                setMyReceivedMessages(receivedMessages)
    
                //sort through all new messages and copy over any that have an isRead property with a value of false into a new aray. This new array will then be set as newMessages
    
                const unreadMessages = receivedMessages.filter( message => {
                    return !message.isRead
                })
    
                setNewMessages(unreadMessages)
            })
    }

    useEffect(() => {
        getMessages()
    }, [])

    useEffect(() => {

        newMessages.map(message => {

            const updatedMessage = {
                isRead: true
            }
    
            fetch(`http://localhost:8088/messages/${message.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updatedMessage)
            })
               
                    getMessages()
               

        })

       

    }, [sidebar])


    const navigate = useNavigate()

    return (
        <>
            <nav className="container container_nav">
                <NavLink to={"/"}><img id="img_logo" className="img logo" src={bb_logo} /></NavLink>
                <ul className="list nav_list">
                    <li className="list_item nav_list_item" id="nav_list_home">
                        <NavLink className="nav_list_item_link" to="/">Home</NavLink>
                    </li>
                    <li className="list_item nav_list_item" id="nav_list_myprofile">
                        <NavLink className="nav_list_item_link" to={`/myprofile`}>My Profile</NavLink>
                    </li>
                    <li className="list_item nav_list_item">
                        <NavLink className="nav_list_item_link" to="/profiles" id="nav_list_allprofiles">All Profiles</NavLink>
                    </li>

                    {

                        sidebar

                            ?

                            <li className="list_item nav_list_item nav_list_item_message_active" onClick={showSidebar}>
                                Messages
                            </li>

                            :

                            newMessages.length

                            ?

                            <li className="list_item nav_list_item nav_list_item_with_new_mail" onClick={showSidebar}>
                                    <span>Messages</span>
                                    <GoIcons.GoMail className="icon icon_newmail" />
                                <div className="container container_newmail">
                                {
                                    <>
                                    <span className="newmail_count">{`${newMessages.length}`}</span>
                                    </>
                                }

                                </div>
                            </li>

                            :

                            <li className="list_item nav_list_item nav_list_item_message" onClick={showSidebar}>
                                Messages
                            </li>

                    }

                    {
                        localStorage.getItem("bb_user")
                            ? <li className="list_item nav_list_item nav_list_item_logout">
                                <Link className="nav_list_item_link" to="" onClick={() => {
                                    localStorage.removeItem("bb_user")
                                    // setSidebar(false)
                                    navigate("/", { replace: true })
                                }}>Logout</Link>
                            </li>
                            : ""
                    }

                </ul>
            </nav>
        </>
    )
}