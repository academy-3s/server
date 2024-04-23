const nodemailer = require('nodemailer');

exports.submitContactForm = async (req, res) => {
  try {
    const { name, email, subject, phone, message } = req.body;

    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'support@academy3s.com',
        pass: 'khkchcomtpxmvlvw',
      },
    });

    // Define email content
    const mailOptions = {
      from: email,
      to: 'support@academy3s.com', // Replace with your email address to receive the contact form
      subject: subject,
      text: `
        Name: ${name}
        Email: ${email}
        Phone: ${phone}
        Message: ${message}
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Contact form submitted successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'An error occurred while submitting the contact form' });
  }
};
