import { Link } from "react-router-dom"
import { useAppContext } from "../contexts/AppContext";
import SignOutButton from "./SignOutButton";


const Header = () => {
    const { isLoggedIn } = useAppContext();

    return (
        //Blue Background, 800 represents darkness, highet the number higher the darkness. Padding on y axis is 6
        <div className="bg-blue-800 py-6">
            {/*Add container to leave space at the left and right od the header using mx-a (MARGIN X AUTO)
            We use flexbox and justify between (and span) to add space between our elements, in this case text and links*/}
            <div className="container mx-auto flex justify-between">
                {/*Tracking puts space between the letters */}
                <span className="text-3xl text-white font-bold tracking-tight">
                    <Link to="/">MernHolidays.com</Link>
                </span>

                {/*space-x-2 adds spacing between all the child elements within the span tag with a value of 2 */}
                <span className="flex space-x-2">
                    {isLoggedIn ? (
                    <>
                        <Link 
                        className="flex items-center text-white px-3 font-bold hover:bg-blue-600" 
                        to="/my-bookings">
                            My Bookings
                        </Link>

                        <Link 
                        className="flex items-center text-white px-3 font-bold hover:bg-blue-600" 
                        to="/my-hotels">
                            My Hotels
                        </Link>
                        <SignOutButton/>
                    </>
                    ) : (
                        //Button algined to the center using flexbox, blue and bold text color, 
                        //padding on x axis of 3 and hover animation of gray color 
                        <Link to="/sign-in" className="flex bg-white items-center text-blue-600 px-3 font-bold hover:bg-gray-100">
                            Sign in
                        </Link>
                    )}
                </span>

            </div>
        </div>
    )
}

export default Header;