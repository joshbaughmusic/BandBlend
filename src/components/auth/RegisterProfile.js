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

        if(bBUserObject.isBand) {

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
            <form className="form profile_register_form profile_register_form_primary_info">
                <label>Enter Profile Primary Info: <span className="optional">(Don't worry, you can change this later)</span></label>
                <fieldset>
                    <label htmlFor="profile_register_Picture">Profile Picture URL:</label>
                    <br />
                    <input required type="url" name="profile_register_Picture" className="input input_text" placeholder="Enter URL" value={profile.picture} onChange={
                        e => {
                            let copy = { ...profile }
                            copy.picture = e.target.value
                            setProfile(copy)
                        }
                    }
                    ></input>
                </fieldset>
                <fieldset>
                    <label htmlFor="profile_register_Location">Location:</label>
                    <br />
                    <input required type="text" name="profile_register_Location" className="input input_text" placeholder="City, State" value={profile.location} onChange={
                        e => {
                            let copy = { ...profile }
                            copy.location = e.target.value
                            setProfile(copy)
                        }
                    }
                    ></input>
                </fieldset>
                {
                    bBUserObject.isBand

                        ?

                        ""
                        :

                        <fieldset>
                            <label htmlFor="profile_register_PrimaryInstrument">Primary Instrument:</label>
                            <br />
                            <select required name="profile_register_PrimaryInstrument" className="input input_select" onChange={e => {
                                const [, instrumentId] = e.target.value.split("--")
                                let copy = { ...profile }
                                copy.primaryInstrumentId = parseInt(instrumentId)
                                setProfile(copy)
                            }}>
                                <option key={`primaryinstrument--null`} value={null} ><span className="selection_placeholder">-select an instrument-</span></option>
                                {
                                    primaryInstruments.map(instrument => {
                                        return <option key={`primaryinstrument--${instrument.id}`} value={`primaryinstrument--${instrument.id}`}>{instrument.name}</option>

                                    })
                                }
                            </select>
                        </fieldset>
                }
                <fieldset>
                    <label htmlFor="profile_register_PrimaryGenre">Primary Genre:</label>
                    <br />
                    <select required name="profile_register_PrimaryGenre" className="input input_select" onChange={e => {
                        const [, genreId] = e.target.value.split("--")
                        let copy = { ...profile }
                        copy.primaryGenreId = parseInt(genreId)
                        setProfile(copy)
                    }}>
                        <option key={`primarygenre--null`} value={null} ><span className="selection_placeholder">-select a genre-</span></option>
                        {
                            primaryGenres.map(genre => {
                                return <option key={`primarygenre--${genre.id}`} value={`primarygenre--${genre.id}`}>{genre.name}</option>

                            })
                        }
                    </select>
                </fieldset>
                <fieldset>
                    <label htmlFor="profile_register_Spotify">Spotify URL: <span className="optional">(optional)</span></label>
                    <br />
                    <input type="url" name="profile_register_Spotify" className="input input_text" placeholder="Enter URL" value={profile.spotify} onChange={
                        e => {
                            let copy = { ...profile }
                            copy.spotify = e.target.value
                            setProfile(copy)
                        }
                    }
                    ></input>
                </fieldset>
                <fieldset>
                    <label htmlFor="profile_register_Facebook">Facebook URL: <span className="optional">(optional)</span></label>
                    <br />
                    <input type="url" name="profile_register_Facebook" className="input input_text" placeholder="Enter URL" value={profile.facebook} onChange={
                        e => {
                            let copy = { ...profile }
                            copy.facebook = e.target.value
                            setProfile(copy)
                        }
                    }
                    ></input>
                </fieldset>
                <fieldset>
                    <label htmlFor="profile_register_Instagram">Instagram URL: <span className="optional">(optional)</span></label>
                    <br />
                    <input type="url" name="profile_register_Instagram" className="input input_text" placeholder="Enter URL" value={profile.instagram} onChange={
                        e => {
                            let copy = { ...profile }
                            copy.instagram = e.target.value
                            setProfile(copy)
                        }
                    }
                    ></input>
                </fieldset>
                <fieldset>
                    <label htmlFor="profile_register_Tiktok">TikTok URL: <span className="optional">(optional)</span></label>
                    <br />
                    <input type="url" name="profile_register_Tiktok" className="input input_text" placeholder="Enter URL" value={profile.tiktok} onChange={
                        e => {
                            let copy = { ...profile }
                            copy.tiktok = e.target.value
                            setProfile(copy)
                        }
                    }
                    ></input>
                </fieldset>
                <fieldset>
                    <label htmlFor="profile_register)About">About Me</label>
                    <br />
                    <textarea autoFocus placeholder="Tell people a little about yourself!" name="profile_register_About" className="input input_text" value={profile.about} rows="8" cols="50" onChange={
                        e => {
                            let copy = { ...profile }
                            copy.about = e.target.value
                            setProfile(copy)
                        }
                    }
                    ></textarea>
                </fieldset>

                <br />
                <button type="submit" className="btn btn_profile_register btn_submit" onClick={handleProfileRegistration}>Submit Profile</button>
            </form>
        </>
    )

}

