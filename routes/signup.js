// routes/signup.js
import express from "express";

const router = express.Router();

router.post("/", (req, res) => {
  const { userName, email, password } = req.body;

  console.log("Signup request:", { userName, email });
  res.send({ userName, email });
});

export default router;
