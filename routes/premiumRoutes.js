const express = require('express');

const premiumController = require('../controllers/premiumController');

const router = express.Router();

router.get('/show-leaderboard', premiumController.getLeaderboard);

module.exports = router;