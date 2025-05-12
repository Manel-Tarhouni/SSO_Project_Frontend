"use server";

import { postAuthorize } from "../services/auth-service";
import { z } from "zod";
const passwordRules = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[a-z]/, "Password must contain a lowercase letter")
  .regex(/[A-Z]/, "Password must contain an uppercase letter")
  .regex(/[0-9]/, "Password must contain a number")
  .regex(/^[\w@+.-]*$/, "Password contains unauthorized characters");

const emailValidator = z
  .string()
  .min(5, "Email is too short")
  .refine((val) => val.includes("@"), {
    message: "Email must contain @",
  })
  .refine((val) => val.includes("."), {
    message: "Email must contain a dot (.)",
  })
  .refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
    message: "Invalid email format",
  });

const ssoLoginSchema = z.object({
  Email: emailValidator,
  password: passwordRules,
  client_id: z.string().min(1, "Client ID is required"),
  redirect_uri: z.string().url("Invalid redirect URL"),
  scope: z.string().min(1, "Scope is required"),
});

export async function handleSSOLogin(prevState: any, formData: FormData) {
  const rawData = {
    Email: formData.get("Email"),
    password: formData.get("password"),
    client_id: formData.get("client_id"),
    redirect_uri: formData.get("redirect_uri"),
    scope: formData.get("scope"),
  };

  const parsed = ssoLoginSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { Email, password, client_id, redirect_uri, scope } = parsed.data;

  try {
    const response = await postAuthorize({
      Email,
      password,
      client_id,
      redirect_uri,
      scope,
    });
    const redirectUrl = new URL(redirect_uri);
    redirectUrl.searchParams.set("code", response.code);

    return {
      success: true,
      redirectUrl: redirectUrl.toString(),
    };
  } catch (err: any) {
    return {
      success: false,
      formError: err.message ?? "Connexion error",
    };
  }
}
