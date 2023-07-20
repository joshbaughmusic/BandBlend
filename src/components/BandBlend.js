import { Route, Routes } from "react-router-dom"
import { Authorized } from "./auth/Authorized.js"
import { Login } from "./auth/Login.js"
import { Register } from "./auth/Register.js"
import { MainContent } from "./mainContent/MainContent.js"
import { Navbar } from "./nav/Navbar.js"
import { Sidebar } from "./sidebar/Sidebar.js"
import "./BandBlend.css"

export const BandBlend = () => {

  return <>
  <div className="container container_grid_all">
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={
        <Authorized>
          <>
            <Navbar />
            <Sidebar />
            <MainContent />

          </>
        </Authorized>
      } />
    </Routes>
  </div>
</>
}
