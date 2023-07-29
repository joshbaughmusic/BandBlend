import "./MessageSortFilter.css"

export const MessageSearchSort = ({setSortTerms, setSearchTerms}) => {


    return (
        <>
            <section className="container container_search_sort_messages">
                <div className="container_searchbar_messages">
                    <i className="fas fa-search search-icon search-icon_messages"></i>
                    <input className="searchbar searchbar_messages input_messages input_field_colors" id="searchbar_messages" type="text" placeholder="Search messages..." name="searchbar_messages" onChange={
                        e => {
                            setSearchTerms(e.target.value)
                        }

                    } />

                </div>
                <div className="container container_sort_messages">
                    <label className="label label_messages label_sort_messages " htmlFor="sort_messages">Sort:</label>
                    <select className="dropdown sort sort_messages input_messages input_field_colors" id="sort_messages" name="sort_messages" onChange={
                        e => {
                            setSortTerms(e.target.value)
                        }
                    } >
                        <option className="input_field_colors" value="newest">Newest</option>
                        <option className="input_field_colors" value="oldest">Oldest</option>
                    </select>
                </div>
                {/* <div className="container container_filters">
                    <label htmlFor="filter_messages">Filter:</label>
                    <select className="dropdown filter_messages" id="filter_messages" name="filter_messages" onChange={
                        e => {
                            setFilterTerms(e.target.value)
                        }
                    } >
                        <option value="--">--</option>
                        <option value="musicians">Musicians Only</option>
                        <option value="bands">Bands Only</option>
                    </select>
                </div> */}
            </section>
        </>
    )
}