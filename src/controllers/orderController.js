const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const orderModel = require("../models/orderModel");
const foodModel = require("../models/foodModel");
const hotelModel = require("../models/hotelModel");
const { getValidationErrorMessage } = require("../utils/validationUtils");

const orderFoodController = async (req, res) => {
  try {
    const { hotelID, items } = req.body;
    const user = req.user;

    if (!hotelID || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Hotel ID and food items are required" });
    }

    const hotel = await hotelModel.findById(hotelID);
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });

    let total = 0;
    const lineItems = [];

    for (const item of items) {
      const { foodItem, quantity, couponCode } = item;
      const food = await foodModel.findById(foodItem).populate("offer");
      if (!food) return res.status(404).json({ message: `Food not found: ${foodItem}` });

      let price = food.price;
      if (
        food.offer &&
        couponCode &&
        food.offer.code === couponCode &&
        food.offer.status === "active" &&
        new Date(food.offer.validity) >= new Date()
      ) {
        // if (food.offer.discountType === "percentage") {
        //   price = Math.round(price * (1 - food.offer.discount / 100));
        // } else {
        //   price = Math.max(price - food.offer.discount, 0);
        // }

         {
  // Always percentage discount
  price = Math.round(price * (1 - food.offer.discount / 100));
}
      }

     

      total += price * quantity;

      lineItems.push({
        price_data: {
          currency: "inr",
          product_data: { name: food.food_name },
          unit_amount: price * 100, // Stripe expects paise
        },
        quantity,
      });
    }

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `https://food-order-client-eftri1m6p-hansha-sharins-projects.vercel.app/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://food-order-client-eftri1m6p-hansha-sharins-projects.vercel.app/order-cancel`,
    });

    // Save pending order
    const order = await orderModel.create({
      user: user._id,
      hotel: hotelID,
      items: items.map((it) => ({ foodItem: it.foodItem, quantity: it.quantity })),
      total,
      status: "pending",
      stripeSessionId: session.id,
      stripePaymentIntentId: session.payment_intent || null, // Save payment_intent for refunds
    });
// if (user.personal_details) {
//   await personalDetailModel.findByIdAndUpdate(
//     user.personal_details,
//     { $push: { orders: order._id } },
//     { new: true }
//   );
// }
    return res.json({ url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};


const completeOrderController = async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ message: "Session ID is required" });

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session || session.payment_status !== "paid") {
      return res.status(400).json({ message: "Payment not completed yet" });
    }

    const order = await orderModel
      .findOne({ stripeSessionId: sessionId })
      .populate("user")
      .populate("hotel")
      .populate("items.foodItem");

    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = "success";
    order.stripePaymentIntentId = session.payment_intent; // ensure payment_intent saved
    await order.save();

    // const personalDetails = await personalDetailModel.findById(order.user.personal_details);
    // if (personalDetails && !personalDetails.orders.includes(order._id)) {
    //   personalDetails.orders.push(order._id);
    //   await personalDetails.save();
    // }

    res.json({ success: true, message: "Order finalized", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to finalize order" });
  }
};

const cancelOrderController = async (req, res) => {
  try {
    const { orderId } = req.params; // from URL
    const order = await orderModel.findById(orderId);

    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.status !== "pending") {
      return res.status(400).json({ message: "Cannot cancel completed order" });
    }

    await order.deleteOne(); // ✅ safer than remove()
    res.json({ success: true, message: "Order canceled successfully" });
  } catch (err) {
    console.error("Cancel order error:", err);
    res.status(500).json({ message: "Failed to cancel order" });
  }
};



const getMyOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ user: req.user._id })
    .populate("items.foodItem", "food_name price") // fetch name + price
      .populate("hotel", "name")                     // fetch hotel name
      .populate("offer", "title discount")  
      .sort({ createdAt: -1 })
      .lean();
    res.json({ orders });
  }catch (err) {
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
module.exports = { orderFoodController,completeOrderController,cancelOrderController ,getMyOrders};
