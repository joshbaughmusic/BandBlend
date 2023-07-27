import { Link, useNavigate } from "react-router-dom"
import bb_logo from "../../images/bb_logo.png"
import "./NavBar.css"
import { useEffect, useState } from "react"

export const Navbar = ( { showSidebar } ) => {

    // const [myProfile, setMyProfile] = useState({})
    // const localBbUser = localStorage.getItem("bb_user")
    // const bBUserObject = JSON.parse(localBbUser)

    // useEffect(() => {
    //     fetch(`http://localhost:8088/profiles?userId=${bBUserObject.userId}`)
    //     .then(res => res.json())
    //     .then(data => {
    //         setMyProfile(data)
    //     })
    // }, [])

    const navigate = useNavigate()

    return (
        <>
            <nav className="container container_nav">
                <Link to={"/"}><img id="img_logo" className="img logo" src={bb_logo}/></Link>
                <ul className="list nav_list">
                    <li className="list_item nav_list_item">
                        <Link className="nav_list_item_link" to="/">Home</Link>
                    </li>
                    <li className="list_item nav_list_item">
                        <Link className="nav_list_item_link" to={`/myprofile`}>My Profile</Link>
                    </li>
                    <li className="list_item nav_list_item">
                        <Link className="nav_list_item_link" to="/profiles">All Profiles</Link>
                    </li>
                    <li className="list_item nav_list_item" onClick={showSidebar}>
                        Messages
                    </li>
                    
                        {
                            localStorage.getItem("bb_user")
                                ? <li className="list_item nav_list_item nav_list_item_logout">
                                    <Link className="nav_list_item_link" to="" onClick={() => {
                                        localStorage.removeItem("bb_user")
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