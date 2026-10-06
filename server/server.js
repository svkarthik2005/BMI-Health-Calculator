const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.json({
    message: "BMI Health Calculator API is running!",
  });
});

// BMI API
app.post("/api/bmi", (req, res) => {
  const { height, weight } = req.body;

   if (
  height === undefined ||
  weight === undefined ||
  Number(height) <= 0 ||
  Number(weight) <= 0 ||
  isNaN(Number(height)) ||
  isNaN(Number(weight))
) {
  return res.status(400).json({
    error: "Please provide valid height and weight.",
  });
}

  const heightInMeters = Number(height) / 100;

  const bmi =
    Number(weight) / (heightInMeters * heightInMeters);

  const roundedBMI = Number(bmi.toFixed(2));

  let category;

  if (bmi < 18.5) {
    category = "Underweight";
  } else if (bmi < 25) {
    category = "Normal";
  } else if (bmi < 30) {
    category = "Overweight";
  } else {
    category = "Obesity";
  }

  res.json({
    height: Number(height),
    weight: Number(weight),
    bmi: roundedBMI,
    category: category,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`BMI backend running on http://localhost:${PORT}`);
});