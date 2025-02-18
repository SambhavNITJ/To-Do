import jwt from 'jsonwebtoken';
import User from '../schema/user.model.js';
import ApiError from '../utils/error.js';

const verifyToken = async (req, res, next) => {
    // console.log("Verifying token");
    try {
        if (!req.cookies || !req.cookies.token) {
            console.log(req.cookies);
            console.log(req.cookies.token);
            console.log("You need to login first");
            
            throw new ApiError(401, 'You need to login first');
        }

        const token = req.cookies?.token;

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        } catch (err) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }

        if (!decoded || !decoded._id) {
            throw new ApiError(400, 'Invalid token payload');
        }

        const user = await User.findById(decoded._id);
        if (!user) {
            throw new ApiError(401, 'Authentication failed');
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Token Verification Error:", error);

        if (error instanceof ApiError) {
            return res.status(error.statusCode).json({ message: error.message });
        }

        return res.status(500).json({ message: 'Internal Server Error' });
    }
};


export { verifyToken };