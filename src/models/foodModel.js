const mongoose = require("mongoose");
// in my project food model
const foodSchema = new mongoose.Schema(
  {
    food_name: {
      type: String,
      required: [true, "title name is requird"],
      trim: true,
    },

    food_description: {
      type: String,
      required: [true, "mandatory"],
      maxlenght: [500, "should not exceed 500 character"],
    },
    image: {
      type: String,
      trim: true,
      required:[true, "mandatory"],
    },

     Quantity: {
      type: Number,
      required: [true, "mandatory"],
      min: [1, "mandatory"],
    },
    price: {
      type: Number,
      required: [true, "mandatory"],
    },
     category: {
      type: String,
      required: [true, "mandatory"],
      enum: ["veg", "non-veg"],
    
    },
    offer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"offer",
        default:null
    }
  },
  {
    timestamps: true,
  }
);

const foodModel = mongoose.model("food",foodSchema);
module.exports = foodModel;
