const nodemailer = require('nodemailer');
const Course = require('../models/Course');

exports.sendPassEmail = async (name, email, courseName, coursePercentage, comingFrom) => {
  try {
    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'support@academy3s.com', // Replace with your email address
        pass: 'khkchcomtpxmvlvw',  // Replace with your email password or an app-specific password
      },
    });

    // const getPercentage = score => {
    //   if (!score) {
    //     return 'N/A'; // Handle case where score is not available
    //   }

    //   const parts = score.split('/');

    //   if (parts.length !== 2) {
    //     console.error(`Invalid score format: ${score}`);
    //     return 'N/A'; // Return some default value or error indicator
    //   }

    //   const numerator = parseInt(parts[0]);
    //   const denominator = parseInt(parts[1]);

    //   if (isNaN(numerator) || isNaN(denominator) || denominator === 0) {
    //     console.error(`Invalid numerator or denominator in score: ${score}`);
    //     return 'N/A'; // Return some default value or error indicator
    //   }

    //   const percentage = Math.round((numerator / denominator) * 100);
    //   return percentage + '%';
    // };

    if (comingFrom === "admin") {
      coursePercentage = "60"
    }

    // Define email content
    const mailOptions = {
      from: 'support@academy3s.com', // Replace with your email address
      to: email,
      subject: 'Congratulation for Passing the Course',
      html: `<p>Dear ${name},</p>

      <p>“Congratulations”</p>
      
      <p>On behalf of the Academy3s, it gives us great pleasure to congratulate you for passing the ${courseName} <br />with ${coursePercentage}%. This is truly an outstanding accomplishment and I hope you take deep pride in having<br /> achieved it.</p>
      
      <p>Your Digital certificate is attached to this email. You should promote/display your achievement on social<br /> networking sites and among your colleagues, employees, and employers that you have substantial<br /> experience and demonstrated competence in the specific domain.</p> 
      
      <p>Again, we sincerely congratulate you on this achievement. We wish you a great career ahead.<br />May god bless you with a healthy and successful life.</p><br/>
      

      <p>With Best Regards,</p>

      <p><strong>Program Certification Board<br/>Academy for Support Services Studies</strong></p>
      <img src="https://www.academy3s.com/images/academy-logo.png" width="140px" height="60px"/>`,
      attachments: [
        {
          filename: 'certificate.pdf',
          path: `./certificates/certificate_${name}.pdf`,
        },
      ],
    };

    // Send the email
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending pass email:', error);
    throw error;
  }
};

exports.sendFailEmail = async (name, email) => {
  try {
    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'support@academy3s.com', // Replace with your email address
        pass: 'khkchcomtpxmvlvw',  // Replace with your email password or an app-specific password
      },
    });

    // Define email content
    const mailOptions = {
      from: 'support@academy3s.com', // Replace with your email address
      to: email,
      subject: 'Test Results: You Did Not Pass',
      text: 'Unfortunately, you did not pass the test. Better luck next time.',
    };

    // Send the email
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending fail email:', error);
    throw error;
  }
};

exports.sendOnFirstTimeSignup = async (name, email) => {
  try {
    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'support@academy3s.com', // Replace with your email address
        pass: 'khkchcomtpxmvlvw',  // Replace with your email password or an app-specific password
      },
    });

    // Define email content
    const mailOptions = {
      from: 'support@academy3s.com', // Replace with your email address
      to: email,
      subject: 'Welcome to Academy for Support Services Studies - Membership Confirmation',
      html: `<p>Dear ${name},</p>
      <p>Congratulations!</p>
      <p>On behalf of the Academy for Support Services Studies, we are glad to let you know that your<br/> membership here has been confirmed and accepted.</p>
      <p>Your Digital Membership certificate is attached to this email. You should promote/display your<br/> achievement on social networking sites and among your colleagues, employees, and employers.</p>
      <p>Again, we sincerely congratulate you on this achievement. We wish you a great career ahead. May god<br/> bless you with a healthy and successful life.</p>
      <p><strong>Further, you will get 20% discount on your first purchase of course</strong></p>
      <p>If you have other queries feel free to contact support@academy3s.com.  We thank you for choosing our<br/> esteemed institute and hope that you will perform with equal enthusiasm in the future days. We wish you<br/> luck in your entire endeavor.</p>
      <p>Sincerely,</p>
      <p><strong>Membership Committee<br/>Academy for Support Services Studies</strong></p>
      <img src="https://www.academy3s.com/images/academy-logo.png" width="140px" height="60px"/>`,
      attachments: [
        {
          filename: 'certificate.pdf',
          path: `./certificates/certificate_first_sign_up_${name}.pdf`,
        },
      ],
    };

    // Send the email
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending fail email:', error);
    throw error;
  }
};

exports.sendWhenCoursePurchased = async (name, email, courses) => {
  try {
    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'support@academy3s.com', // Replace with your email address
        pass: 'khkchcomtpxmvlvw',  // Replace with your email password or an app-specific password
      },
    });

    // const getCourseTitle = async (courseId) => {
    //   const course = await Course.findById(courseId)
    //   return course.title
    // }

    let coursesWithAppropriateGrammar
    let courseTitle
    // console.log("courses", courses, typeof courses)
    if (courses.length === 1) {
      const course = await Course.findById(courses[0])
      // console.log("course", course, typeof course)
      courseTitle = course.title
      coursesWithAppropriateGrammar = `this course ${courseTitle}`
    } else {
      coursesWithAppropriateGrammar = `the courses `
      for (let i = 0; i < courses.length - 1; i++) {
        const course = await Course.findById(courses[i])
        courseTitle = course.title
        if (i === courses.length - 1) {
          coursesWithAppropriateGrammar += `${courseTitle}`
        } else {
          coursesWithAppropriateGrammar += `${courseTitle}, `
        }
      }
    }

    // Define email content
    const mailOptions = {
      from: 'support@academy3s.com', // Replace with your email address
      to: email,
      subject: 'Confirmation for Course Enrollment - Academy3s',
      html: `<p>Dear ${name},</p>

      <p>Congratulations!</p>
      
      <p>We want to inform you that your enrolment number for ${coursesWithAppropriateGrammar} has been confirmed.</p>


      <p>If you have other queries feel free to contact support@academy3s.com.  We thank you for choosing our esteemed institute<br /> and hope that you will perform with equal enthusiasm in the future days.<br /> We wish you luck in your entire endeavor.<p>


      <p>Sincerely,</p>


      <p><strong>Program Certification Board<br/>Academy for Support Services Studies</strong></p>
      <img src="https://www.academy3s.com/images/academy-logo.png" width="140px" height="60px"/>`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}