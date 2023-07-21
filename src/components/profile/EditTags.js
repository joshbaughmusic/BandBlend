import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const EditTags = () => {
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [count, setCount] = useState(0)
    // const [currentTags, setCurrentTags] = useState([])

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
    
    // useEffect(() => {
    //     fetch(`http://localhost:8088/tags?profileId=${profileId}`)
    //         .then((res) => res.json())
    //         .then((data) => {
    //             setCurrentTags(data);
    //         });
    // }, []);
    
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

    return (
        <>
            <label>Select Up To 3 Tags:</label><br />
            <div className="container container_tag_edit_checkboxes">
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
                                />
                            </li>
                        </>
                    );
                })}
            </div>
        </>
    );
};
