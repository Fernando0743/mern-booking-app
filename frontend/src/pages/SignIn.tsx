import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form"
import * as apiClient from '../api-client'
import { useAppContext } from "../contexts/AppContext";
import { Link, useLocation, useNavigate } from "react-router-dom";


export type SignInFormData = {
    email: string;
    password: string;

}

const SignIn = () => {

    const queryClient = useQueryClient();
    
    const { showToast } = useAppContext();
    
    const navigate = useNavigate();

    const location = useLocation();

    const {
        register,
        formState: {errors},
        handleSubmit
    } = useForm<SignInFormData>();
    
    const mutation = useMutation({
        mutationFn: apiClient.signIn,
        onSuccess: async () => {
            showToast({message: "Sign In Successful!", type: "SUCCESS"});

            //Once token is created, we verify it as a double check and to update web site if applies
            //await allows us to wait for the token to be verified before navigating to home pahe
            await queryClient.invalidateQueries({
                queryKey: ["validateToken"]
            });

            navigate(location.state?.from?.pathname || "/")
        },
        onError: (error: Error) => {
            showToast({message: error.message, type: "ERROR"});
        }
    });

    const onSubmit = handleSubmit((data) => {
        mutation.mutate(data)
    })

    return(
        //Spacing of 5 using gap and flexcol to arrange items in a column
        <form className="flex flex-col gap-5" onSubmit={onSubmit}>
            <h2 className="text-3xl font-bold">Sign In</h2>

             {/*Email*/}
            <label className="text-gray-700 text-sm font-bold flex-1">
                    Email
                    <input 
                    type="email"
                    className="border rounded w-full py-1 px-2 font-normal"
                    {...register("email", {required: "This field is required"})}
                    ></input>

                    {/*Display error if error occurs */}
                    {errors.email && (
                        <span className="text-red-500">{errors.email.message}</span>
                    )}
            </label>

            {/*Password*/}
            <label className="text-gray-700 text-sm font-bold flex-1">
                    Password
                    <input 
                    type="password"
                    className="border rounded w-full py-1 px-2 font-normal"
                    {...register("password", {
                        required: "This field is required",
                        minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters"
                        },
                        
                    })}
                    ></input>

                    {/*Display error if error occurs */}
                    {errors.password && (
                        <span className="text-red-500">{errors.password.message}</span>
                    )}
            </label>

             <span className="flex items-cemter justify-between">
                <span className="text-sm">
                    Not Registered? <Link className="underline" to="/register">Create an account here</Link>
                </span>

                <button 
                type="submit"
                className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl">
                    Login
                </button>
            </span>

        </form>
    );
};

export default SignIn;