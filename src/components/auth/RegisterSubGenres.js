import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const RegisterSubGenres = () => {
    const [subgenres, setSubgenres] = useState([]);
    const [subGenreCol1, setSubGenreCol1] = useState([]);
    const [subGenreCol2, setSubGenreCol2] = useState([]);
    const [selectedSubGenres, setSelectedSubGenres] = useState([]);
    const [count, setCount] = useState(0)
    const [showSpinner, setShowSpinner] = useState(false)
    const navigate = useNavigate()

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

            //create all new profileSubGenres by mapping through the selectedSubGenres array. This only has the subGenreId values, not the full profileSubGenre.

            selectedSubGenres.map(subGenreId => {

                //create new object to send

                let newProfileSubGenreObj = {
                    profileId: parseInt(profileId),
                    subGenreId: subGenreId
                }

                //send object

                fetch(`http://localhost:8088/profileSubGenres`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(newProfileSubGenreObj)
                })
                    .then(() => {

                    })
            })

            //make it so that a loading spinner replaces the screen for a few seconds since there are a lot of fetch calls happening and the db needs a little time to catch up. Let it breathe.

            setShowSpinner(true)

            setTimeout(() => {

                navigate("/")

            }, 1000)

        } else {
            window.alert("Please select 3 subgenres.")
        }

    }

    if (!subgenres || !subGenreCol1 || !subGenreCol2) {
        return null
    }

    if (!showSpinner) {

        return (
            <>

                {/* copied over homepage content for background and logos, leaving css the same here for that part of it */}

                <section className="waves-reggenres container container_homepage">
                    <div className="container container_homepage_inner">

                        <div className="container container_register_subgenres">
                            <div className="container container_register_subgenres_header">
                                <h2>Select 3 Subgenres:</h2>
                                <p className="optional">(Don't worry, you can change this later)</p>
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
                                    <ul className="container container_subgenre_edit_checkbox_col">
                                        {
                                            subGenreCol2.map((subgenre, index) => {

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
                                <button type="submit" className="btn btn_edit btn_submit button_profile_colors button-loginreg" onClick={handleSubmitTagEdits}>Confirm Selections</button>
                        </div>
                    </div>
                </section>
            </>
        );
    } else {
        return (
            <>
                <section className="waves-reggenres container container_homepage">
                    <div className="container container_homepage_inner container_loading_spinner">
                        <img className="loading img_loading" src={require("../../images/loading_spinner.gif")} />
                    </div>
                </section>
            </>
        )
    }
};
