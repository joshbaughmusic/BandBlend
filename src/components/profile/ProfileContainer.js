import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { MyProfile } from "./MyProfile.js"
import { OtherProfile } from "./OtherProfile.js"

export const ProfileContainer = ({ currentUserProfile }) => {

    //recieving entire profile object of current user from parent element MainContent.js. This is used to compare against the profileId param to see if it matches. If so, display my profile. Otherwise display other profile.

    const { profileId } = useParams()

    if (parseInt(profileId) === currentUserProfile.id) {
        return <MyProfile profileId={profileId}/>
    } else {
        return <OtherProfile profileId={profileId}/>
    }
}