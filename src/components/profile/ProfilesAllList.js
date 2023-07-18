import { useEffect, useState } from "react"
import "./ProfilesAllList.css"

export const ProfilesAllList = () => {
    const [profiles, setProfiles] = useState([])
    const [tags, setTags] = useState([])

    //fetch all profiles with expanded users and primary genre, embeded profileTags

    useEffect(() => {
        fetch(`http://localhost:8088/profiles?_expand=user&_expand=primaryGenre&_embed=profileTags`)
        .then(res => res.json())
        .then(data => {
            setProfiles(data)
        })
    }, [])

    //fetch all tags

    useEffect(() => {
        fetch(`http://localhost:8088/tags`)
        .then(res => res.json())
        .then(data => {
            setTags(data)
        })

    }, [])


    if (!profiles || !tags ) {
        return null
    }

    //define a function to match tag from all tags with incoming profileTags tagId attached to profile by embed. Return that tag's name. Will be invoked in map function below

    const matchTags = (tagId) => {
        let matchedTagName = tags.find( tag => tag.id === tagId)
        return matchedTagName?.name
    }


    return <>
        <section id="container_allProfiles" className="container">
            {
                profiles.map( profile => {
                    return <article key={`profileCard--${profile.id}`} className="container container_profile_card">
                        <img id={`profileCardImg--${profile.id}`} className="img img_profileCard" src={profile.picture}/>
                        <div className="container container_profile_card_header">
                            <h2 className="profile_card_name">{profile.name}</h2>
                            {
                                profile.user.isBand ? <p className="profile_card_bandnote">Band</p> : ''
                            }
                            <h3 className="profile_card_location">{profile.location}</h3>
                        </div>
                        <div className="container container_profile_card_primarygenre">
                            <h3 className="profile_card_genre">Genre</h3>
                            <p className="profile_card_genre_name">{profile.primaryGenre.name}</p>
                        </div>
                        <ul className="container container_profile_card_tags">
                            {
                                profile.profileTags.map( tag => {
                                    return <li key={`profileCardTag--${tag.id}--${tag.tagId}`} className="profile_card_tag">{matchTags(tag.tagId)}</li>
                                })
                            }
                        </ul>

                    </article>
                })
            }
        </section>
    </>
}