import express from "express";
import { getUser, setUser } from "../services/auth.js";
import UserModel from "../db/schema/user.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { uid } = req.cookies;
    console.log(uid);
    if (!uid) return res.status(401).send("No session token");

    const sessionUser = getUser(uid);
    console.log(sessionUser);
    if (!sessionUser) return res.status(401).send("Invalid or expired token");

    const { userName, email } = sessionUser;
    console.log({ userName, email });

    const user = await UserModel.findOne({ userName: userName, email: email });
    console.log(user);
    if (!user) {
      return res.status(400).send("User not found");
    }
    const sessionId = req?.cookies?.uid;
    setUser(sessionId, { userName: user.userName, email: user.email });
    res.cookie("uid", sessionId, {
      httpOnly: false,
      secure: false, // true in production
      sameSite: "lax", // allow cross-site
      expires: new Date(Date.now() + 48 * 60 * 60 * 1000), // 1 day
    });
    console.log(user);
    console.log({ username: user.userName, email: user.email });
    return res.status(200).json({ username: user.userName, email: user.email });
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: "User not Found", error: err });
  }
});

export default router;
