import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { MyProfile } from "./MyProfile.js"
import { OtherProfile } from "./OtherProfile.js"

export const ProfileContainer = ({ currentUserProfile }) => {

    //recieving entire profile object of current user from parent element MainContent.js. This is used to compare against the profileId param to see if it matches. If so, display my profile. Otherwise display other profile.

    const { profileId } = useParams()

    if (parseInt(profileId) === currentUserProfile.id) {
        //if current user's profile, send whole profile object with embeds and expands to be used with minimal fetch calls in child component MyProfile.js
        return <MyProfile currentUserProfile={currentUserProfile}/>
    } else {
        //if not the current user's profile, just passing the profile id so it can be pulled in child component OtherProfile.js
        return <OtherProfile otherProfileId={profileId}/>
    }
}