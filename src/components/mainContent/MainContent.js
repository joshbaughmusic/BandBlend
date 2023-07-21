import { Route, Routes } from "react-router-dom"
import { Homepage } from "../homepage/Homepage.js"
import { ProfilesAllList } from "../profile/ProfilesAllList.js"
import { OtherProfile } from "../profile/OtherProfile.js"
import { MyProfile } from "../profile/MyProfile.js"
import { EditPost } from "../posts/EditPost.js"
import { EditAbout } from "../profile/EditAbout.js"
import { EditTags } from "../profile/EditTags.js"
import { EditSubGenres } from "../profile/EditSubGenres.js"
import { EditPrimaryInfo } from "../profile/EditPrimaryInfo.js"

export const MainContent = () => {

    //main content is where everything that isn't the nav and sidebar is displayed, mainly profile views and the homepage

    return (
        <>  <main className="container container_main">
            <Routes>
                <Route path="/" element={ <Homepage />}/>
                <Route path="profiles" element={ <ProfilesAllList />} />
                <Route path="myprofile" element={<MyProfile />} />
                <Route path="myprofile/edit/post/:postId" element={<EditPost />} />
                <Route path="myprofile/edit/about/:profileId" element={<EditAbout />} />
                <Route path="myprofile/edit/primaryinfo/:profileId" element={<EditPrimaryInfo />} />
                <Route path="myprofile/edit/tags/:profileId" element={<EditTags />} />
                <Route path="myprofile/edit/subgenres/:profileId" element={<EditSubGenres />} />
                <Route path="profiles/:profileId" element={<OtherProfile />} />
            </Routes>
            </main>
            
        </>
    )
}