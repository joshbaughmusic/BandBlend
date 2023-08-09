import { useEffect, useState } from "react"
import './Distance.css'
import * as TbIcons from "react-icons/tb";
import * as BsIcons from "react-icons/bs";
import { graphHopperAPIKey } from "../../apiKeys.js";


export const Distance = ({ profileId }) => {
    const [calculatedMiles, setCalculatedMiles] = useState('')

    const localBbUser = localStorage.getItem("bb_user")
    const bBUserObject = JSON.parse(localBbUser)

    useEffect(() => {
        //get current user profile object
        fetch(`http://localhost:8088/profiles?userId=${bBUserObject.id}`)
            .then(res => res.json())
            .then(data => {
                //store user object in local variable
                const rawUserObject = data;
    
                //fetch viewed profile object
                fetch(`http://localhost:8088/profiles?userId=${profileId}`)
                    .then(res => res.json())
                    .then(data => {
                        //store viewed profile object in local variable
                        const rawProfileObject = data;
    
                        const userLocation = rawUserObject[0].location;
                        const profileLocation = rawProfileObject[0].location;
    
                        if (userLocation === profileLocation) {
                            setCalculatedMiles('0');
                        } else {
                            //store latlong of both profiles in variables
    
                            const userLatLong = rawUserObject[0].latlong
                            const profileLatLong = rawProfileObject[0].latlong
    
                            //store those values in a useable string
                            const routeString = `point=${userLatLong}&point=${profileLatLong}`;
    
                            //now calculate the route to get the distance
                            fetch(`https://graphhopper.com/api/1/route?${routeString}&vehicle=car&locale=us&instructions=true&calc_points=true&key=${graphHopperAPIKey}`)
                                .then(res => res.json())
                                .then(data => {
    
                                    if (data.message === "Connection between locations not found") {
                                        setCalculatedMiles("In a galaxy far, far away...")
                                    } else {
    
                                        //store that data
                                        const routeObject = data;
                                        //get the distance off of the route object
                                        const rawDistance = routeObject.paths[0].distance;
                                        //now convert meters to miles
                                        function metersToMiles(meters) {
                                            const milesPerMeter = 0.000621371;
                                            return meters * milesPerMeter;
                                        }
                                        const distanceInMiles = metersToMiles(rawDistance);
                                        setCalculatedMiles(distanceInMiles);
                                    }
                                });
                        }
                    });
            });
    }, []);


    if (!calculatedMiles) {
        return (
            <>
                <img className="icon icon_loading" src={require("../../images/loading_spinner.gif")} />
            </>
        )
    }

    return (
        <>
            <div className="container container_profile_distance">

                {
                    calculatedMiles === 'In a galaxy far, far away...'

                        ?

                        <TbIcons.TbPlanet className="icon icon_distance" />

                        :

                        <BsIcons.BsFillCarFrontFill className="icon icon_distance" />

                }
                {
                    calculatedMiles === 'In a galaxy far, far away...'

                        ?

                        <p className="text text_profile_distance text_profile_distance_galaxy">In a galaxy far, far away...</p>

                        :

                        calculatedMiles !== '0'

                            ?

                            <p className="text text_profile_distance">{parseInt(calculatedMiles).toLocaleString()} miles away</p>

                            :

                            <p className="text text_profile_distance">In your city!</p>

                }
            </div>
        </>
    )
}