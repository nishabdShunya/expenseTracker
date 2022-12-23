const Expense = require("../models/expense");

exports.postAddExpense = async (req, res, next) => {
    const expenseAdded = await Expense.create({
        amount: req.body.amount,
        description: req.body.description,
        category: req.body.category
    });
    res.status(201).json({ success: true, message: 'Expense added successfully.', expenseAdded: expenseAdded });
}

exports.getExpenses = async (req, res, next) => {
    const expenses = await Expense.findAll();
    res.status(200).json({ success: true, expenses: expenses });
}

exports.deleteExpense = async (req, res, next) => {
    await Expense.destroy({ where: { id: req.params.expenseId } });
    res.status(200).json({ success: true, message: 'Expense deleted successfully.' });
}