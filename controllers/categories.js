const Category = require('../models/categories');

const createCategory = async (req, res) => {
    const { name } = req.body;
    const student = new Category({ name });

    try {
        await student.save();
        res.status(201).json({ message: 'Category created successfully' });
    } catch (error) {
        console.log("error", error)
        res.status(500).json({ error: 'Failed to create category' });
    }
};

const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find({}); // Use await to handle the Promise
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve categories.' });
    }
};

const updateCategory = async (req, res) => {
    const { id, name } = req.params;
    try {
        const editedCategory = await Category.findByIdAndUpdate(id, { name }, {
            new: true,
        });
        res.status(200).json({ message: "category upddated successfully." });
    } catch (error) {
        console.log("error updateCategory", error);
        res.status(500).json({ error: 'Failed to update categories.' });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const id = req.params.id;

        const deletedCategory = await Category.findByIdAndRemove(id);

        res.status(200).json({ message: 'category deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete question' });
    }
};

module.exports = {
    createCategory,
    getAllCategories,
    updateCategory,
    deleteCategory
};