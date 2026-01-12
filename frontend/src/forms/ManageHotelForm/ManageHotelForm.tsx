import { FormProvider, useForm } from "react-hook-form";
import DetailsSection from "./DetailsSection";
import TypeSection from "./TypeSection";
import FacilitiesSection from "./FacilitiesSection";
import GuestsSection from "./GuestsSection";
import ImagesSection from "./ImagesSection";


export type HotelFormData = {
    name: string;
    city: string;
    country: string;
    description: string;
    type: string;
    pricePerNight: number;
    starRating: number;
    facilities: string[];
    imageFiles: FileList;
    adultCount: number;
    childCount: number;
}

type Props = {
    onSave: (hotelFormData: FormData) => void //Arrow function that returns void
    isPending: boolean
}

const ManageHotelForm = ( { onSave, isPending }: Props) => {
    //We do not destructure useForm Methods as this component is made of other components
    const formMethods = useForm<HotelFormData>();

    const { handleSubmit } = formMethods;

    const onSubmit = handleSubmit ((formDataJson: HotelFormData) => {
        const formData = new FormData();
        formData.append("name", formDataJson.name);
        formData.append("city", formDataJson.city);
        formData.append("country", formDataJson.country);
        formData.append("description", formDataJson.description);
        formData.append("type", formDataJson.type);
        formData.append("pricePerNight", formDataJson.pricePerNight.toString());
        formData.append("starRating", formDataJson.starRating.toString());
        formData.append("adultCount", formDataJson.adultCount.toString());
        formData.append("childCount", formDataJson.childCount.toString());

        //Facilities array
        formDataJson.facilities.forEach((facility, index) => {
            formData.append(`facilities[${index}]`, facility)
        })


        //Convert imageFiles of type FileList to array and attach it to form data
        Array.from(formDataJson.imageFiles).forEach((imageFile) => {
            formData.append(`imageFiles`, imageFile);

        })
    
        onSave(formData);
    })

    return (
    //Form Provider is used to provide all useForm hook methods to all children elements inside the tag
    <FormProvider {...formMethods}>
        <form className="flex flex-col gap-10" onSubmit={onSubmit}>
            <DetailsSection/>
            <TypeSection/>
            <FacilitiesSection/>
            <GuestsSection/>
            <ImagesSection/>
            <span className="flex justify-end">
                <button 
                disabled={isPending}
                type="submit" 
                className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl disabled:bg-gray-500">
                    {isPending? "Saving..." : "Save"}
                </button>
            </span>
        </form>
    </FormProvider>
    );
};


export default ManageHotelForm;