import express, { type Request, type Response } from "express"
import Hotel from "../models/hotel.js";
import type { HotelSearchResponse } from "../shared/types.js";


const router = express.Router();

// /api/hotels/search?
router.get("/search", async(req: Request, res: Response) => {
    try {
        //Add pagination when searching hotels
        const pageSize = 5;
        //Check if we have a page parameter (user clicked on page number), default is page number 1
        const pageNumber = parseInt(
            req.query.page ? req.query.page.toString() : "1"
        );

        //Tell how many hotels found on db to skip depending on what page we are
        //Every page of our search contains 5 hotels, so if user clicks page 3 then
        // (3 - 1) * 5 = 10
        //So we're going to skip the first 10 items found on our search query
        const skip = (pageNumber - 1 ) * pageSize;

        //Skip is to know how mani items we're skipping and limit is to know how many items we want after that (5 in this case)
        //This so that we don't get the rest of the itemsa after our skip.
        const hotels = await Hotel.find().skip(skip).limit(pageSize);

        //Get total number of documents so we know how many pages to display on frontend
        const total = await Hotel.countDocuments();

        const response: HotelSearchResponse = {
            data: hotels,
            pagination: {
                total,
                page: pageNumber,
                //total number of pages
                pages: Math.ceil(total / pageSize),
            },    
        };

        res.json(response);

    }catch (error){
        console.log("error", error);
        res.status(500).json({ message : "Something went wrong"});
    }
});

export default router;
