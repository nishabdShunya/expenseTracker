const express = require('express');

const userControllers = require('../controllers/userControllers');

const router = express.Router();

router.post('/signup', userControllers.postAddUser);

router.post('/login', userControllers.postLoginUser);

module.exports = router;