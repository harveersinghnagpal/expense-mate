const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');

// @desc    Get Overview (Income, Expense, Savings)
// @route   GET /analytics/overview
const getOverview = async (req, res) => {
    try {
        const stats = await Transaction.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(req.user.id) } },
            {
                $group: {
                    _id: '$type',
                    total: { $sum: '$amount' }
                }
            }
        ]);

        const income = stats.find(s => s._id === 'income')?.total || 0;
        const expense = stats.find(s => s._id === 'expense')?.total || 0;
        const savings = income - expense;
        const savingsPercentage = income ? ((savings / income) * 100).toFixed(1) : 0;

        res.status(200).json({
            income,
            expense,
            savings,
            savingsPercentage
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// @desc    Category Breakdown
// @route   GET /analytics/category-breakdown
const getCategoryBreakdown = async (req, res) => {
    try {
        const breakdown = await Transaction.aggregate([
            { 
                $match: { 
                    userId: new mongoose.Types.ObjectId(req.user.id),
                    type: 'expense'
                } 
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'categoryId',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            { $unwind: '$category' },
            {
                $group: {
                    _id: '$category.name',
                    total: { $sum: '$amount' },
                    color: { $first: '$category.color' }
                }
            },
            { $sort: { total: -1 } }
        ]);

        res.status(200).json(breakdown);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// @desc    Get Rule-based Insights
// @route   GET /analytics/insights
const getInsights = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.id);
        const insights = [];

        // 1. Total Income vs Expense Check
        const overview = await Transaction.aggregate([
            { $match: { userId } },
            { $group: { _id: '$type', total: { $sum: '$amount' } } }
        ]);
        const income = overview.find(o => o._id === 'income')?.total || 0;
        const expense = overview.find(o => o._id === 'expense')?.total || 0;

        if (expense > income) {
            insights.push({
                type: 'warning',
                title: 'Deficit Warning',
                message: `You have spent $${(expense - income).toLocaleString()} more than you earned.`
            });
        }

        // 2. High Spending Categories
        const categorySpend = await Transaction.aggregate([
            { $match: { userId, type: 'expense' } },
            { $group: { _id: '$categoryId', total: { $sum: '$amount' } } },
            { $sort: { total: -1 } },
            { $limit: 1 },
            { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'category' } },
            { $unwind: '$category' }
        ]);

        if (categorySpend.length > 0) {
            const top = categorySpend[0];
            insights.push({
                type: 'info',
                title: 'Top Spending Category',
                message: `Your highest spending is in ${top.category.name} ($${top.total.toLocaleString()}).`
            });
        }

        res.status(200).json(insights);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getOverview,
    getCategoryBreakdown,
    getInsights
};
