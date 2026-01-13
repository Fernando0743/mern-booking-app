import express, {type Request, type Response} from 'express';
import cors from 'cors';
import "dotenv/config";
import mongoose from 'mongoose';
import userRoutes from './routes/users.js'
import authRoutes from './routes/auth.js'
import cookieParser from "cookie-parser"
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { v2 as cloudinary } from 'cloudinary';
import myHotelRoutes from './routes/my-hotels.js'

//Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
    api_key: process.env.CLOUDINARY_API_KEY as string,
    api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

//Use mongoose and env variable to connect to mongo atlas cluster
mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string);


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//Create new express app
const app = express();
//To use http only cookies
app.use(cookieParser());
//Convert the body of API request into JSON automatically
app.use(express.json());
app.use(express.urlencoded({extended: true}));
//Use cors to prevent requests from certain URLs
app.use(cors({ //Accept requests from frontend url only and that the url must include the cookie on the request. This is for securitu 
    origin: process.env.FRONTEND_URL,
    credentials: true,
})
);

//Use static assets (frontend app built into dist folder) and  serve front end files (javasipt, html and css)
//This means that we can only start the backend without deploying the frontend for our app
app.use(express.static(path.join(__dirname, "../../frontend/dist")));

//Authentification related routes
app.use("/api/auth", authRoutes);

//Users related Routes
app.use("/api/users", userRoutes);

//My hotels related routes
app.use("/api/my-hotels", myHotelRoutes);

//Pass any request that are not api endpoints to let react router handle the routing of the request for us
//This is  because some routes are behind conditional logic and won't be part of the static files declared on line 44 because
//they're generated at request time
app.get("*", (req: Request, res: Response) =>{
    res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'))
})

app.listen(7000, () => {
    console.log("Sever is running on localhost:7000");
});