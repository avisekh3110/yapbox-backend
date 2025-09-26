// routes/signup.js
import express from "express";
import Usersignin from "../validation/signinValidate.js";
import UserModel from "../db/schema/user.js";

const router = express.Router();

router.post("/", (req, res) => {
  const { email, password } = req.body;

  const userQuery = Usersignin.safeParse({ email, password });
  if (!userQuery.success) {
    res.status(400).json(userQuery.error.message);
  } else {
    res.status(200).json(userQuery.data.email);
    UserModel.findOne({ email: userQuery.data.email }).then((res) => {
      console.log("Found: ", res);
    });
  }
});

export default router;
