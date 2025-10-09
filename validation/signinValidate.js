import * as z from "zod";
import { ParseStatus } from "zod/v3";

const Usersignin = z.object({
  email: z.string().min(8).email({ message: "Bad Email" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

export default Usersignin;
