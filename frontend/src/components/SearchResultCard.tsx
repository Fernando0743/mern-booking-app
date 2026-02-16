import { AiFillStar } from "react-icons/ai";
import type { HotelType } from "../../../backend/src/shared/types";
import { Link } from "react-router-dom";


type Props = {
    hotel: HotelType;
};


const SearchResultsCard = ({hotel} : Props) => {

    return(
        //One column default, for large screens image will take 2/5 of the screen and hotel detailes 3/5
        <div className="grid grid-cols-1 xl:grid-cols-[2fr_3fr] border border-slate-300 rounded-lg p-8 gap-8">
            {/*Image. Take full width defined on div above (2_fr or 2/5) and has a defined height of 300px */}
            <div className="w-full h-[300px]">
                {/*Take full dimensions defined above, full width and 300px for height. Use cover to scale image on center */}
                <img 
                src={hotel.imageUrls[0]} 
                className="w-full h-full object-cover object-center"
                />
            </div>

            {/*Hotel Info */}
            <div className="grid grid-rows-[1_fr_2fr_1fr]">
                <div>
                    {/*Star Section and Hotel Type*/}
                    <div className="flex items-center">
                        <span className="flex">
                            {/*Create number of stars depending on hotel star rating. */}
                            {Array.from({ length: hotel.starRating}).map(() => (
                                <AiFillStar className="fill-yellow-400"/>
                            ))}
                        </span>
                        <span className="ml-1 text-sm">
                            {hotel.type}       
                        </span>
                    </div>
                     <Link
                      to={`/detail/${hotel._id}`} 
                      className="text-2xl font-bold cursor-pointer">
                        {hotel.name}
                    </Link>
                </div>

                <div>
                    {/*Truncate text at line 4*/ }
                    <div className="line-clamp-4">
                        {hotel.description}
                    </div>
                </div>

                {/*Items-end push the children of the div to the bottomo of the container and no wrap prevents text from jumping onto another line */}                
                <div className="grid grid-cols-2 items-end whitespace-nowrap">
                    {/*Facilities Card */}
                    <div className="flex gap-1 items-center">
                        {hotel.facilities.slice(0,3).map((facility) =>(
                            <span className="bg-slate-300 p-2 rounded-lg font-bold text-xs whitespace-nowrap">
                                {facility}
                            </span>
                        ))}
                        <span className="text-sm">
                            {hotel.facilities.length > 3 && 
                                `+${hotel.facilities.length - 3} more`}
                        </span>
                    </div>

                    {/*Price and button to view more */}
                    <div className="flex flex-col items-end gap-1">
                        <span className="font-bold">${hotel.pricePerNight} per night</span>
                        <Link 
                        to={`/detail/${hotel._id}`} 
                        className="bg-blue-600 text-white h-full p-2 font-bold text-xl max-w-fit hover:bg-blue-500">
                            View More
                        </Link>
                    </div>
                </div>
               




            </div>
        </div>
    )
};

export default SearchResultsCard;