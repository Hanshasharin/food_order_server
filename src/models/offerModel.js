const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title name is requird"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "mandatory"],
      maxlenght: [500, "should not exceed 500 character"],
    },

    validity: {
      type: Number,
      required: [true, "mandatory"],
      min: [1, "offer validity must be at least one month"],
    },

    percentage: {
      type: Number,
      required: [true, "mandatory"],
    },

     status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
      required: [true, "mandotory field"],
    },
  },
  {
    timestamps: true,
  }
);

const offerModel = mongoose.model("offer", offerSchema);

module.exports = offerModel;
