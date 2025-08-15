const express = require('express')
const authMiddleware = require('../middlewares/AuthMiddleware');
const {  updateRoleController, userListController, toggleUserStatus } = require('../controllers/adminController');
const { adminOnlyMiddleware } = require('../middlewares/roleMiddleware');

const router = express.Router()

// router.patch('/change-role/:userId', authMiddleware, adminOnlyMiddleware, updateRoleController);
router.put('/update-role',authMiddleware,adminOnlyMiddleware, updateRoleController)
router.get('/user-list', authMiddleware,adminOnlyMiddleware,userListController)

router.get('/update-status',authMiddleware, adminOnlyMiddleware,toggleUserStatus)



module.exports= router