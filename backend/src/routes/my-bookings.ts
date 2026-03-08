import express, { type Request, type Response } from 'express';
import verifyToken from '../middleware/auth.js';
import Hotel from '../models/hotel.js';
import type { HotelType } from '../shared/types.js';

const router = express.Router();


//api/my-bookings
router.get("/", verifyToken, async(req: Request, res: Response) => {
    try{
        //This line despite finding a booking for an hotel with current userId, will return all the bookings for that hotel
        const hotels = await Hotel.find({
            bookings: {
                $elemMatch : { userId: req.userId}
            }
        });

        //Only return bookings for current user
        const results = hotels.map((hotel) => {
            const userBookings = hotel.bookings.filter(
                (booking) => booking.userId.toString() === req.userId
            );

            //Updated hotel array with bookings from current user (User could have multiple bookings for same hotel)
            const hotelWithUserBookings: HotelType = {
                ...hotel.toObject(),
                bookings: userBookings,
            }

            return hotelWithUserBookings;
        });

        res.json(results);



    }catch(error){
        console.log(error)
        res.status(500).json({message: "Unable to fetch bookings"})
    }
})


export default router;
