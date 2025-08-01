const mongoose = require("mongoose");

const personalDetailSchema = new mongoose.Schema(
  {
     name:{
      type:String,
      required: [true, "name is required"],
    },
    
    
    address: {
      type: String,
      required: [true, "mandatory"],
      maxlength: [500, "should not exceed 500 character"],
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

