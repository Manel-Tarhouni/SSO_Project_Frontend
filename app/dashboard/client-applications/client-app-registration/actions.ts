"use server";

import { cookies } from "next/headers";
import {
  registerClient,
  RegisterClientResponse,
} from "../../../services/client-service";
import { registerClientSchema } from "./schemas/clientRegistrationSchema";

export async function registerClientAction(prevState: any, formData: FormData) {
  const rawAllowedScopes = formData.get("allowedScopes")?.toString() ?? "";
  const allowedScopes = rawAllowedScopes
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s !== "");
  const rawData = {
    isConfidential: formData.get("isConfidential") === "true",
    clientName: formData.get("clientName")?.toString() ?? "",
    redirectUri: formData.get("redirectUri")?.toString() ?? "",
    domain: formData.get("domain")?.toString() ?? "",
    allowedScopes,
    logoFile: formData.get("logoFile") as File | null,
  };

  const parsed = registerClientSchema.safeParse(rawData);

  if (parsed.success) {
    const data = parsed.data;
  } else {
    console.error(parsed.error.format());
  }

  if (!parsed.success) {
    console.log("Validation Errors:", parsed.error.flatten().fieldErrors);
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  try {
    const data = await registerClient(parsed.data, cookieHeader);
    return { success: true, data };
  } catch (err: any) {
    return {
      success: false,
      errors: {
        allowedScopes: [],
        logoFile: [],
        isConfidential: [],
        clientName: [],
        redirectUri: [],
        domain: [],
      },
      formError: "Something went wrong",
    };
  }
}
