import { useEffect, useState } from "react"

export const ProfilesAllList = () => {
    const [allProfiles, setAllProfiles] = useState()
    const [tags, setTags] = useState()
    const [subGenres, setSubGenres] = useState()

    useEffect(() => {
        fetch(`http://localhost:8088/profiles?_expand=user&_expand=primaryGenre&_embed=profileSubGenres&_embed=profileTags`)
        .then(res => res.json())
        .then(data => {
            setAllProfiles(data)
        })
    }, [])

    return <h1>Profiles All List</h1>
}