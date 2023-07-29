import { useEffect, useState } from "react"
import './SaveButtonProfile.css'

//create save button with varying states:

export const SaveButtonProfile = ({ profileId }) => {

    // getting id of current profile from other profile

    const [savedProfiles, setSavedProfiles] = useState([])
    const [isSaved, setIsSaved] = useState(false)

    //get and store ID of currently logged in user:
    const localBbUser = localStorage.getItem("bb_user")
    const bBUserObject = JSON.parse(localBbUser)

    //get all saved profiles on render and everytime isSaved changes

    useEffect(() => {
        fetch(`http://localhost:8088/savedProfiles`)
            .then(res => res.json())
            .then(data => {
                setSavedProfiles(data)
            })
    }, [isSaved])


    //check to see if there is a favorite that currently exists with a matching postId and userId

    useEffect(() => {

        savedProfiles.find(savedProfile => {
            if (savedProfile.userId === bBUserObject.id && savedProfile.profileId === parseInt(profileId)) {
                setIsSaved(true)
            } else {
                setIsSaved(false)
            }
        })

    }, [savedProfiles, profileId])


    //create an event handler function for when the save button is clicked

    const handleSaveButtonClick = e => {

        if (e.target.id.startsWith('saved')) {

            const foundSavedProfileObj = savedProfiles.find(savedProfile => {
                return savedProfile.userId === bBUserObject.id && savedProfile.profileId === parseInt(profileId)})
    
            fetch(`http://localhost:8088/savedProfiles/${foundSavedProfileObj.id}`, {
                method: "DELETE",
            })
                .then(() => {
                    setIsSaved(false)
                })

        } else {

            const newSavedProfile = {
                profileId: parseInt(profileId),
                userId: bBUserObject.id
            }
    
    
            fetch(`http://localhost:8088/savedProfiles`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newSavedProfile)
            })
                .then(res => res.json())
                .then(() => {
                    setIsSaved(true)
                })
           
        }

    }

    //if isSaved is true, return the saved icon. Else return the unsaved one.

    if (!savedProfiles, !profileId) {
        return null
    }

    if (isSaved) {

        return (
            <>
                <button type="button" id={`saved--${profileId}--${bBUserObject.id}`} className="btn btn_save button_profile_primary_saved" onClick={handleSaveButtonClick}>Saved</button>
            </>
        )

    } else {

        return (
            <>
                <button type="button" id={`nonsaved--${profileId}--${bBUserObject.id}`} className="btn btn_save button_profile_primary_nonsaved button_profile_colors" onClick={handleSaveButtonClick}>Save</button>
            </>
        )
    }


}