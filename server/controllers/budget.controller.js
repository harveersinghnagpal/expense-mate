const Budget = require('../models/Budget');

// @desc    Get budgets
// @route   GET /budgets
// @query   month, year
const getBudgets = async (req, res) => {
  try {
    const { month, year } = req.query;
    const query = { userId: req.user.id };

    if (month) query.month = month;
    if (year) query.year = year;

    const budgets = await Budget.find(query).populate('categoryId');
    res.status(200).json(budgets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Set budget
// @route   POST /budgets
const setBudget = async (req, res) => {
  const { categoryId, month, year, limitAmount } = req.body;

  if (!categoryId || !month || !year || !limitAmount) {
    return res.status(400).json({ message: 'Please add all fields' });
  }

  try {
    // Check if budget exists for this category/month/year
    let budget = await Budget.findOne({
      userId: req.user.id,
      categoryId,
      month,
      year
    });

    if (budget) {
      budget.limitAmount = limitAmount;
      await budget.save();
    } else {
      budget = await Budget.create({
        userId: req.user.id,
        categoryId,
        month,
        year,
        limitAmount
      });
    }

    const populatedBudget = await Budget.findById(budget._id).populate('categoryId');
    res.status(200).json(populatedBudget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update budget
// @route   PUT /budgets/:id
const updateBudget = async (req, res) => {
    // Essentially same as setBudget but specific by ID if needed, 
    // or just rely on setBudget to upsert.
    // For REST fullness:
    try {
        const budget = await Budget.findById(req.params.id);
        if(!budget) return res.status(404).json({message: 'Budget not found'});
        if(budget.userId.toString() !== req.user.id) return res.status(401).json({message: 'Not authorized'});

        const updated = await Budget.findByIdAndUpdate(req.params.id, req.body, {new: true}).populate('categoryId');
        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

// @desc    Delete budget
// @route   DELETE /budgets/:id
const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);
    if(!budget) return res.status(404).json({message: 'Budget not found'});
    if(budget.userId.toString() !== req.user.id) return res.status(401).json({message: 'Not authorized'});
    
    await budget.deleteOne();
    res.status(200).json({id: req.params.id});
  } catch (error) {
    res.status(500).json({message: error.message});
  }
}

module.exports = {
  getBudgets,
  setBudget,
  updateBudget,
  deleteBudget
};
