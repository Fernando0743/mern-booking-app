import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom"
import * as apiClient from "../api-client"
import { AiFillStar } from "react-icons/ai";
import GuestInfoForm from "../forms/GuestInfoForm/GuestInfoForm";


const Detail = () => {
    const { hotelId} = useParams();

    const { data: hotel } = useQuery({
        queryKey: ["fetchHotelById"],
        queryFn: () => apiClient.fetchHotelById(hotelId as string),
        //If we haven't got an Hotel Id we don't run api
        enabled: !!hotelId
    })

    //Return an empty page is hotel is empty (error fetching or waiting to be fetched)
    if (!hotel){
        return <></>
    }

    return (
        <div className="space-y-6">
            {/*Star Rating */}
            <div>
                <span className="flex">
                    {Array.from({ length: hotel.starRating}).map(() =>
                        <AiFillStar className="fill-yellow-400"/>
                    )}
                </span>
                <h1 className="text-3xl font-bold">{hotel.name}</h1>
            </div>

            {/*Image Grid*/}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {hotel.imageUrls.map((image) => (
                    <div className="h-[300px]">
                        <img 
                        src={image} 
                        alt={hotel.name} 
                        className="rounded-md w-full h-full object-cover object-center" 
                        />
                    </div>
                ))}
            </div>

            {/*Hotel Facilities*/ }
            <div className="grid grid-cols-1 lg: grid-cols-4 gap-2">
                {hotel.facilities.map((facility) => (
                    <div className="border border-slate-300 rounded-sm-3 p-3">
                        {facility}
                    </div>
                ))}
            </div>

            {/*Hotel Description and Pay Button*/}
            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr]">
                <div className="whitespace-pre-line">{hotel.description}</div>
                <div className="h-fit">
                    <GuestInfoForm 
                    pricePerNight={hotel.pricePerNight} 
                    hotelId={hotel._id} 
                    />
                </div>
            </div>

        </div>
    )
};

export default Detail;