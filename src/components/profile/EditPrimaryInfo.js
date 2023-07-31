import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import "./EditPrimaryInfo.css"

export const EditPrimaryInfo = () => {

    // get profile id off of url

    const { profileId } = useParams()

    //use state to hold profile

    const [profile, setProfile] = useState({
        picture: "",
        location: "",
        primaryInstrumentId: "",
        primaryGenreId: "",
        spotify: "",
        facebook: "",
        instagram: "",
        tiktok: ""
    })

    //use state to hold primary genres and primary instruments

    const [primaryGenres, setPrimaryGenres] = useState([])
    const [primaryInstruments, setPrimaryInstruments] = useState([])

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

    //fetch primary genres

    useEffect(() => {
        fetch(`http://localhost:8088/primaryGenres`)
            .then(res => res.json())
            .then(data => {
                setPrimaryGenres(data)
            })
    }, [])

    //fetch primary instruments

    useEffect(() => {
        fetch(`http://localhost:8088/primaryInstruments?id_ne=17`)
            .then(res => res.json())
            .then(data => {
                setPrimaryInstruments(data)
            })
    }, [])

    //write function to handle edit submission click

    const handlePrimaryInfoEditSubmission = e => {
        e.preventDefault()

        const newPrimaryInfoObj = {
            picture: profile.picture,
            location: profile.location,
            primaryInstrumentId: profile.primaryInstrumentId,
            primaryGenreId: profile.primaryGenreId,
            spotify: profile.spotify,
            facebook: profile.facebook,
            instagram: profile.instagram,
            tiktok: profile.tiktok
        }

        if (newPrimaryInfoObj.picture && newPrimaryInfoObj.location && newPrimaryInfoObj.primaryGenreId) {

            return fetch(`http://localhost:8088/profiles/${profileId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newPrimaryInfoObj)
            })
                .then(response => response.json())
                .then(() => {
                    navigate("/myprofile")
                })
        } else {
            window.alert("Please fill out all non-optional forms.")
        }
    }

    //make sure the profile/about belongs to user

    const localBbUser = localStorage.getItem("bb_user")
    const bBUserObject = JSON.parse(localBbUser)

    if (!profile.userId) {
        return null
    }

    if (profile.userId === bBUserObject.id) {

        return (
            <>

                {/* Carrying over styles and classes from registration for a lot of it*/}
                
                        <form className="form edit_form edit_form_primaryinfo">
                            <h2>Edit Primary Info:</h2>

                            <label htmlFor="editPicture">Profile Picture URL:</label>
                            <br />
                            <input required type="url" name="editPicture" className="input input_text input_reg input_field_colors" value={profile.picture} onChange={
                                e => {
                                    let copy = { ...profile }
                                    copy.picture = e.target.value
                                    setProfile(copy)
                                }
                            }
                            ></input>

                            <label htmlFor="editLocation">Location:</label>
                            <br />
                            <input required type="text" name="editLocation" className="input input_text input_reg input_field_colors" value={profile.location} onChange={
                                e => {
                                    let copy = { ...profile }
                                    copy.location = e.target.value
                                    setProfile(copy)
                                }
                            }
                            ></input>

                            {
                                bBUserObject.isBand

                                    ?

                                    ""

                                    :

                                    <>
                                        <label htmlFor="editPrimaryInstrument">Primary Instrument:</label>
                                        <br />
                                        <select required name="editPrimaryInstrument" className="input input_select input_reg input_field_colors" onChange={e => {
                                            const [, instrumentId] = e.target.value.split("--")
                                            let copy = { ...profile }
                                            copy.primaryInstrumentId = parseInt(instrumentId)
                                            setProfile(copy)
                                        }}>
                                            {
                                                primaryInstruments.map(instrument => {
                                                    if (instrument.id === profile.primaryInstrumentId) {
                                                        return <option selected key={`primaryinstrumentkey--${instrument.id}`} value={`primaryinstrument--${instrument.id}`}>{instrument.name}</option>
                                                    } else {
                                                        return <option key={`primaryinstrumentkey--${instrument.id}`} value={`primaryinstrument--${instrument.id}`}>{instrument.name}</option>
                                                    }
                                                })
                                            }
                                        </select>
                                    </>



                            }

                            <label htmlFor="editPrimaryGenre">Primary Genre:</label>
                            <br />
                            <select required name="editPrimaryGenre" className="input input_select input_reg input_field_colors" onChange={e => {
                                const [, genreId] = e.target.value.split("--")
                                let copy = { ...profile }
                                copy.primaryGenreId = parseInt(genreId)
                                setProfile(copy)
                            }}>
                                {
                                    primaryGenres.map(genre => {
                                        if (genre.id === profile.primaryGenreId) {
                                            return <option selected key={`primarygenrekey--${genre.id}`} value={`primarygenre--${genre.id}`}>{genre.name}</option>
                                        } else {
                                            return <option key={`primarygenrekey--${genre.id}`} value={`primarygenre--${genre.id}`}>{genre.name}</option>
                                        }
                                    })
                                }
                            </select>



                            <label htmlFor="editSpotify">Spotify URL: <span className="optional">(optional)</span></label>
                            <br />
                            <input type="url" name="editSpotify" className="input input_text input_reg input_field_colors" value={profile.spotify} onChange={
                                e => {
                                    let copy = { ...profile }
                                    copy.spotify = e.target.value
                                    setProfile(copy)
                                }
                            }
                            ></input>

                            <label htmlFor="editFacebook">Facebook URL: <span className="optional">(optional)</span></label>
                            <br />
                            <input type="url" name="editFacebook" className="input input_text input_reg input_field_colors" value={profile.facebook} onChange={
                                e => {
                                    let copy = { ...profile }
                                    copy.facebook = e.target.value
                                    setProfile(copy)
                                }
                            }
                            ></input>

                            <label htmlFor="editInstagram">Instagram URL: <span className="optional">(optional)</span></label>
                            <br />
                            <input type="url" name="editInstagram" className="input input_text input_reg input_field_colors" value={profile.instagram} onChange={
                                e => {
                                    let copy = { ...profile }
                                    copy.instagram = e.target.value
                                    setProfile(copy)
                                }
                            }
                            ></input>

                            <label htmlFor="editTiktok">TikTok URL: <span className="optional">(optional)</span></label>
                            <br />
                            <input type="url" name="editTiktok" className="input input_text input_reg input_field_colors" value={profile.tiktok} onChange={
                                e => {
                                    let copy = { ...profile }
                                    copy.tiktok = e.target.value
                                    setProfile(copy)
                                }
                            }
                            ></input>
                            <div className="container container_buttons_edit_primaryinfo">
                            <button type="submit" className="btn btn_edit btn_submit" onClick={handlePrimaryInfoEditSubmission}>Confirm Changes</button>
                            <button type="button" className="btn btn_edit btn_navigate button_exit_edit" onClick={() => { navigate('/myprofile') }}>Exit</button>
                            </div>
                        </form>
              

                <div className="waves-primary-transparent"></div>
            </>
        )
    } else {
        return <p>Nice try, loser. You're not authorized to edit this profile.</p>
    }
}