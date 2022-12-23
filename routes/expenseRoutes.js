const express = require('express');

const expenseControllers = require('../controllers/expenseControllers');

const router = express.Router();

router.get('/', expenseControllers.getExpenses);

router.delete('/:expenseId', expenseControllers.deleteExpense);

router.post('/add-expense', expenseControllers.postAddExpense);

module.exports = router;