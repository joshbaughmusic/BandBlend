import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./EditTags.css"

export const EditTags = () => {
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
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

    const [currentProfileTags, setCurrentProfileTags] = useState([])


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

    // get current tags

    useEffect(() => {
        fetch(`http://localhost:8088/profileTags?profileId=${profileId}`)
            .then((res) => res.json())
            .then((data) => {
                setCurrentProfileTags(data)

                //this is just getting the actual tagIds off of the returned data so that it can be used for easy comparison.
                const currentTagIdArray = []
                data.map((profileTag) => {
                    currentTagIdArray.push(profileTag.tagId)
                })

                // sets the initial value of selectedTags equal to the current tag array so that they're already selected by default.
                setSelectedTags(currentTagIdArray);

                setCount(currentTagIdArray.length)
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

    //function to handle submitting changes. Will need to delete all current profileTags for selected profile, as well as create all new profileTags for it based on the choices.

    const handleSubmitTagEdits = e => {
        e.preventDefault()

        //make sure three are selected

        if (selectedTags.length === 3) {

            //delete all current proFileTags

            return fetch(`http://localhost:8088/profileTags/${currentProfileTags[0].id}`, {
                method: "DELETE",
            }).then(() => {

                return fetch(`http://localhost:8088/profileTags/${currentProfileTags[1].id}`, {
                    method: "DELETE",
                }).then(() => {

                    return fetch(`http://localhost:8088/profileTags/${currentProfileTags[2].id}`, {
                        method: "DELETE",
                    }).then(() => {

                        let newProfileTagObj1 = {
                            profileId: parseInt(profileId),
                            tagId: selectedTags[0]
                        }
                       
                        
                        //send object 1 

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

                            //send object 2

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

                                //send object 3

                                return fetch(`http://localhost:8088/profileTags`, {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify(newProfileTagObj3)
                                }).then(() => {

                                    navigate("/myprofile")
                                })
                            })
                        })
                    })
                })
            })

        } else {
            window.alert("Please select 3 tags.")
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

                    <div className="container container_register_tags container_register_tags_edit">
                        <div className="container container_register_tags_header">
                            <h2>Select 3 Profile Tags:</h2>
                        </div>
                        <form className="container container_tag_edit_form">
                            <ul className="container container_tag_edit_checkboxes">
                                {tags.map((tag) => {

                                    return (
                                        <>
                                            <li key={`tagListItem--${tag.id}`} className="tag-list-item">
                                                <input
                                                    key={tag.id}
                                                    type="checkbox"
                                                    id={`tag--${tag.id}`}
                                                    value={tag.id}
                                                    onChange={checkboxHandler}
                                                    checked={selectedTags.includes(tag.id)}
                                                />
                                                <label htmlFor={`tag--${tag.id}`} className="tag-list-item-label">{tag.name}</label>
                                            </li>
                                        </>
                                    );
                                })}
                            </ul>
                            <button type="submit" className="btn btn_edit btn_submit button_profile_colors button-loginreg" onClick={handleSubmitTagEdits}>Confirm Changes</button>
                            <button type="button" className="btn btn_edit btn_navigate button_exit_edit button_profile_colors button-loginreg" onClick={() => { navigate('/myprofile') }}>Exit</button>
                        </form>
                    </div>
                    <div className="waves-tags-transparent"></div>
                </>
            );
        } else {
            return <>
                <section className="waves-regtags container container_homepage">
                    <div className="container container_homepage_inner container_loading_spinner">
                        <img className="loading img_loading" src={require("../../images/loading_spinner.svg")} />
                    </div>
                </section >
                <div className="waves-tags-transparent"></div>
            </>
        }
    } else {
        return <p>Nice try, loser. You're not authorized to edit this profile.</p>
    }


};
