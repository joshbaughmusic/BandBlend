import { useState } from "react"
import './NewComment.css'

export const NewComment = ({ postId, getAllComments }) => {

    const [newComment, setNewComment] = useState({
        body: ""
    })

    const localBbUser = localStorage.getItem("bb_user")
    const bBUserObject = JSON.parse(localBbUser)


    //handle close button click

    const handleCloseNewCommentFormButtonClick = e => {
        const [, postIdToCloseNewCommentFor] = e.target.id.split('--')

        const formToClose = document.getElementById(`newCommentForm--${postIdToCloseNewCommentFor}`)

        formToClose.classList.remove("show")

        // show reply button

        const buttonToShow = document.getElementById(`openNewCommentBtn--${postIdToCloseNewCommentFor}`)

        buttonToShow.classList.add("show")

        // clears out value of new comment text area and updates the textarea directly
        const textarea = document.querySelector(`#newCommentForm--${postId} textarea`);
        textarea.value = "";
        setNewComment({
            body: ""
        });

    }

    //handle new comment submit

    const handleSubmitNewCommentClick = e => {
        e.preventDefault()


        const newCommentObject = {
            postId: postId,
            userId: bBUserObject.id,
            body: newComment.body,
            date: Date.now()
        }

        if (newComment.body !== "") {
            return fetch(`http://localhost:8088/comments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newCommentObject)
            })
                .then(() => {
                    //refetch all comments
                    getAllComments()

                    // clears out value of new comment text area and updates the textarea directly
                    const textarea = document.querySelector(`#newCommentForm--${postId} textarea`);
                    textarea.value = "";
                    setNewComment({
                        body: ""
                    });

                    //close form

                    const [, postIdToCloseNewCommentFor] = e.target.id.split('--')

                    const formToClose = document.getElementById(`newCommentForm--${postIdToCloseNewCommentFor}`)

                    formToClose.classList.remove("show")


                    //show reply button

                    const buttonToShow = document.getElementById(`openNewCommentBtn--${postIdToCloseNewCommentFor}`)

                    buttonToShow.classList.add("show")
                })
        } else {
            window.alert("New post cannot be blank.")
        }
    }


    return (
        <>
            <form className="form form_new_comment" id={`newCommentForm--${postId}`}>
                    <textarea autoFocus name="newComment" className="input input_text_new_comment" placeholder="What's on your mind?" rows="4" cols="50" onChange={
                        e => {
                            const copy = { ...newComment }
                            copy.body = e.target.value
                            setNewComment(copy)
                        }
                    }
                    ></textarea>
                <br />
                <button type="submit" className="btn btn_profile btn_submit" id={`submitNewCommentBtn--${postId}`} onClick={handleSubmitNewCommentClick}>Submit Reply</button>
                <button type="button" className="btn btn_profile btn_close" id={`closeNewCommentBtn--${postId}`} onClick={handleCloseNewCommentFormButtonClick}>Close</button>
            </form>
        </>
    )

}