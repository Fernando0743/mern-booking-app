import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom"
import * as apiClient from "../api-client"
import ManageHotelForm from "../forms/ManageHotelForm/ManageHotelForm";
import { useAppContext } from "../contexts/AppContext";

const EditHotel = () => {
    //Get hotel id
    const { hotelId } = useParams();

    const { showToast } = useAppContext();

    const { data: hotelData } = useQuery({
        queryKey : ["fetchMyHotelById"],
        queryFn: () => apiClient.fetchMyHotelById(hotelId || ""),
        //Only run query when hotelid has a value
        enabled: !!hotelId
    });

    const { mutate, isPending } = useMutation({
        mutationFn : apiClient.updateMyHotelById,
        onSuccess: () => {
            showToast({message : "Hotel Updated Successfully" , "type" : "SUCCESS"});
        },
        onError: () => {
            showToast({message : "Error Updating hotel" , "type" : "ERROR"});
        }
    });

    const handleSave = ( hotelFormData: FormData) => {
        mutate(hotelFormData);
    };

    return <ManageHotelForm hotel={hotelData} onSave={handleSave} isPending={isPending}/>

}

export default EditHotel;