import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

export const EditPost = () => {

    // get post id off of url

    const { postId } = useParams()

    //use state to hold all posts from user to make sure the one being edited belongs to them

    const [allUserPosts, setAllUserPosts] = useState()

    // useState to hold current post

    const [post, setPost] = useState({
        body: ""
    })

     //set up navigation hook to take you back to MyProfile on post edit submission

     const navigate = useNavigate()

    //make sure that post belongs to user

    // const localBbUser = localStorage.getItem("bb_user")
    // const bBUserObject = JSON.parse(localBbUser)

    // useEffect(() => {
    //     fetch(`http://localhost:8088/profiles?userId=${bBUserObject.id}&_embed=posts`)
    //     .then(res => res.json())
    //     .then(data => {
    //         setAllUserPosts(data)
    //     })
    // }, [])

    //fetch post using postId from above

    useEffect(() => {
        fetch(`http://localhost:8088/posts?id=${postId}`)
        .then(res => res.json())
        .then(data => {
            setPost(data[0])
        })
    }, [])

    //write handler function to edit post

    const handlePostEditSubmission = e => {
        e.preventDefault()

        const updatedPostBody = {
            body: post.body
        }

        return fetch(`http://localhost:8088/posts/${postId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedPostBody)
        })
        .then(response => response.json())
        .then(() => {
            navigate("/myprofile")
        })
    }

    return (
        <>
        <form className="form edit_form edit_form_post">
                <fieldset>
                    <label htmlFor="editPost">Edit Post</label>
                    <br/>
                    <textarea autoFocus name="editPost" className="input input_text" value={post.body} rows="8" cols="50" onChange={
                        e => {
                            const copy = { ...post }
                            copy.body = e.target.value
                            setPost(copy)
                        }
                    }
                    ></textarea>
                </fieldset>
                <br />
                <button type="submit" className="btn bte_edit btn_submit" onClick={handlePostEditSubmission}>Confirm Changes</button>
                <button type="button" className="btn btn_edit btn_navigate" onClick={ () => {navigate('/myprofile')}}>Exit</button>
            </form>
        </>
    )

}