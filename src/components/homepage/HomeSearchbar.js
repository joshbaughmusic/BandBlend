import { useEffect, useState } from 'react';
import './HomeSearchbar.css'
import { useNavigate } from 'react-router';


export const HomeSearchbar = () => {
    //create a searchbar with autocomplete dropdown on homepage
    const [profiles, setProfiles] = useState([])
    const [filteredProfiles, setFilteredProfiles] = useState([])
    const [input, setInput] = useState('')
    const navigate = useNavigate()

    const localBbUser = localStorage.getItem("bb_user")
    const bBUserObject = JSON.parse(localBbUser)


    //fetch all profiles with expanded user, genre, and instrument info. Want to use all of these things in search terms. Filter out current user from result when fetching

    useEffect(() => {
        fetch(`http://localhost:8088/profiles?userId_ne=${bBUserObject.id}&_expand=user&_expand=primaryGenre&_expand=primaryInstrument`)
            .then((res) => res.json())
            .then((data) => {
                setProfiles(data);
            });
    }, []);


    useEffect(() => {
            if(!input) {
                setFilteredProfiles([])
            } else {
                const searchedProfiles = profiles.filter((profile) => {
                    if (profile.user.name.toLocaleLowerCase().includes(input.toLocaleLowerCase()) || profile.primaryInstrument.name.toLocaleLowerCase().includes(input.toLocaleLowerCase()) || profile.primaryGenre.name.toLocaleLowerCase().includes(input.toLocaleLowerCase()) || profile.location.toLocaleLowerCase().includes(input.toLocaleLowerCase())) 
                    return true
                })
                
                setFilteredProfiles(searchedProfiles)
            }
     
    }, [input])
    
    return (
        <>
            <div className='search-bar-container'>
                <div className='input-wrapper'>
                    <i className="fas fa-search search-icon"></i>
                    <input className='input input_searchbar input_searchbar_home' placeholder='Find your stage mates...' value={input} onChange={(e) => {
                        setInput(e.target.value)
                    }}
                    ></input>
                </div>
                <div className='results-list'>
                    {
                        filteredProfiles.map((profile, id) => {
                            return <div className='search-result' key={`result--${id}`} onClick={ () => {
                                navigate(`/profiles/${profile.id}`)
                            }}>{profile.user.name}</div>
                        })
                    }
                </div>
            </div>
            <p className='text text_searchbar_subtext'>Search by name, location, genre, or instrument</p>
        </>
    )

}