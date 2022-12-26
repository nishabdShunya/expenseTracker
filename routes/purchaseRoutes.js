const express = require('express');

const authorizationMiddleware = require('../middlewares/authorization');

const purchaseController = require('../controllers/purchaseController');

const router = express.Router();

router.get('/premium-membership', authorizationMiddleware.authentication, purchaseController.getPremium);

router.post('/update-transaction-status', authorizationMiddleware.authentication, purchaseController.updateTransaction);

module.exports = router;