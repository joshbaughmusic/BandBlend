import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const EditTags = () => {
    const [tags, setTags] = useState([]);
    const [currentTags, setCurrentTags] = useState([])
    const [checkedTags, setCheckedTags] = useState([]);

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
        fetch(`http://localhost:8088/tags?profileId=${profileId}`)
            .then((res) => res.json())
            .then((data) => {
                setCurrentTags(data);
            });
    }, []);
    
    const handleCheckboxChange = (tagId) => {
        if (checkedTags.includes(tagId)) {
            // Uncheck the checkbox (remove the tagId from the array)
            setCheckedTags(checkedTags.filter((id) => id !== tagId));
        } else {
            // Check the checkbox (add the tagId to the array if less than 3 selected)
            if (checkedTags.length < 3) {
                setCheckedTags([...checkedTags, tagId]);
            }
        }
    };

    return (
        <>
            <label>Select Up To 3 Tags:</label><br />
            <div className="container container_tag_edit_checkboxes">
                {tags.map((tag) => {
                    const isChecked = checkedTags.includes(tag.id);

                    return (
                        <>
                            <li>
                                <label htmlFor={`tag--${tag.id}`}>{tag.name}</label>
                                <input
                                    key={tag.id}
                                    type="checkbox"
                                    id={`tag--${tag.id}`}
                                    value={tag.id}
                                    checked={isChecked}
                                    onChange={() => handleCheckboxChange(tag.id)}
                                />
                            </li>
                        </>
                    );
                })}
            </div>
        </>
    );
};
