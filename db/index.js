import { connect } from "mongoose";
import { db_password, db_username } from "../const.js";

export default async function connectToDB() {
  console.log("connecting to Database...");
  try {
    await connect(
      `mongodb+srv://${db_username}:${db_password}@cluster0.cchkyn4.mongodb.net/`
    );
  } catch (e) {
    console.log("Error connecting to db", e);
    throw e; //connected to db prints even if the connectio is failed
  }
}
