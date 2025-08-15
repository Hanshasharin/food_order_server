// const OrderModel = require("../models/orderModel");
// const FoodModel = require("../models/foodModel");
// const HotelModel = require("../models/hotelModel");
// const OfferModel = require("../models/offerModel"); // optional

// const placeOrderController = async (req, res) => {
//   try {
//     const user = req.user; // authenticated user from middleware
//     const { hotelID, items, offerID } = req.body;

//     if (!hotelID || !Array.isArray(items) || items.length === 0) {
//       return res.status(400).json({ message: "Hotel ID and items are required." });
//     }

//     // Check hotel exists
//     const hotel = await HotelModel.findById(hotelID);
//     if (!hotel) return res.status(404).json({ message: "Hotel not found." });

//     let total = 0;
//     const orderItems = [];

//     // Validate food and calculate total
//     for (const item of items) {
//       const food = await FoodModel.findById(item.foodItem);
//       if (!food) return res.status(404).json({ message: `Food not found: ${item.foodItem}` });

//       const quantity = item.quantity || 1;
//       total += food.price * quantity;

//       orderItems.push({ foodItem: food._id, quantity });
//     }

//     // Optional: apply offer discount
//     let offer = null;
//     if (offerID) {
//       offer = await OfferModel.findById(offerID);
//       if (offer && offer.discount) {
//         total = total - (total * offer.discount) / 100;
//       }
//     }

//     // Create order
//     const order = new OrderModel({
//       user: user._id,
//       hotel: hotel._id,
//       items: orderItems,
//       offer: offer ? offer._id : undefined,
//       total,
//       status: "pending"
//     });

//     await order.save();

//     res.status(201).json({ message: "Order placed successfully", order });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error, please try again later." });
//   }
// };

// module.exports = placeOrderController;
