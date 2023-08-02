import { Link, NavLink, useNavigate } from "react-router-dom"
import bb_logo from "../../images/Bandblend_Logos/Logo-nav-black.png"
import "./NavBar.css"
import * as GoIcons from "react-icons/go";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import { useEffect, useState } from "react"
import "./NavBarDropDown.css"



export const Navbar = ({ sidebar, showSidebar, setSidebar }) => {

    //set up reactive nav

    const [showDropdown, setShowDropdown] = useState(false)

    const handleDropdownClick = () => {
        setSidebar(false)
        setShowDropdown(!showDropdown)
    }
    const closeMobileMenu = () => setShowDropdown(false)





    //set up new messaage notifications

    const [myReceivedMessages, setMyReceivedMessages] = useState([])
    const [newMessages, setNewMessages] = useState([])

    //fetch all messages that the receiver Id mataches the id of the current logged in user and filter for newMessages and set that too

    const localBbUser = localStorage.getItem("bb_user")
    const bBUserObject = JSON.parse(localBbUser)

    //store profile of current user
    const [currentUserProfile, setCurrentUserProfile] = useState([])

    useEffect(() => {
        fetch(`http://localhost:8088/profiles?userId=${bBUserObject.id}`)
            .then(res => res.json())
            .then(data => {
                setCurrentUserProfile(data[0])
            })
    }, [])

    const getMessages = () => {

        fetch(`http://localhost:8088/messages?receiverId=${bBUserObject.id}`)
            .then((res) => res.json())
            .then((receivedMessages) => {
                setMyReceivedMessages(receivedMessages)

                //sort through all new messages and copy over any that have an isRead property with a value of false into a new aray. This new array will then be set as newMessages

                const unreadMessages = receivedMessages.filter(message => {
                    return !message.isRead
                })

                setNewMessages(unreadMessages)
            })
    }

    useEffect(() => {
        getMessages()
    }, [])

    const handleMessageReadUpdate = () => {

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
    }

    const handleMessageTabClick = async e => {
        await closeMobileMenu()
        await showSidebar()
        await handleMessageReadUpdate()

    }


    const navigate = useNavigate()

    return (
        <>
            <nav className="container container_nav">
                <NavLink to={"/"}><img id="img_logo" className="img logo" src={bb_logo} /></NavLink>

                <div className="nav-dropdown-icon" onClick={handleDropdownClick}>
                    {
                        showDropdown

                            ?

                            <FaIcons.FaTimes fill="#000000" />
                            
                            :
                            
                            <FaIcons.FaBars fill="000000" />
                    }
                </div>

                <ul className={showDropdown ? 'nav-dropdown active ' : 'nav-dropdown'}>
                    <li className="list_item dropdown-item">
                        <NavLink to='/' className="nav-dropdown-links" onClick={closeMobileMenu}>
                            Home
                        </NavLink>
                    </li>
                    <li className="list_item dropdown-item">
                        <NavLink to={`/myprofile`} className="nav-dropdown-links" onClick={closeMobileMenu}>
                            My Profile
                        </NavLink>
                    </li>
                    <li className="list_item dropdown-item">
                        <NavLink to={"/profiles"} className="nav-dropdown-links" onClick={closeMobileMenu}>
                            All Profiles
                        </NavLink>
                    </li>
                    {

                        sidebar

                            ?

                            <li className="list_item nav_list_item_message_active dropdown-item nav-dropdown-links" onClick={handleMessageTabClick}>
                                Messages
                            </li>

                            :

                            newMessages.length

                                ?

                                <li className="list_item nav_list_item_with_new_mail dropdown-item nav-dropdown-links" onClick={handleMessageTabClick}>
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

                                <li className="list_item nav_list_item_message dropdown-item nav-dropdown-links" onClick={handleMessageTabClick}>
                                    Messages
                                </li>

                    }
                    {
                        localStorage.getItem("bb_user")
                        ? <li className="list_item  nav_list_item_logout dropdown-item">
                                <Link className="nav_list_item_link nav-dropdown-links" to="" onClick={() => {
                                    localStorage.removeItem("bb_user")
                                    setSidebar(false)
                                    navigate("/", { replace: true })
                                }}>Logout</Link>
                            </li>
                            : ""
                    }


                </ul>

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

                            <li className="list_item nav_list_item nav_list_item_message_active" onClick={handleMessageTabClick}>
                                Messages
                            </li>

                            :

                            newMessages.length

                                ?

                                <li className="list_item nav_list_item nav_list_item_with_new_mail" onClick={handleMessageTabClick}>
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

                                <li className="list_item nav_list_item nav_list_item_message" onClick={handleMessageTabClick}>
                                    Messages
                                </li>

                    }

                    {
                        localStorage.getItem("bb_user")
                            ? <li className="list_item nav_list_item nav_list_item_logout">
                                <Link className="nav_list_item_link" to="" onClick={() => {
                                    localStorage.removeItem("bb_user")
                                    setSidebar(false)
                                    navigate("/", { replace: true })
                                }}>Logout</Link>
                                <NavLink className="nav_list_item_link" to={`/myprofile`}><img className="img img_navbar_user" src={currentUserProfile.picture}/></NavLink>
                            </li>
                            : ""
                    }

                </ul>
            </nav>
        </>
    )
}