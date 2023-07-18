import { Route, Routes } from "react-router-dom"
import { Authorized } from "./auth/Authorized.js"
import { Login } from "./auth/Login.js"
import { Register } from "./auth/Register.js"
import { MainContent } from "./mainContent/MainContent.js"
import { Navbar } from "./nav/Navbar.js"
import { Sidebar } from "./sidebar/Sidebar.js"

export const BandBlend = () => {

  //enter in logic to get userProfile. This will be sent as prop to navbar and maincontent. Navbar will use it to power myProfile link. Maincontent to set the route.

  const localBbUser = localStorage.getItem("bb_user")
  const bBUserObject = JSON.parse(localBbUser)

  const currentUserProfileId = bBUserObject.id

  return <Routes>
    <Route path="/login" element={<Login />} />
		<Route path="/register" element={<Register />} />
    <Route path="*" element={
			<Authorized>
				<>
          <Navbar currentUserProfileId={currentUserProfileId}/>
          <Sidebar />
					<MainContent currentUserProfileId={currentUserProfileId}/>

				</>
			</Authorized>

		} />

  </Routes>
}
