import { Route, Routes } from "react-router-dom"
import { Homepage } from "../homepage/Homepage.js"
import { ProfilesAllList } from "../profile/ProfilesAllList.js"
import { ProfileContainer } from "../profile/ProfileContainer.js"

export const MainContent = ({ currentUserProfile }) => {

    //recieving entire profile object of current user from parent element BandBlend.js. This is being sent down a couple levels to be used by ParentContainer.js to check if current profile being viewed belongs to user or not.

    return (
        <>  <main className="container container_main">
            <Routes>
                <Route path="/" element={ <Homepage currentUserProfile={currentUserProfile} />}/>
                <Route path="profiles" element={ <ProfilesAllList />} />
                <Route path="profiles/:profileId" element={<ProfileContainer currentUserProfile={currentUserProfile} />} />
            </Routes>
            </main>
            
        </>
    )
}