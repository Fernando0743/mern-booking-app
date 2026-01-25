import { useFormContext } from "react-hook-form"
import type { HotelFormData } from "./ManageHotelForm"


const ImagesSection = () => {
    const { 
        register, 
        formState: {errors},
        watch,
        setValue,
    } = useFormContext<HotelFormData>();

    //Check if we have existing images (we do have if we are editing hotel)
    const existingImageUrls = watch("imageUrls")

    //Handlet to delete image
    const handleDelete = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, imageUrl: string) => {
        //Submit event is default when clicking a button on a form, preventdefault prevents that
        event.preventDefault();
        
        //Change imageUrls array with all imagesUrls except the one we clicked Delete button
        setValue("imageUrls", existingImageUrls.filter((url) => url !== imageUrl))

    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-3">Images</h2>

            <div className="border rounded p-4 flex flex-col gap-4">

                {existingImageUrls && (
                    <div className="grid grid-cols-6 gap-4"> 
                        {existingImageUrls.map((url) =>(
                            <div className="relative group">
                                <img src={url} className="min-h-full object-cover" />
                                <button
                                onClick={(event) => handleDelete(event, url)} 
                                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 text-white">
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                )}


                <input 
                type="file"
                multiple
                accept="image/*"
                className="w-full text-gray-700 font-normal"
                {...register("imageFiles", {
                    validate: (imageFiles) => {
                        //Image files represent user updated images and existing represent images that already exists
                        const totaLength = imageFiles.length + (existingImageUrls?.length || 0);

                        if(totaLength == 0) {
                            return "At least one image should be added"
                        }

                        if(totaLength > 6) {
                            return "Total number of images cannot be more than 6"
                        }

                        return true;
                    }
                })}>


                </input>
            </div>
            {errors.imageFiles && (
                <span className="text-red-500 text-sm font-bold">
                    {errors.imageFiles.message}
                </span>
            )}
        </div>
    );
};

export default ImagesSection;