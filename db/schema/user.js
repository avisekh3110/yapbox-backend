import { model, Schema } from "mongoose";

const userSchema = new Schema({
  userName: String,
  email: String,
  password: String,
});

const UserModel = new model("user", userSchema);

export default UserModel;
