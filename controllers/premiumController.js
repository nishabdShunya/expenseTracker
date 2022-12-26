const Expense = require('../models/expense');
const User = require('../models/user');

exports.getLeaderboard = async (req, res, next) => {
    try {
        const expenses = await Expense.findAll();
        const useridAndExpenses = {};
        for (let expense of expenses) {
            if (useridAndExpenses[expense.userId]) {
                useridAndExpenses[expense.userId] += expense.amount;
            } else {
                useridAndExpenses[expense.userId] = expense.amount;
            }
        }
        const users = await User.findAll();
        const usernameAndExpenses = [];
        for (let user of users) {
            usernameAndExpenses.push({ name: user.name, totalExpenses: useridAndExpenses[user.id] });
        }
        usernameAndExpenses.sort((a, b) => b.totalExpenses - a.totalExpenses);
        res.status(200).json({ success: true, leaderboard: usernameAndExpenses });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Database operation failed. Please try again.' });
    }
}