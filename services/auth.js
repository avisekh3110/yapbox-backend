// statefull

// const sessidTouserMap = new Map();

// export const setUser = (id, user) => {
//   sessidTouserMap.set(id, user);
// };

// export const getUser = (id) => {
//   return sessidTouserMap.get(id);
// };

// statelesss usign JWT

import jwt from "jsonwebtoken";
import { jwt_signature } from "../const.js";

export const setUser = (id, user) => {
  return jwt.sign(
    {
      id: id,
      userName: user.userName,
      email: user.email,
    },
    jwt_signature
  );
};

export const getUser = (token) => {
  if (!token) return null;
  return jwt.verify(token, jwt_signature);
};
