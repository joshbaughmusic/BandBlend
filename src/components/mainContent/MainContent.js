import { Route, Routes } from "react-router-dom"
import { Homepage } from "../homepage/Homepage.js"
import { ProfilesAllList } from "../profile/ProfilesAllList.js"
import { OtherProfile } from "../profile/OtherProfile.js"
import { MyProfile } from "../profile/MyProfile.js"

export const MainContent = ( {currentUserProfileId} ) => {

    //get props in from bandblend currentUserProfileId={currentUserProfileId}

    return (
        <>  
            <Routes>
                <Route path="/" element={ <Homepage />}/>
                <Route path="profiles" element={ <ProfilesAllList />} />
                <Route path="profiles/:profileId" element={<OtherProfile />} />
                <Route path={`profiles/${currentUserProfileId}`} element={<MyProfile />} />

            </Routes>
            
        </>
    )
}