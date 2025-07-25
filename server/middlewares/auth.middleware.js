import jwt from 'jsonwebtoken';
import {User} from '../models/User.js';

export const requireAuth = async (req,res,next) => {
    const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "")
    if(!token){
        console.log("No token provided");
        return res.status(401).json({message: "Unauthorized, No token provided"});
    }

    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password')
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        req.user = user
        next();
    } catch (error) {
        res.status(401).json({message: "Unauthorized, Invalid token"});
    }
}