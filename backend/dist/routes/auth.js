import express, {} from "express";
import { check, validationResult } from "express-validator";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import verifyToken from "../middleware/auth.js";
//Login is part of auth ts and not user ts becaues we are not interacting directily with user entity like we did on register functionality
const router = express.Router();
//Post as we're creating access token and a http cookie
//api/auth/login
router.post("/login", [
    check("email", "Email is required").isEmail(),
    check("password", "Password with 6 or more characters is required").isLength({
        min: 6,
    }),
], async (req, res) => {
    //Get errors from request validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        //Return bad request code
        return res.status(400).json({ message: errors.array() });
    }
    //Destructure email and password from request body
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        //User not found
        if (!user) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }
        //Hash password from request body and compare it to hashed password from user db
        const isMatch = await bcrypt.compare(password, user.password);
        //Passwords does not match
        if (!isMatch) {
            return res.status(400).json({ message: "Passwords does not match" });
        }
        //Create token
        const token = jwt.sign({
            userId: user._id
        }, process.env.JWT_SECRET_KEY, {
            expiresIn: "1d"
        });
        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 86400000,
        });
        res.status(200).json({ userId: user._id });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong!" });
    }
});
//Get as we're getting information
//api/auth/validate-token
router.get("/validate-token", verifyToken, (req, res) => {
    //Token was validated successfully
    res.status(200).send({ userId: req.userId });
});
//api/auth/logout
router.post("/logout", (req, res) => {
    //Replace token with new token that expires at the time of creation so we make it unvalid
    res.cookie("auth_token", "", {
        expires: new Date(0),
    });
    res.send();
});
export default router;
//# sourceMappingURL=auth.js.map