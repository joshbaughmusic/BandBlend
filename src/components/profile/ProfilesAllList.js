import { useEffect, useState } from "react";
import "./ProfilesAllList.css";
import { Link } from "react-router-dom";
import { SaveButtonList } from "./SaveButtonList.js";
import FadeIn from 'react-fade-in';
import * as TbIcons from "react-icons/tb";
import * as BsIcons from "react-icons/bs";

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
    const [showSpinner, setShowSpinner] = useState(true)


    const graphHopperAPIKey = 'adf07474-6bc7-421e-8731-0e202739ca11'


    //get current user id from local storage

    const localBbUser = localStorage.getItem("bb_user");
    const bBUserObject = JSON.parse(localBbUser);

    //fetch all profiles with expanded users and primary genre, embeded profileTags, minus logged in user

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response1 = await fetch(
                    `http://localhost:8088/profiles?userId_ne=${bBUserObject.id}&_expand=user&_expand=primaryGenre&_expand=primaryInstrument&_embed=profileTags`
                );
                const data1 = await response1.json();
                const allProfilesMinusCurrentUser = data1;

                const response2 = await fetch(
                    `http://localhost:8088/profiles?userId=${bBUserObject.id}`
                );
                const data2 = await response2.json();
                const currentUserProfile = data2[0];

                const allProfilesWithDistance = await Promise.all(
                    allProfilesMinusCurrentUser.map(async (profile) => {
                        const routeString = `point=${currentUserProfile.latlong}&point=${profile.latlong}`;
                        const response3 = await fetch(
                            `https://graphhopper.com/api/1/route?${routeString}&vehicle=car&locale=us&instructions=true&calc_points=true&key=${graphHopperAPIKey}`
                        );
                        const data3 = await response3.json();

                        let calculatedMiles = '';
                        if (data3.message === 'Connection between locations not found') {
                            calculatedMiles = 'In a galaxy far, far away...';
                        } else {
                            const routeObject = data3;
                            const rawDistance = routeObject.paths[0].distance;
                            function metersToMiles(meters) {
                                const milesPerMeter = 0.000621371;
                                return meters * milesPerMeter;
                            }
                            const distanceInMiles = metersToMiles(rawDistance);
                            calculatedMiles = distanceInMiles;
                        }

                        const profileWithDistance = { ...profile };
                        profileWithDistance.distance = calculatedMiles;
                        return profileWithDistance;
                    })
                );

                setProfiles(allProfilesWithDistance);
                setFilteredProfiles(allProfilesWithDistance);
                setShowSpinner(false)
            } catch (error) {
                // Handle any error that might occur during the fetch
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
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
        } else if (sortTerms === "distance-closest") {
            filteredData = filteredData.sort((a, b) => a.distance - b.distance);
        } else if (sortTerms === "distance-furthest") {
            filteredData = filteredData.sort((a, b) => b.distance - a.distance);
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

    if (!tags || !filteredProfiles) {
        return null;
    }

    //loading spinner will be shown until everything is fetched, then the showSpinner state is set to false
    if (showSpinner) {
        return <section className="container container_allProfiles">
            <img className="icon icon_loading_big" src={require("../../images/spinner_big_background.gif")} />
        </section>

        //show no results if they tried to search for something and there was no matches
    } else if (filteredProfiles.length === 0) {
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
                                    {
                                        profile?.user?.isBand

                                            ?
                                            
                                            <p className="profile_card_bandnote">Band</p>

                                            :

                                            ''
                                    }
                                    {
                                        !profile?.user?.isBand

                                            ?

                                            <div className="container container_profile_card_primaryinstrument">
                                                <p className="profile_card_instrument">{profile?.primaryInstrument?.name}</p>
                                            </div>

                                            :

                                            ""
                                    }
                                    <h3 className="profile_card_location">{profile.location}</h3>
                                    <div className="container container_profile_distance">

                                        {
                                            profile.distance === 'In a galaxy far, far away...'

                                                ?

                                                <TbIcons.TbPlanet className="icon icon_distance icon_distance_allprof" />

                                                :

                                                <BsIcons.BsFillCarFrontFill className="icon icon_distance icon_distance_allprof" />

                                        }
                                        {
                                            profile.distance === 'In a galaxy far, far away...'

                                                ?

                                                <p className="text text_profile_distance text_profile_distance_galaxy text_profile_distance_allprof">In a galaxy far, far away...</p>

                                                :

                                                profile.distance !== 0

                                                    ?

                                                    <p className="text text_profile_distance text_profile_distance_allprof">{parseInt(profile.distance).toLocaleString()} miles away</p>

                                                    :

                                                    <p className="text text_profile_distance">In your city!</p>

                                        }
                                    </div>
                                    
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
