import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as apiClient from "../api-client"
import { useAppContext } from "../contexts/AppContext";


const SignOutButton = () => {

    const queryClient = useQueryClient();

    const { showToast } = useAppContext();

    const mutation = useMutation({
        mutationFn: apiClient.signOut,
        onSuccess: async () => {
            //Marks validateToken (defined on app context) query as Stale (data outadted) and refetch it (execute it) again
            //This is done to update webpage as user is now logged out
            await queryClient.invalidateQueries({
                queryKey: ["validateToken"]
            });
            showToast({message: "Signed Out", type: "SUCCESS"});
        },
        onError: (error: Error) => {
            showToast({message: error.message, type: "ERROR"});
        }
    });

    const handleClick = () => {
        mutation.mutate();
    };

    return(
        <button onClick={handleClick} className="text-blue-600 px-3 font-bold bg-white hover:bg-gray-100">
            Sign Out
        </button>
    );
};

export default SignOutButton;