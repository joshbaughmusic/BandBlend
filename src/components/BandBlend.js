import { Route, Routes } from "react-router-dom"
import { Authorized } from "./auth/Authorized.js"
import { Login } from "./auth/Login.js"
import { Register } from "./auth/Register.js"
import { MainContent } from "./mainContent/MainContent.js"
import { Navbar } from "./nav/Navbar.js"
import { Sidebar } from "./sidebar/Sidebar.js"
import { useEffect, useState } from "react"

export const BandBlend = () => {

  //get the profile object of the current user. Need the userId property on it. This will be passed down multiple levels in two ways. It will go to nav so that the id can be used in the URL for the my profile nav item. It will also go to profile container so that it can be used to compare and see if profile being viewed should show as user's owned profile or not.

  const [profile, setProfile] = useState([])

  const localBbUser = localStorage.getItem("bb_user")
  const bBUserObject = JSON.parse(localBbUser)

  useEffect(() => {
    fetch(`http://localhost:8088/profiles?userId=${bBUserObject.id}`)
    .then(res => res.json())
    .then(data => {
        setProfile(data[0])
    })
}, [])

  const currentUserProfile = profile

  //then set up routing and pass props accordingly

  return <Routes>
    <Route path="/login" element={<Login />} />
		<Route path="/register" element={<Register />} />
    <Route path="*" element={
			<Authorized>
				<>
          <Navbar currentUserProfile={currentUserProfile}/>
          <Sidebar />
					<MainContent currentUserProfile={currentUserProfile}/>

				</>
			</Authorized>

		} />

  </Routes>
}
