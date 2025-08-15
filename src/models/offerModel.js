const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title name is requird"],
      
    },


    validity: {
      type: Date,
      required: [true, "mandatory"],
      // min: [1, "offer validity must be at least one month"],
    },

     status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
      required: [true, "mandotory field"],
    },
   
    code: {
      type: String,
      required: [true, "code is requird"],
      unique:[true,"it should be unique"]
    
    },
    discount: {
      type: Number,
      required: [true, "discount is requird"],
      
    },
  },
  {
    timestamps: true,
  }
);

const offerModel = mongoose.model("offer", offerSchema);

module.exports = offerModel;
