import { useState } from "react"
import "./NewPhoto.css"

export const NewPhoto = ({ closeNewPhoto, myProfileId, setMedia, }) => {

    const [newPhoto, setNewPhoto] = useState({
        profileId: '',
        url: ''
    })


      //function to set new photo object and send to database, close new photo form and clear field on submit, update photo list

      const handleSubmitNewPhotoClick = e => {
        e.preventDefault()

        const photoObject = {
            profileId: myProfileId,
            url: newPhoto.url
        }

        if (newPhoto.url !== "") {
            return fetch(`http://localhost:8088/media`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(photoObject)
            })
                .then(res => res.json())
                .then(() => {
                    fetch(`http://localhost:8088/media?profileId=${myProfileId}`)
                        .then(res => res.json())
                        .then(data => {
                            setMedia(data)
                            closeNewPhoto()
                            //clears out value of new post text area
                            setNewPhoto({})
                        })
                })
        } else {
            window.alert("Please enter a URL to your photo.")
        }
    }

    return (
        <>
        <form className="form form_new_photo">
                    <input type="url" pattern="https://.*" required autoFocus name="newPhoto" className="input input_text input_text_photo input_field_colors" placeholder="Enter Photo URL..." onChange={
                        e => {
                            const copy = { ...newPhoto }
                            copy.url = e.target.value
                            setNewPhoto(copy)
                        }
                    }
                    ></input>
                <br />
                <button type="button" className="btn btn_profile btn_submit_photo button_profile_colors" onClick={handleSubmitNewPhotoClick}>Submit Photo</button>
                {/* <button type="button" className="btn btn_profile btn_close" onClick={closeNewPhoto}>Close</button> */}
            </form>
        </>
    )
}