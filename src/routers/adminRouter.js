const express = require('express')
const authMiddleware = require('../middlewares/AuthMiddleware');
const adminOnlyMiddleware = require('../middlewares/roleMiddleware');
const { changeUserRoleController } = require('../controllers/adminController');

const router = express.Router()

router.patch('/change-role/:userId', authMiddleware,adminOnlyMiddleware('admin'), changeUserRoleController);



module.exports= router