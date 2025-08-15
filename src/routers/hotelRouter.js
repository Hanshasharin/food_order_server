const express = require('express');
const { createHotelController, hotelListController, createFoodItemsController, listFoodItemsInHotelController, createOfferController, deleteFoodController } = require('../controllers/hotelOwnerController');
const authMiddleware = require('../middlewares/AuthMiddleware');
const { hotelOwnerOnlyMiddleware } = require('../middlewares/roleMiddleware');



const router = express.Router()


router.post("/create", authMiddleware ,hotelOwnerOnlyMiddleware, createHotelController);

router.get("/my-hotels", authMiddleware,hotelOwnerOnlyMiddleware, hotelListController);

router.post("/foodItem", authMiddleware, createFoodItemsController);

router.get("/food-list/:hotelId", authMiddleware,hotelOwnerOnlyMiddleware, listFoodItemsInHotelController);

router.post("/offer", authMiddleware,hotelOwnerOnlyMiddleware, createOfferController);

router.delete("/delete/:foodID",authMiddleware,hotelOwnerOnlyMiddleware, deleteFoodController);


module.exports= router