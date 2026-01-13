import jwt, {} from 'jsonwebtoken';
// /api/auth/validate-token
const verifyToken = (req, res, next) => {
    //Get token from cookies request
    const token = req.cookies["auth_token"];
    //Token does not exist
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        //Decode token with secret key to verify that the token was created by us
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        //Store userid
        req.userId = decoded.userId;
        next();
    }
    catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
};
export default verifyToken;
//# sourceMappingURL=auth.js.map