const express = require('express');
const router = express.Router();
const multer = require('multer');
const RealTest = require('../controllers/RealTest');
const { checkPurchasedCourse } = require('../middlewares/userValidation');

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/RealTest');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

// Route for uploading questions from an Excel file
router.post('/upload/:courseId', upload.single('excelFile'), RealTest.uploadQuestions);

// Route for fetching all questions
router.get('/', RealTest.getQuestions);
router.get('/module/:moduleId', RealTest.getQuestionsById);
router.post('/course/:courseId', checkPurchasedCourse, RealTest.getQuestionsByCourseId);


router.post('/add/:courseId', RealTest.addQuestion);

// route for editing a question
router.put('/:id', RealTest.editQuestion);

// route for deleting a question
router.delete('/:id', RealTest.deleteQuestion);

module.exports = router;
