import jwt from 'jsonwebtoken'
import UserModel from '../models/User.js';

const verifyUser = async (req , res , next) =>{
try {
    const authHeader = req.headers.authorization; 
    if (!authHeader) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    const token = authHeader.split(' ')[1]; 
    if (!token) {
      return res.status(401).json({ msg: "Unauthorized" });
    }
    const decoded = jwt.verify(token , process.env.JWT_KEY);


    if(!decoded){
        return res.status(401).json({msg:"invalid token"})
    }

    const user = await UserModel.findOne({_id:decoded.id}).select('-pasword')

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
 

    req.user = user ;

    next();
} catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ msg: "Unauthorized" });
}
}


export default verifyUser ;