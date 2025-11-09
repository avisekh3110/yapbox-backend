import express from "express";

const Router = express.Router();

Router.get("/", (req, res) => {
  res.send("<p>This is the server for <a>YAPBOX.VERCEL.APP</a><p>");
});

export default Router;
