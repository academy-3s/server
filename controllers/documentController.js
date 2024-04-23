const fs = require('fs');
const path = require('path');
const libre = require('libreoffice-convert');
const Document = require('../models/document');

const convertToPdf = (inputPath, extend) => {
  return new Promise((resolve, reject) => {
    libre.convert(fs.readFileSync(inputPath), extend, undefined, (err, done) => {
      if (err) {
        reject(err);
      } else {
        resolve(done);
      }
    });
  });
};

const uploadDocument = async (req, res) => {
  try {
    const { chapterName, courseName, moduleIndex, chapterIndex } = req.body;
    const filePath = req.file.path;

    const inputPath = "./uploads/" + req.file.originalname;
    const outputPath = "./pdfs/" + req.file.originalname.replace(/\.pptx$/, "") + ".pdf";
    const extend = ".pdf";

    const convertedFile = await convertToPdf(inputPath, extend);
    fs.writeFileSync(outputPath, convertedFile);

    const document = new Document({ chapterName, courseName, moduleIndex, chapterIndex, filePath: outputPath });
    await document.save();

    res.status(201).json({ message: 'File uploaded successfully' });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
};

const getAllDocuments = async (req, res) => {
  try {
    const documents = await Document.find();
    res.status(200).json(documents);
  } catch (error) {
    console.error('Error retrieving documents:', error);
    res.status(500).json({ error: 'Failed to retrieve documents' });
  }
};

const getDocumentById = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const filename = path.basename(document.filePath);
    const staticPath = `/pdfs/${filename}`;

    const documentWithStaticPath = {
      ...document.toObject(),
      staticPath
    };

    res.status(200).json(documentWithStaticPath);
  } catch (error) {
    console.error('Error retrieving document:', error);
    res.status(500).json({ error: 'Failed to retrieve document' });
  }
};



// const updateDocument = async (req, res) => {
//   try {
//     const { chapterName, courseName, moduleIndex, chapterIndex } = req.body;
//     const filePath = req.file.path;

//     const inputPath = "./uploads/" + req.file.originalname;
//     const outputPath = "./pdfs/" + req.file.originalname.replace(/\.pptx$/, "") + ".pdf";
//     const extend = ".pdf";

//     const convertedFile = await convertToPdf(inputPath, extend);
//     fs.writeFileSync(outputPath, convertedFile);

//     const document = await Document.findByIdAndUpdate(req.params.id, {
//       chapterName,
//       courseName,
//       moduleIndex,
//       chapterIndex,
//       filePath: outputPath, // Use the same outputPath as in the uploadDocument function
//     });

//     if (!document) {
//       return res.status(404).json({ error: 'Document not found' });
//     }

//     res.status(200).json({ message: 'Document updated successfully' });
//   } catch (error) {
//     console.error('Error updating document:', error);
//     res.status(500).json({ error: 'Failed to update document' });
//   }
// };

const updateDocument = async (req, res) => {
  try {
    const { chapterName, moduleIndex, chapterIndex } = req.body;
    const filePath = req.file.path;

    const inputPath = "./uploads/" + req.file.originalname;
    const outputPath = "./pdfs/" + req.file.originalname.replace(/\.pptx$/, "") + ".pdf";
    const extend = ".pdf";

    const convertedFile = await convertToPdf(inputPath, extend);
    fs.writeFileSync(outputPath, convertedFile);

    // Now, update the document in the database with the new information
    const document = await Document.findByIdAndUpdate(req.params.id, {
      chapterName,
      moduleIndex,
      chapterIndex,
      filePath: outputPath, // Use the same outputPath as in the uploadDocument function
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.status(200).json({ message: 'Document updated successfully' });
  } catch (error) {
    console.error('Error updating document:', error);
    res.status(500).json({ error: 'Failed to update document' });
  }
};

const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findByIdAndDelete(req.params.id);

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    fs.unlinkSync(document.filePath);
    res.status(200).json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ error: 'Failed to delete document' });
  }
};

const getDocumentsByModuleIndex = async (req, res) => {
  try {
    const moduleIndex = req.params.moduleIndex;
    const documents = await Document.find({ moduleIndex: moduleIndex });

    res.status(200).json(documents);
  } catch (error) {
    console.error('Error retrieving documents by moduleIndex:', error);
    res.status(500).json({ error: 'Failed to retrieve documents by moduleIndex' });
  }
};

const getDocumentsByChapterIndex = async (req, res) => {
  try {
    const chapterIndex = req.params.chapterIndex;
    const documents = await Document.find({ chapterIndex: chapterIndex });

    res.status(200).json(documents);
  } catch (error) {
    console.error('Error retrieving documents by chapterIndex:', error);
    res.status(500).json({ error: 'Failed to retrieve documents by chapterIndex' });
  }
};

// const uploadDocumentForCourse = async (req, res) => {
//   try {
//     const { chapterName, moduleIndex, chapterIndex } = req.body;
//     const courseId = req.params.courseId; // Retrieve the courseId from the URL parameter
//     const filePath = req.file.path;

//     const inputPath = "./uploads/" + req.file.originalname;
//     const outputPath = "./pdfs/" + req.file.originalname.replace(/\.pptx$/, "") + ".pdf";
//     const extend = ".pdf";

//     const convertedFile = await convertToPdf(inputPath, extend);
//     fs.writeFileSync(outputPath, convertedFile);

//     const document = new Document({
//       chapterName,
//       course: courseId, // Store the courseId in the 'course' field of the document
//       moduleIndex,
//       chapterIndex,
//       filePath: outputPath,
//     });

//     await document.save();

//     res.status(201).json({ message: 'File uploaded successfully' });
//   } catch (error) {
//     console.error('Error uploading file:', error);
//     res.status(500).json({ error: 'Failed to upload file' });
//   }
// };

const uploadDocumentForCourse = async (req, res) => {
  try {
    const { chapterName, moduleIndex, chapterIndex } = req.body;
    const courseId = req.params.courseId; // Retrieve the courseId from the URL parameter
    const filePath = req.file.path;

    const inputPath = "./uploads/" + req.file.originalname;
    const outputPath = "./pdfs/" + req.file.originalname.replace(/\.pptx$/, "") + ".pdf";
    const extend = ".pdf";

    const convertedFile = await convertToPdf(inputPath, extend);
    fs.writeFileSync(outputPath, convertedFile);

    const document = new Document({
      chapterName,
      course: courseId, // Store the courseId in the 'course' field of the document
      moduleIndex: parseInt(moduleIndex),
      chapterIndex,
      filePath: outputPath,
    });

    await document.save();

    res.status(201).json({ message: 'File uploaded successfully' });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
};


const getDocumentsByCourseAndModule = async (req, res) => {
  try {
    const { courseId, moduleIndex } = req.params;
    const documents = await Document.find({ course: courseId, moduleIndex: moduleIndex });

    res.status(200).json(documents);
  } catch (error) {
    console.error('Error retrieving documents by course and module:', error);
    res.status(500).json({ error: 'Failed to retrieve documents by course and module' });
  }
};


module.exports = {
  uploadDocument,
  getAllDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
  getDocumentsByModuleIndex,
  getDocumentsByChapterIndex,
  uploadDocumentForCourse,  
  getDocumentsByCourseAndModule,


};
