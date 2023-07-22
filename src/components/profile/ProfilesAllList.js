import { useEffect, useState } from "react";
import "./ProfilesAllList.css";
import { Link } from "react-router-dom";

export const ProfilesAllList = ({
    searchTerms,
    sortTerms,
    filterTerms
}) => {

    //getting all search, sort, filter terms from parents component ProfilesAllListContainer Shared with SearchFilterAllProfiles.

    const [profiles, setProfiles] = useState([]);
    const [filteredProfiles, setFilteredProfiles] = useState([]);
    const [tags, setTags] = useState([]);

    //fetch all profiles with expanded users and primary genre, embeded profileTags

    useEffect(() => {
        fetch(`http://localhost:8088/profiles?userId_ne=${bBUserObject.id}&_expand=user&_expand=primaryGenre&_embed=profileTags`)
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

    //manage all search, sort, and filter functions here

    useEffect(() => {

        //search by name, primaryGenre, or location, maybe include about later

        const searchedProfiles = profiles.filter(
            (profile) =>
                profile.user.name.toLowerCase().includes(searchTerms.toLowerCase()) ||
                profile.primaryGenre.name.toLowerCase().includes(searchTerms.toLowerCase()) ||
                profile.location.toLowerCase().includes(searchTerms.toLowerCase())
        );

        let filteredData = [...searchedProfiles];
        if (filterTerms === "musicians") {
            filteredData = filteredData.filter((profile) => !profile.user.isBand);
        } else if (filterTerms === "bands") {
            filteredData = filteredData.filter((profile) => profile.user.isBand);
        }

        // include filter for saved later

        if (sortTerms === "name-forward") {
            filteredData = filteredData.sort((a, b) => a.user.name.localeCompare(b.user.name));
        } else if (sortTerms === "name-backward") {
            filteredData = filteredData.sort((a, b) => b.user.name.localeCompare(a.user.name));
        } else if (sortTerms === "genre") {
            filteredData = filteredData.sort((a, b) => a.primaryGenre.name.localeCompare(b.primaryGenre.name));
        }

        // include sort by instrument and maybe distance later

        setFilteredProfiles(filteredData);
    }, [searchTerms, sortTerms, filterTerms, profiles]);

    //end search/filter/sort section



    //get current user id from local storage

    const localBbUser = localStorage.getItem("bb_user");
    const bBUserObject = JSON.parse(localBbUser);


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
                <section className="container container_allProfiles">
                    {filteredProfiles.map((profile) => (
                        <article key={`profileCard--${profile.id}`} className="container container_profile_card">
                            <Link to={`/profiles/${profile.id}`}>
                                <img id={`profileCardImg--${profile.id}`} className="img img_profileCard" src={profile.picture} />
                            </Link>
                            <div className="container container_profile_card_header">
                                <Link to={`/profiles/${profile.id}`}>
                                    <h2 className="profile_card_name">{profile?.user?.name}</h2>
                                </Link>
                                {profile?.user?.isBand ? (
                                    <p className="profile_card_bandnote">Band</p>
                                ) : (
                                    <p className="profile_card_musiciannote">Musician</p>
                                )}
                                <h3 className="profile_card_location">{profile.location}</h3>
                            </div>
                            <div className="container container_profile_card_primarygenre">
                                <h3 className="profile_card_genre">Genre</h3>
                                <p className="profile_card_genre_name">{profile.primaryGenre.name}</p>
                            </div>

                            <div className="container container_profile_card_tags">
                                <h3 className="profile_card_tags">Tags</h3>
                                <ul>
                                    {profile.profileTags.map((tag) => (
                                        <li key={`profileCardTag--${tag.id}--${tag.tagId}`} className="profile_card_tag">
                                            {matchTags(tag.tagId)}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <button>Save</button>
                        </article>
                    ))}
                </section>
            </>
        );
    }
};
