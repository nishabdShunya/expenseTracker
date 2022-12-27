const Expense = require('../models/expense');
const User = require('../models/user');
const sequelize = require('../util/database');

exports.getLeaderboard = async (req, res, next) => {
    try {
        const leaderboard = await User.findAll({
            attributes: ['id', 'name', [sequelize.fn('sum', sequelize.col('expenses.amount')), 'totalExpenses']],
            include: [{ model: Expense, attributes: [] }],
            group: ['user.id'],
            order: [['totalExpenses', 'DESC']]
        });
        res.status(200).json({ success: true, leaderboard: leaderboard });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Database operation failed. Please try again.' });
    }
}