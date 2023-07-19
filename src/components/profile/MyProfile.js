import { useEffect, useState } from "react"

export const MyProfile = ({ currentUserProfile }) => {
    //receiving full current user profile with expands and embeds from ProfileContainer.js

    const [tags, setTags] = useState([])
    const [subGenres, setSubGenres] = useState([])

    //fetch all tags

    useEffect(() => {
        fetch(`http://localhost:8088/tags`)
        .then(res => res.json())
        .then(data => {
            setTags(data)
        })

    }, [])

    //fetch all subgenres

    useEffect(() => {
        fetch(`http://localhost:8088/subGenres`)
        .then(res => res.json())
        .then(data => {
            setSubGenres(data)
        })

    }, [])

    //define a function to match tag from all tags with incoming profileTags tagId attached to profile by embed. Return that tag's name. Will be invoked in map function below

    const matchTags = (tagId) => {
        let matchedTagName = tags.find( tag => tag.id === tagId)
        return matchedTagName?.name
    }

    //define a function to match subGenre from all subGenres with incoming profilesubGenres subGenreId attached to profile by embed. Return that subGenre's name. Will be invoked in map function below

    const matchSubGenres = (sgId) => {
        let matchedSubGenre = subGenres.find( sg => sg.id === sgId)
        return matchedSubGenre?.name
    }


    return (
        <>

        <h1>My Profile</h1>
        </>
    )
}