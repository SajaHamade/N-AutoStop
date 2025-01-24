import bcrypt from 'bcryptjs';
import { Router } from "express";
const router = Router();
import path from 'path';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import User from '../models/User.js';


const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, res, cb) => {
        cb(null, res.fieldname + "_" + Date.now() + path.extname(res.originalname));
    }
});

export const upload = multer({
    storage: storage
});


async function Signup (req,res){
    try {
        const { username, password, firstName, lastName, gender, phoneNumber, dateOfBirth, liscenceNumber, description } = req.body;

        
        if (!req.file) {
            return res.status(400).json({ msg: "Profile picture is required." });
        }

        const file = req.file.filename;

        const userExist = await User.findOne({ username });
        if (userExist) {
            console.log("username already exists");
            return res.status(400).json({ msg: "Username already exists. Please choose another username." });
        }

        const hashpassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            password: hashpassword,
            profilePicture: file,
            phoneNumber,
            licenseNumber: liscenceNumber,
            firstName,
            lastName,
            dateOfBirth,
            gender,
            description
        });

        await newUser.save(); 

        return res.status(200).json({ msg: "User saved successfully in the database." });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Error: " + error.message });
    }
};




export async function login (req,res) {
    try {
   
       
       const {username , password} = req.body ; 

       const userExist = await User.findOne({username})
   
       if(!userExist){
           console.log("Error Finding User . Check the validity of your Username or Password");
           return res.status(400).json({msg:"Error Finding User . Check the validity of your Username or Password"})
       }    
       
       const matchpassword = await bcrypt.compare(password, userExist.password)
       if (!matchpassword) {
           console.log("Error Finding User . Check the validity of your Username or Password")
           return res.status(400).json({msg:"Error Finding User . Check the validity of your Username or Password"})
       }
   
   
       const token = jwt.sign({id: userExist._id} , process.env.JWT_KEY , {
           expiresIn : '1h'
       })
   
       return res.status(200).json({msg:"success" , token , user:{_id:userExist._id , username :userExist.username } })
   
      
    } catch (error) {
       console.log(error)
       return res.status(500).json({msg :"error"+error})
    }
   }




   export async function GetUserDetails(req, res) {
    try {
      const { id } = req.body;
      if (!id) {
        return res.status(400).json({ msg: "User ID is required" });
      }
  
      // Fetch user details from the database
      const user = await User.findById(id).select("-password -tokens");
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }
  
      return res.status(200).json({ msg: "User fetched successfully", user });
    } catch (error) {
      console.error("Error fetching user details:", error.message);
      return res.status(500).json({ msg: "Internal server error" });
    }
  }
  



export default Signup ;
