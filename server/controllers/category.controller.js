const Category = require('../models/Category');

// @desc    Get all categories for user
// @route   GET /categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ userId: req.user.id });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new category
// @route   POST /categories
const createCategory = async (req, res) => {
  const { name, color, icon } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Please add a name' });
  }

  try {
    const category = await Category.create({
      userId: req.user.id,
      name,
      color,
      icon,
    });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update category
// @route   PUT /categories/:id
const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) return res.status(404).json({ message: 'Category not found' });
    if (category.userId.toString() !== req.user.id) return res.status(401).json({ message: 'User not authorized' });

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete category
// @route   DELETE /categories/:id
const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) return res.status(404).json({ message: 'Category not found' });
        if (category.userId.toString() !== req.user.id) return res.status(401).json({ message: 'User not authorized' });

        await category.deleteOne();
        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
};
