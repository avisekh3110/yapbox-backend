import * as z from "zod";
import { ParseStatus } from "zod/v3";

const Usersignin = z.object({
  email: z.string().email({ message: "Bad Email" }),
  password: z.string(),
});

export default Usersignin;
