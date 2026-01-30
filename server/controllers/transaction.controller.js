const Transaction = require('../models/Transaction');

// @desc    Get transactions
// @route   GET /transactions
// @query   from, to, categoryId
const getTransactions = async (req, res) => {
  try {
    const { from, to, categoryId } = req.query;
    let query = { userId: req.user.id };

    if (from || to) {
      query.date = {};
      if (from) query.date.$gte = new Date(from);
      if (to) query.date.$lte = new Date(to);
    }

    if (categoryId) {
      query.categoryId = categoryId;
    }

    const transactions = await Transaction.find(query)
      .sort({ date: -1 })
      .populate('categoryId', 'name color icon');
      
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add transaction
// @route   POST /transactions
const addTransaction = async (req, res) => {
  const { type, amount, categoryId, note, date, paymentMode } = req.body;

  if (!type || !amount || !categoryId) {
    return res.status(400).json({ message: 'Please add type, amount and category' });
  }

  try {
    const transaction = await Transaction.create({
      userId: req.user.id,
      type,
      amount,
      categoryId,
      note,
      date,
      paymentMode,
    });
    
    // Populate category to return full object if needed, or just return basic
    const populatedTx = await Transaction.findById(transaction._id).populate('categoryId');

    res.status(201).json(populatedTx);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update transaction
// @route   PUT /transactions/:id
const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    if (transaction.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('categoryId');

    res.status(200).json(updatedTransaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete transaction
// @route   DELETE /transactions/:id
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    if (transaction.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await transaction.deleteOne();
    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
};
