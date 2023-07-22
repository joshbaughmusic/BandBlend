import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { PostProfile } from "../posts/PostProfile.js"
import { NewPost } from "../posts/NewPost.js"
import "./MyProfile.css"
import { NewPhoto } from "./NewPhoto.js"

export const MyProfile = () => {

    const [profile, setProfile] = useState({})
    const [myPosts, setMyPosts] = useState([])
    const [media, setMedia] = useState([])
    const [tags, setTags] = useState([])
    const [subGenres, setSubGenres] = useState([])
    
    const navigate = useNavigate()

    //states to handle whether or not to show new content forms

    const [showNewPost, setShowNewPost] = useState(false);
    const [showNewPhoto, setShowNewPhoto] = useState(false);


    //fetch current user in local storage and fetch their profile when they arrive at MyProfile page. Use this to populate the view.

    const localBbUser = localStorage.getItem("bb_user")
    const bBUserObject = JSON.parse(localBbUser)

    useEffect(() => {
        fetch(`http://localhost:8088/profiles?userId=${bBUserObject.id}&_expand=user&_expand=primaryGenre&_embed=profileTags&_embed=profileSubGenres`)
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

    //handler functions to take care of deletions or edits

    const handleDeletePhotoClick = e => {
        e.preventDefault()

        const [,imgIdToDelete] = e.target.id.split("--")

        return fetch(`http://localhost:8088/media/${imgIdToDelete}`, {
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
            <section className="container container_profile_page">
                <article className="container container_profile_primary">
                    <img className="img img_profile_primary" src={profile.picture} />
                    <div className="container container_heading_profile_primary">
                        <h2 className="heading heading_profile_primary_name">{profile?.user?.name}</h2>
                        <h3 className="heading heading_profile_primary_location">{profile?.location}</h3>
                        <h3 className="heading heading_profile_primary_primary_genre">{profile?.primaryGenre?.name}</h3>
                        <button type="button" className="btn button_profile_primary_edit" id={`btnEditProfilePrimary--${profile.id}`} onClick={() => { navigate(`/myprofile/edit/primaryinfo/${profile.id}`) }}>Edit Primary Info</button>
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
                                        return <li key={`profilePrimaryTag--${tag.id}`} className="profile_primary_tag">{matchTags(tag.tagId)}</li>
                                    })
                                }
                            </ul>
                            <button className="btn btn_edit btn_edit_tags" onClick={ () => { navigate(`/myprofile/edit/tags/${profile.id}`)}}>Edit Tags</button>
                            <h4 className="heading heading_profile_subgenres">Sub-Genres</h4>
                            <ul className="container container_subgenres">
                                {
                                    profile?.profileSubGenres?.map(sg => {
                                        return <li key={`profileSubGenre--${sg.id}`} className="profile_subgenre">{matchSubGenres(sg.subGenreId)}</li>
                                    })
                                }
                            </ul>
                            <button className="btn btn_edit btn_edit_subgenres" onClick={ () => { navigate(`/myprofile/edit/subgenres/${profile.id}`)}}>Edit Sub-Genres</button>
                        </div>
                    </div>
                </article>

                <article className="container container_profile_about">
                    <h3 className="heading heading_profile_about">About</h3>
                    <p className="text text_profile_about">{profile.about}</p>
                    <button type="button" className="btn button_profile_about_edit" id={`btnEditProfileAbout--${profile.id}`} onClick={() => { navigate(`/myprofile/edit/about/${profile.id}`) }}>Edit About</button>
                </article>

                <article className="container container_profile_media_outer">
                    <h3 className="heading heading_profile_media">Additional Photos</h3>
                    <div className="container container_profile_media_inner">
                        {
                            media?.length

                                ?

                                media.map(media => {
                                    return <div className="container container_profile_additional_img"><img className="img profile_img_item" key={`img--${profile.id}--${media.url}`} src={media.url} /><button type="button" id={`img--${media.id}`} className="btn btn_delete btn_delete_photo" onClick={handleDeletePhotoClick}>Delete Photo</button></div>
                                })

                                :

                                <p className="text text_profile_media_none">User hasn't uploaded additional photos yet.</p>
                        }
                    </div>
                    <div className="container container_new_photo" id="container_new_photo">
                        {
                            showNewPhoto

                            ?

                            <NewPhoto closeNewPhoto={handleNewPhotoClose} myProfileId={profile.id} setMedia={setMedia} />
                            
                            :

                            <button type="button" className="btn button_profile_photos_new" onClick={handleNewPhotoShow}>Add Photo</button>

                        }
                    </div>
                </article>

                <article className="container container_profile_posts_outer">
                    <h3 className="heading heading_profile_posts">Posts</h3>
                    <ul className="container container_profile_posts_inner">
                        {
                            myPosts?.length

                                ?

                                myPosts.map(post => <PostProfile setMyPosts={setMyPosts} myProfileId={profile.id} postKey={`postkey--${post.id}`} postId={post.id} userPicture={profile.picture} userId={profile?.user?.id} userName={profile?.user?.name} postBody={post.body} postDate={post.date} />)

                                :

                                <li key={`nopostskey`} className="post post_list_item_null"><p className="text text_profile_post_none">User hasn't submitted any posts yet.</p>
                                </li>
                        }
                    </ul>
                    <div className="container container_new_post" id="container_new_post">
                        {
                            showNewPost

                            ?

                            <NewPost closeNewPost={handleNewPostClose} myProfileId={profile.id} setMyPosts={setMyPosts} />
                            
                            :

                            <button type="button" className="btn button_profile_posts_new" id={`btnNewProfilePosts--${profile.id}`} onClick={handleNewPostShow}>New Post</button>

                        }
                    </div>
                </article>
            </section>
        </>
    )
}