const mongoose = require("mongoose");

const personalDetailSchema = new mongoose.Schema(
  {
    phone: {
          type: String,
          required: [true, "phone num requird"],
          minlength: [10, "number should me atleast 10 characters"],
          maxlength: [15, "number should not exeed 15"],
        },
    
    address: {
      type: String,
      required: [true, "mandatory"],
      maxlenght: [500, "should not exceed 500 character"],
    },
    
      orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "order",
        required: [true, "mandatory"],
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

