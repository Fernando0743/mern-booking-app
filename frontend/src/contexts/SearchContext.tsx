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
    //Check for items in session storage as default value to persist the search data as long as user has tab opened 
    // (data will now persist if user refreshes tab)
    const [destination, setDestination] = useState<string>(
        () => sessionStorage.getItem("destination") || ""
    );
    const [checkIn, setCheckIn] = useState<Date>(
        () => new Date(sessionStorage.getItem("checkIn") || new Date().toISOString())
    );
    const [checkOut, setCheckOut] = useState<Date>(
        () => new Date(sessionStorage.getItem("checkOut") || new Date().toISOString())
    );
    const [adultCount, setAdultCount] = useState<number>(
        () => parseInt(sessionStorage.getItem("adultCount") || "1")
    );
    const [childCount, setChildCount] = useState<number>(        
        () => parseInt(sessionStorage.getItem("childCount") || "1")
    );
    const [hotelId, setHotelId] = useState<string>(
        () => sessionStorage.getItem("hotelId") || "" 
    );

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

        //Save data to session storae
        sessionStorage.setItem("destination", destination);
        sessionStorage.setItem("checkIn", checkIn.toISOString());
        sessionStorage.setItem("checkOut", checkOut.toISOString());
        sessionStorage.setItem("adultCount", adultCount.toString());
        sessionStorage.setItem("childCount", childCount.toString());

        if(hotelId){
            sessionStorage.setItem("hotelId", hotelId);
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
