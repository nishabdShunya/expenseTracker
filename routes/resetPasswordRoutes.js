const express = require('express');

const resetPasswordController = require('../controllers/resetPasswordController');

const router = express.Router();

router.post('/forgot-password', resetPasswordController.postForgotPassword);

router.get('/reset-password/:id', resetPasswordController.getResetPassword);

router.get('/update-password/:id', resetPasswordController.getUpdatePassword);

module.exports = router;