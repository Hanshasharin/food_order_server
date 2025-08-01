const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "mandatory"],
    },
     food_item: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "food",
      required: [true, "mandatory"],
    }],
    hotel:{
     type: mongoose.Schema.Types.ObjectId,
      ref: "hotel",
      required: [true, "mandatory"],
    },
    purchased_date: {
      type: Date,
      required: [true, "mandatory"],
      default: Date.now,
    },
    offer:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"offer"
    },
status: {
      type: String,
      enum: ["pending", "success"],
      default: "pending"
    },
    total: {
      type: Number,
      required: [true, "mandatory"],
    }
   
  },
  {
    timestamps: true,
  }
);

const orderModel = mongoose.model("order", orderSchema);
module.exports = orderModel;
