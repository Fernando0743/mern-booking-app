import { useQuery } from "@tanstack/react-query";
import { useSearchContext } from "../contexts/SearchContext"
import * as apiClient from "../api-client"
import { useState, type ChangeEvent } from "react";
import SearchResultsCard from "../components/SearchResultCard";
import Pagination from "../components/Pagination";
import StarRatingFilter from "../components/StarRatingFIlter";
import HotelTypesFilter from "../components/HotelTypesFilter";
import FacilitiesFilter from "../components/FacilitiesFilter";
import PriceFilter from "../components/PriceFilter";


const Search = () => {
    const search = useSearchContext();
    const [page, setPage] = useState<number>(1);
    const [selectedStars, setSelectedStars] = useState<string[]> ([]);
    const [selectedHotelTypes, setSelectedHotelTypes] = useState<string[]> ([]);
    const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
    const [selectedPrice, setSelectedPrice] = useState<number | undefined>();
    const [sortOption, setSortOption] = useState<string>("");

    const searchParams = {
        destination: search.destination,
        checkIn: search.checkIn.toISOString(),
        checkOut: search.checkOut.toISOString(),
        adultCount: search.adultCount.toString(),
        childCount: search.childCount.toString(),
        page: page.toString(),
        stars: selectedStars,
        types: selectedHotelTypes,
        facilities: selectedFacilities,
        maxPrice: selectedPrice?.toString(),
        sortOption
    };

    const { data: hotelData} = useQuery({
        queryKey: ["searchHotels", searchParams],
        queryFn: () => apiClient.searchHotels(searchParams)
    })

    const handleStarsChange = (event: ChangeEvent<HTMLInputElement>) => {
        //Star value
        const starRating = event.target.value;

        //Check if the user checked or unchecked the checkbox from the event.
        //If they did we copy the previous stars already stored in the state and add the new star just checked at the end of array
        //If they unchecked it it is going to take the current stars and filter out the unchecked stars
        setSelectedStars((prevStars) =>
            event.target.checked
            ? [...prevStars, starRating]
            : prevStars.filter((star) => star !== starRating)
        )
    };

    const handleHotelTypeChange = (event: ChangeEvent<HTMLInputElement>) => {
        //Hotel Type value
        const hotelType = event.target.value;

        //Check if the user checked or unchecked the checkbox from the event.
        //If they did we copy the previous types already stored in the state and add the new type just checked at the end of array
        //If they unchecked it it is going to take the current types and filter out the unchecked types
        setSelectedHotelTypes((prevHotelTypes) =>
            event.target.checked
            ? [...prevHotelTypes, hotelType]
            : prevHotelTypes.filter((type) => type !== hotelType)
        )
    };

    const handleFacilityChange = (event: ChangeEvent<HTMLInputElement>) => {
        //Hotel Type value
        const facility = event.target.value;

        //Check if the user checked or unchecked the checkbox from the event.
        //If they did we copy the previous facilities already stored in the state and add the new facility just checked at the end of array
        //If they unchecked it it is going to take the current facilities and filter out the unchecked facilities
        setSelectedFacilities((prevFacilities) =>
            event.target.checked
            ? [...prevFacilities, facility]
            : prevFacilities.filter((prevFacility) => prevFacility !== facility)
        )
    };



    return (
        <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5">
            {/*Filters Column. Sticky will sticks the div to the window as we scroll down*/}
            <div className="rounded-lg border border-slate-300 p-5 h-fit sticky top-10">
                {/*Div that spaces out all the stuff in our filters column*/ }
                <div className="space-y-5">
                    <h3 className="text-lg font-semibold border-b border-slate-300 pb-5">
                        Filter by: 
                    </h3>
                    <StarRatingFilter 
                    selectedStars={selectedStars} 
                    onChange={handleStarsChange} 
                    />
                    <HotelTypesFilter
                    selectedHotelTypes={selectedHotelTypes}
                    onChange={handleHotelTypeChange}
                    />
                    <FacilitiesFilter 
                    selectedFacilities={selectedFacilities}
                    onChange={handleFacilityChange}
                    />
                    <PriceFilter 
                    selectedPrice={selectedPrice}
                    onChange={(value? : number) => setSelectedPrice(value)}
                    />
                </div>
            </div>

            <div className="flex flex-col gap-5">
                {/*Sort dropdown and number of hotel founds label */}
                <div className="flex justify-between items-center">
                    <span className="text-xl font-bold">
                        {hotelData?.pagination.total} Hotels found
                        {search.destination ? ` in ${search.destination}` : ""}
                    </span>
                    <select 
                    value={sortOption} 
                    onChange={(event) => setSortOption(event.target.value)} 
                    className="p-2 border rounded-md"
                    >
                        <option value="">Sort By</option>
                        <option value="starRating">Star Rating</option>
                        <option value="pricePerNightAsc">Price Per Night (low to high)</option>
                        <option value="pricePerNightDesc">Price Per Night (high to low)</option>
                    </select>
                </div>
                {hotelData?.data.map((hotel) =>(
                    <SearchResultsCard hotel={hotel} />
                ))}
                <div>
                    {/*Pagination*/}
                    <Pagination
                    page={hotelData?.pagination.page || 1} 
                    pages={hotelData?.pagination.pages || 1} 
                    onPageChange={(page) => setPage(page)} />
                </div>
            </div>

        </div>
    )


    
}

export default Search;