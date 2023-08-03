import { useEffect, useState } from "react"
import "./OtherProfile.css"
import { Link, useParams } from "react-router-dom"
import { PostProfile } from "../posts/PostProfile.js"
import { SaveButtonProfile } from "./SaveButtonProfile.js"
import { Distance } from "./Distance.js"
import FadeIn from 'react-fade-in';


export const OtherProfile = ({ message, setMessage, selectedReceiverId, setSelectedReceiverId, showNewMessage, setShowNewMessage, sidebar, setSidebar }) => {
    //bringing in these props from maincontainer to handle message button click

    //use useParams to get the profile id from url.

    const { profileId } = useParams()

    const [profile, setProfile] = useState({})
    const [tags, setTags] = useState([])
    const [subGenres, setSubGenres] = useState([])

    //state to handle photo enlarge

    const [file, setFile] = useState(null)

    //fetch currently viewed profile based on param (profileId) with expanded users and primary genre, embeded profileTags and media

    useEffect(() => {
        fetch(`http://localhost:8088/profiles?userId=${profileId}&_expand=user&_expand=primaryGenre&_expand=primaryInstrument&_embed=profileTags&_embed=profileSubGenres&_embed=media&_embed=posts`)
            .then(res => res.json())
            .then(data => {
                setProfile(data[0])
            })
    }, [profileId])

    //fetch all tags

    useEffect(() => {
        fetch(`http://localhost:8088/tags`)
            .then(res => res.json())
            .then(data => {
                setTags(data)
            })

    }, [profileId])

    //fetch all subgenres

    useEffect(() => {
        fetch(`http://localhost:8088/subGenres`)
            .then(res => res.json())
            .then(data => {
                setSubGenres(data)
            })

    }, [profileId])

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


    //function to handle when the message button is clicked. Uses message state shared from parent and sets up values on it as needed.
    const handleMessageClick = e => {
        e.preventDefault()

        setShowNewMessage(true)

        const [, userId] = e.target.id.split('--')

        const copy = message
        copy.receiverId = parseInt(userId)
        copy.body = ''
        copy.date = 0
        copy.id = ''
        setMessage(copy)
        setSidebar(true)
        setSelectedReceiverId(`user--${userId}`)

    }


    if (!profile || !tags || !subGenres) {
        return null
    }


    return (
        <>
            <FadeIn>
                <section className="container container_profile_page">
                    <article className="container container_profile_primary">

                        <div className="container container_img_profile_primary">
                            <img className="img img_profile_primary" src={profile.picture} onClick={() => { setFile(profile.picture) }} />
                        </div>

                        <div className="container container_heading_profile_primary">
                            <h2 className="heading heading_profile_primary_name">{profile?.user?.name}</h2>
                            {
                                profile.user?.isBand

                                    ?

                                    <h5 className="heading heading_profile_isBand">Band</h5>

                                    :

                                    <h5 className="heading heading_profile_isBand">Musician</h5>

                            }
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
                            <h3 className="heading heading_profile_primary_location">{profile?.location}</h3>
                            <Distance profileId={profileId} />
                            {
                                !profile?.user?.isBand

                                    ?

                                    <div className="container container_primary_instrument">
                                        <h4 className="heading heading_profile_primary_primary_instrument heading_bubbles_section">Primary Instrument:</h4>
                                        <h4 className="heading heading_profile_primary_primary_instrument_name tag_genre_bubble ">{profile?.primaryInstrument?.name}</h4>
                                    </div>

                                    :

                                    ""

                            }
                            <div className="container container_primary_genre">
                                <h4 className="heading heading_profile_primary_primary_genre heading_bubbles_section">Primary Genre:</h4>
                                <h4 className="heading heading_profile_primary_primary_genre_name tag_genre_bubble">{profile?.primaryGenre?.name}</h4>
                            </div>
                        </div>

                        <div className="container container_profile_primary_clickables">

                            {/* <div className="container container_profile_primary_song">
                            {
                                profile.featuredSong ? <div className="audio audio_profile_primary">Featured song goes here</div> : ''
                            }
                        </div> */}



                            <div className="container container_tags_genres">
                                <div className="container container_tags_section">
                                    <h4 className="heading heading_profile_primary_tags heading_bubbles_section">Tags:</h4>
                                    <ul className="container container_tags container_tag_genre_bubbles">
                                        {
                                            profile?.profileTags?.map(tag => {
                                                return <li key={`profilePrimaryTag--${tag.id}--${tag.tagId}`} className="profile_primary_tag tag_genre_bubble">{matchTags(tag.tagId)}</li>
                                            })
                                        }
                                    </ul>
                                </div>
                                <div className="container container_subgenres_section">
                                    <h4 className="heading heading_profile_subgenres heading_bubbles_section">SubGenres:</h4>
                                    <ul className="container container_subgenres container_tag_genre_bubbles">
                                        {
                                            profile?.profileSubGenres?.map(sg => {
                                                return <li key={`profileSubGenre--${sg.id}--${sg.subGenreId}`} className="profile_primary_subgenre tag_genre_bubble">{matchSubGenres(sg.subGenreId)}</li>
                                            })
                                        }
                                    </ul>
                                </div>
                            </div>
                            <div className="container container_profile_primary_buttons">
                                <SaveButtonProfile profileId={profileId} />
                                {/* <button type="button" className="btn button_profile_primary_save" onClick={handleSaveButtonClick}>Save</button> */}
                                <button type="button" className="btn button_profile_primary_message
                            button_profile_colors" id={`messageUser--${profile?.user?.id}`} onClick={handleMessageClick}
                                >Message</button>
                            </div>
                        </div>
                    </article>

                    <div className="container container_right_profile_sections">

                        <article className="container container_profile_about">
                            <h3 className="heading heading_profile_about heading_main_profile_sections">About</h3>
                            {/* <hr className="linebreak_about"/> */}
                            <p className="text text_profile_about">{profile.about}</p>
                        </article>

                        <article className="container container_profile_media_outer">
                            <h3 className="heading heading_profile_media heading_main_profile_sections">Additional Photos</h3>
                            <div className="container container_profile_media_inner">
                                {
                                    profile.media?.length

                                        ?

                                        profile.media.map(media => {
                                            return <div className="container container_profile_additional_img" key={`img--${profile.id}--${media.url}`}>
                                                <img className="img profile_img_item" src={media.url} onClick={() => { setFile(media) }} />
                                            </div>
                                        })

                                        :

                                        <p className="text text_profile_media_none">User hasn't uploaded additional photos yet.</p>
                                }
                            </div>

                            <div className="popup-media-container" style={{ display: file ? 'block' : 'none' }}>
                                <span className="icon icon_close icon_close_popup_media" onClick={() => {
                                    setFile(null)
                                }}>&times;</span>
                                <img className="img img-popup" src={file?.url ? file?.url : file} />
                            </div>

                        </article>

                        <article className="container container_profile_posts_outer">
                            <h3 className="heading heading_profile_posts heading_main_profile_sections">Posts</h3>
                            <ul className="container container_profile_posts_inner">
                                {
                                    profile.posts?.length

                                        ?

                                        profile.posts.sort((a, b) => b.date - a.date).map(post => <PostProfile key={`postkey--${post.id}`} postKey={`postkeyCard--${post.id}`} postId={post.id} userPicture={profile.picture} userName={profile?.user?.name} userId={profile?.user?.id} postBody={post.body} postDate={post.date} />)

                                        :

                                        <li key={`nopostskey`} className="post post_list_item_null"><p className="text text_profile_post_none">User hasn't submitted any posts yet.</p>
                                        </li>
                                }
                            </ul>
                        </article>
                    </div>
                </section>
            </FadeIn>
        </>
    )
}