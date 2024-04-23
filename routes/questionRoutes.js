const express = require('express');
const router = express.Router();
const multer = require('multer');
const questionController = require('../controllers/questionController');
const { checkPurchasedCourse } = require('../middlewares/userValidation');

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });


router.post('/upload/:courseId', upload.single('excelFile'), questionController.uploadQuestions);
router.put('/editTime/:courseId', questionController.editTime);

// Route for fetching all questions
router.get('/', questionController.getQuestions);

router.get('/module/:moduleId', questionController.getQuestionsById);
router.get('/course/:courseId', questionController.getQuestionsByCourseId);
router.post('/course/:courseId/module/:moduleId', checkPurchasedCourse, questionController.getQuestionsByCourseAndModule);


// router.post('/add', questionController.addQuestion);
router.post('/add/:courseId', questionController.addQuestion);

// route for editing a question
router.put('/:id', questionController.editQuestion);

// route for deleting a question
router.delete('/:id', questionController.deleteQuestion);

module.exports = router;
