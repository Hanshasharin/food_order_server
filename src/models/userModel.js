const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
  
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "password required"],
      minlength: [8, "password should be atleast 8 characters"],
    },
    profile_pic: {
      type: String,
      trim: true,
            required: [true, "profile pic required" ],

    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "hotel_owner", "user"],
      default: "user",
    },
    phone: {
      type: String,
      required: [true, "phone num requird"],
      minlength: [10, "number should me atleast 10 characters"],
      maxlength: [15, "number should not exeed 15"],
    },
    personal_details: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "personalDetails",
    },
    status: {
        type: String,
        required: [true, "Status is required"],
        enum: ["active", "inactive"],
        default: "active"
    }

  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;
