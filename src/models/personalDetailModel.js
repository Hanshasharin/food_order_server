const mongoose = require("mongoose");

const personalDetailSchema = new mongoose.Schema(
  {
     fullName:{
      type:String,
      required: [true, "name is required"],
    },
    
    
    address: {
      type: String,
      required: [true, "mandatory"],
      maxlength: [500, "should not exceed 500 character"],
    },
    alternateAddress: {
      type: String,
      maxlength: [500, "should not exceed 500 character"],
    },
    specialInstructions: {
      type: String,
      maxlength: [300, "Special instructions should not exceed 300 characters"],
      trim: true,
      default: '',
    },
      orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "order",
        // required: [true, "mandatory"],
      },
    ],

  },

  {
    timestamps: true,
  }
);

const personalDetailModel = mongoose.model(
  "personalDetails",
  personalDetailSchema
);
module.exports = personalDetailModel;

