import express, { type Request, type Response } from 'express'
import multer from 'multer'
import cloudinary from 'cloudinary'
import type { HotelType } from '../shared/types.js'
import Hotel from '../models/hotel.js';
import verifyToken from '../middleware/auth.js';
import { body } from "express-validator";


const router = express.Router();

//Config multer for image handling. This line stores images we get in memory
const storage = multer.memoryStorage();

//Initialize Multer
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024  //5 MB
    }
})

//imageFiles is the field from our form that will contain 6 images
//multer uses upload to create a new parameter called files in the request body
//api/my-hotels
router.post(
    "/", 
    verifyToken, [
        body("name").notEmpty().withMessage("Name is required"),
        body("city").notEmpty().withMessage("City is required"),
        body("country").notEmpty().withMessage("Country is required"),
        body("description").notEmpty().withMessage("Description is required"),
        body("type").notEmpty().withMessage("Hotel Type is required"),
        body("pricePerNight").notEmpty().isNumeric().withMessage("Price per night is required and must be a number"),
        body("facilities").notEmpty().isArray().withMessage("Facilities are required"),
],
 upload.array("imageFiles", 6), 
 async (req: Request, res: Response) => {
    try {
        //Get images and text data
        const imageFiles = req.files as Express.Multer.File[];
        const newHotel: HotelType = req.body;
        

        //Upload images to cloudinary (1 image at a time)
        const imageUrls = await uploadImages(imageFiles);

        //Add URLs to the new hotel
        newHotel.imageUrls = imageUrls;
        newHotel.lastUpdated = new Date();
        newHotel.userId = req.userId;

        //Save hotel to database. Create new document for mongoDb
        const hotel = new Hotel(newHotel);
        await hotel.save();

        //Status succesful
        res.status(201).send(hotel);

    } catch (e) {
        console.log("Error creating hotel: ", e);
        
        res.status(500).json({ message : "Something went wrong"})

    }
});


//Get all hotels created by a specific user
//api/my-hotels
router.get("/", verifyToken, async (req: Request, res: Response) => {
    try{
         //Get all hotels created by a specific user
        const hotels = await Hotel.find({userId : req.userId})
        res.json(hotels)
        
    }catch(error){
        res.status(500).json({ message: "Error fetching hotels" })
    }
})

//Get specific hotel information given the ID
//api/my-hotels/75495874
router.get("/:id", verifyToken, async(req: Request, res: Response) => {
    const id = req.params.id?.toString();
    try{
        //Find Hotel by ID and verfy that matches userID
        const hotel = await Hotel.findOne({
            _id : id,
            userId : req.userId
        }as any);

        res.json(hotel);

    }catch(error){
        res.status(500).json({message : "Error fetching hotel data"})
    }
});

//Update hotel document
router.put("/:hotelId", verifyToken, upload.array("imageFiles"), async(req: Request, res: Response) => {
    try{
        //Text data
        const updatedHotel: HotelType = req.body;
        updatedHotel.lastUpdated = new Date();

        //Quickly updated text fields (does not execute validators from schema)
        const hotel = await Hotel.findOneAndUpdate({
            _id : req.params.hotelId,
            userId: req.userId,
        } as any,
        updatedHotel,
        //new : true makes hotel variable to now have the latest information
        { new : true}
        );

        if(!hotel){
            return res.status(404).json({ message: "Hotel not found"});
        }

        //Upload new images (if user upload any)
        const files = req.files as Express.Multer.File[];

        const updatedImageUrls = await uploadImages(files);

        //Save new images and already existing images to hotel document
        hotel.imageUrls = [
            ...updatedImageUrls, 
            ...(updatedHotel.imageUrls || []),
        ];

        //Update whole document (Images, text, and execute valdiation from schema)
        await hotel.save();
        res.status(201).json(hotel);


    }catch(error){
        res.status(500).json({ message : "Something went wrong"});
    }
}) 


async function uploadImages(imageFiles: Express.Multer.File[]) {
    const uploadPromises = imageFiles.map(async (image) => {

        //Encode image as a base 64 string
        const b64 = Buffer.from(image.buffer).toString("base64");

        //Image Type
        let dataURI = "data:" + image.mimetype + ";base64," + b64;

        //Upload image
        const res = await cloudinary.v2.uploader.upload(dataURI);

        //Return url of the image
        return res.url;
    });

    //Wait for all images to be uploaded to cloudinary
    const imageUrls = await Promise.all(uploadPromises);
    return imageUrls;
}

export default router;

