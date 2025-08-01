const express = require('express')
const { registerController, loginController, addPersonalDetails, getUserProfile, logoutController } = require('../controllers/userController')
const authMiddleware = require('../middlewares/AuthMiddleware')


const router = express.Router()


router.post('/register',registerController)
router.post('/login',loginController)
router.post('/personalDetails',authMiddleware, addPersonalDetails)
router.get('/profile', authMiddleware,getUserProfile)
router.post('/logout',logoutController)

module.exports= router