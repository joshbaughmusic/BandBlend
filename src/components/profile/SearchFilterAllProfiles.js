import "./SearchFilterAllProfiles.css"

export const SearchFilterAllProfiles = ({ setSearchTerms, setSortTerms, setFilterTerms }) => {
    return (
        <>
            <section className="container container_search_filter_all_profiles">
                <div className="container_searchbar_allprofiles">
                    <i className="fas fa-search search-icon_allprofiles"></i>
                    <input className="searchbar searchbar_all_profiles input_allprofiles" id="searchbar_all_profiles" type="text" placeholder="Search for a profile..." name="searchbar_all_profiles" onChange={
                        e => {
                            setSearchTerms(e.target.value)
                        }

                    } />

                </div>
                <div className="container container_sort_filter_allprofiles">
                    <label className="label_allprofiles" htmlFor="sort_all_profiles">Sort:</label>
                    <select className="dropdown sort sort_all_profiles input_allprofiles" id="sort_all_profiles" name="sort_all_profiles" onChange={
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
                    {/* </div> */}
                    {/* <div className="container container_filters"> */}
                    <label className="label_allprofiles" htmlFor="filter_all_profiles">Filter:</label>
                    <select className="dropdown filter_all_profiles input_allprofiles" id="filter_all_profiles" name="filter_all_profiles" onChange={
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
                {/* </div> */}
            </section>
        </>
    )
}