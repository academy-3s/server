const express = require('express');
const router = express.Router();
const certificateController = require('../controllers/certificateController'); // Import the correct controller
const contactController = require('../controllers/certificateContactController');
const certificateGivenHistory = require('../models/certificateGivenHistory');
const User = require('../models/User');
const Course = require('../models/Course');
const { generateRandomNumber } = require('../utils/randomNumberGenerate');
const { getCurrentDateInIndianFormat } = require('../utils/dates');

router.post('/generate', async (req, res) => {
  // const { name, email, course, percentage, comingFrom, userId, courseId } = req.body;
  let { percentage, comingFrom, userId, courseId, certiNo, date } = req.body;
  // domain, certiNo, date
  const user = await User.findById(userId)
  const courseDetails = await Course.findById(courseId)
  const email = user.email
  const name = user.name
  const course = courseDetails.title
  const domain = courseDetails.category1
  // console.log("name, email, course, domain", name, email, course, domain)
  if (certiNo === null || certiNo === undefined) {
    const number = generateRandomNumber(7)
    certiNo = `C-${number}`
  }
  if (date === null || date === undefined) {
    date = getCurrentDateInIndianFormat()
  }
  // console.log("certi_no, date", certiNo, date)

  try {
    const certificatePath = await certificateController.generatePDF(name, course, domain, certiNo, date); // Use the correct controller method

    // Send the pass email
    await contactController.sendPassEmail(name, email, course, percentage, comingFrom);

    res.status(200).json({ message: 'Certificate generated and pass email sent successfully' });
  } catch (error) {
    console.error('Error generating certificate and sending pass email:', error);
    res.status(500).json({ message: 'An error occurred while generating the certificate and sending the pass email' });
  }
});

router.post('/fail', async (req, res) => {
  const { name, email } = req.body; // Extract the user's name and email from the request body

  try {
    // Send the fail email
    await contactController.sendFailEmail(name, email);
    res.status(200).json({ message: 'Fail email sent successfully' });
  } catch (error) {
    console.error('Error sending fail email:', error);
    res.status(500).json({ message: 'An error occurred while sending the fail email' });
  }
});
router.get('/all', async (req, res) => {
  try {
    const certificates = await certificateController.getAllCertificates();
    res.status(200).json(certificates);
  } catch (error) {
    console.error('Error retrieving certificates:', error);
    res.status(500).json({ message: 'An error occurred while retrieving certificates' });
  }
});

router.post("/course-purchased-email", async (req, res) => {
  const { name, email, courses } = req.body
  try {
    await contactController.sendWhenCoursePurchased(name, email, courses)
    res.status(200).json({ message: 'Course purchased email sent successfully' })
  } catch (e) {
    console.error('Error sending courses purchased email:', error);
    res.status(500).json({ message: 'An error occurred while sending the course purchased email' });
  }
})

router.post("/create-certificate-record", async (req, res) => {
  let { user, course, score, comingFrom, result, date, certiNo } = req.body;

  try {
    // const certificatePath = await certificateController.generatePDF(name, course); // Use the correct controller method

    if (certiNo === undefined || certiNo === null) {
      const number = generateRandomNumber(7)
      certiNo = `C-${number}`
    }

    let certificateObject
    if (date) {
      certificateObject = {
        certi_no: certiNo,
        user,
        course,
        score,
        comingFrom,
        result,
        date
      }
    } else {
      certificateObject = {
        certi_no: certiNo,
        user,
        course,
        score,
        comingFrom,
        result
      }
    }

    let newRecord = new certificateGivenHistory(certificateObject);

    await newRecord.save()

    res.status(200).json({ message: 'Certificate record created successfully' });
  } catch (error) {
    console.error('Error creating certi record:', error);
    res.status(500).json({ message: 'An error occurred while creating the certi record' });
  }
})

router.get("/certificate-history", async (req, res) => {
  try {
    let certificateHistory = await certificateGivenHistory.find({})
      .populate('user', 'name email phone')
      .populate('course', 'title');
    res.status(200).json({ message: 'got certificate records successfully', data: certificateHistory });
  } catch (error) {
    console.error('Error creating certi record:', error);
    res.status(500).json({ message: 'An error occurred while getting certificate records' });
  }
})

router.post('/generate-certificate', async (req, res) => {
  // const { name, course, domain, certiNo, date } = req.body;
  let { userId, courseId, certiNo, date } = req.body;
  // domain, certiNo, date
  const user = await User.findById(userId)
  const courseDetails = await Course.findById(courseId)
  const email = user.email
  const name = user.name
  const course = courseDetails.title
  const domain = courseDetails.category1
  // console.log("name, email, course, domain", name, email, course, domain)
  if (certiNo === null || certiNo === undefined) {
    const number = generateRandomNumber(7)
    certiNo = `C-${number}`
  }
  if (date === null || date === undefined) {
    date = getCurrentDateInIndianFormat()
  }
  // console.log("certi_no, date", certiNo, date)

  try {
    const certificatePath = await certificateController.generatePDF(name, course, domain, certiNo, date); // Use the correct controller method
    res.status(200).json({ message: "Certificate generated!" })

  } catch (error) {
    console.error('Error generating certificate and sending pass email:', error);
    res.status(500).json({ message: 'An error occurred while generating the certificate and sending the pass email' });
  }
})

module.exports = router;
//module.exports = router;