const Expense = require("../models/expense");
const S3Services = require('../services/S3Services');

exports.postAddExpense = async (req, res, next) => {
    try {
        await req.user.createExpense({
            amount: req.body.amount,
            description: req.body.description,
            category: req.body.category
        });
        const expenses = await req.user.getExpenses();
        const totalExpenses = expenses.length;
        const EXPENSES_PER_PAGE = +req.headers.expensesperpage;
        const lastPage = Math.ceil(totalExpenses / EXPENSES_PER_PAGE);
        res.status(201).json({ success: true, message: 'Expense added successfully.', lastPage: lastPage });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Database operation failed. Please try again.' })
    }
}

exports.getExpenses = async (req, res, next) => {
    try {
        const page = +req.query.page || 1;
        const expenses = await req.user.getExpenses();
        const totalExpenses = expenses.length;
        const EXPENSES_PER_PAGE = +req.headers.expensesperpage;
        const pageExpenses = await req.user.getExpenses({
            offset: (page - 1) * EXPENSES_PER_PAGE,
            limit: EXPENSES_PER_PAGE
        });
        res.status(200).json({
            success: true,
            user: req.user,
            pageExpenses: pageExpenses,
            paginationInfo: {
                currentPage: page,
                hasNextPage: page * EXPENSES_PER_PAGE < totalExpenses,
                nextPage: page + 1,
                hasPreviousPage: page > 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalExpenses / EXPENSES_PER_PAGE)
            }
        });
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
        res.status(500).json({ success: false, message: 'Database operation failed. Please try again.' });
    }
}

exports.downloadExpenses = async (req, res, next) => {
    try {
        const expenses = await req.user.getExpenses();
        const filename = `Expenses${req.user.id}/${new Date()}.txt`;
        const fileURL = await S3Services.s3Upload(filename, JSON.stringify(expenses));
        await req.user.createFileDownloaded({
            fileURL: fileURL
        });
        res.status(200).json({ success: true, fileURL: fileURL });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Database operation failed. Please try again.' });
    }
}

exports.getDownloadHistory = async (req, res, next) => {
    try {
        const filesDownloaded = await req.user.getFileDownloadeds();
        res.status(200).json({ success: true, filesDownloaded: filesDownloaded });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Database operation failed. Please try again.' });
    }
}