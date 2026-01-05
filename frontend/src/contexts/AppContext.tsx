import { createContext, useContext, useState, type ReactNode } from "react";
import Toast from "../components/Toast";
import { useQuery } from "@tanstack/react-query";
import * as apiClient from "../api-client"

type ToastMessage = {
    message: string,
    type: "SUCCESS" | "ERROR";
}

type AppContext = {
    showToast : (toastMessage: ToastMessage) => void;
    isLoggedIn: boolean;
}

//Create context with default value of undefined
const AppContext = createContext<AppContext | undefined>(undefined)

//We can thinks of AppContextProvider as a react component where we can store states, use hooks, etc
export const AppContextProvider = ({
    children
}: {
    children: ReactNode
}) => {
    //Toast State
    const [toast, setToast] = useState<ToastMessage | undefined>(undefined)

    //Call validate Token endpoint to verify if user is has a valid token
    const { isError } = useQuery({
        queryKey: ["validateToken"],
        queryFn: apiClient.validateToken,
        retry: false,
    });

    return (
        <AppContext.Provider value={{
            showToast: (toastMessage) => {
                setToast(toastMessage)
            },
            //If we have an error then user is not logged in or has invalid token, if we have no erros then user is logged in properly and has a valid token
            isLoggedIn: !isError
        }} >

            {toast && (
                <Toast 
                message={toast.message} 
                type={toast.type}
                //When timer runs out, we set toast variable to be undefined, so as it is same as false it is not going to be rendered
                onClose={() => setToast(undefined)}/>)}
            {children}
        </AppContext.Provider>
    );
};


export const useAppContext = () => {
    const context = useContext(AppContext);
    return context as AppContext;
};

