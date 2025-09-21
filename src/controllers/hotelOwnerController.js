const offerModel = require('../models/offerModel');
const hotelModel = require('../models/hotelModel');
const foodModel = require('../models/foodModel');
const { getValidationErrorMessage } = require("../utils/validationUtils");

const createHotelController = async (req, res) => {
    try {
        const data = req.body;
        data.hotel_owner = req.user._id;
          if (req.file) {
      data.hotel_image = req.file.path;  // <-- cloudinary URL here
    }
        const hotel = await hotelModel.create(data);
        await hotel.populate("hotel_owner");
        res.json({ message: "Hotel created successfully", hotel });
    } catch (err) {
        if (err.name === "ValidationError") {
            const message = getValidationErrorMessage(err);
            res.status(400).json({ message });
        } else {
            res.status(500).json({ message: "Something went wrong in the server. Please try after some time." });
        }
    }
};

const hotelListController = async (req, res) => {
    try {
        const user = req.user;
        const hotelList = await hotelModel.find({ hotel_owner: user._id });
        res.json({ message: "Hotel List fetched successfully", hotelList , user});
    } catch (err) {
         if (err.name === "ValidationError") {
            const message = getValidationErrorMessage(err);
            res.status(400).json({ message });
        } else {
            res.status(500).json({ message: "Something went wrong in the server. Please try after some time." });
        }
    
    }
};


const createFoodItemsController = async (req, res) => {
    try {
      
      const imageUrl = req.file?.path;
        const foodItem = await foodModel.create({
      ...req.body,
      image: imageUrl, // save uploaded image URL here
    });

        const hotel = await hotelModel.findById(req.body.hotelID);

        if (!hotel) return res.status(404).json({ message: "Hotel not found" });

        hotel.food.push(foodItem._id);
        await hotel.save();

        res.json({ message: "Food item created successfully", hotel, foodItem });
    } catch (err) {
        if (err.name === "ValidationError") {
            const message = getValidationErrorMessage(err);
            res.status(400).json({ message });
        } else if (err.name === "CastError") {
            res.status(500).json({ message: err.message });
        } else {
            res.status(500).json({ message: "Something went wrong in the server. Please try after some time." });
        }
    }
};
const listFoodItemsInHotelController = async (req, res) => {
  try {
    const { hotelId } = req.params;

    // const hotel = await hotelModel.findById(hotelId).populate("food");
const hotel = await hotelModel
  .findById(hotelId)
  .populate({
    path: "food",
    populate: {
      path: "offer",
      model: "offer",
    },
  });

    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    res.json({
      message: "Food items fetched successfully",
      foodItems: hotel.food,
    });
  } catch (err) {
  if (err.name === "ValidationError") {
            const message = getValidationErrorMessage(err);
            res.status(400).json({ message });
        } else {
            res.status(500).json({ message: "Something went wrong in the server. Please try after some time." });
        }
    
  }
};




const getFoodsWithActiveOffers = async (req, res) => {
  try {
    const foodWithActiveOffers = await foodModel
      .find()
      .populate({
        path: "offer",
        match: { status: "active", validity: { $gte: new Date() } }, // only active & valid offers
      });
// / Filter out foods with no active offer
    let activeFoods = foodWithActiveOffers.filter(food => food.offer);

    // Sort by offer creation date (latest first) and take only 3
    activeFoods = activeFoods
      .sort((a, b) => new Date(b.offer.createdAt) - new Date(a.offer.createdAt))
      .slice(0, 3);
    // Filter out foods with no active offer
    // const activeFoods = foodWithActiveOffers.filter(food => food.offer);

    res.json({
      message: "Active offers fetched successfully",
      foods: activeFoods,
      
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong while fetching offers" });
  }
};



const createOfferController = async (req, res) => {
    try {
      
        const offer = await offerModel.create(req.body);
        const food = await foodModel.findById(req.body.foodID);
        
// const food = await foodModel.find({ hotel: hotelId }).populate('offer');

        if (!food) return res.status(404).json({ message: "Food item not found" });

        food.offer = offer._id;
        await food.save();

        res.json({ message: "Offer created successfully", offer, food });
    } catch (err) {
        if (err.name === "ValidationError") {
            const message = getValidationErrorMessage(err);
            res.status(400).json({ message });
        } else if (err.name === "CastError") {
            res.status(500).json({ message: err.message });
        } else {
            res.status(500).json({ message: "Something went wrong in the server. Please try after some time." });
        }
    }
};

const deleteFoodController = async (req, res) => {
  try {
    const { foodID } = req.params;

    const foodItem = await foodModel.findById(foodID);
    if (!foodItem) {
      return res.status(404).json({ message: "Food item not found" });
    }

    // Find the hotel which contains this foodID in its food array
    const hotel = await hotelModel.findOne({ food: foodID });

    if (hotel) {
      hotel.food = hotel.food.filter(id => id.toString() !== foodID);
      await hotel.save();
    } else {
      console.warn("No hotel linked to this food found");
    }

    await foodModel.findByIdAndDelete(foodID);

    res.json({ message: "Food item deleted successfully and removed from hotel list" });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong while deleting the food item" });
  }
};


module.exports = {
    createHotelController,
    createFoodItemsController,
    createOfferController,
    hotelListController,
    listFoodItemsInHotelController,
    deleteFoodController,
    getFoodsWithActiveOffers
};
