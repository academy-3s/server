const fs = require("fs/promises");
const path = require("path");
const { PDFDocument } = require("pdf-lib");

const generatePDF = async (name) => {
  const pdfData = await fs.readFile("./cert.pdf");

  const pdfDoc = await PDFDocument.load(pdfData);

  const pages = pdfDoc.getPages();
  const firstPage = pages[0];

  firstPage.drawText(name, {
    x: 300,
    y: 270,
    size: 58,
  });

  const pdfBytes = await pdfDoc.save();

  const certificatesPath = path.join(__dirname, "..", "certificates");
  await fs.mkdir(certificatesPath, { recursive: true });

  const filename = `certificate_${name}.pdf`;
  const outputPath = path.join(certificatesPath, filename);

  await fs.writeFile(outputPath, pdfBytes);

  // console.log("Done creating", outputPath);
  return outputPath;
};

module.exports = { generatePDF };