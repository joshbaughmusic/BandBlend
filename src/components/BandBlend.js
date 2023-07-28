import { Route, Routes } from "react-router-dom"
import { Authorized } from "./auth/Authorized.js"
import { Login } from "./auth/Login.js"
import { RegisterUser } from "./auth/RegisterUser.js"
import { MainContent } from "./mainContent/MainContent.js"
import { Navbar } from "./nav/Navbar.js"
import { RegisterProfile } from "./auth/RegisterProfile.js"
import { RegisterTags } from "./auth/RegisterTags.js"
import { RegisterSubGenres } from "./auth/RegisterSubGenres.js"
import { MessagesSidebar } from "./messagesSidebar/MessagesSidebar.js"
import { useState } from "react"
import "./BandBlend.css"
import "./Colors.css"
import "./Backgrounds.css"

export const BandBlend = () => {


  //message and selectedReceiverId being defined here so they can both go to the children compoinetns to handle reply and message being selected. Being passed down into messageSidebar => message, newmessage and mainContent => otherProfile
  const [selectedReceiverId, setSelectedReceiverId] = useState('');
  const [message, setMessage] = useState({
    body: "",
    receiverId: ''
  })
  //state to handle whether or not to show new message form also for handling reply and message click

  const [showNewMessage, setShowNewMessage] = useState(false);



  //defining sidebar stuff here so it can go to sidebar, nav, and main content
  //states to handle whether or not to show the sidebar
  const [sidebar, setSidebar] = useState(false)

  //function to handle open of side bar
  const showSidebar = () => setSidebar(!sidebar)


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
              <Navbar showSidebar={showSidebar}/>
              <MessagesSidebar message={message} setMessage={setMessage} selectedReceiverId={selectedReceiverId} setSelectedReceiverId={setSelectedReceiverId} showNewMessage={showNewMessage} setShowNewMessage={setShowNewMessage} sidebar={sidebar}  showSidebar={showSidebar}/>
              <MainContent message={message} setMessage={setMessage} selectedReceiverId={selectedReceiverId} setSelectedReceiverId={setSelectedReceiverId} showNewMessage={showNewMessage} setShowNewMessage={setShowNewMessage} sidebar={sidebar} setSidebar={setSidebar}/>

            </>
          </Authorized>
        } />
      </Routes>
    </div>
  </>
}
