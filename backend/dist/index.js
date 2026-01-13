import express, {} from 'express';
import cors from 'cors';
import "dotenv/config";
import mongoose from 'mongoose';
import userRoutes from './routes/users.js';
import authRoutes from './routes/auth.js';
import cookieParser from "cookie-parser";
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { v2 as cloudinary } from 'cloudinary';
import myHotelRoutes from './routes/my-hotels.js';
//Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
//Use mongoose and env variable to connect to mongo atlas cluster
mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
//Create new express app
const app = express();
//To use http only cookies
app.use(cookieParser());
//Convert the body of API request into JSON automatically
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//Use cors to prevent requests from certain URLs
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));
//Use static assets (frontend app built into dist folder) and  serve front end files (javasipt, html and css)
//This means that we can only start the backend without deploying the frontend for our app
app.use(express.static(path.join(__dirname, "../../frontend/dist")));
//Authentification related routes
app.use("/api/auth", authRoutes);
//Users related Routes
app.use("/api/users", userRoutes);
//My hotels related routes
app.use("/api/my-hotels", myHotelRoutes);
app.listen(7000, () => {
    console.log("Sever is running on localhost:7000");
});
//# sourceMappingURL=index.js.map