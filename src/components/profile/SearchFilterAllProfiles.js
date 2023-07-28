import "./SearchFilterAllProfiles.css"

export const SearchFilterAllProfiles = ({ setSearchTerms, setSortTerms, setFilterTerms }) => {
    return (
        <>
            <section className="container container_search_filter_all_profiles">
                <div className='search-bar-container allprofiles'>
                    <div className='input-wrapper allprofiles'>
                        <i className="fas fa-search search-icon allprofiles"></i>
                        <input className='input input_searchbar input_searchbar_allprofiles' placeholder='Find your stage mates...' onChange={
                            e => {
                                setSearchTerms(e.target.value)
                            }
                        }
                        ></input>
                    </div>
                </div>

                <div className="container container_sort">
                    <label htmlFor="sort_all_profiles">Sort:</label>
                    <select className="dropdown sort sort_all_profiles" id="sort_all_profiles" name="sort_all_profiles" onChange={
                        e => {
                            setSortTerms(e.target.value)
                        }
                    } >
                        <option value="--">--</option>
                        <option value="name-forward">Name A-Z</option>
                        <option value="name-backward">Name Z-A</option>
                        <option value="genre">Genre</option>
                        <option value="instrument">Instrument</option>
                        {/* <option value="distance">Distance</option> */}
                    </select>
                </div>
                <div className="container container_filters">
                    <label htmlFor="filter_all_profiles">Filter:</label>
                    <select className="dropdown filter_all_profiles" id="filter_all_profiles" name="filter_all_profiles" onChange={
                        e => {
                            setFilterTerms(e.target.value)
                        }
                    } >
                        <option value="--">--</option>
                        <option value="saved">Saved Only</option>
                        <option value="musicians">Musicians Only</option>
                        <option value="bands">Bands Only</option>
                    </select>
                </div>
            </section>
        </>
    )
}