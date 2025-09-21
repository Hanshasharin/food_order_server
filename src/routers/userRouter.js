const express = require('express')
const { registerController, loginController, addPersonalDetails, getUserProfile, logoutController, personalDetailsController, getHotelController } = require('../controllers/userController')
const authMiddleware = require('../middlewares/AuthMiddleware')
const { orderFoodController, completeOrderController, cancelOrderController, getMyOrders } = require('../controllers/orderController')
const parser = require('../config/upload')



const router = express.Router()



router.post('/register',parser.single('profile_pic'), registerController)
// router.post(
//   '/register',
//   (req, res, next) => {
//     console.log("📥 Incoming request to /register");
//     parser.single('profile_pic')(req, res, function (err) {
//       if (err) {
//         console.error("🛑 Multer/Cloudinary Error:", JSON.stringify(err, null, 2));

//         // You can customize this based on error type
//         return res.status(400).json({
//           message: 'File upload failed',
//           error: err.message || 'Unknown error in file upload',
//         });
//       }
//       console.log("✅ File upload successful or no file uploaded");
//       next();
//     });
//   },
//   registerController
// );
router.post('/login',loginController)
router.post('/personalDetails',authMiddleware, personalDetailsController)
router.get('/profile', authMiddleware,getUserProfile)
router.post('/logout',authMiddleware,logoutController)
router.post('/order',authMiddleware,orderFoodController)
router.post('/complete',authMiddleware,completeOrderController)
router.post('/cancel/:orderId',authMiddleware,cancelOrderController)
router.get('/my-order',authMiddleware,getMyOrders)


router.get('/hotels',getHotelController)
module.exports= router