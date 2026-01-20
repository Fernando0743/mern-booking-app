import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import * as apiClient from "../api-client"
import { BsBuilding, BsMap } from "react-icons/bs"
import { BiHotel, BiMoney, BiStar } from "react-icons/bi";



const MyHotels = () => {
    //Get MyHotels data from backend using our apiclient function
    const { data: hotelData, error, isError } = useQuery({
        queryKey : ["fetchMyHotels"],
        queryFn : apiClient.fetchMyHotels,

    })

    if(isError){
        
    }
    
    if(!hotelData){
        return <span>No Hotels Found</span>
    }

    return (
        <div className="space-y-5">
            {/* Span is to put thing in line (or row) */}
            <span className="flex justify-between">
                <h1 className="text-3xl font-bold">My Hotels</h1>
                <Link 
                to="/add-hotel"
                className="flex bg-blue-600 text-white text-xl font-bold p-2 hover:bg-blue-500"
                >
                Add Hotel
                </Link>
            </span>

            {/*Grid containing hotels */}
            <div className="grid grid-cols-1 gap-8">
                {hotelData.map((hotel) => (
                    <div className="flex flex-col justify-between border border-slate-300 rounded-lg p-8 gap-5">

                        {/*Hotel Information*/}
                        <h2 className="text-2xl font-bold">{hotel.name}</h2>

                        {/*Whitespace preline prevents the text from overflowing our card*/}
                        <div className="whitespace-pre-line">{hotel.description}</div>

                        {/*Hotel Features Grid*/}
                        <div className="grid grid-cols-5 gap-2">
                            <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                                <BsMap className="mr-1" />
                                {hotel.city}, {hotel.country}
                            </div>

                            <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                                <BsBuilding className="mr-1" />
                                {hotel.type}
                            </div>

                            <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                                <BiMoney className="mr-1" />
                                ${hotel.pricePerNight} per night
                            </div>

                            <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                                <BiHotel className="mr-1" />
                                {hotel.adultCount} adults, {hotel.childCount} children
                            </div>

                            <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                                <BiStar className="mr-1" />
                                {hotel.starRating} Stars
                            </div>
                        </div>

                        {/*View Details*/}
                        <span className="flex justify-end">
                            <Link 
                            to={`/edit-hotel/${hotel._id}`}
                            className="flex bg-blue-600 text-white text-xl font-bold p-2 hover:bg-blue-500"
                            >
                                View Details
                            </Link>
                        </span>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default MyHotels;

