import { Link, NavLink, useNavigate } from "react-router-dom"
import bb_logo from "../../images/Bandblend_Logos/Logo-nav-white.png"
import "./NavBar.css"
import { useEffect, useState } from "react"

export const Navbar = ({ sidebar, showSidebar }) => {

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

                            <li className="list_item nav_list_item" onClick={showSidebar}>
                                Messages
                            </li>

                    }

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