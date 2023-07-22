import { useEffect, useState } from "react"
import "./OtherProfile.css"
import { Link, useParams } from "react-router-dom"
import { PostProfile } from "../posts/PostProfile.js"

export const OtherProfile = () => {

    //use useParams to get the profile id from url.

    const { profileId } = useParams()

    const [profile, setProfile] = useState({})
    const [tags, setTags] = useState([])
    const [subGenres, setSubGenres] = useState([])

    //fetch currently viewed profile based on param (profileId) with expanded users and primary genre, embeded profileTags and media

    useEffect(() => {
        fetch(`http://localhost:8088/profiles?userId=${profileId}&_expand=user&_expand=primaryGenre&_expand=primaryInstrument&_embed=profileTags&_embed=profileSubGenres&_embed=media&_embed=posts`)
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

    if (!profile || !tags || !subGenres) {
        return null
    }


    return (
        <>
            <section className="container container_profile_page">
                <article className="container container_profile_primary">
                    <img className="img img_profile_primary" src={profile.picture} />
                    <div className="container container_heading_profile_primary">
                        <h2 className="heading heading_profile_primary_name">{profile?.user?.name}</h2>
                        <h3 className="heading heading_profile_primary_location">{profile?.location}</h3>
                        {
                            profile.primaryInstrument

                            ?

                            <div className="container container_primary_instrument">
                            <h4 className="heading heading_profile_primary_primary_instrument">Primary Instrument:</h4>
                            <h4 className="heading heading_profile_primary_primary_instrument_name">{profile?.primaryInstrument?.name}</h4>
                        </div>

                            :

                            ""

                        }
                        <div className="container container_primary_genre">
                            <h4 className="heading heading_profile_primary_primary_genre">Primary Genre:</h4>
                            <h4 className="heading heading_profile_primary_primary_genre_name">{profile?.primaryGenre?.name}</h4>
                        </div>
                    </div>

                    <div className="container container_profile_primary_clickables">
                        <div className="container container_profile_primary_buttons">
                            <button type="button" className="btn button_profile_primary_save" onClick={() => { }}>Save</button>
                            <button type="button" className="btn button_profile_primary_message" onClick={() => { }}>Message</button>
                        </div>
                        {/* <div className="container container_profile_primary_song">
                            {
                                profile.featuredSong ? <div className="audio audio_profile_primary">Featured song goes here</div> : ''
                            }
                        </div> */}

                        <div className="container container_profile_primary_socialwidgets">
                        {
                                profile.spotify

                                    ?

                                    <Link to={profile.spotify}><img className="img img_profile_primary_socialwidget" src={require("../../images/spotify.png")} /></Link>

                                    :

                                    ""
                            }
                            {
                                profile.facebook

                                    ?

                                    <Link to={profile.facebook}><img className="img img_profile_primary_socialwidget" src={require("../../images/facebook.png")} /></Link>

                                    :

                                    ""
                            }
                            {
                                profile.instagram

                                    ?

                                    <Link to={profile.instagram}><img className="img img_profile_primary_socialwidget" src={require("../../images/instagram.png")} /></Link>

                                    :

                                    ""
                            }
                            {
                                profile.tiktok

                                    ?

                                    <Link to={profile.tiktok}><img className="img img_profile_primary_socialwidget" src={require("../../images/tiktok.png")} /></Link>

                                    :

                                    ""
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
                            <h4 className="heading heading_profile_subgenres">SubGenres</h4>
                            <ul className="container container_subgenres">
                                {
                                    profile?.profileSubGenres?.map(sg => {
                                        return <li key={`profileSubGenre--${sg.id}--${sg.subGenreId}`} className="profile_subgenre">{matchSubGenres(sg.subGenreId)}</li>
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
                    <h3 className="heading heading_profile_media">Additional Photos</h3>
                    <div className="container container_profile_media_inner">
                        {
                            profile.media?.length

                                ?

                                profile.media.map(media => {
                                    return <div className="container container_profile_additional_img"><img className="img profile_img_item" key={`img--${profile.id}--${media.url}`} src={media.url} /></div>
                                })

                                :

                                <p className="text text_profile_media_none">User hasn't uploaded additional photos yet.</p>
                        }
                    </div>
                </article>

                <article className="container container_profile_posts_outer">
                    <h3 className="heading heading_profile_posts">Posts</h3>
                    <ul className="container container_profile_posts_inner">
                        {
                            profile.posts?.length

                                ?

                                profile.posts.sort((a,b) => b.date - a.date).map(post => <PostProfile postKey={`postkey--${post.id}`} postId={post.id} userPicture={profile.picture} userName={profile?.user?.name} userId={profile?.user?.id} postBody={post.body} postDate={post.date} />)

                                :

                                <li key={`nopostskey`} className="post post_list_item_null"><p className="text text_profile_post_none">User hasn't submitted any posts yet.</p>
                                </li>
                        }
                    </ul>
                </article>
            </section>
        </>
    )
}