import { useParams } from "react-router-dom"
import { MyProfile } from "./MyProfile.js"
import { OtherProfile } from "./OtherProfile.js"

export const ProfileContainer = () => {

    const { profileId } = useParams()

    const localBbUser = localStorage.getItem("bb_user")
    const bbUserObject = JSON.parse(localBbUser)

    //insert logic to check if the profile is owned by the current user or not

    if (bbUserObject) {
        return <MyProfile profileId={profileId}/>
    } else {
        return <OtherProfile profileId={profileId}/>
    }
}