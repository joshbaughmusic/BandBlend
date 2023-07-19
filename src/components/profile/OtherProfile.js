import { useEffect, useState } from "react"
import "./OtherProfile.css"
import { Link } from "react-router-dom"

export const OtherProfile = ({ otherProfileId }) => {
    //receiving id of profile being viewed from ProfileContainer.js

    const [profile, setProfile] = useState([])
    const [tags, setTags] = useState([])
    const [subGenres, setSubGenres] = useState([])

    //fetch all currently viewed profile based on prop passed in (otherProfileId) with expanded users and primary genre, embeded profileTags and media

    useEffect(() => {
        fetch(`http://localhost:8088/profiles?userId=${otherProfileId}&_expand=user&_expand=primaryGenre&_embed=profileTags&_embed=profileSubGenres&_embed=media&_embed=posts`)
            .then(res => res.json())
            .then(data => {
                setProfile(data[0])
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
        let matchedTagName = tags.find(tag => tag.id === tagId)
        return matchedTagName?.name
    }

    //define a function to match subGenre from all subGenres with incoming profilesubGenres subGenreId attached to profile by embed. Return that subGenre's name. Will be invoked in map function below

    const matchSubGenres = (sgId) => {
        let matchedSubGenre = subGenres.find(sg => sg.id === sgId)
        return matchedSubGenre?.name
    }

    // if (!profile || !tags || !subGenres) {
    //     return null
    // }


    return (
        <>
            <section className="container container_profile_page">
                <article className="container container_profile_primary">
                    <img className="img img_profile_primary" src={profile.picture} />
                    <div className="container container_heading_profile_primary">
                        <h2 className="heading heading_profile_primary_name">{profile.user?.name}</h2>
                        <h3 className="heading heading_profile_primary_location">{profile.location}</h3>
                    </div>

                    <div className="container container_profile_primary_clickables">
                        <div className="container container_profile_primary_buttons">
                            <button type="button" className="btn button_profile_primary_save" onClick={<></>}>Save</button>
                            <button type="button" className="btn button_profile_primary_message" onClick={<></>}>Message</button>
                        </div>
                        <div className="container container_profile_primary_song">
                            {
                                profile.featuredSong ? <div className="audio audio_profile_primary">Featured song goes here</div> : ''
                            }
                        </div>

                        <div className="container container_profile_primary_socialwidgets">
                            {
                                profile.spotify ? <Link to={profile.spotify}><img className="img img_profile_primary_socialwidget" src="../../images/spotify.png" /></Link> : ""
                            }
                            {
                                profile.facebook ? <Link to={profile.facebook}><img className="img img_profile_primary_socialwidget" src="../../images/facebook.png" /></Link> : ""
                            }
                            {
                                profile.instagram ? <Link to={profile.instagram}><img className="img img_profile_primary_socialwidget" src="../../images/instagram.png" /></Link> : ""
                            }
                            {
                                profile.tiktok ? <Link to={profile.tiktok}><img className="img img_profile_primary_socialwidget" src="../../images/tiktok.png" /></Link> : ""
                            }
                        </div>

                        <div className="container container_tags_genres">
                            <h4 className="heading heading_profile_primary_tags">Tags</h4>
                            <ul className="container container_tags">
                                {
                                    profile?.profileTags?.map(tag => {
                                        return <li key={`profilePrimaryTag--${tag.id}--${tag.tagId}`} className="profile_primary_tag">{matchTags(tag.tagId)}</li>
                                    })
                                }
                            </ul>
                            <h4 className="heading heading_profile_primary_genres">Genres</h4>
                            <ul className="container container_genres">
                                <li className="profile_primary_primarygenre">{profile?.primaryGenre?.name}</li>
                                {
                                    profile?.profileSubGenres?.map(sg => {
                                        return <li key={`profilePrimarySubGenre--${sg.id}--${sg.subGenreId}`} className="profile_primary_subgenre">{matchSubGenres(sg.subGenreId)}</li>
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                </article>

                <article className="container container_profile_about">
                    <h3 className="heading heading_profile_about">About</h3>
                    <p className="text text_profile_about">{profile.about}</p>
                </article>

                <article className="container container_profile_media_outer">
                    <h3 className="heading heading_profile_media">Additional Media</h3>
                    <div className="container container_profile_media_inner">
                        {
                            profile.media ? profile.media.map(media => {
                                return <img className="img profile_media_item" src={media.url} />
                            }) : <p className="text text_profile_media_none">No additional media at this time.</p>
                        }
                    </div>
                </article>

                <article className="container container_profile_posts_outer">
                    <h3 className="heading heading_profile_posts">Posts</h3>
                    <div className="container container_profile_posts_inner">
                        {
                            profile.posts ? profile.posts.map(post => {
                                return <p className="text text_profile_about">{post.body}</p>
                            }) : <p className="text text_profile_media_none">No additional media at this time.</p>
                        }
                    </div>
                </article>
            </section>
        </>
    )
}