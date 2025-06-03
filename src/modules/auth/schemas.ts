import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(63, { message: "Username must be less than 63 characters" })
    .regex(/^[a-z0-9][a-z0-9-]*[a-z0-9]$/, {
      message:
        "Username must start and end with a letter or number, and can only contain letters, numbers, and dashes.",
    })
    .refine((val) => !val?.includes("--"), {
      message: "Username cannot contain consecutive dashes.",
    })
    .transform((val) => val.toLowerCase()),
  password: z.string().min(6).max(100),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(100),
});
