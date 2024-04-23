const XLSX = require('xlsx');
const Question = require('../models/Question');


const uploadQuestions = async (req, res) => {
  try {
    const courseId = req.params.courseId; // Get the course ID from the request parameters
    const workbook = XLSX.readFile(req.file.path);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet);

    // Modify the questions data to include the course ID
    const questions = data.map((row) => {
      const options = [row.A, row.B, row.C, row.D].filter(Boolean);
      const answer = row.answer;
      if (options.includes(answer)) {
        return {
          question: row.question,
          answer,
          options,
          module: row.Module,
          course: courseId, // Use the courseId obtained from the request parameter
        };
      } else {
        return {
          question: row.question,
          answer,
          options,
          module: row.Module,
          course: courseId, // Use the courseId obtained from the request parameter
        };
      }
    });

    const savedQuestions = await Question.insertMany(questions);

    res.status(201).json({
      message: 'Questions uploaded successfully',
      questions: savedQuestions,
    });
  } catch (error) {
    console.error('Error uploading questions:', error);
    res.status(500).json({ error: 'Failed to upload questions' });
  }
};

const editTime = async (req, res) => {
  try {
    let courseId = req.params.courseId; // Get the course ID from the request parameters
    let { time, moduleNo } = req.body;
    moduleNo = parseInt(moduleNo);
    time = parseInt(time);
    // console.log("courseId", courseId, typeof courseId, moduleNo, typeof moduleNo, time, typeof time);

    const filter = {
      course: courseId,
      module: moduleNo
    };

    const update = {
      $set: {
        time,
      },
    };

    const options = {
      new: true, // Return the modified document rather than the original
    };

    // console.log("filter", filter, 'update', update, 'options', options);

    const result = await Question.updateMany(filter, update, options);

    // console.log('Documents updated:', result);

    if (result.modifiedCount > 0) {
      res.status(201).json({
        message: 'time updated successfully'
      });
    } else {
      res.status(404).json({ error: 'No documents updated' });
    }
  } catch (error) {
    console.error('Error updating time:', error);
    res.status(500).json({ error: 'Failed to update time' });
  }
};

const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    res.status(200).json({ questions });
  } catch (error) {
    // console.log()
    console.error('Error retrieving questions:', error);
    res.status(500).json({ error: 'Failed to retrieve questions' });
  }
};

const getQuestionsByCourseId = async (req, res) => {
  try {
    const courseId = req.params.courseId; // Get the course ID from the request parameters
    const questions = await Question.find({ course: courseId });
    res.status(200).json({ questions });
  } catch (error) {
    console.error('Error retrieving questions:', error);
    res.status(500).json({ error: 'Failed to retrieve questions' });
  }
};


const getQuestionsById = async (req, res) => {
  try {
    const moduleId = req.params.moduleId;
    const questions = await Question.find({ module: moduleId });
    res.status(200).json({ questions });
  } catch (error) {
    console.error('Error retrieving questions:', error);
    res.status(500).json({ error: 'Failed to retrieve questions' });
  }
};

const addQuestion = async (req, res) => {
  try {
    const courseId = req.params.courseId; // Get the course ID from the request parameters
    const { question, answer, options, module } = req.body;

    const newQuestion = {
      question,
      answer,
      options,
      module,
      course: courseId, // Use the courseId obtained from the request parameter
    };

    const savedQuestion = await Question.create(newQuestion);

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
    const { question, answer, options, module, course } = req.body;

    const updatedQuestion = {
      question,
      answer,
      options,
      module,
      course,
    };

    const editedQuestion = await Question.findByIdAndUpdate(questionId, updatedQuestion, {
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

    const deletedQuestion = await Question.findByIdAndRemove(questionId);

    res.status(200).json({
      message: 'Question deleted successfully',
      question: deletedQuestion,
    });
  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).json({ error: 'Failed to delete question' });
  }
};

const getQuestionsByCourseAndModule = async (req, res) => {
  try {
    const courseId = req.params.courseId; // Get the course ID from the request parameters
    const moduleId = req.params.moduleId; // Get the module ID from the request parameters
    const questions = await Question.find({ course: courseId, module: moduleId });
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
  getQuestionsByCourseId,
  getQuestionsByCourseAndModule,
  editTime
};