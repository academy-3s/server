const XLSX = require('xlsx');
const RealTestQuestions = require('../models/RealTestQuestions');

// const uploadQuestions = async (req, res) => {
//   try {
//     const courseId = req.params.courseId;
//     const { time } = req.body;
//     const workbook = XLSX.readFile(req.file.path);
//     const worksheet = workbook.Sheets[workbook.SheetNames[0]];
//     const data = XLSX.utils.sheet_to_json(worksheet);

//     const questions = data.map((row) => {
//       const options = [row.A, row.B, row.C, row.D].filter(Boolean);
//       const answer = row.answer;
//       if (options.includes(answer)) {
//         return {
//           question: row.question,
//           answer,
//           options,
//           module: row.Module,
//           course: courseId,
//           time,
//         };
//       } else {
//         return {
//           question: row.question,
//           answer,
//           options,
//           module: row.Module,
//           course: courseId,
//           time,
//         };
//       }
//     });

//     const savedQuestions = await RealTestQuestions.insertMany(questions);

//     res.status(201).json({
//       message: 'Questions uploaded successfully',
//       questions: savedQuestions,
//     });
//   } catch (error) {
//     console.error('Error uploading questions:', error);
//     res.status(500).json({ error: 'Failed to upload questions' });
//   }
// };


const uploadQuestions = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const { time } = req.body;
    const workbook = XLSX.readFile(req.file.path);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet);

    // Delete existing questions for the specified course
    await RealTestQuestions.deleteMany({ course: courseId });

    const questions = data.map((row) => {
      const options = [row.A, row.B, row.C, row.D].filter(Boolean);
      const answer = row.answer;
      return {
        question: row.question,
        answer,
        options,
        module: row.Module,
        course: courseId,
        time,
      };
    });

    const savedQuestions = await RealTestQuestions.insertMany(questions);

    res.status(201).json({
      message: 'Questions uploaded successfully',
      questions: savedQuestions,
    });
  } catch (error) {
    console.error('Error uploading questions:', error);
    res.status(500).json({ error: 'Failed to upload questions' });
  }
};



const getQuestions = async (req, res) => {
  try {
    const questions = await RealTestQuestions.find();
    res.status(200).json({ questions });
  } catch (error) {
    // console.log()
    console.error('Error retrieving questions:', error);
    res.status(500).json({ error: 'Failed to retrieve questions' });
  }
};

const getQuestionsById = async (req, res) => {
  try {
    const moduleId = req.params.moduleId;
    const questions = await RealTestQuestions.find({ module: moduleId });
    res.status(200).json({ questions });
  } catch (error) {
    console.error('Error retrieving questions:', error);
    res.status(500).json({ error: 'Failed to retrieve questions' });
  }
};

const addQuestion = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const { question, answer, options, module, time } = req.body;

    const newQuestion = {
      question,
      answer,
      options,
      module,
      course: courseId,
      time
    };

    const savedQuestion = await RealTestQuestions.create(newQuestion);

    res.status(201).json({
      message: 'Question added successfully',
      question: savedQuestion,
    });
  } catch (error) {
    console.error('Error adding question:', error);
    res.status(500).json({ error: 'Failed to add question' });
  }
};

const editQuestion = async (req, res) => {
  try {
    const questionId = req.params.id;
    const { question, answer, options, module, course, time } = req.body;

    const updatedQuestion = {
      question,
      answer,
      options,
      module,
      course,
      time
    };

    const editedQuestion = await RealTestQuestions.findByIdAndUpdate(questionId, updatedQuestion, {
      new: true,
    });

    res.status(200).json({
      message: 'Question updated successfully',
      question: editedQuestion,
    });
  } catch (error) {
    console.error('Error editing question:', error);
    res.status(500).json({ error: 'Failed to edit question' });
  }
};

// New function to handle deleting a question
const deleteQuestion = async (req, res) => {
  try {
    const questionId = req.params.id;

    const deletedQuestion = await RealTestQuestions.findByIdAndRemove(questionId);

    res.status(200).json({
      message: 'Question deleted successfully',
      question: deletedQuestion,
    });
  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).json({ error: 'Failed to delete question' });
  }
};

const getQuestionsByCourseId = async (req, res) => {
  try {
    const courseId = req.params.courseId; // Get the course ID from the request parameters
    const questions = await RealTestQuestions.find({ course: courseId });
    res.status(200).json({ questions });
  } catch (error) {
    console.error('Error retrieving questions:', error);
    res.status(500).json({ error: 'Failed to retrieve questions' });
  }
};


module.exports = {
  uploadQuestions,
  getQuestions,
  getQuestionsById,
  addQuestion,
  editQuestion,
  deleteQuestion,
  getQuestionsByCourseId
};
