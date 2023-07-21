import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const EditTags = () => {
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [count, setCount] = useState(0)
    const [showSpinner, setShowSpinner] = useState(false)

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
        
        //delete all current proFileTags

        currentProfileTags.map(profileTag => {
            return fetch(`http://localhost:8088/profileTags/${profileTag.id}`, {
                method: "DELETE",
            })
                .then(() => {
                    console.log(`deleted profileTag Id# ${profileTag.id}`)

                    
                })
            })

            //create all new profileTags by mapping through the selectedTags array. This only has the tagId values, not the full profileTag.

            selectedTags.map(tagId => {

                //create new object to send

                let newProfileTagObj = {
                    profileId: parseInt(profileId),
                    tagId: tagId
                }

                //send object

                fetch(`http://localhost:8088/profileTags`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(newProfileTagObj)
                })
                    .then(() => {
                        console.log(`created new profileTag with tagId ${tagId}`)
                    })
            })

            //make it so that a loading spinner replaces the screen for a few seconds since there are a lot of fetch calls happening and the db needs a little time to catch up. Let it breathe.

            setShowSpinner(true)

            setTimeout(() => {
                
                navigate("/myprofile")

            }, 2000)

    }

    if(!showSpinner) {

        return (
            <>
                <label>Select Up To 3 Tags:</label><br />
                <form className="container container_tag_edit_form">
                    <ul className="container container_tag_edit_checkboxes">
                        {tags.map((tag, index) => {
    
                            return (
                                <>
                                    <li key={`tagListItem--${tag.id}`}>
                                        <label htmlFor={`tag--${tag.id}`}>{tag.name}</label>
                                        <input
                                            key={tag.id}
                                            type="checkbox"
                                            id={`tag--${tag.id}`}
                                            value={tag.id}
                                            onChange={checkboxHandler}
                                            checked={selectedTags.includes(tag.id)}
                                        />
                                    </li>
                                </>
                            );
                        })}
                    </ul>
                    <button type="submit" className="btn btn_edit btn_submit" onClick={handleSubmitTagEdits}>Confirm Changes</button>
                    <button type="button" className="btn btn_edit btn_navigate" onClick={() => { navigate('/myprofile') }}>Exit</button>
                </form>
            </>
        );
    } else {
        return <img className="loading img_loading" src={require("../../images/loading_spinner.gif")}/>
    }

};
