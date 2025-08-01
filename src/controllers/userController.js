const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const personalDetailModel = require("../models/personalDetailModel");
var jwt = require("jsonwebtoken");
const saltRounds = Number(process.env.SALTROUNDS);
const secret_key = process.env.JWT_SECRET;

const getValidationErrorMessage = (err) => {
  const keys = Object.keys(err.errors);
  const messages = Object.values(err.errors);

  const messageObject = {};
  for (let i = 0; i < keys.length; i++) {
    messageObject[keys[i]] = messages[i].message;
  }
  return messageObject;
};

const registerController = async (req, res) => {
  try {
    const { email, password, profile_pic, phone } = req.body;

    console.log(req.body);
    const user = await userModel.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "user already existed" });
    }

    bcrypt.hash(password, saltRounds, async function (err, hash) {
      if (err) {
        console.error("Hashing error:", err);
        return res
          .status(500)
          .json({ message: "password hashing failed", error: err.message });
      }

      if (hash) {
        try {
          const newUser = await userModel.create({
            email,
            password: hash,
            profile_pic,
            phone,
          });
          res.json({ message: "successfully user created" });
        } catch (err) {
          if (err.name === "ValidationError") {
            const message = getValidationErrorMessage(err);
            return res.status(400).json({ message });
          }

          console.error("Mongoose create error:", err);
          return res
            .status(500)
            .json({
              message: "something went wrong with server",
              error: err.message,
            });
        }
      } else {
        res.status(400).json({ message: "password required" });
      }
    });
  } catch (err) {
    console.error("Outer catch error:", err);
    res
      .status(500)
      .json({
        message: "something went wrong with the server",
        error: err.message,
      });
  }
};

const loginController = async (req, res) => {
  try {
    if (!req.body.email || !req.body.password) {
      return res.status(400).json({ message: "email and password required" });
    }
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    console.log(user);

    if (user) {
      if (user.status === "inactive") {
        return res
          .status(401)
          .json({ message: "inactive user. pls contact admin" });
      }
      bcrypt.compare(password, user.password, function (err, result) {
        if (result) {
          var token = jwt.sign({ email }, secret_key);
          res
            .cookie("token", token, {
              maxAge: 30 * 24 * 60 * 60 * 1000,
              httpOnly: true,
              sameSite: "None",
              secure: true,
            })
            .json({ message: "login successfully" });
        } else {
          res.status(401).json({ message: "invalid credentials" });
        }
      });
    } else {
      res.status(401).json({ message: "invalid credentials" });
    }
  } catch (err) {
    res
      .status(500)
      .json({
        message: "something went wrong with server pllas try after sone time",
      });
  }
};

const addPersonalDetails = async (req, res) => {
  try {
    const { name, address, orders } = req.body;

    if (!name || !address) {
      return res.status(400).json({ message: "Name and address are required" });
    }

    //  Check if personal_detail is already set for this user
    if (req.user.personal_detail) {
      return res
        .status(400)
        .json({ message: "Personal details already submitted" });
    }

    //  Create new personalDetails
    const newDetail = await personalDetailModel.create({
      name,
      address,
      orders,
    });

    // Save reference in user
    req.user.personal_detail = newDetail._id;
    await req.user.save();

    res
      .status(201)
      .json({ message: "Personal details added", data: newDetail });
  } catch (error) {
    console.error("Error adding personal details:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await userModel.findById(userId).populate("personal_detail"); // populate personal detail if available

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

const logoutController = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });
  res.status(200).json({ message: "Logged out successfully" });
};

module.exports = {
  registerController,
  loginController,
  addPersonalDetails,
  getUserProfile,
  logoutController,
};
