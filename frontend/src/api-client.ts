import type { RegisterFormData } from "./pages/Register";
import type { SignInFormData } from "./pages/SignIn";
import type { HotelSearchResponse, HotelType } from "../../backend/src/shared/types"


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export const register = async (formData: RegisterFormData) => {
    //Call backend register endpoint
    const response = await fetch(`${API_BASE_URL}/api/users/register`, {
        //Define request info
        method: 'POST',
        credentials: "include", //include and set http cookies on the browser
        headers: {
            //Tells our server that the body of the request is going to be in JSON format
            "Content-Type" : "application/json"
        },
        //Pass our form data as JSON format stringified
        body: JSON.stringify(formData)
    });

    const responseBody = await response.json();

    //Check if response is not okay (Remember that in our backend we send status code okay 200 if successful)
    if(!response.ok){
        throw new Error(responseBody.message)
    }
};

export const signIn = async (formData: SignInFormData) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        credentials: "include",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(formData)
    });

    const body = await response.json();

    if(!response.ok){
        throw new Error(body.message)
    }

    return body;

}

export const validateToken = async () => {
    const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
        //Send cookies along with request
        credentials: "include"
    })

    if (!response.ok){
        throw new Error("Token invalid");
    }

    return response.json();
};


export const signOut = async () => {
    const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
        credentials: "include",
        method: "POST"
    });

    if(!response.ok){
        throw new Error("Error during logout")
    }
}

export const addMyHotel = async (hotelFormData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
        method: "POST",
        credentials: "include",
        body: hotelFormData,
    });

    if(!response.ok){
        throw new Error("Failed to add hotel")
    }
    
    return response.json();
}

//We use HotelType from backend so frontend and backend can work on same type
export const fetchMyHotels = async (): Promise<HotelType[]> => {
    const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
        credentials: "include"
    });

    if(!response.ok){
        throw new Error("Error fetching hotels");
    }

    return response.json();
};

//Get single hotel information given hotelId
export const fetchMyHotelById = async (hotelId: string) : Promise<HotelType>  => {
    const response = await fetch(`${API_BASE_URL}/api/my-hotels/${hotelId}`,{
        credentials : "include"
    });

    if(!response.ok){
        throw new Error("Error fetching hotels");
    }

    return response.json();
    
}

export const updateMyHotelById = async (hotelFormData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/api/my-hotels/${hotelFormData.get("hotelId")}`, {
        method: "PUT",
        body: hotelFormData,
        credentials: "include"
    });

    if(!response.ok){
        throw new Error("Error fetching hotels");
    }

    return response.json();    
}

export type SearchParams = {
    destination?: string;
    checkIn?: string;
    checkOut?: string;
    adultCount?: string;
    childCount?: string;
    page?: string;
}

export const searchHotels = async(searchParams: SearchParams) :Promise<HotelSearchResponse> => {
    const queryParams = new URLSearchParams();
    queryParams.append("destination", searchParams.destination || "");
    queryParams.append("checkIn", searchParams.checkIn || "");
    queryParams.append("checkOut", searchParams.checkOut || "");
    queryParams.append("adultCount", searchParams.adultCount || "");
    queryParams.append("childCount", searchParams.childCount || "");
    queryParams.append("page", searchParams.page || "");

    const response = await fetch(`${API_BASE_URL}/api/hotels/search?${queryParams}`);

    if(!response.ok){
        throw new Error("Error fetching hotels");
    }

    return response.json();

}