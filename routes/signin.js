// routes/signup.js
import express from "express";
import Usersignin from "../validation/signinValidate.js";
import UserModel from "../db/schema/user.js";

//statefull auth
import { v4 as uuidv4 } from "uuid";
import { setUser } from "../services/auth.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { email, password } = req.body;

  const userQuery = Usersignin.safeParse({ email, password });
  //not valid
  if (!userQuery.success) {
    return res.status(400).json(userQuery.error.message);
  }
  //valid
  try {
    const user = await UserModel.findOne({ email: userQuery.data.email });

    // Early return if user not found
    if (!user) {
      return res.status(404).send("User not found");
    }

    //user found
    //passwordcheck
    if (password != user.password) {
      return res.status(401).send("Wrong Password");
    }

    const sessionId = uuidv4();
    const token = setUser(sessionId, {
      userName: user.userName,
      email: user.email,
    });
    res.cookie("uid", token, {
      httpOnly: false,
      secure: false, // true in production
      sameSite: "lax", // allow cross-site
      expires: new Date(Date.now() + 48 * 60 * 60 * 1000), // 1 day
    });
    return res.status(200).json({ username: user.userName, email: user.email });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});

export default router;
