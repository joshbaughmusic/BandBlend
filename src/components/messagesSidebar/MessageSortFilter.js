export const MessageSortFilter = ({setFilterTerms, setSortTerms}) => {


    return (
        <>
            <section className="container container_search_filter_messages">
                <div className="container container_sort">
                    <label htmlFor="sort_messages">Sort:</label>
                    <select className="dropdown sort sort_messages" id="sort_messages" name="sort_messages" onChange={
                        e => {
                            setSortTerms(e.target.value)
                        }
                    } >
                        <option value="--">--</option>
                        <option value="name-forward">Name A-Z</option>
                        <option value="name-backward">Name Z-A</option>
                    </select>
                </div>
                <div className="container container_filters">
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
                </div>
            </section>
        </>
    )
}