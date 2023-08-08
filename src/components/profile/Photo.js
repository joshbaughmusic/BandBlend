import { useState } from "react";
import { ModalPhotoWarning } from "../modals/ModalPhotoWarning.js"
import FadeIn from 'react-fade-in';

export const Photo = ({ media, index, setFile, setMedia, profile }) => {

    //state to track modal open or close

    const [isModalOpen, setIsModalOpen] = useState(false);

    //handler functions to take care of deletion of photo

    const handleDeletePhotoClickWarning = e => {
        setIsModalOpen(true)
    }

    const handleDeletePhotoClick = photoIdToDelete => {

        return fetch(`http://localhost:8088/media/${photoIdToDelete}`, {
            method: "DELETE",
        })
            .then(() => {
                fetch(`http://localhost:8088/media?profileId=${profile.id}`)
                    .then(res => res.json())
                    .then(data => {
                        setMedia(data)

                    })
            })

    }

    return (
        <>
            <div className="container container_profile_additional_img"><img className="img profile_img_item" src={media.url} onClick={() => { setFile(media) }} /><span id={`img--${media.id}`} className="icon icon_delete icon_delete_photo" onClick={handleDeletePhotoClickWarning}>&times;</span>
            </div>
            <ModalPhotoWarning
                key={`imgModalWarning--${index}`}
                modalKey={`imgModalWarningCard--${index * Math.random()}`}
                mediaId={media.id}
                isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} handleDeletePhotoClick={handleDeletePhotoClick} />
        </>
    )
}