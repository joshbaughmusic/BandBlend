import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { PostProfile } from "../posts/PostProfile.js"
import { NewPost } from "../posts/NewPost.js"
import "./MyProfile.css"

export const MyProfile = () => {

    const [profile, setProfile] = useState({})
    const [myPosts, setMyPosts] = useState([])
    const [tags, setTags] = useState([])
    const [subGenres, setSubGenres] = useState([])

    //states to handle whether or not to show new content forms

    const [showNewPost, setShowNewPost] = useState(false);


    //fetch current user in local storage and fetch their profile when they arrive at MyProfile page. Use this to populate the view.

    const localBbUser = localStorage.getItem("bb_user")
    const bBUserObject = JSON.parse(localBbUser)

    useEffect(() => {
        fetch(`http://localhost:8088/profiles?userId=${bBUserObject.id}&_expand=user&_expand=primaryGenre&_embed=profileTags&_embed=profileSubGenres&_embed=media`)
            .then(res => res.json())
            .then(data => {
                setProfile(data[0])
            })
    }, [])

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
                        <button type="button" className="btn button_profile_primary_edit" id={`btnEditProfilePrimary--${profile.id}`} onClick={() => { }}>Edit Primary Info</button>
                    </div>

                    <div className="container container_profile_primary_clickables">
                        <div className="container container_profile_primary_song">
                            {
                                profile.featuredSong

                                    ?

                                    <div className="audio audio_profile_primary">Featured song goes here</div>

                                    :

                                    ''
                            }
                        </div>

                        <div className="container container_profile_primary_socialwidgets">
                            {
                                profile.spotify

                                    ?

                                    <Link to={profile.spotify}><img className="img img_profile_primary_socialwidget" src="../../images/spotify.png" /></Link>

                                    :

                                    ""
                            }
                            {
                                profile.facebook

                                    ?

                                    <Link to={profile.facebook}><img className="img img_profile_primary_socialwidget" src="../../images/facebook.png" /></Link>

                                    :

                                    ""
                            }
                            {
                                profile.instagram

                                    ?

                                    <Link to={profile.instagram}><img className="img img_profile_primary_socialwidget" src="../../images/instagram.png" /></Link>

                                    :

                                    ""
                            }
                            {
                                profile.tiktok

                                    ?

                                    <Link to={profile.tiktok}><img className="img img_profile_primary_socialwidget" src="../../images/tiktok.png" /></Link>

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
                    <button type="button" className="btn button_profile_about_edit" id={`btnEditProfileAbout--${profile.id}`} onClick={() => { }}>Edit About</button>
                </article>

                <article className="container container_profile_media_outer">
                    <h3 className="heading heading_profile_media">Additional Photos</h3>
                    <div className="container container_profile_media_inner">
                        {
                            profile.media?.length

                                ?

                                profile.media.map(media => {
                                    return <img className="img profile_media_item" key={`img--${profile.id}--${media.url}`} src={media.url} />
                                })

                                :

                                <p className="text text_profile_media_none">User hasn't uploaded additional photos yet.</p>
                        }
                    </div>
                    <button type="button" className="btn button_profile_addphotos_new" id={`btnNewProfilePhotos--${profile.id}`} onClick={() => { }}>New Photo</button>
                </article>

                <article className="container container_profile_posts_outer">
                    <h3 className="heading heading_profile_posts">Posts</h3>
                    <ul className="container container_profile_posts_inner">
                        {
                            myPosts?.length

                                ?

                                myPosts.map(post => <PostProfile setMyPosts={setMyPosts} myProfileId={profile.id} key={`post--${post.id}`} postId={post.id} userPicture={profile.picture} userId={profile?.user?.id} userName={profile?.user?.name} postBody={post.body} postDate={post.date} />)

                                :

                                <li className="post post_list_item_null"><p className="text text_profile_post_none">User hasn't submitted any posts yet.</p>
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