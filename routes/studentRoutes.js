const express = require('express');
const router = express.Router();
const { createStudent, getAllStudents, editStudent } = require('../controllers/studentController');

// POST route to create a new student
router.post('/', createStudent);

// GET route to retrieve all students
router.get('/', getAllStudents);

// PUT route to edit a student
router.put('/:id', editStudent);

module.exports = router;
