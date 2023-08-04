import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { PostProfile } from "../posts/PostProfile.js"
import { NewPost } from "../posts/NewPost.js"
import "./MyProfile.css"
import { NewPhoto } from "./NewPhoto.js"
import FadeIn from 'react-fade-in';
import { ModalPhotoWarning } from "../modals/ModalPhotoWarning.js"


export const MyProfile = () => {

    const [profile, setProfile] = useState({})
    const [myPosts, setMyPosts] = useState([])
    const [media, setMedia] = useState([])
    const [tags, setTags] = useState([])
    const [subGenres, setSubGenres] = useState([])
    const [primaryInstruments, setPrimaryInstruments] = useState([])

    const navigate = useNavigate()

    //states to handle whether or not to show new content forms

    const [showNewPost, setShowNewPost] = useState(false);
    const [showNewPhoto, setShowNewPhoto] = useState(false);

    //state to handle photo enlarge

    const [file, setFile] = useState(null)

    //states to track modal open or close

    const [isModalOpen, setIsModalOpen] = useState(false);


    //fetch current user in local storage and fetch their profile when they arrive at MyProfile page. Use this to populate the view.

    const localBbUser = localStorage.getItem("bb_user")
    const bBUserObject = JSON.parse(localBbUser)

    useEffect(() => {
        fetch(`http://localhost:8088/profiles?userId=${bBUserObject.id}&_expand=user&_expand=primaryGenre&_expand=primaryInstrument&_embed=profileTags&_embed=profileSubGenres`)
            .then(res => res.json())
            .then(data => {
                setProfile(data[0])
            })
    }, [])

    //get media

    useEffect(() => {
        fetch(`http://localhost:8088/media?profileId=${profile.id}`)
            .then(res => res.json())
            .then(data => {
                setMedia(data)
            })
    }, [profile])

    //get posts

    useEffect(() => {
        fetch(`http://localhost:8088/posts?profileId=${profile.id}`)
            .then(res => res.json())
            .then(data => {
                setMyPosts(data)
            })
    }, [profile])

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


    //handler functions for click events to take care of showing and hiding certain new content forms

    const handleNewPostShow = () => {
        setShowNewPost(true)
    }

    const handleNewPostClose = () => {
        setShowNewPost(false)
    }

    const handleNewPhotoShow = () => {
        setShowNewPhoto(true)
    }

    const handleNewPhotoClose = () => {
        setShowNewPhoto(false)
    }

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



    if (!profile.user) {
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
                                bBUserObject.isBand

                                    ?

                                    <h5 className="heading heading_profile_isBand">Band</h5>

                                    :

                                    <h5 className="heading heading_profile_isBand">Musician</h5>
                            }
                            <div className="container container_profile_primary_socialwidgets container_profile_primary_socialwidgets_myprofile">
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

                            {
                                !profile?.user?.isBand

                                    ?

                                    <div className="container container_primary_instrument">
                                        <h4 className="heading heading_profile_primary_primary_instrument heading_bubbles_section">Primary Instrument:</h4>
                                        <h4 className="heading heading_profile_primary_primary_instrument_name tag_genre_bubble">{profile?.primaryInstrument?.name}</h4>
                                    </div>

                                    :

                                    ""

                            }
                            <div className="container container_primary_genre">
                                <h4 className="heading heading_profile_primary_primary_genre heading_bubbles_section">Primary Genre:</h4>
                                <h4 className="heading heading_profile_primary_primary_genre_name tag_genre_bubble">{profile?.primaryGenre?.name}</h4>
                            </div>
                            <button type="button" className="btn button_profile_primary_edit button_profile_sidebar_edit button_profile_colors button_myprofile_primary_section" id={`btnEditProfilePrimary--${profile.id}`} onClick={() => { navigate(`/myprofile/edit/primaryinfo/${profile.id}`) }}>Edit Primary Info</button>
                        </div>

                        <div className="container container_profile_primary_clickables">
                            {/* <div className="container container_profile_primary_song">
                            {
                                profile.featuredSong

                                    ?

                                    <div className="audio audio_profile_primary">Featured song goes here</div>

                                    :

                                    ''
                            }
                        </div> */}

                            <div className="container container_tags_genres">
                                <div className="container container_tags_section">
                                    <h4 className="heading heading_profile_primary_tags heading_bubbles_section">Tags:</h4>
                                    <ul className="container container_tags container_tag_genre_bubbles">
                                        {
                                            profile?.profileTags?.map(tag => {
                                                return <li key={`profilePrimaryTag--${tag.id}`} className="profile_primary_tag tag_genre_bubble">{matchTags(tag.tagId)}</li>
                                            })
                                        }
                                    </ul>
                                </div>
                                <button className="btn btn_edit btn_edit_tags button_profile_sidebar_edit button_profile_colors button_myprofile_primary_section" onClick={() => { navigate(`/myprofile/edit/tags/${profile.id}`) }}>Edit Tags</button>
                                <div className="container container_subgenres_section">
                                    <h4 className="heading heading_profile_subgenres heading_bubbles_section">Sub-Genres:</h4>
                                    <ul className="container container_subgenres container_tag_genre_bubbles">
                                        {
                                            profile?.profileSubGenres?.map(sg => {
                                                return <li key={`profileSubGenre--${sg.id}`} className="profile_primary_subgenre tag_genre_bubble">{matchSubGenres(sg.subGenreId)}</li>
                                            })
                                        }
                                    </ul>
                                </div>
                                <button className="btn btn_edit btn_edit_subgenres button_profile_sidebar_edit button_profile_colors button_myprofile_primary_section" onClick={() => { navigate(`/myprofile/edit/subgenres/${profile.id}`) }}>Edit Sub-Genres</button>
                            </div>
                        </div>
                    </article>

                    <div className="container container_right_profile_sections">

                        <article className="container container_profile_about">
                            <div className="container heading_main_profile_sections">
                                <h3 className="heading heading_profile_about">About</h3>
                                <button type="button" className="btn button_profile_about_edit button_profile_colors" id={`btnEditProfileAbout--${profile.id}`} onClick={() => { navigate(`/myprofile/edit/about/${profile.id}`) }}>Edit About</button>
                            </div>
                            <p className="text text_profile_about">{profile.about}</p>
                        </article>

                        <article className="container container_profile_media_outer">
                            <div className="container heading_main_profile_sections">
                                <h3 className="heading heading_profile_media ">Additional Photos</h3>
                                {
                                    showNewPhoto

                                        ?

                                        <button type="button" className="btn button_profile_photos_close_main button_profile_colors" onClick={handleNewPhotoClose}>Close</button>

                                        :

                                        <button type="button" className="btn button_profile_photos_new button_profile_colors" onClick={handleNewPhotoShow}>Add Photo</button>

                                }

                            </div>
                            {
                                showNewPhoto

                                    ?

                                    <NewPhoto closeNewPhoto={handleNewPhotoClose} myProfileId={profile.id} setMedia={setMedia} />

                                    :

                                    ''

                            }
                            <div className="container container_profile_media_inner">
                                {
                                    media?.length

                                        ?

                                        media.map((media, index) => {
                                            return  <React.Fragment key={`img--${index}`}>
                                                

                                                    <div className="container container_profile_additional_img"><img className="img profile_img_item" src={media.url} onClick={() => { setFile(media) }} /><span id={`img--${media.id}`} className="icon icon_delete icon_delete_photo" onClick={handleDeletePhotoClickWarning}>&times;</span>
                                                    </div>
                                                    <ModalPhotoWarning
                                                        key={`imgModalWarning--${index}`}
                                                        modalKey={`imgModalWarningCard--${index * Math.random()}`}
                                                        mediaId={media.id}
                                                        isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} handleDeletePhotoClick={handleDeletePhotoClick} />

                                                </React.Fragment>
                                            
                                        })

                                        :

                                        <p className="text text_profile_media_none">User hasn't uploaded additional photos yet.</p>
                                }

                                <div className="popup-media-container" style={{ display: file ? 'block' : 'none' }}>
                                    <span className="icon icon_close icon_close_popup_media" onClick={() => {
                                        setFile(null)
                                    }}>&times;</span>
                                    <img className="img img-popup" src={file?.url ? file?.url : file} />
                                </div>

                            </div>
                            <div className="container container_new_photo" id="container_new_photo">

                            </div>
                        </article>

                        <article className="container container_profile_posts_outer">
                            <div className="container heading_main_profile_sections">
                                <h3 className="heading heading_profile_posts ">Posts</h3>
                                <div className="container container_new_post" id="container_new_post">
                                    {
                                        showNewPost

                                            ?

                                            <button type="button" className="btn button_profile_posts_close_main button_profile_colors" id={`btnNewProfilePosts--${profile.id}`} onClick={handleNewPostClose}>Close</button>

                                            :

                                            <button type="button" className="btn button_profile_posts_new button_profile_colors" id={`btnNewProfilePosts--${profile.id}`} onClick={handleNewPostShow}>New Post</button>

                                    }
                                </div>
                            </div>
                            {
                                showNewPost

                                    ?

                                    <NewPost closeNewPost={handleNewPostClose} myProfileId={profile.id} setMyPosts={setMyPosts} />

                                    :

                                    ''

                            }
                            <ul className="container container_profile_posts_inner">
                                {
                                    myPosts?.length

                                        ?

                                        myPosts.sort((a, b) => b.date - a.date).map((post, index) => <PostProfile key={`postkey--${index}`} setMyPosts={setMyPosts} myProfileId={profile.id} postKey={`postCardkey--${index}`} postId={post.id} userPicture={profile.picture} userId={profile?.user?.id} userName={profile?.user?.name} postBody={post.body} postDate={post.date} />)

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