import { Link, useNavigate } from "react-router-dom"

export const Navbar = () => {

    const navigate = useNavigate()

    return (
        <>
            <nav id="navbar">
                <img id="img_logo" clasName="img" src="../../../images/bb_logo.png"/>
                <ul className="list nav_list">
                    <li className="list_item nav_list_item">
                        <Link className="nav_list_item_link" to="/">Home</Link>
                    </li>
                    <li className="list_item nav_list_item">
                        <Link className="nav_list_item_link" to="/profiles">All Profiles</Link>
                    </li>
                    <li className="list_item nav_list_item">
                        <Link className="nav_list_item_link" to="/profile">My Profile</Link>
                    </li>
                    <li className="list_item nav_list_item">
                        <Link className="nav_list_item_link" to="">Messages</Link>
                    </li>
                    <li className="list_item nav_list_item">
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
                    </li>
                </ul>
            </nav>
        </>
    )
}