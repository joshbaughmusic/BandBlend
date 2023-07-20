import { Route, Routes } from "react-router-dom"
import { Homepage } from "../homepage/Homepage.js"
import { ProfilesAllList } from "../profile/ProfilesAllList.js"
import { OtherProfile } from "../profile/OtherProfile.js"
import { MyProfile } from "../profile/MyProfile.js"

export const MainContent = () => {

    //main content is where everything that isn't the nav and sidebar is displayed, mainly profile views and the homepage

    return (
        <>  <main className="container container_main">
            <Routes>
                <Route path="/" element={ <Homepage />}/>
                <Route path="profiles" element={ <ProfilesAllList />} />
                <Route path="myprofile" element={<MyProfile />} />
                <Route path="profiles/:profileId" element={<OtherProfile />} />
            </Routes>
            </main>
            
        </>
    )
}