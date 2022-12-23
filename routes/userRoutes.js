const express = require('express');

const userController = require('../controllers/userController');

const router = express.Router();

router.post('/signup', userController.postAddUser);

router.post('/login', userController.postLoginUser);

module.exports = router;