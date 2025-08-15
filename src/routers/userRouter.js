const express = require('express')
const { registerController, loginController, addPersonalDetails, getUserProfile, logoutController, personalDetailsController } = require('../controllers/userController')
const authMiddleware = require('../middlewares/AuthMiddleware')



const router = express.Router()


router.post('/register',registerController)
router.post('/login',loginController)
router.post('/personalDetails',authMiddleware, personalDetailsController)
router.get('/profile', authMiddleware,getUserProfile)
router.post('/logout',authMiddleware,logoutController)

module.exports= router