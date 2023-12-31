import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import "./EditAbout.css"

export const EditAbout = () => {

    // get profile id off of url

    const { profileId } = useParams()

    //use state to hold profile

    const [profile, setProfile] = useState({
        about: ""
    })

    //set up navigation hook to take you back to MyProfile on edit submission

    const navigate = useNavigate()

    //fetch profile using profileId from above

    useEffect(() => {
        fetch(`http://localhost:8088/profiles?id=${profileId}`)
            .then(res => res.json())
            .then(data => {
                setProfile(data[0])
            })
    }, [])

    //make the profile/about belongs to user

    const localBbUser = localStorage.getItem("bb_user")
    const bBUserObject = JSON.parse(localBbUser)

    if (!profile.userId) {
        return null
    }

    if (profile.userId === bBUserObject.id) {


        //write handler function to edit post

        const handleAboutEditSubmission = e => {
            e.preventDefault()

            const updatedAbout = {
                about: profile.about
            }

            return fetch(`http://localhost:8088/profiles/${profileId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updatedAbout)
            })
                .then(response => response.json())
                .then(() => {
                    navigate("/myprofile")
                })
        }

        return (
            <>

                {/* Carrying over styles and classes from registration for a lot of it*/}
          
                        <form className="form edit_form edit_form_about">
                            <h2 htmlFor="editAbout">Edit About:</h2>

                            <textarea autoFocus name="editAbout" className="input input_text input_reg input_field_colors" value={profile.about} rows="8" cols="50" onChange={
                                e => {
                                    let copy = { ...profile }
                                    copy.about = e.target.value
                                    setProfile(copy)
                                }
                            }
                            ></textarea>
                            <div className="container container_buttons_edit_about">
                                <button type="submit" className="btn btn_edit btn_submit" onClick={handleAboutEditSubmission}>Confirm Changes</button>
                                <button type="button" className="btn btn_edit btn_navigate button_exit_edit" onClick={() => { navigate('/myprofile') }}>Exit</button>
                            </div>
                        </form>
                        <div className="waves-about-transparent"></div>
              
            </>
        )
    } else {
        return <>
            <p>Nice try, loser. You're not authorized to edit this profile.</p>
        </>
    }


}