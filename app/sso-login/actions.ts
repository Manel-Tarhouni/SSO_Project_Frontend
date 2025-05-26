"use server";

import { z } from "zod";
import { postAuthorize } from "../services/auth-service";

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

const loginSchema = z.object({
  Email: emailValidator,
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  client_id: z.string().min(1, { message: "Missing client_id" }),
  redirect_uri: z.string().url({ message: "Invalid redirect_uri" }),
  scope: z.string().min(1, "Scope is required"),
  Provider: z.literal("credentials"),
});

export type FieldErrors = {
  Email?: string[];
  password?: string[];
  client_id?: string[];
  redirect_uri?: string[];
  scope?: string[];
  Provider?: string[];
  IdToken?: string[];
};

export type LoginFormState = {
  success: boolean;
  errors: FieldErrors;
  formError?: string;
  redirectUrl?: string;
};

export async function handleSSOLogin(
  prevState: any,
  formData: FormData
): Promise<LoginFormState> {
  const raw = {
    Email: formData.get("Email")?.toString() ?? "",
    password: formData.get("password")?.toString() ?? "",
    client_id: formData.get("client_id")?.toString() ?? "",
    redirect_uri: formData.get("redirect_uri")?.toString() ?? "",
    scope: formData.get("scope")?.toString() ?? "",
    Provider: formData.get("Provider")?.toString() ?? "",
    IdToken: formData.get("IdToken")?.toString(),
  };

  const { Email, password, client_id, redirect_uri, scope, Provider, IdToken } =
    raw;

  if (Provider === "credentials") {
    const parsed = loginSchema.safeParse({
      Email,
      password,
      client_id,
      redirect_uri,
      scope,
      Provider,
    });

    if (!parsed.success) {
      return {
        success: false,
        errors: parsed.error.flatten().fieldErrors,
        formError: "Please fix the form errors and try again.",
      };
    }
  }

  try {
    let response;
    if (Provider === "Google") {
      response = await postAuthorize({
        client_id,
        redirect_uri,
        scope,
        Provider,
        IdToken,
      });
    } else {
      response = await postAuthorize({
        client_id,
        redirect_uri,
        scope,
        Provider,
        Email,
        password,
      });
    }

    const redirectUrl = new URL(redirect_uri);
    redirectUrl.searchParams.set("code", response.code);

    return {
      success: true,
      redirectUrl: redirectUrl.toString(),
      errors: {},
      formError: undefined,
    };
  } catch (err: any) {
    return {
      success: false,
      errors: {},
      formError: err.message ?? "Connection error",
    };
  }
}
