import { createContext, useContext, useState, type ReactNode } from "react";

type SearchContext = {
    destination: string,
    checkIn: Date;
    checkOut: Date;
    adultCount: number;
    childCount: number;
    //For when user clicks on a specific hotel after searching
    hotelId: string;
    //Function when user click search button
    saveSearchValues:(
        destination: string, 
        checkIn: Date, 
        checkOut: Date, 
        adultCount: number, 
        childCount: number
    ) => void;
};

//Create context with default value of undefined
const SearchContext = createContext<SearchContext | undefined>(undefined);

type SearchContextProviderProps = {
    children: ReactNode
}


//We can thinks of SearchContextProvider as a react component where we can store states, use hooks, etc
export const SearchContextProvider = ({children} : SearchContextProviderProps) => {
    const [destination, setDestination] = useState<string>("");
    const [checkIn, setCheckIn] = useState<Date>(new Date());
    const [checkOut, setCheckOut] = useState<Date>(new Date());
    const [adultCount, setAdultCount] = useState<number>(1);
    const [childCount, setChildCount] = useState<number>(0);
    const [hotelId, setHotelId] = useState<string>("");

    //Function that executes when user click Search Button
    const saveSearchValues = (
        destination: string, 
        checkIn: Date, 
        checkOut: Date, 
        adultCount: number, 
        childCount: number,
        hotelId?: string
    ) => {
        //Update values received
        setDestination(destination);
        setCheckIn(checkIn);
        setCheckOut(checkOut);
        setAdultCount(adultCount);
        setChildCount(childCount);
        
        if(hotelId){
            setHotelId(hotelId);
        }
    };

    return(
        <SearchContext.Provider value= {{
            destination,
            checkIn,
            checkOut,
            adultCount,
            childCount,
            hotelId,
            saveSearchValues,
        }}>
            {children}
        </SearchContext.Provider>
    );
};

export const useSearchContext = () => {
    const context = useContext(SearchContext);

    return context as SearchContext;

}
