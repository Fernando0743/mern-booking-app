import express, { type Request, type Response } from "express"
import Hotel from "../models/hotel.js";
import type { BookingType, HotelSearchResponse } from "../shared/types.js";
import { param, validationResult } from "express-validator";
import Stripe from "stripe";
import verifyToken from "../middleware/auth.js";

const stripe = new Stripe(process.env.STRIPE_API_KEY as string)

const router = express.Router();


// /api/hotels/search?
router.get("/search", async(req: Request, res: Response) => {
    try {
        const query = constructSearchQuery(req.query);

        let sortOptions = {};
        switch (req.query.sortOption) {
        case "starRating":
            sortOptions = { starRating: - 1 };
            break;
        case "pricePerNightAsc":
            sortOptions = { pricePerNight: 1 };
            break;
        case "pricePerNightDesc":
            sortOptions = { pricePerNight: -1 };
            break;
        }

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
        const hotels = await Hotel.find(query)
          .sort(sortOptions)
          .skip(skip)
          .limit(pageSize);

        //Get total number of documents so we know how many pages to display on frontend
        const total = await Hotel.countDocuments(query);

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

router.get("/", async(req: Request, res: Response) => {
    try {
        const hotels = await Hotel.find().sort("-lastUpdated");
        res.json(hotels);
    }catch(error) {
      res.status(500).json({message: "Error fetching hotels"})

    }
})


//api/hotels/38349834
router.get("/:id", [
  param("id").notEmpty().withMessage("Hotel ID is required")], 
  async(req: Request, res: Response) => {

    //Check for any errors on request. In this case that we didn't receive hotel id
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).json({ errors: errors.array()});
    }

    const id = req.params.id?.toString();

    try{
      //Find hotel
      const hotel = await Hotel.findById(id);
      res.json(hotel);

    } catch(error) {
      console.log(error);
      res.status(500).json({message: "Error fetching hotel"})
    }

  }
);

//Route that creates payment intent when user begins booking process
router.post("/:hotelId/bookings/payment-intent", verifyToken, async (req: Request, res: Response) => {
    //Get data, totalcost, hotelId, userId
    const { numberOfNights } = req.body;
    const hotelId = req.params.hotelId;

    const hotel = await Hotel.findById(hotelId);

    if(!hotel) {
      return res.status(400).json({ message: "Hotel not found"})
    }

    const totalCost = hotel.pricePerNight * numberOfNights;

    const paymentIntent = await stripe.paymentIntents.create({
        amount: totalCost,
        currency: "usd",
        metadata: {
          hotelId: hotelId || "",
          userId: req.userId
        }
    });

    //Check if client secret now exists now that we created payment intent. 
    //Client secret is so that user can enter payment information
    if(!paymentIntent.client_secret) {
      return res.status(500).json( {message: "Error creating payment intent"});
    }

    const response = {
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret.toString(),
      totalCost,
    };

    res.send(response)

  }
);

//Route that creates booking
router.post("/:hotelId/bookings", verifyToken, async(req: Request, res: Response) => {
    try{
      //Get payment Intent
      const paymentIntentId = req.body.paymentIntentId;

      console.log(req.body);

      const paymentIntent = await stripe.paymentIntents.retrieve(
        paymentIntentId as string
      );

      if(!paymentIntent){
          return res.status(400).json({message: "Payment Intent not found"});
      }

      //Verify payment intent matches with userId and correct hotel
      if(paymentIntent.metadata.hotelId !== req.params.hotelId || paymentIntent.metadata.userId !== req.userId) {
        return res.status(400).json({ message: "Payment intent mismatch"});
      }
      
      //Verify if payment intent succeedeed
      if(paymentIntent.status !== "succeeded"){
          return res.status(400).json({message: `Payment intent not succeeded. Status: ${paymentIntent.status}`})
      };

      //If code reaches here the payment was successful so we create booking
      const newBooking: BookingType = {
          ...req.body,
          userId: req.userId,
      };

      const hotelId  = req.params.hotelId;
      if (!hotelId) {
          return res.status(400).json({ message: "Hotel ID is required" });
      }
      
      //Push new booking to booings array of hotel
      const hotel = await Hotel.findOneAndUpdate({_id: hotelId}, {
        $push: { bookings: newBooking},
      })

      if(!hotel) {
        return res.status(400).json({message: "Hotel not found"});
      }

      await hotel.save();

      res.status(200).send();

    } catch(error) {
      console.log(error);
      res.status(500).json({message: "Something went wrong"});
    }
})

//Query constructor based on URL parameters for MongoDB query
const constructSearchQuery = (queryParams: any) => {
  let constructedQuery: any = {};

  if (queryParams.destination) {
    constructedQuery.$or = [
      { city: new RegExp(queryParams.destination, "i") },
      { country: new RegExp(queryParams.destination, "i") },
    ];
  }

  if (queryParams.adultCount) {
    constructedQuery.adultCount = {
      $gte: parseInt(queryParams.adultCount),
    };
  }

  if (queryParams.childCount) {
    constructedQuery.childCount = {
      $gte: parseInt(queryParams.childCount),
    };
  }

  if (queryParams.facilities) {
    constructedQuery.facilities = {
      $all: Array.isArray(queryParams.facilities)
        ? queryParams.facilities
        : [queryParams.facilities],
    };
  }

  if (queryParams.types) {
    constructedQuery.type = {
      $in: Array.isArray(queryParams.types)
        ? queryParams.types
        : [queryParams.types],
    };
  }

  if (queryParams.stars) {
    const starRatings = Array.isArray(queryParams.stars)
    //If stars is an array we convert array of strings to numbers
      ? queryParams.stars.map((star: string) => parseInt(star))
      : parseInt(queryParams.stars);

    constructedQuery.starRating = { $in: starRatings };
  }

  if (queryParams.maxPrice) {
    constructedQuery.pricePerNight = {
      $lte: parseInt(queryParams.maxPrice).toString(),
    };
  }

  return constructedQuery;
};


export default router;
