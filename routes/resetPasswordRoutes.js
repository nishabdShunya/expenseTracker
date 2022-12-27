const express = require('express');

const resetPasswordController = require('../controllers/resetPasswordController');

const router = express.Router();

router.post('/forgot-password', resetPasswordController.postForgotPassword);

module.exports = router;