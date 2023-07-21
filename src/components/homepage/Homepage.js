import { useEffect, useState } from "react"
import "./Homepage.css"

export const Homepage = () => {

    const localBbUser = localStorage.getItem("bb_user")
    const bBUserObject = JSON.parse(localBbUser)

    //split user name to only first name if there's a last name as well. Split by space

    const [mainName, ] = bBUserObject.name.split(" ")

    const [profilesWithPosts, setProfilesWithPosts] = useState([])

    //need to get posts separately to sort them, then somehow get posts matched up with the relevant profile and user to get the picture and name for them

    // //fetch profiles with expanded users and embeded posts (need to do it this way to get all the relevant info to display on a post like profile pic and such)

    // useEffect(() => {
    //     fetch(`http://localhost:8088/profiles?userId_ne=${bBUserObject.id}&_expand=user&_embed=posts`)
    //     .then(res => res.json())
    //     .then(data => {
    //         setProfilesWithPosts(data)
    //     })
    // }, [])

    // //sort list of profilesWithPosts by timestamp (do), get latest 3 into a new array

    // if (!profilesWithPosts) {
    //     return null
    // }

    // const latestPosts = []

    // const sortedProfilesWithPosts = profilesWithPosts.sort((a,b) => a.posts.date - b.posts.date)

    // console.log(sortedProfilesWithPosts);

    return (
        <>

            <section className="container container_homepage">
                <section className="container container_hero">
                    <header className="container container_heading">
                        <h1 className="heading heading_app_title">BandBlend</h1>
                        <h2 className="heading heading_app_subheading">Fusing Musicians for Masterpieces</h2>
                    </header>
                    <div className="container container_greeting">
                        <h3 className="greeting">Hello {mainName}!</h3>
                    </div>
                </section>
                <section>
                    <div>
                        <input type="text" /><br />
                        <input type="text" />
                    </div>
                </section>
                <section className="container container_home_featured_posts_outer">
                    <h3 className="heading heading_home_featured_posts">Posts</h3>
                    <ul className="container container_home_featured_posts_inner">
                        {
                            // profile.posts?.length

                            //     ?

                            //     profile.posts.map(post => <PostProfile key={`post--${post.id}`} postId={post.id} userPicture={profile.picture} userName={profile?.user?.name} userId={profile?.user?.id} postBody={post.body} postDate={post.date} />)

                            //     :

                            //     <li className="post post_list_item_null"><p className="text text_home_post_none">No posts to show at this time.</p>
                            //     </li>
                        }
                    </ul>
                </section>
            </section>

        </>
    )
}