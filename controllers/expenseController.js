const Expense = require("../models/expense");

exports.postAddExpense = async (req, res, next) => {
    try {
        await req.user.createExpense({
            amount: req.body.amount,
            description: req.body.description,
            category: req.body.category
        });
        res.status(201).json({ success: true, message: 'Expense added successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Database operation failed. Please try again.' })
    }
}

exports.getExpenses = async (req, res, next) => {
    try {
        const expenses = await req.user.getExpenses();
        res.status(200).json({ success: true, expenses: expenses, user: req.user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Database operation failed. Please try again.' });
    }
}

exports.deleteExpense = async (req, res, next) => {
    try {
        const expenses = await req.user.getExpenses({ where: { id: req.params.expenseId } });
        const expenseToBeDeleted = expenses[0];
        await req.user.removeExpense(expenseToBeDeleted);
        await Expense.destroy({ where: { id: req.params.expenseId } });
        res.status(200).json({ success: true, message: 'Expense deleted successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Database operation failed. Please try again.' })
    }
}