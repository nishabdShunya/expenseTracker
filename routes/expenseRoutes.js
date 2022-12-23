const express = require('express');

const expenseController = require('../controllers/expenseController');

const authorizationMiddleware = require('../middlewares/authorization');

const router = express.Router();

router.get('/', authorizationMiddleware.getAndDeleteExpenseAuthentication, expenseController.getExpenses);

router.delete('/:expenseId', authorizationMiddleware.getAndDeleteExpenseAuthentication, expenseController.deleteExpense);

router.post('/add-expense', authorizationMiddleware.addExpenseAuthentication, expenseController.postAddExpense);

module.exports = router;