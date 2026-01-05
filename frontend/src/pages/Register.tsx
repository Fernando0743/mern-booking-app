import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import * as apiClient from '../api-client'
import { useAppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";


//Type for our form data
export type RegisterFormData = {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    confirmPassword: string
}

const Register = () => {
    const queryClient = useQueryClient();

    const navigate = useNavigate();

    //Use custom context hook
    const { showToast  } = useAppContext();

    //React-hook-form
    //useMutation es un hook de React Query que se usa para operaciones que modifican datos en el servidor 
    // (como crear, actualizar o eliminar).
    //•	useQuery → Para LEER datos (GET requests)
    //•	useMutation → Para MODIFICAR datos (POST, PUT, DELETE)

    const { 
        register, //Registra inputs de forma automatica
        watch, // Observar valores de otros campos del forumulario
        handleSubmit,  //Manejar el submit automaticamente
        formState: {errors}, //Errores automaticos
    } = useForm<RegisterFormData>();



    //React Query (TanStack Query) is used to handle asynchronous server state management. 
    //React Query eliminates all this boilerplate while providing additional features like retry logic, caching, and better TypeScript support!
    //We use react query so we don't have to manage any state ourselves
    const mutation = useMutation({
        mutationFn: apiClient.register,
        onSuccess: async () => {
            //Display toast and navigate to home screen
            showToast({message: "Registration Sucessful!" , type: "SUCCESS"})

            //Once token is created, we verify it as a double check and to update web site if applies
            //await allows us to wait for the token to be verified before navigating to home pahe
            await queryClient.invalidateQueries({
                queryKey: ["validateToken"]
            });

            navigate("/")
        },
        onError: (error: Error) => {
            showToast({message: error.message , type: "ERROR"})
        }
    });

    //Onsubmit function is goint go get called when we submit the form and we pass the data using handlesubmit from useform hook
    const onSubmit = handleSubmit((data) => {
        mutation.mutate(data);
    });

    return (
        // Flex col to arrange individual elements in a column and gap to add spacing between them
        <form className="flex flex-col gap-5" onSubmit={onSubmit}>
            <h2 className="text-3xl font-bold">Create an account</h2>

            {/*First name and Last Name inputs, first we develop for mobile (small) screens and then make it responsive to bigger screens 
            defualt is flex column items arranged in column for small screens and for medium screens we use flex row 
            (items arranged in row form) */}
            <div className="flex flex-col md:flex-row gap-5">
                {/*Flex-1 is to take all space available*/}
                <label className="text-gray-700 text-sm font-bold flex-1">
                    First Name
                    <input 
                    className="border rounded w-full py-1 px-2 font-normal" 
                    {...register("firstName", {required: "This field is required"})}
                    ></input>

                    {/*Display error if error occurs */}
                    {errors.firstName && (
                        <span className="text-red-500">{errors.firstName.message}</span>
                    )}
                </label>

                <label className="text-gray-700 text-sm font-bold flex-1">
                    Last Name
                    <input 
                    className="border rounded w-full py-1 px-2 font-normal"
                    {...register("lastName", {required: "This field is required"})}
                    ></input>

                    {/*Display error if error occurs */}
                    {errors.lastName && (
                        <span className="text-red-500">{errors.lastName.message}</span>
                    )}
                </label>
            </div>

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

            {/*Confirm Password*/}
            <label className="text-gray-700 text-sm font-bold flex-1">
                    Confirm Password
                    <input 
                    type="password"
                    className="border rounded w-full py-1 px-2 font-normal"
                    {...register("confirmPassword", {
                        //Valide parameter allows us for custom validation (in this case check if value is filled ant then
                        // compare password and compare password)
                        validate: (val) => {
                            if(!val){
                                return "This field is required"
                            }
                            else if(watch("password") !== val){
                                return "Passwords do not match"
                            }
                        },
                    })}
                    ></input>

                    {/*Display error if error occurs */}
                    {errors.confirmPassword && (
                        <span className="text-red-500">{errors.confirmPassword.message}</span>
                    )}
            </label>

            <span>
                <button 
                type="submit"
                className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl">
                    Create Account
                </button>
            </span>



        </form>
    );
};

export default Register;