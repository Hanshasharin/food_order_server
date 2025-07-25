const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema(
  {
    hotel_name: {
      type: String,
      required: [true,  " hotel name is requird"],
      unique: true,
      trim: true,
    },
    hotel_image: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      required: [true, "mandatory"],
      maxlenght: [500, "should not exceed 500 character"],
    },
    timing: {
      type: String,
      required: [true, "mandatory"],
    },
    hotel_owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "mandatory"],
    },
    contact_details: {
      type: String,
      required: [true, "mandatory"],
      maxlenght: [500, "should not exceed 500 character"],
    },
    food: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "food",
        required: [true, "mandatory"],
      },
    ],

    
    
  },
  {
    timestamps: true,
  }
);

const hotelModel = mongoose.model("hotel", hotelSchema);
module.exports = hotelModel;
