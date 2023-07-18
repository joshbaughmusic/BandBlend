import { Route, Routes } from "react-router-dom"
import { Homepage } from "../homepage/Homepage.js"
import { ProfilesAllList } from "../profile/ProfilesAllList.js"
import { ProfileContainer } from "../profile/ProfileContainer.js"

export const MainContent = () => {

    return (
        <>  
            <Routes>
                <Route path="/" element={ <Homepage />}/>
                <Route path="profiles" element={ <ProfilesAllList />} />
                <Route path="profiles/:profileId" element={<ProfileContainer />} />
            </Routes>
            
        </>
    )
}