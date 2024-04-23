const express = require('express');
const multer = require('multer');
const documentController = require('../controllers/documentController');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

const router = express.Router();

router.post('/upload', upload.single('pptFile'), documentController.uploadDocument);
router.post('/upload/:courseId', upload.single('pptFile'), documentController.uploadDocumentForCourse); // New route for uploading document for a specific course

router.get('/documents', documentController.getAllDocuments);
router.get('/documents/:id', documentController.getDocumentById);
router.put('/documents/:id', upload.single('pptFile'), documentController.updateDocument);
router.delete('/documents/:id', documentController.deleteDocument);
router.get('/documents/moduleIndex/:moduleIndex', documentController.getDocumentsByModuleIndex);
router.get('/documents/chapterIndex/:chapterIndex', documentController.getDocumentsByChapterIndex);
router.get('/documents/course/:courseId/moduleIndex/:moduleIndex', documentController.getDocumentsByCourseAndModule);

module.exports = router;
