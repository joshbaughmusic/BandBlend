import { useEffect, useState } from "react"

export const ProfilesAllList = () => {
    const [allProfiles, setAllProfiles] = useState()

    useEffect(() => {
        fetch(`http://localhost:8088/profiles`)
        .then(res => res.json())
        .then(data => {
            setAllProfiles(data)
        })
    }, [])

    return <h1>Profiles All List</h1>
}