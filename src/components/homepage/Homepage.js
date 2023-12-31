import { useEffect, useState } from "react"
import "./Homepage.css"
import { PostHome } from "../posts/PostHome.js"
import { HomeSearchbar } from "./HomeSearchbar.js"
import FadeIn from 'react-fade-in';
import { useNavigate } from "react-router";


export const Homepage = ({ message, setMessage, setSelectedReceiverId, showNewMessage, setShowNewMessage, setSidebar }) => {

    const navigate = useNavigate()

    const localBbUser = localStorage.getItem("bb_user")
    const bBUserObject = JSON.parse(localBbUser)

    //split user name to only first name if there's a last name as well. Split by space. Is only returned in code below if user is not a band. Otherwise entire name returned.

    const [mainName,] = bBUserObject.name.split(" ")

    const [profilesWithUsers, setProfilesWithUsers] = useState([])
    const [allPosts, setAllPosts] = useState([])

    //make sure page starts at top when it's loaded

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    //fetch profiles with expanded users (need this info to display on the posts)

    useEffect(() => {
        fetch(`http://localhost:8088/profiles?_expand=user`)
            .then(res => res.json())
            .then(data => {
                setProfilesWithUsers(data)
            })
    }, [])

    //fetch all posts

    useEffect(() => {
        fetch(`http://localhost:8088/posts`)
            .then(res => res.json())
            .then(data => {
                setAllPosts(data)
            })
    }, [])


    if (!profilesWithUsers) {
        return null
    }

    //get profile of current logged in user

    const currentUserProfile = profilesWithUsers.find(profile => profile.user.id === bBUserObject.id)

    //filter out posts that belong to the currently logged in user and get latest 3 posts from remainder and store in variable

    const latestPosts = [...allPosts].filter(post => {
        return post.profileId !== currentUserProfile?.id && post.profileId !== 20
    }).sort((a, b) => b.date - a.date).slice(0, 3)


    //match those posts with the list of profiles pulled from before. Merge each post into the profile object and store them all in a new variable.


    const profilesWithPostsAttached = latestPosts.map(post => {
        let matchedProfile = profilesWithUsers.find(profile => profile.id === post.profileId)

        let profileWithPost = {
            ...matchedProfile,
            ...post
        }

        return profileWithPost
    })

    const handleJohhnyClick = e => {
        e.preventDefault()

        setShowNewMessage(true)

        const copy = message
        copy.receiverId = 20
        copy.body = ''
        copy.date = 0
        copy.id = ''
        setMessage(copy)
        setSidebar(true)
        setSelectedReceiverId(`user--20`)

        if (showNewMessage) {
            document.querySelector('.input_text_message').value = ''
        }

    }

    return (
        <>


                <div className="container container_all_homepage_content">
                    <section className="container container_hero">
                        <header className="container container_heading">
                            <img className="heading heading_app_title" src={require("../../images/Bandblend_Logos/Logo-top-black.png")} />
                            <img className="heading heading_app_subtitle" src={require("../../images/Bandblend_Logos/Logo-bot-black.png")} />
                        </header>

                    </section>
                        <FadeIn transitionDuration={400}>
                        <HomeSearchbar />
                    <div className="container container_greeting">
                        {
                            bBUserObject.isBand === true

                                ?

                                <h3 className="heading heading_greeting">Hey {bBUserObject.name}!</h3>

                                :

                                <h3 className="heading heading_greeting">Hey {mainName}!</h3>

                        }
                    </div>
                    <section className="container container_home_latest_posts_outer">
                        <ul className="container container_home_latest_posts_inner">
                            <h3 className="heading heading_home_latest_posts">Latest posts from the community:</h3>
                            {
                                profilesWithPostsAttached?.length

                                    ?

                                    profilesWithPostsAttached.map(profileWithPost => <PostHome
                                        key={`profileWithPost--${profileWithPost.id}`}
                                        profileId={profileWithPost.profileId} userPicture={profileWithPost.picture} userName={profileWithPost?.user?.name} userId={profileWithPost?.user?.id}
                                        postId={profileWithPost.id}
                                        postBody={profileWithPost.body}
                                        postDate={profileWithPost.date} />)

                                    :

                                    ''
                            }
                        </ul>

                        <div className="container container_homepage_johnny_button">
                            <div className="container container_homepage_johnny_button_text">
                                <p className="text text_homepage_johnny_button_1">Not sure where to start?</p>
                                <p className="text text_homepage_johnny_button_2">Try asking <span className="johnny_profile_link" onClick={() => {
                                    navigate(`profiles/20`)
                                }}>Johnny</span>:</p>
                            </div>
                            <button className="btn btn_homepage_johnny_button" onClick={handleJohhnyClick}>Message Now</button>
                        </div>
                        <div className="container container_homepage_johnny_button container_homepage_johnny_button_smaller">
                            <p className="text text_homepage_johnny_button_smaller">Not sure where to start?</p>
                            <p className="text text_homepage_johnny_button_2">Try asking <span className="johnny_profile_link" onClick={() => {
                                    navigate(`profiles/20`)
                                }}>Johnny</span>:</p>
                            <button className="btn btn_homepage_johnny_button" onClick={handleJohhnyClick}>Message Now</button>
                        </div>
                        
                    </section>
            </FadeIn>
                </div>

            <div className="waves-home"></div>


        </>
    )
}