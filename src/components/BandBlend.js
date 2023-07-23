import { Route, Routes } from "react-router-dom"
import { Authorized } from "./auth/Authorized.js"
import { Login } from "./auth/Login.js"
import { RegisterUser } from "./auth/RegisterUser.js"
import { MainContent } from "./mainContent/MainContent.js"
import { Navbar } from "./nav/Navbar.js"
import "./BandBlend.css"
import { RegisterProfile } from "./auth/RegisterProfile.js"
import { RegisterTags } from "./auth/RegisterTags.js"
import { RegisterSubGenres } from "./auth/RegisterSubGenres.js"
import { MessagesSidebar } from "./messagesSidebar/MessagesSidebar.js"

export const BandBlend = () => {

  return <>
  <div className="container container_grid_all">
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register/user" element={<RegisterUser />} />
      <Route path="/register/profile/:userId" element={<RegisterProfile />} />
      <Route path="/register/tags/:profileId" element={<RegisterTags />} />
      <Route path="/register/subgenres/:profileId" element={<RegisterSubGenres />} />
      <Route path="*" element={
        <Authorized>
          <>
            <Navbar />
            <MessagesSidebar />
            <MainContent />

          </>
        </Authorized>
      } />
    </Routes>
  </div>
</>
}
