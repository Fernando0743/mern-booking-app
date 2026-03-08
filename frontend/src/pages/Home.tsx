import { useQuery } from "@tanstack/react-query";
import * as apiClient from "../api-client";
import LatestDestinationCard from "../components/LatestDestinationCard";



const Home = () =>{
    const {data : hotels} = useQuery({
        queryKey: ["fetchQuery"],
        queryFn: () => apiClient.fetchHotels()
    })

    //Grab first two hotels
    const topRowHotels = hotels?.slice(0,2) || [];
    //Grab rest of hotels
    const bottomRowhotels = hotels?.slice(2) || [];

    return (
        <div className="space-y-3">
            <h2 className="text-3xl font-bold">Latest Destinations</h2>
            <p>Most recent destinations added by our hosts</p>
            {/*Image Grid*/}
            <div className="grid gap-4">
                <div className="grid md:grid-cols-2 grid-cols-1 gap-4">{topRowHotels.map((hotel) => (
                    <LatestDestinationCard hotel={hotel}/>
                ))}
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                    {bottomRowhotels.map((hotel) => (
                        <LatestDestinationCard hotel={hotel} />
                    ))}
                </div>
            </div>
        </div>
    )

}   

export default Home;