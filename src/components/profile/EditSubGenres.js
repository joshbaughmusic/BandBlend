import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./EditSubGenres.css"

export const EditSubGenres = () => {
    const [subgenres, setSubgenres] = useState([]);
    const [subGenreCol1, setSubGenreCol1] = useState([]);
    const [subGenreCol2, setSubGenreCol2] = useState([]);
    const [selectedSubGenres, setSelectedSubGenres] = useState([]);
    const [count, setCount] = useState(0)
    const [showSpinner, setShowSpinner] = useState(false)

    //get currentUserProfile to make sure they have rights to access this page for this profile

    const [currentUserProfile, setCurrentUserProfile] = useState([])

    const localBbUser = localStorage.getItem("bb_user")
    const bBUserObject = JSON.parse(localBbUser)

    useEffect(() => {
        fetch(`http://localhost:8088/profiles?userId=${bBUserObject.id}`)
            .then(res => res.json())
            .then(data => {
                setCurrentUserProfile(data[0])
            })
    }, [])

    const navigate = useNavigate()

    //store the full current profile tags so they can be deleted

    const [currentProfileSubGenres, setCurrentProfileSubGenres] = useState([])


    // get profile id off of url
    const { profileId } = useParams();

    //get all subgenres

    useEffect(() => {
        fetch(`http://localhost:8088/subgenres`)
            .then((res) => res.json())
            .then((data) => {
                setSubgenres(data);

                //split subgenres list in hald and store in two different variables so they can be mapped and put into different coloumns in jsx

                const subGenreListLength = data.length
                const midpoint = Math.floor(subGenreListLength / 2);

                const col1 = [...data].slice(0, midpoint)
                const col2 = [...data].slice(midpoint)

                setSubGenreCol1(col1)
                setSubGenreCol2(col2)
            });
    }, []);

    // get current profileSubGenres

    useEffect(() => {
        fetch(`http://localhost:8088/profileSubGenres?profileId=${profileId}`)
            .then((res) => res.json())
            .then((data) => {
                setCurrentProfileSubGenres(data)

                //this is just getting the actual subgenreIds off of the returned data so that it can be used for easy comparison.
                const currentSubGenreIdArray = []
                data.map((profileSubGenre) => {
                    currentSubGenreIdArray.push(profileSubGenre.subGenreId)
                })

                // sets the initial value of selectedSubGenres equal to the current tag array so that they're already selected by default.
                setSelectedSubGenres(currentSubGenreIdArray);

                setCount(currentSubGenreIdArray.length)
            });
    }, []);

    const checkboxHandler = (e) => {
        let value = parseInt(e.target.value);

        //check to make sure count isn't already at 3 and that the selected box isn't already in the values array. If not, add it and increase count. If so, move on to else.

        if (count < 3 && !selectedSubGenres.includes(value)) {
            setSelectedSubGenres([...selectedSubGenres, value]);
            setCount((prevCount) => prevCount + 1);
        } else {

            //if the array already includes the value that was clicked, remove it and decrease count.

            if (selectedSubGenres.includes(value)) {
                setSelectedSubGenres((prevData) => prevData.filter((id) => id !== value));
                setCount(count - 1)
            } else {

                //if count is at 3 and the value isn't already in the array, force click to do nothing and not check value.

                e.target.checked = false

            }
            // this handles the deselection. If it's deselected, remove it from the current value of selectedSubGenres and decrease count
        }

    };

    //function to handle submitting changes. Will need to delete all current profileSubGenres for selected profile, as well as create all new profileSubGenres for it based on the choices.

    const handleSubmitTagEdits = e => {
        e.preventDefault()

        //make sure three are selected

        if (selectedSubGenres.length === 3) {

            //delete all current profileSubGenres

            return fetch(`http://localhost:8088/profileSubGenres/${currentProfileSubGenres[0].id}`, {
                method: "DELETE",
            }).then(() => {

                return fetch(`http://localhost:8088/profileSubGenres/${currentProfileSubGenres[1].id}`, {
                    method: "DELETE",
                }).then(() => {

                    return fetch(`http://localhost:8088/profileSubGenres/${currentProfileSubGenres[2].id}`, {
                        method: "DELETE",
                    }).then(() => {

                        let newProfileSubGenreObj1 = {
                            profileId: parseInt(profileId),
                            subGenreId: selectedSubGenres[0]
                        }
                       
                        
                        //send object 1 

                        return fetch(`http://localhost:8088/profileSubGenres`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(newProfileSubGenreObj1)
                        }).then(() => {

                            let newProfileSubGenreObj2 = {
                                profileId: parseInt(profileId),
                                subGenreId: selectedSubGenres[1]
                            }

                            //send object 2

                            return fetch(`http://localhost:8088/profileSubGenres`, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify(newProfileSubGenreObj2)
                            }).then(() => {

                                let newProfileSubGenreObj3 = {
                                    profileId: parseInt(profileId),
                                    subGenreId: selectedSubGenres[2]
                                }

                                //send object 3

                                return fetch(`http://localhost:8088/profileSubGenres`, {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify(newProfileSubGenreObj3)
                                }).then(() => {

                                    navigate("/myprofile")
                                })
                            })
                        })
                    })
                })
            })
        } else {
            window.alert("Please select 3 subgenres.")
        }


    }

    if (!currentUserProfile.id || !profileId) {
        return null
    }

    if (currentUserProfile.id === parseInt(profileId)) {

        if (!showSpinner) {

            return (
                <>

                    {/* copied over registration content for background, leaving css the same here for that part of it. Also carrying over styles and classes from registration for a lot of it*/}

                    <div className="container container_register_subgenres container_register_subgenres_edit">
                        <div className="container container_register_subgenres_header">
                            <h2>Select 3 Subgenres:</h2>
                        </div>

                        <form className="container container_subgenre_edit_form">
                            <div className="container container_subgenre_columns">
                                <ul className="container container_subgenre_edit_checkbox-col">
                                    {
                                        subGenreCol1.map((subgenre, index) => {

                                        return (
                                            <>
                                                <li key={`subgenreListItem--${subgenre.id}`} className="subgenre-list-item">
                                                    <input
                                                        key={subgenre.id}
                                                        type="checkbox"
                                                        id={`subgenre--${subgenre.id}`}
                                                        value={subgenre.id}
                                                        onChange={checkboxHandler}
                                                        checked={selectedSubGenres.includes(subgenre.id)}
                                                        className="subgenre-list-item-checkbox"
                                                    />
                                                    <label htmlFor={`subgenre--${subgenre.id}`}>{subgenre.name}</label>
                                                </li>
                                            </>
                                        );
                                    })}
                                </ul>
                                <ul className="container container_subgenre_edit_checkbox-col">
                                    {subGenreCol2.map((subgenre, index) => {

                                        return (
                                            <>
                                                <li key={`subgenreListItem--${subgenre.id}`} className="subgenre-list-item">
                                                    <input
                                                        key={subgenre.id}
                                                        type="checkbox"
                                                        id={`subgenre--${subgenre.id}`}
                                                        value={subgenre.id}
                                                        onChange={checkboxHandler}
                                                        checked={selectedSubGenres.includes(subgenre.id)}
                                                        className="subgenre-list-item-checkbox"
                                                    />
                                                    <label htmlFor={`subgenre--${subgenre.id}`}>{subgenre.name}</label>
                                                </li>
                                            </>
                                        );
                                    })}
                                </ul>
                            </div>
                        </form>
                        <div className="container container_buttons_edit_subgenres">
                            <button type="submit" className="btn btn_edit btn_submit button_profile_colors button-loginreg" onClick={handleSubmitTagEdits}>Confirm Changes</button>
                            <button type="button" className="btn btn_edit btn_navigate button_exit_edit button_profile_colors button-loginreg" onClick={() => { navigate('/myprofile') }}>Exit</button>
                        </div>
                    </div>
                    <div className="waves-subgenre-transparent"></div>
                </>
            );
        } else {
            return <>
                <section className="waves-reggenres container container_homepage">
                    <div className="container container_homepage_inner container_loading_spinner">
                        <img className="loading img_loading" src={require("../../images/loading_spinner.svg")} />
                    </div>
                </section>
                <div className="waves-subgenre-transparent"></div>
            </>
        }

    } else {
        return <p>Nice try, loser. You're not authorized to edit this profile.</p>
    }

};
