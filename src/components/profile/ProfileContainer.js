import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { MyProfile } from "./MyProfile.js"
import { OtherProfile } from "./OtherProfile.js"

export const ProfileContainer = () => {

    const { profileId } = useParams()

    const [profile, setProfile] = useState([])

    //will need to set logic to determine if the profile being viewed belongs to the current user or not. If so, show a different view.

    //get current user object from local storage

    const localBbUser = localStorage.getItem("bb_user")
    const bBUserObject = JSON.parse(localBbUser)

    //get profiles

    useEffect(() => {
        fetch(`http://localhost:8088/profiles?userId=${bBUserObject.id}`)
        .then(res => res.json())
        .then(data => {
            setProfile(data[0])
        })
    }, [])

    //find profile object using profile id

    if (!profile) {
        return null
    }

    if (parseInt(profile.userId) === bBUserObject.id) {
        return <MyProfile profileId={profileId} profile={profile}/>
    } else {
        return <OtherProfile profileId={profileId} profile={profile}/>
    }
}