const Student = require('../models/studentModel');

const createStudent = async (req, res) => {
  const { user, course, score } = req.body;
  const student = new Student({ user, course, score });

  try {
    await student.save();
    res.status(201).json({ message: 'Test data sent successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to sent Test data' });
  }
};

const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find({})
      .populate({ path: 'user', select: { _id: 1, name: 1, email: 1, phone: 1, membershipNo: 1 } })
      .populate({ path: 'course', select: { title: 1 } })
      .exec();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve students.' });
  }
};

const editStudent = async (req, res) => {
  const { id } = req.params
  try {
    const student = await Student.findById(id)
    student.status = 'inactive'
    const updatedStudent = await student.save();
    res.status(200).json({ message: "Student updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to edit student' })
  }
}

module.exports = {
  createStudent,
  getAllStudents,
  editStudent
};
