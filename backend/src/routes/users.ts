import express, {type Request, type Response} from "express"
import User from "../models/user.js";
import jwt from "jsonwebtoken"
import { check, validationResult } from "express-validator";

const router = express.Router();

//Check function is middleware to check body of the request using express validator
// /api/users/register
router.post("/register",[
    check("firstName", "First Name is required").isString(),
    check("lastName", "Last Name is required").isString(),
    check("email", "Email is required").isEmail(),
    check("password", "Password with 6 or more characters is required").isLength({
        min : 6
    }),
], async (req: Request, res: Response) => {
    //Get errrors from request validator
    const errors = validationResult(req);

    if (!errors.isEmpty())
    {
        //Return bad request code
        return res.status(400).json({message : errors.array()})
    }

    try {
        //Check if user already exists if user is on register form
        let user = await User.findOne({
            email: req.body.email,
        });

        //User already exists so we send bad request status code
        if(user) {
            return res.status(400).json({message: "User already exists"});
        }
        
        //User does not exist so we create one and store it on db
        user = new User(req.body);
        //If we fo to user model user.ts we can see that before calling save function from mongoose to store the user on db, we encrypt the password
        await user.save();

        //Create tokens and store it as http cookies. Store user id on token
        const token = jwt.sign(
            {userId : user._id}, 
            process.env.JWT_SECRET_KEY as string, 
            {
                //1 Day expiracy
                expiresIn: "1d"
            }
           
        );

        res.cookie("auth_token" , token, {
            httpOnly: true,
            //Activate secure parameter depending if we are on production or developement environment as secure only accepts cookies over https so hackers can't get our cookies
            secure: process.env.NODE_ENV === "production",
            maxAge: 86400000,
        })

        return res.status(200).send({message: "User registered OK"})


    } 
    catch(error) 
    {
        console.log(error);
        res.status(500).send({message: "Something went wrong!"});
    }
});

export default router