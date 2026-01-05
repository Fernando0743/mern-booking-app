import { useEffect } from "react";

type ToastProps = {
    message: string;
    type: "SUCCESS" | "ERROR";
    onClose: () => void;
}


const Toast = ({message, type, onClose}: ToastProps) => {
    //
    useEffect(() => {
        const timer = setTimeout(() => {
            //This code will get executed after 5 seconds
            onClose();
        }, 5000) // 5 seconds for timeout

        return () => {
            //Reset timer when component is closed
            clearTimeout(timer);
        };
    }, [onClose]); //[onClose] means this code will run when toast component is rendered or when onClose Changes

    const styles = type === "SUCCESS"
    //Success Styles
    ? "fixed top-4 right-4 z-50 p-4 rounded-md bg-green-600 text-white max-w-md"
    //Error styles
    : "fixed top-4 right-4 z-50 p-4 rounded-md bg-red-600 text-white max-w-md"
    

    return(
        <div className={styles}>
            <div className="flex justify-center items-center">
                <span className="text-lg font-semibold">{message}</span>
            </div>
        </div>
    );
};

export default Toast;