import "./SearchFilterAllProfiles.css"

export const SearchFilterAllProfiles = ({ setSearchTerms, setSortTerms, setFilterTerms }) => {
    return (
        <>
            <section className="container container_search_filter_all_profiles">
                <div className="container_searchbar_allprofiles">
                    <i className="fas fa-search search-icon search-icon_allprofiles"></i>
                    <input className="searchbar searchbar_all_profiles input_allprofiles input_field_colors" id="searchbar_all_profiles" type="text" placeholder="Search for a profile..." name="searchbar_all_profiles" onChange={
                        e => {
                            setSearchTerms(e.target.value)
                        }

                    } />

                </div>
                <div className="container container_sort_filter_allprofiles">
                    <div className="container container_all_profiles_search_filter_individual">
                        <label className="label_allprofiles" htmlFor="sort_all_profiles">Sort:</label>
                        <select className="dropdown sort sort_all_profiles input_allprofiles input_field_colors" id="sort_all_profiles" name="sort_all_profiles" onChange={
                            e => {
                                setSortTerms(e.target.value)
                            }
                        } >
                            <option className="input_field_colors" value="--">--</option>
                            <option className="input_field_colors" value="name-forward">Name A-Z</option>
                            <option className="input_field_colors" value="name-backward">Name Z-A</option>
                            <option className="input_field_colors" value="genre">Genre</option>
                            <option className="input_field_colors" value="instrument">Instrument</option>
                            {/* <option value="distance">Distance</option> */}
                        </select>
                    </div>
                    <div className="container container_all_profiles_search_filter_individual">
                        <label className="label_allprofiles" htmlFor="filter_all_profiles">Filter:</label>
                        <select className="dropdown filter_all_profiles input_allprofiles input_field_colors" id="filter_all_profiles" name="filter_all_profiles" onChange={
                            e => {
                                setFilterTerms(e.target.value)
                            }
                        } >
                            <option className="input_field_colors" value="--">--</option>
                            <option className="input_field_colors" value="saved">Saved Only</option>
                            <option className="input_field_colors" value="musicians">Musicians Only</option>
                            <option className="input_field_colors" value="bands">Bands Only</option>
                        </select>
                    </div>
                </div>
            </section>
        </>
    )
}