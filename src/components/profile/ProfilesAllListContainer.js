import { useState } from "react"
import { SearchFilterAllProfiles } from "./SearchFilterAllProfiles.js"
import { ProfilesAllList } from "./ProfilesAllList.js"


export const ProfileAllListContainer = () => {
    const [searchTerms, setSearchTerms] = useState('')
    const [sortTerms, setSortTerms] = useState('')
    const [filterTerms, setFilterTerms] = useState('')

    return <>
        <SearchFilterAllProfiles setSearchTerms={setSearchTerms} setSortTerms={setSortTerms} setFilterTerms={setFilterTerms}/>
        <ProfilesAllList searchTerms={searchTerms} sortTerms={sortTerms} filterTerms={filterTerms} setSearchTerms={setSearchTerms} setSortTerms={setSortTerms} setFilterTerms={setFilterTerms}/>
    </>
}