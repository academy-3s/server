const express = require('express');
const router = express.Router();
const categories = require('../controllers/categories');

// Create
router.post('/create', categories.createCategory)

// Read
router.get('/read', categories.getAllCategories)

// update
router.put('/update/:id/name/:name', categories.updateCategory)

// delete
router.delete('/delete/:id', categories.deleteCategory)

module.exports = router;