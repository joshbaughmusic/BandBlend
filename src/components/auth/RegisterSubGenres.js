import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const RegisterSubGenres = () => {
    const [subgenres, setSubgenres] = useState([]);
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

            navigate("/myprofile")

        }, 1000)

    }

    if (!subgenres) {
        return null
    }

        if (!showSpinner) {

            return (
                <>
                    <label>Select Up To 3 Sub-Genres:</label><br />
                    <form className="container container_subgenre_edit_form">
                        <ul className="container container_subgenre_edit_checkboxes">
                            {subgenres.map((subgenre, index) => {

                                return (
                                    <>
                                        <li key={`subgenreListItem--${subgenre.id}`}>
                                            <label htmlFor={`subgenre--${subgenre.id}`}>{subgenre.name}</label>
                                            <input
                                                key={subgenre.id}
                                                type="checkbox"
                                                id={`subgenre--${subgenre.id}`}
                                                value={subgenre.id}
                                                onChange={checkboxHandler}
                                                checked={selectedSubGenres.includes(subgenre.id)}
                                            />
                                        </li>
                                    </>
                                );
                            })}
                        </ul>
                        <button type="submit" className="btn btn_edit btn_submit" onClick={handleSubmitTagEdits}>Confirm Changes</button>
                        <button type="button" className="btn btn_edit btn_navigate" onClick={() => { navigate('/') }}>Exit</button>
                    </form>
                </>
            );
        } else {
            return <img className="loading img_loading" src={require("../../images/loading_spinner.gif")} />
        }
};
