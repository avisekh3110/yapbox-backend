// routes/signup.js
import express from "express";
import * as z from "zod";
import UserModel from "../db/schema/user.js";
import UserSignup from "../validation/signupValidate.js";

const router = express.Router();

router.post("/", (req, res) => {
  const { userName, email, password } = req.body;

  try {
    const validatedUser = UserSignup.parse({ userName, email, password });
    res.json({ user: validatedUser }); //!

    //save signup data into db
    const user = new UserModel(validatedUser);
    user
      .save()
      .then((res) => {
        //!
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    if (err instanceof z.ZodError) {
      console.log(err.message);
      return res.status(400).json({ errors: err.message });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
