import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import "./EditComment.css"

export const EditComment = () => {
    // get comment id off of url

    const { commentId } = useParams()

    // useState to hold current comment

    const [comment, setComment] = useState({
        body: ""
    })

    //state to hold profile id that the post the comment was made was from

    const [previousProfileId, setPreviousProfileId] = useState(null)
    const [currentUserProfile, setCurrentUserProfile] = useState([])

    //set up navigation hook to take you back to previous page (profile) on comment edit submission and exit button click

    const navigate = useNavigate()


    const localBbUser = localStorage.getItem("bb_user")
    const bBUserObject = JSON.parse(localBbUser)


    //fetch comment using commentId and profile Id from the post it's one from above param

    useEffect(() => {
        fetch(`http://localhost:8088/comments?id=${commentId}&_expand=post`)
            .then(res => res.json())
            .then(data => {
                setComment(data[0])
                setPreviousProfileId(data[0].post.profileId)

                //get profile of current user to find out if the profile they came from belonged to them so proper navigate can happen

                fetch(`http://localhost:8088/profiles?userId=${bBUserObject.id}`)
                    .then(res => res.json())
                    .then(data => {
                        setCurrentUserProfile(data[0])

                    })


            })
    }, [])


    if (!comment) {
        return null
    }


    //make sure that comment belongs to user

    if (comment.userId === bBUserObject.id) {


        //write handler function to edit comment

        const handleCommentEditSubmission = e => {
            e.preventDefault()

            const updatedCommentBody = {
                body: comment.body
            }

            if (comment.body !== "") {

                return fetch(`http://localhost:8088/comments/${commentId}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(updatedCommentBody)
                })
                    .then(() => {

                        //if current user was last on their own profile page, send them back to myprofile. Otherwise send back to previous other profile

                        if (currentUserProfile.id === previousProfileId) {
                            navigate(`/myprofile`)

                        } else {
                            navigate(`/profiles/${previousProfileId}`)
                        }
                    })
            } else {
                window.alert("Comment must not be blank.")
            }

        }

        return (
            <>
            {/* copied over registration content for background, leaving css the same here for that part of it. Also carrying over styles and classes from registration for a lot of it*/}
            
                <section className="waves-reguser container container_homepage">
                    <div className="container container_homepage_inner">
                        <form className="form edit_form edit_form_comment">
                            <h2 htmlFor="editComment">Edit Comment:</h2>
                            <textarea autoFocus name="editComment" className="input input_text input_reg input_field_colors" value={comment.body} rows="8" cols="50" onChange={
                                e => {
                                    const copy = { ...comment }
                                    copy.body = e.target.value
                                    setComment(copy)
                                }
                            }
                            ></textarea>
                            <div className="container container_buttons_edit_about">
                                <button type="submit" className="btn btn_edit btn_submit" onClick={handleCommentEditSubmission}>Confirm Changes</button>
                                {
                                    currentUserProfile.id === previousProfileId

                                        ?

                                        <button type="button" className="btn btn_edit btn_navigate button_exit_edit" onClick={() => { navigate(`/myprofile`) }}>Exit</button>

                                        :

                                        <button type="button" className="btn btn_edit btn_navigate button_exit_edit" onClick={() => { navigate(`/profiles/${previousProfileId}`) }}>Exit</button>
                                }
                            </div>
                        </form>
                    </div>
                </section>
            </>
        )
    } else {
        return <>
            <p>Nice try, loser. You're not authorized to edit this comment.</p>
        </>
    }



}