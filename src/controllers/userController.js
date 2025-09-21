const UserModel= require("../models/userModel")
const personalDetailModel = require('../models/personalDetailModel')
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const { getValidationErrorMessage } = require("../utils/validationUtils");
const hotelModel = require("../models/hotelModel");

const saltRounds = Number(process.env.SALT_ROUNDS)
const JWT_SECRET = process.env.JWT_SECRET


const registerController = async (req, res) => {
  try {
    const { email, password, phone } = req.body;
    const profile_pic = req.file?.path;
      //  console.log("Received data:", req.body);
    // console.log("Received file:", req.file);

    const user = await UserModel.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "User with this Email ID already exists" });
    } else {
      bcrypt.hash(password, saltRounds, async function(err, hash) {
        if (err) {
          console.error("Bcrypt error:", err); // <-- log bcrypt error clearly
          return res.status(500).json({ message: "Error hashing password" });
        }
        if (hash) {
          try {
            const newUser = await UserModel.create({
              email,
              password: hash,
              profile_pic,
              phone,
            });
            res.json({ message: "User registered successfully" });
          } catch (err) {
            console.error("Error object:", JSON.stringify(err, null, 2));  // ✅ readable full error object

            console.error("User creation error:", err); // <-- log creation error clearly
            if (err.name === "ValidationError") {
              const message = getValidationErrorMessage(err);
              res.status(400).json({ message: message });
            } else {
              res.status(500).json({ message: "Something went wrong in the server. Please try after some time." });
            }
          }
        } else {
          res.status(400).json({ message: "Password is required." });
        }
      });
    }
  } catch (err) {
    console.error("General register error:", err); // <-- log catch error clearly
    res.status(500).json({ message: "Something went wrong in the server. Please try after some time." });
  }
};


const loginController = async (req, res) => {
    try{
        const {email, password} = req.body

        if(!req.body.email || !req.body.password){
            return res.status(400).json({message: "Email ID and password is required"})
        }
        const user = await UserModel.findOne({email})
        if (user){
            if(user.status === "inactive"){
                return res.status(401).json({message: "Account is inactive. Please contact admin."})
            }
            bcrypt.compare(password, user.password, function(err, result) {
                if (result){
                    var token = jwt.sign({email}, JWT_SECRET)
                    res.cookie('token', token, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: "None", secure: true }).json({"message": "Login successfull",  user: {
    
        profile_pic: user.profile_pic,
            role: user.role, // <-- send role here

      
      }})
                }else{
                    res.status(401).json({"message": "Invalid credentials."})
                }
            });
        }else{
            res.status(401).json({"message": "Invalid credentials."})
        }
    }
    catch(err){
        res.status(500).json({"message": "Something went wrong in the server. Please try after some time."})
    }
}



const personalDetailsController = async (req, res) => {
  try {
    const data = req.body;
    console.log(data);

    const personalDetails = await personalDetailModel.create(data); // ← Error likely here
    const user = req.user;

    user.personal_details = personalDetails._id;
    await user.save(); // ← Important to persist the update

    res.json({ message: "Personal details created successfully", personalDetails });
  } catch (err) {
    if (err.name === "ValidationError") {
      const message = getValidationErrorMessage(err);
      res.status(400).json({ message: message });
    } else if (err.name === "CastError") {
      res.status(500).json({ message: err.message });
    } else {
      console.error("Server error:", err); // ← Add this to see what went wrong
      res.status(500).json({
        message: "Something went wrong in the server. Please try after some time.",
      });
    }
  }
};


const getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
const user = await UserModel.findById(userId)
  .populate({
    path: "personal_details",
    populate: {
      path: "orders",
       populate: [
            { path: "hotel", select: "name" }, // get hotel name
            { path: "items.foodItem", select: "food_name price" } // get food names and price
          ]
      
    }
  });

   // populate personal detail if available

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User profile fetched successfully",
      user,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
const getHotelController = async (req, res) => { 
    const hotels = await hotelModel.find(); 
    res.json(hotels);
};

const logoutController = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });
  res.status(200).json({ message: "Logged out successfully" });
};

module.exports = {registerController, loginController,personalDetailsController,logoutController,getUserProfile,getHotelController}

