import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const RegisterTags = () => {
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [count, setCount] = useState(0)
    const [showSpinner, setShowSpinner] = useState(false)
    const navigate = useNavigate()

    //get currentUserProfile to make sure they have rights to access this page for this profile

    const localBbUser = localStorage.getItem("bb_user")
    const bBUserObject = JSON.parse(localBbUser)

    // get profile id off of url
    const { profileId } = useParams();

    //get all tags

    useEffect(() => {
        fetch(`http://localhost:8088/tags`)
            .then((res) => res.json())
            .then((data) => {
                setTags(data);
            });
    }, []);


    const checkboxHandler = (e) => {
        let value = parseInt(e.target.value);

        //check to make sure count isn't already at 3 and that the selected box isn't already in the values array. If not, add it and increase count. If so, move on to else.

        if (count < 3 && !selectedTags.includes(value)) {
            setSelectedTags([...selectedTags, value]);
            setCount((prevCount) => prevCount + 1);
        } else {

            //if the array already includes the value that was clicked, remove it and decrease count.

            if (selectedTags.includes(value)) {
                setSelectedTags((prevData) => prevData.filter((id) => id !== value));
                setCount(count - 1)
            } else {

                //if count is at 3 and the value isn't already in the array, force click to do nothing and not check value.

                e.target.checked = false

            }
            // this handles the deselection. If it's deselected, remove it from the current value of selectedTags and decrease count
        }

    };

    //function to handle submitting new selections

    const handleSubmitTags = e => {
        e.preventDefault()

        //make sure three are selected

        if (selectedTags.length === 3) {

            let newProfileTagObj1 = {
                profileId: parseInt(profileId),
                tagId: selectedTags[0]
            }

            return fetch(`http://localhost:8088/profileTags`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(newProfileTagObj1)
                }).then(() => {

                    let newProfileTagObj2 = {
                        profileId: parseInt(profileId),
                        tagId: selectedTags[1]
                    }
        
                    return fetch(`http://localhost:8088/profileTags`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(newProfileTagObj2)
                        }).then(() => {
        
                            let newProfileTagObj3 = {
                                profileId: parseInt(profileId),
                                tagId: selectedTags[2]
                            }
                
                            return fetch(`http://localhost:8088/profileTags`, {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify(newProfileTagObj3)
                                }).then(() => {
                
                                    navigate(`/register/subgenres/${profileId}`)
                            })
                    })
            })


        } else {
            window.alert("Please select 3 tags.")
        }


    }

    if (!tags) {
        return null
    }

    if (!showSpinner) {

        return (
            <>

                <div className="container container_register_tags">
                    <div className="container container_register_tags_header">
                        <h2>Select 3 Profile Tags:</h2>
                        <p className="optional">(Don't worry, you can change this later)</p>
                    </div>

                    <form className="container container_tag_edit_form">
                        <ul className="container container_tag_edit_checkboxes">
                            {tags.map((tag, index) => {

                                return  <React.Fragment key={`tagListItem--${tag.id}`}>
                                        <li className="tag-list-item">
                                            <input
                                                key={tag.id}
                                                type="checkbox"
                                                id={`tag--${tag.id}`}
                                                value={tag.id}
                                                onChange={checkboxHandler}
                                                checked={selectedTags.includes(tag.id)}
                                                className="tag-list-item-checkbox"
                                            />
                                            <label htmlFor={`tag--${tag.id}`} className="tag-list-item-label">{tag.name}</label>
                                        </li>
                                    </React.Fragment>
                            })}
                        </ul>
                        <button type="submit" className="btn btn_edit btn_submit button_profile_colors button-loginreg" onClick={handleSubmitTags}>Confirm Selections</button>

                    </form>
                </div>
                <div className="waves-tags-transparent"></div>
            </>
        );
    } else {
        return (
            <>

                <img className="loading img_loading" src={require("../../images/loading_spinner.svg")} />
                <div className="waves-tags-transparent"></div>

            </>
        )
    }

};