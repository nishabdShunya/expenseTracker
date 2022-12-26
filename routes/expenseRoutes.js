const express = require('express');

const expenseController = require('../controllers/expenseController');

const authorizationMiddleware = require('../middlewares/authorization');

const router = express.Router();

router.get('/', authorizationMiddleware.authentication, expenseController.getExpenses);

router.delete('/:expenseId', authorizationMiddleware.authentication, expenseController.deleteExpense);

router.post('/add-expense', authorizationMiddleware.authentication, expenseController.postAddExpense);

module.exports = router;