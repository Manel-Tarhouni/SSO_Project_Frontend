"use server";

import { z } from "zod";
import { registerUser } from "../services/user-service";
const passwordRules = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[a-z]/, "Password must contain a lowercase letter")
  .regex(/[A-Z]/, "Password must contain an uppercase letter")
  .regex(/[0-9]/, "Password must contain a number")
  .regex(/^[\w@+.-]*$/, "Password contains unauthorized characters");

const emailValidator = z
  .string()
  .min(1, "Email is required")
  .refine((val) => val.includes("@"), {
    message: "Email must contain @",
  })
  .refine((val) => val.includes("."), {
    message: "Email must contain a dot (.)",
  })
  .refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
    message: "Invalid email format",
  });
const RegisterSchema = z.object({
  email: emailValidator,
  firstname: z.string().min(1, { message: "First name is required" }),
  lastname: z.string().min(1, { message: "Last name is required" }),
  password: passwordRules,
});

export type RegisterFormState = {
  errors?: Record<string, string[]>;
  message?: string;
};

export async function registerAction(
  prevState: RegisterFormState,
  formData: FormData
): Promise<RegisterFormState> {
  const parsed = RegisterSchema.safeParse({
    email: formData.get("email"),
    firstname: formData.get("firstname"),
    lastname: formData.get("lastname"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    return { errors };
  }

  try {
    await registerUser(parsed.data);
    return { message: "Registration successful!" };
  } catch (error: any) {
    return {
      message: error.message || "Error while signing up",
    };
  }
}
