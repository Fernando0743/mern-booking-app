import { useQuery } from "@tanstack/react-query"
import * as apiClient from "../api-client"
import BookingForm from "../forms/BookingForm/BookingForm";
import { useSearchContext } from "../contexts/SearchContext";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import BookingDetailsSummary from "../components/BookingDetailsSummary";


const Booking = () => {

    const search = useSearchContext();
    const { hotelId } = useParams();

    const [numberOfNights, setNumberOfNights] = useState<number>(0);

    useEffect(() => {
        if(search.checkIn && search.checkOut){
            const nights = 
                Math.abs(search.checkOut.getTime() - search.checkIn.getTime()) / 
                (1000 * 60 *60 * 24)
            setNumberOfNights(Math.ceil(nights))
        }
    }, [search.checkIn, search.checkOut]) //Run this use effect when component initialized and everytime checkin and checkut dates changes

    const { data : hotel} = useQuery({
        queryKey: ["fetchHotelById"],
        queryFn: () => apiClient.fetchHotelById(hotelId as string),
        //Run only if we have an hotelId variable
        enabled: !!hotelId
    });

    const { data: currentUser} = useQuery({
        queryKey: ["fetchCurrentUser"],
        queryFn: apiClient.fetchCurrentUser
    });

    if(!hotel){
        return <></>
    }


    return(
        <div className="grid md:grid-cols-[1_fr_2fr]">
            <BookingDetailsSummary 
                checkIn={search.checkIn} 
                checkOut={search.checkOut} 
                adultCount={search.adultCount} 
                childCount={search.childCount}
                numberOfNights={numberOfNights}
                hotel={hotel}
            />
            {currentUser && <BookingForm currentUser={currentUser} />}
        </div>
    )


}

export default Booking;


