const express = require("express");
const pdfController = require("../controllers/certificate");

const router = express.Router();

router.get("/generate-pdf/:name", async (req, res) => {
  const { name } = req.params;
  const pdfPath = await pdfController.generatePDF(name);

  res.json({ pdfPath });
});

module.exports = router;