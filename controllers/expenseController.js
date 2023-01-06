const Expense = require("../models/expense");
const FileDownloaded = require('../models/fileDownloaded');
const S3Services = require('../services/S3Services');

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