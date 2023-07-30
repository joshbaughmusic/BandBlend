import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export const RegisterProfile = () => {
    const [profile, setProfile] = useState({
        userId: "",
        picture: "",
        location: "",
        about: "",
        primaryInstrumentId: 16,
        primaryGenreId: 0,
        spotify: "",
        facebook: "",
        instagram: "",
        tiktok: ""
    })

    const localBbUser = localStorage.getItem("bb_user")
    const bBUserObject = JSON.parse(localBbUser)

    let navigate = useNavigate()

    //use state to hold primary genres and instruments

    const [primaryGenres, setPrimaryGenres] = useState([])
    const [primaryInstruments, setPrimaryInstruments] = useState([])

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

    //set handler to submit profile info to API when button is clicked

    const handleProfileRegistration = e => {
        e.preventDefault()

        const newPrimaryInfoObj = {
            userId: bBUserObject.id,
            picture: profile.picture,
            location: profile.location,
            about: profile.about,
            primaryInstrumentId: profile.primaryInstrumentId,
            primaryGenreId: profile.primaryGenreId,
            spotify: profile.spotify,
            facebook: profile.facebook,
            instagram: profile.instagram,
            tiktok: profile.tiktok
        }

        if (bBUserObject.isBand) {

            //if the user is a band, dont make it required to have a primary instrument since they can't pick one

            if (newPrimaryInfoObj.picture && newPrimaryInfoObj.location && newPrimaryInfoObj.primaryGenreId) {

                return fetch(`http://localhost:8088/profiles`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(newPrimaryInfoObj)
                })
                    .then(response => response.json())
                    .then((data) => {
                        console.log(data)
                        const newProfileId = data.id;
                        navigate(`/register/tags/${newProfileId}`)
                    })
            } else {
                window.alert("Please fill out all non-optional forms.")
            }
        } else {

            if (newPrimaryInfoObj.picture && newPrimaryInfoObj.location && newPrimaryInfoObj.primaryInstrumentId && newPrimaryInfoObj.primaryGenreId) {

                return fetch(`http://localhost:8088/profiles`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(newPrimaryInfoObj)
                })
                    .then(response => response.json())
                    .then((data) => {
                        console.log(data)
                        const newProfileId = data.id;
                        navigate(`/register/tags/${newProfileId}`)
                    })
            } else {
                window.alert("Please fill out all non-optional forms.")
            }
        }

    }

    return (
        <>

            {/* copied over homepage content for background and logos, leaving css the same here for that part of it */}

            <section className="waves-regprofile container container_homepage">
                <div className="container container_homepage_inner">

                    <form className="form profile_register_form profile_register_form_primary_info">
                        <div className="container container_regprofile_header">
                        <h2 className="label_regprofile">Enter Profile Primary Info:</h2>
                        <p className="optional">(Don't worry, you can change this later)</p>
                        </div>
                        <label htmlFor="profile_register_Picture">Profile Picture URL:</label>

                        <input required type="url" name="profile_register_Picture" className="input input_text input_reg input_field_colors" placeholder="Enter URL" value={profile.picture} onChange={
                            e => {
                                let copy = { ...profile }
                                copy.picture = e.target.value
                                setProfile(copy)
                            }
                        }
                        ></input>
                        <label htmlFor="profile_register_Location">Location:</label>

                        <input required type="text" name="profile_register_Location" className="input input_text input_reg input_field_colors" placeholder="City, State Code" value={profile.location} onChange={
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

                                            <label htmlFor="profile_register_PrimaryInstrument">Primary Instrument:</label>
                                   
                                    <select required name="profile_register_PrimaryInstrument" className="input input_select input_reg input_field_colors" onChange={e => {
                                        const [, instrumentId] = e.target.value.split("--")
                                        let copy = { ...profile }
                                        copy.primaryInstrumentId = parseInt(instrumentId)
                                        setProfile(copy)
                                    }}>
                                        <option key={`primaryinstrument--null`} value={null} ><span className="selection_placeholder input_field_colors ">-select an instrument-</span></option>
                                        {
                                            primaryInstruments.map(instrument => {
                                                return <option key={`primaryinstrument--${instrument.id}`} value={`primaryinstrument--${instrument.id}`} className="input_field_colors">{instrument.name}</option>

                                            })
                                        }
                                    </select>
                                    </>
                        }
                        <label htmlFor="profile_register_PrimaryGenre">Primary Genre:</label>

                        <select required name="profile_register_PrimaryGenre" className="input input_select input_reg input_field_colors" onChange={e => {
                            const [, genreId] = e.target.value.split("--")
                            let copy = { ...profile }
                            copy.primaryGenreId = parseInt(genreId)
                            setProfile(copy)
                        }}>
                            <option key={`primarygenre--null`} value={null} ><span className="selection_placeholder input_field_colors">-select a genre-</span></option>
                            {
                                primaryGenres.map(genre => {
                                    return <option key={`primarygenre--${genre.id}`} value={`primarygenre--${genre.id}`} className="input_field_colors">{genre.name}</option>

                                })
                            }
                        </select>
                        <label htmlFor="profile_register_Spotify">Spotify URL: <span className="optional">(optional)</span></label>

                        <input type="url" name="profile_register_Spotify" className="input input_text input_reg input_field_colors" placeholder="Enter URL" value={profile.spotify} onChange={
                            e => {
                                let copy = { ...profile }
                                copy.spotify = e.target.value
                                setProfile(copy)
                            }
                        }
                        ></input>
                        <label htmlFor="profile_register_Facebook">Facebook URL: <span className="optional">(optional)</span></label>

                        <input type="url" name="profile_register_Facebook" className="input input_text input_reg input_field_colors" placeholder="Enter URL" value={profile.facebook} onChange={
                            e => {
                                let copy = { ...profile }
                                copy.facebook = e.target.value
                                setProfile(copy)
                            }
                        }
                        ></input>
                        <label htmlFor="profile_register_Instagram">Instagram URL: <span className="optional">(optional)</span></label>

                        <input type="url" name="profile_register_Instagram" className="input input_text input_reg input_field_colors" placeholder="Enter URL" value={profile.instagram} onChange={
                            e => {
                                let copy = { ...profile }
                                copy.instagram = e.target.value
                                setProfile(copy)
                            }
                        }
                        ></input>
                        <label htmlFor="profile_register_Tiktok">TikTok URL: <span className="optional">(optional)</span></label>

                        <input type="url" name="profile_register_Tiktok" className="input input_text input_reg input_field_colors" placeholder="Enter URL" value={profile.tiktok} onChange={
                            e => {
                                let copy = { ...profile }
                                copy.tiktok = e.target.value
                                setProfile(copy)
                            }
                        }
                        ></input>
                        <label htmlFor="profile_register)About">About Me</label>

                        <textarea autoFocus placeholder="Tell people a little about yourself!" name="profile_register_About" className="input input_text input_reg input_field_colors" value={profile.about} rows="8" cols="50" onChange={
                            e => {
                                let copy = { ...profile }
                                copy.about = e.target.value
                                setProfile(copy)
                            }
                        }
                        ></textarea>


                        <button type="submit" className="btn btn_profile_register btn_submit button_profile_colors button-loginreg" onClick={handleProfileRegistration}>Submit Profile</button>
                    </form>

                </div>
            </section >
        </>
    )

}

