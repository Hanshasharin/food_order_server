const express = require('express');
const { createHotelController, hotelListController, createFoodItemsController, listFoodItemsInHotelController, createOfferController, deleteFoodController, getFoodsWithActiveOffers } = require('../controllers/hotelOwnerController');
const authMiddleware = require('../middlewares/AuthMiddleware');
const { hotelOwnerOnlyMiddleware } = require('../middlewares/roleMiddleware');
const parser = require('../config/upload');



const router = express.Router()

router.post("/create", authMiddleware,parser.single('hotel_image'),hotelOwnerOnlyMiddleware, createHotelController);

router.get("/my-hotels", authMiddleware,hotelOwnerOnlyMiddleware, hotelListController);

router.post("/foodItem", authMiddleware,parser.single('image'),hotelOwnerOnlyMiddleware, createFoodItemsController);

router.get("/food-list/:hotelId", authMiddleware, listFoodItemsInHotelController);

router.post("/offer", authMiddleware,hotelOwnerOnlyMiddleware, createOfferController);

router.delete("/delete/:foodID",authMiddleware,hotelOwnerOnlyMiddleware, deleteFoodController);

router.get("/active-offers", getFoodsWithActiveOffers);

module.exports= router