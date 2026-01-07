import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from 'jsonwebtoken'

//Add userId property to request type for Express namespace
declare global {
    namespace Express {
        interface Request {
            userId: string;
        }
    }
}

// /api/auth/validate-token
const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    //Get token from cookies request
    const token = req.cookies["auth_token"];

    //Token does not exist
    if(!token){
        return res.status(401).json({message : "Unauthorized"});
    }

    try{
        //Decode token with secret key to verify that the token was created by us
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string)
        
        //Store userid
        req.userId = (decoded as JwtPayload).userId;

        next();

    }catch(error)
    {
        return res.status(401).json({message : "Unauthorized"});
    }

};

export default verifyToken;