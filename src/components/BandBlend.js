import { Route, Routes } from "react-router-dom"
import { Authorized } from "./auth/Authorized.js"
import { Login } from "./auth/Login.js"
import { Register } from "./auth/Register.js"
import { MainContent } from "./mainContent/MainContent.js"
import { Navbar } from "./nav/Navbar.js"
import { Sidebar } from "./sidebar/Sidebar.js"

export const BandBlend = () => {

  //enter in logic to get userProfile 

  const currentUserProfileId = null

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
