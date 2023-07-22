import "./SearchFilterAllProfiles.css"

export const SearchFilterAllProfiles = ({ setSearchTerms, setSortTerms, setFilterTerms }) => {
    return (
        <>
            <section className="container container_search_filter_all_profiles">
                <div className="container container_searchbar">
                    <label htmlFor="searchbar_all_profiles">Search:</label>
                    <input className="searchbar searchbar_all_profiles" type="text" placeholder="Search for a profile..." name="searchbar_all_profiles" onChange={
                        e => {
                            setSearchTerms(e.target.value)
                        }
                    } />
                </div>
                <div className="container container_sort">
                    <label htmlFor="sort_all_profiles">Sort:</label>
                    <select className="dropdown sort sort_all_profiles" name="sort_all_profiles" onChange={
                        e => {
                            setSortTerms(e.target.value)
                        }
                    } >
                        <option value="--">--</option>
                        <option value="name-forward">Name A-Z</option>
                        <option value="name-backward">Name Z-A</option>
                        <option value="genre">Genre</option>
                        <option value="instrument">Instrument</option>
                        <option value="distance">Distance</option>
                    </select>
                </div>
                <div className="container container_filters">
                    <label htmlFor="filter_all_profiles">Filter:</label>
                    <select className="dropdown filter_all_profiles" name="filter_all_profiles" onChange={
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