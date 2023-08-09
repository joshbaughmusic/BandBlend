import { useState } from "react"
import "./NewPost.css"
// import FadeIn from 'react-fade-in';


export const NewPost = ({ closeNewPost, myProfileId, setMyPosts }) => {

    //taking in function closeNewPost from MyProfile to handle closing the new post form when it's open and the button is clicked. Switches state in MyProfile. Also taking in profileId from MyProfile to pass into the new post object when it's created, as well as setMyPosts to update the post list after a new one is submitted.

    const [post, setPost] = useState({
        body: ""
    })

    //function to set new post object and send to database, close new post form and clear field on submit, update post list

    const handleSubmitNewPostClick = e => {
        e.preventDefault()

        const postObject = {
            profileId: myProfileId,
            body: post.body,
            date: Date.now()
        }

        if (post.body !== "") {
            return fetch(`http://localhost:8088/posts`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(postObject)
            })
                .then(res => res.json())
                .then(() => {
                    fetch(`http://localhost:8088/posts?profileId=${myProfileId}`)
                        .then(res => res.json())
                        .then(data => {
                            setMyPosts(data)
                            closeNewPost()
                            //clears out value of new post text area
                            setPost("")
                        })
                })
        } else {
            window.alert("New post cannot be blank.")
        }
    }

    return (
        <>
        {/* <FadeIn> */}
            <form className="form form_new_post">
                    <textarea autoFocus name="newPost" className="input input_text input_text_post input_field_colors" placeholder="What's on your mind?" rows="4" cols="50" onChange={
                        e => {
                            const copy = { ...post }
                            copy.body = e.target.value
                            setPost(copy)
                        }
                    }
                    ></textarea>
                <br />
                <button type="submit" className="btn btn_profile btn_submit_post button_profile_colors" onClick={handleSubmitNewPostClick}>Submit Post</button>
                {/* <button type="button" className="btn btn_profile btn_close" onClick={closeNewPost}>Close</button> */}
            </form>
            {/* </FadeIn> */}
        </>
    )
}