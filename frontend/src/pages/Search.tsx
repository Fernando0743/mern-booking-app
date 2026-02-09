import { useQuery } from "@tanstack/react-query";
import { useSearchContext } from "../contexts/SearchContext"
import * as apiClient from "../api-client"
import { useState } from "react";
import SearchResultsCard from "../components/SearchResultCard";


const Search = () => {
    const search = useSearchContext();
    const [page, setPage] = useState<number>(1);

    const searchParams = {
        destination: search.destination,
        checkIn: search.checkIn.toISOString(),
        checkOut: search.checkOut.toISOString(),
        adultCount: search.adultCount.toString(),
        childCount: search.childCount.toString(),
        page: page.toString(),
        

    }

    const { data: hotelData} = useQuery({
        queryKey: ["searchHotels", searchParams],
        queryFn: () => apiClient.searchHotels(searchParams)
    })

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5">
            {/*Filters Column. Sticky will sticks the div to the window as we scroll down*/}
            <div className="rounded-lg border border-slate-300 p-5 h-fit sticky top-10">
                {/*Div that spaces out all the stuff in our filters column*/ }
                <div className="space-y-5">
                    <h3 className="text-lg font-semibold border-b border-slate-300 pb-5">
                        Filter by: 
                    </h3>
                    {/*TODO - ADD MORE FILTERS */}
                </div>
            </div>

            <div className="flex flex-col gap-5">
                {/*Sort dropdown and number of hotel founds label */}
                <div className="flex justify-between items-center">
                    <span className="text-xl font-bold">
                        {hotelData?.pagination.total} Hotels found
                        {search.destination ? ` in ${search.destination}` : ""}
                    </span>
                    {/*TODO sort options */}
                </div>
                {hotelData?.data.map((hotel) =>(
                    <SearchResultsCard hotel={hotel} />
                ))}
            </div>

        </div>
    )


    
}

export default Search;