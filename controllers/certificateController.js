const fs = require('fs/promises');
const path = require('path');
const { PDFDocument } = require('pdf-lib');
const Certificate = require('../models/certificate');

// Function to draw bold text by drawing multiple times with slight offsets
function drawBoldText(page, text, options) {
  const boldOffset = 0.3; // Adjust as needed

  // Draw the text multiple times with a slight offset to create a bold effect
  page.drawText(text, { ...options });
  page.drawText(text, { ...options, x: options.x + boldOffset });
}

const generatePDF = async (name, course, domain, certiNo, date) => {
  const pdfData = await fs.readFile('./academy certificate new edit.pdf');
  const pdfDoc = await PDFDocument.load(pdfData);
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];

  const pageWidth = firstPage.getSize().width;
  const centerX = pageWidth / 2;
  const textX = centerX - (name.length / 2) * 12;

  // Draw the user's name and course name
  firstPage.drawText(name, { x: textX, y: 276, size: 22 });

  // Draw the course name with a bold effect
  drawBoldText(firstPage, course, { x: 366, y: 217, size: 16 });

  // Draw the domain with a bold effect
  drawBoldText(firstPage, domain, { x: 366, y: 191, size: 16 });
  drawBoldText(firstPage, certiNo, { x: 656, y: 518, size: 12 });
  drawBoldText(firstPage, date, { x: 67, y: 44, size: 13 });
  // firstPage.drawText(certiNo, { x: 656, y: 518, size: 12 });
  // firstPage.drawText(date, { x: 67, y: 44, size: 13 });

  const pdfBytes = await pdfDoc.save();

  const certificatesPath = path.join(__dirname, '../certificates');
  await fs.mkdir(certificatesPath, { recursive: true });

  const filename = `certificate_${name}.pdf`;
  const outputPath = path.join(certificatesPath, filename);

  await fs.writeFile(outputPath, pdfBytes);

  // Save the certificate details to the database
  const certificate = new Certificate({
    name,
    course,
    certificatePath: outputPath,
  });
  await certificate.save();

  // console.log('Done creating', outputPath);
  return outputPath;
};

const generatePDFForSignUp = async (name, membershipCode) => {
  const pdfData = await fs.readFile('./on_signup_certi.pdf');
  const pdfDoc = await PDFDocument.load(pdfData);
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];

  // Calculate text width to center horizontally
  const fontSize = 34;
  const text = name;
  // const textWidth = firstPage.widthOfString(text, { size: fontSize });
  const pageWidth = firstPage.getSize().width;
  const centerX = pageWidth / 2;
  const textX = centerX - (name.length / 2) * 12.5;

  firstPage.drawText(name, { x: textX, y: 277, size: 25 });
  firstPage.drawText(membershipCode, { x: 280, y: 130, size: 18 });

  const pdfBytes = await pdfDoc.save();

  const certificatesPath = path.join(__dirname, '../certificates');
  await fs.mkdir(certificatesPath, { recursive: true });

  const filename = `certificate_first_sign_up_${name}.pdf`;
  const outputPath = path.join(certificatesPath, filename);

  await fs.writeFile(outputPath, pdfBytes);

  // // Save the certificate details to the database
  // const certificate = new Certificate({
  //   name,
  //   course,
  //   certificatePath: outputPath,
  // });
  // await certificate.save();

  // console.log('Done creating', outputPath);
  return outputPath;
};

const getAllCertificates = async () => {
  try {
    const certificates = await Certificate.find();
    return certificates;
  } catch (error) {
    throw error;
  }
};

module.exports = { generatePDF, generatePDFForSignUp, getAllCertificates };
