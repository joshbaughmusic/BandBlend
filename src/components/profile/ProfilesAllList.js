import { useEffect, useState } from "react";
import "./ProfilesAllList.css";
import { Link } from "react-router-dom";
import { SaveButtonList } from "./SaveButtonList.js";
import FadeIn from 'react-fade-in';

export const ProfilesAllList = ({
    searchTerms,
    sortTerms,
    filterTerms
}) => {

    //getting all search, sort, filter terms from parents component ProfilesAllListContainer Shared with SearchFilterAllProfiles.

    const [profiles, setProfiles] = useState([]);
    const [filteredProfiles, setFilteredProfiles] = useState([]);
    const [savedProfiles, setSavedProfiles] = useState([]);
    const [tags, setTags] = useState([]);
    const [saveListener, setSaveListener] = useState(true)

    

    //get current user id from local storage

    const localBbUser = localStorage.getItem("bb_user");
    const bBUserObject = JSON.parse(localBbUser);

    //fetch all profiles with expanded users and primary genre, embeded profileTags

    useEffect(() => {
        fetch(`http://localhost:8088/profiles?userId_ne=${bBUserObject.id}&_expand=user&_expand=primaryGenre&_expand=primaryInstrument&_embed=profileTags`)
            .then((res) => res.json())
            .then((data) => {
                setProfiles(data);
                setFilteredProfiles(data);
            });
    }, []);


    //fetch all tags

    useEffect(() => {
        fetch(`http://localhost:8088/tags`)
            .then((res) => res.json())
            .then((data) => {
                setTags(data);
            });
    }, []);

    //fetch all savedProfiles

    useEffect(() => {
        fetch(`http://localhost:8088/savedProfiles`)
            .then((res) => res.json())
            .then((data) => {
                setSavedProfiles(data);
            });
    }, [saveListener]);

    //manage all search, sort, and filter functions here

    //write a function to handle filtering by favorites that can be used below

    const filterByFavorites = filteredData => {

        //new arr to push all results into and then return at end of function

        const filteredArr = []

        //filter array accordingly and return it for possible further processing

        //loop through all profiles in filteredData
        for (const profile of filteredData) {
            //loop through all savedProfile objects
            for (const savedProfile of savedProfiles) {
                //if there's matches, push them into filteredArr
                if (profile.id === savedProfile.profileId && bBUserObject.id === savedProfile.userId) {
                    filteredArr.push(profile)

                }
            }
        }

        return filteredArr

    }

    //search sort filter section

    useEffect(() => {

        //search by name, primaryGenre, or location, instrument, and maybe include about later

        const searchedProfiles = profiles.filter(
            (profile) =>
                profile.user.name.toLowerCase().includes(searchTerms.toLowerCase()) ||
                profile.primaryGenre.name.toLowerCase().includes(searchTerms.toLowerCase()) ||
                profile.location.toLowerCase().includes(searchTerms.toLowerCase()) ||
                profile.primaryInstrument?.name.toLowerCase().includes(searchTerms.toLowerCase())
        );

        let filteredData = [...searchedProfiles];
        if (filterTerms === "musicians") {
            filteredData = filteredData.filter((profile) => !profile.user.isBand);
        } else if (filterTerms === "bands") {
            filteredData = filteredData.filter((profile) => profile.user.isBand);
        } else if (filterTerms === "saved") {
            filteredData = filterByFavorites(filteredData)
        }

        // include filter for saved later

        if (sortTerms === "name-forward") {
            filteredData = filteredData.sort((a, b) => a.user.name.localeCompare(b.user.name));
        } else if (sortTerms === "name-backward") {
            filteredData = filteredData.sort((a, b) => b.user.name.localeCompare(a.user.name));
        } else if (sortTerms === "genre") {
            filteredData = filteredData.sort((a, b) => a.primaryGenre.name.localeCompare(b.primaryGenre.name));
        } else if (sortTerms === "instrument") {
            filteredData = filteredData.filter((profile) => !profile.user.isBand).sort((a, b) => a.primaryInstrument?.name.localeCompare(b.primaryInstrument?.name));
        }

        // include sort by instrument and maybe distance later

        setFilteredProfiles(filteredData);
    }, [searchTerms, sortTerms, filterTerms, profiles, savedProfiles]);

    //end search/filter/sort section


    //define a function to match tag from all tags with incoming profileTags tagId attached to profile by embed. Return that tag's name. Will be invoked in map function below

    const matchTags = (tagId) => {
        let matchedTagName = tags.find((tag) => tag.id === tagId);
        return matchedTagName?.name;
    };

    if (!profiles || !tags) {
        return null;
    }

    if (filteredProfiles.length === 0) {
        return <p>No matching results.</p>;
    } else {
        return (
            <>
            <FadeIn>
                <section className="container container_allProfiles">
                    {filteredProfiles.map((profile) => (
                        <article key={`profileCard--${profile.id}`} className="container container_profile_card">
                            <Link to={`/profiles/${profile.id}`} className="profileall_link">
                                <img id={`profileCardImg--${profile.id}`} className="img img_profileCard" src={profile.picture} />
                            </Link>
                            <div className="container container_profile_card_header">
                                <Link to={`/profiles/${profile.id}`} className="profileall_link">
                                    <h2 className="profile_card_name">{profile?.user?.name}</h2>
                                </Link>
                                <h3 className="profile_card_location">{profile.location}</h3>
                                {
                                    !profile?.user?.isBand

                                        ?

                                        <div className="container container_profile_card_primaryinstrument">
                                            <p className="profile_card_instrument">{profile?.primaryInstrument?.name}</p>
                                        </div>

                                        :

                                        ""
                                }
                                {profile?.user?.isBand ? (
                                    <p className="profile_card_bandnote">Band</p>
                                ) : (
                                    ''
                                )}
                            </div>
                            <div className="container container_profile_card_primarygenre">
                                <h3 className="profile_card_genre">Genre:</h3>
                                <p className="profile_card_genre_name">{profile.primaryGenre.name}</p>
                            </div>

                            <div className="container container_profile_card_tags">
                                <h3 className="profile_card_tags">Tags:</h3>
                                <ul>
                                    {profile.profileTags.map((tag) => (
                                        <li key={`profileCardTag--${tag.id}--${tag.tagId}`} className="profile_card_tag">
                                            {matchTags(tag.tagId)}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <SaveButtonList profileId={profile.id} saveListener={saveListener} setSaveListener={setSaveListener} />
                        </article>
                    ))}
                </section>
                </FadeIn>
            </>
        );
    }
};
