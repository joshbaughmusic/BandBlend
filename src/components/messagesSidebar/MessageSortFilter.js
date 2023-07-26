export const MessageSearchSort = ({setSortTerms, setSearchTerms}) => {


    return (
        <>
            <section className="container container_searchbar_sort_messages">
            <div className="container container_searchbar_messages">
                    <label htmlFor="searchbar_messages">Search:</label>
                    <input className="searchbar searchbar_messages" id="searchbar_messages" type="text" placeholder="Search for messages..." name="searchbar_messages" onChange={
                        e => {
                            setSearchTerms(e.target.value)
                        }
                    } />
                </div>
                <div className="container container_sort">
                    <label htmlFor="sort_messages">Sort:</label>
                    <select className="dropdown sort sort_messages" id="sort_messages" name="sort_messages" onChange={
                        e => {
                            setSortTerms(e.target.value)
                        }
                    } >
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
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