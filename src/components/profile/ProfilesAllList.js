import { useEffect, useState } from "react"
import "./ProfilesAllList.css"
import { Link } from "react-router-dom"

export const ProfilesAllList = ({ searchTerms, sortTerms, filterTerms }) => {
    //getting all search, sort, filter terms from parents component ProfilesAllListContainer Shared with SearchFilterAllProfiles.

    const [profiles, setProfiles] = useState([])
    const [filteredProfiles, setFilteredProfiles] = useState([])
    const [tags, setTags] = useState([])


    //manage all search, sort, and filter functions here

    //search by name

    useEffect(() => {
        const searchedProfiles = profiles.filter(profile => profile.user.name.toLowerCase().includes(searchTerms.toLowerCase()))

        setFilteredProfiles(searchedProfiles)

    }, [searchTerms])


    //sort by value

    useEffect(() => {
        //if set back to no sort option --
        if (sortTerms === "--") {

            setFilteredProfiles(profiles)
        }

        //for A-Z sort option

        if (sortTerms === "name-forward") {
            const sortedProfiles = [...profiles].sort((a,b) => {
                if (a.user.name < b.user.name) {
                    return -1;
                  }
                  if (a.user.name > b.user.name) {
                    return 1;
                  }
                  return 0; 
            })

            setFilteredProfiles(sortedProfiles)
        }
        
        //for Z-A sort option

        if (sortTerms === "name-backward") {
            const sortedProfiles = [...profiles].sort((a,b) => {
                if (a.user.name > b.user.name) {
                    return -1;
                  }
                  if (a.user.name < b.user.name) {
                    return 1;
                  }
                  return 0; 
            })

            setFilteredProfiles(sortedProfiles)
        }

        //for genre sort option

        if (sortTerms === "genre") {
            const sortedProfiles = [...profiles].sort((a,b) => {
                if (a.primaryGenre.name < b.primaryGenre.name) {
                    return -1;
                  }
                  if (a.primaryGenre.name > b.primaryGenre.name) {
                    return 1;
                  }
                  return 0; 
            })

            setFilteredProfiles(sortedProfiles)
        }

        //for instrument sort option
        
        //for distance sort option

    }, [sortTerms])

    //filter by value

    useEffect(() => {
        //if set back to no sort option --
        if (filterTerms === "--") {

            setFilteredProfiles(profiles)
        }

        //for musicians option

        if (filterTerms === "musicians") {
            const filteredProfiles = profiles.filter(profile => {
                return profile.user.isBand === false;
            })

            setFilteredProfiles(filteredProfiles)
        }

        //for bands option

        if (filterTerms === "bands") {
            const filteredProfiles = profiles.filter(profile => {
                return profile.user.isBand === true;
            })

            setFilteredProfiles(filteredProfiles)
        }

        //for saved only option


    }, [filterTerms])


    //end of search, sort, and filter section



    //get current user id from local storage

    const localBbUser = localStorage.getItem("bb_user")
    const bBUserObject = JSON.parse(localBbUser)

    //fetch all profiles with expanded users and primary genre, embeded profileTags

    useEffect(() => {
        fetch(`http://localhost:8088/profiles?userId_ne=${bBUserObject.id}&_expand=user&_expand=primaryGenre&_embed=profileTags`)
            .then(res => res.json())
            .then(data => {
                setProfiles(data)
                setFilteredProfiles(data)
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


    if (!profiles || !tags) {
        return null
    }

    //define a function to match tag from all tags with incoming profileTags tagId attached to profile by embed. Return that tag's name. Will be invoked in map function below

    const matchTags = (tagId) => {
        let matchedTagName = tags.find(tag => tag.id === tagId)
        return matchedTagName?.name
    }

    if (filteredProfiles.length === 0) {
        return <p>No matching results.</p>
    } else {
        return <>
            <section className="container container_allProfiles">
                {
                    filteredProfiles.map(profile => {
                        return <article key={`profileCard--${profile.id}`} className="container container_profile_card">
                            <img id={`profileCardImg--${profile.id}`} className="img img_profileCard" src={profile.picture} />
                            <div className="container container_profile_card_header">
                                <Link to={`/profiles/${profile.id}`}><h2 className="profile_card_name">{profile?.user?.name}</h2></Link>
                                {
                                    profile?.user?.isBand ? <p className="profile_card_bandnote">Band</p> : <p className="profile_card_musiciannote">Musician</p>
                                }
                                <h3 className="profile_card_location">{profile.location}</h3>
                            </div>
                            <div className="container container_profile_card_primarygenre">
                                <h3 className="profile_card_genre">Genre</h3>
                                <p className="profile_card_genre_name">{profile.primaryGenre.name}</p>
                            </div>

                            <div className="container container_profile_card_tags">
                                <h3 className="profile_card_tags">Tags</h3>
                                <ul>
                                    {
                                        profile.profileTags.map(tag => {
                                            return <li key={`profileCardTag--${tag.id}--${tag.tagId}`} className="profile_card_tag">{matchTags(tag.tagId)}</li>
                                        })
                                    }
                                </ul>
                            </div>
                            <button>Save</button>

                        </article>
                    })
                }
            </section>
        </>
    }
}