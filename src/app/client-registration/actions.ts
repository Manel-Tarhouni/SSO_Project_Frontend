"use server";

import { cookies } from "next/headers";
import {
  registerClient,
  RegisterClientResponse,
} from "../services/client-service";
import { z } from "zod";
import { registerClientSchema } from "./schemas/clientRegistrationSchema";

export async function registerClientAction(prevState: any, formData: FormData) {
  const rawData = {
    // isConfidential: formData.get("isConfidential")?.toString() ?? "",
    isConfidential: formData.get("isConfidential") === "true",
    clientName: formData.get("clientName")?.toString() ?? "",
    redirectUri: formData.get("redirectUri")?.toString() ?? "",
    domain: formData.get("domain")?.toString() ?? "",
    allowedScopes: formData.getAll("allowedScopes").map(String),
    //allowedScopes: Array.from(formData.getAll("allowedScopes") ?? []).map(String),
    logoFile: formData.get("logoFile") as File | null,
  };

  const parsed = registerClientSchema.safeParse(rawData);

  if (!parsed.success) {
    console.log("Validation Errors:", parsed.error.flatten().fieldErrors);
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const cookieStore = cookies();
  const cookieHeader = cookieStore.toString();
  //const session = cookies().get('YourCookieName')?.value;
  try {
    const data = await registerClient(parsed.data, cookieHeader);
    return { success: true, data };
  } catch (err: any) {
    return {
      success: false,
      errors: {},
      formError: err.message ?? "Something went wrong",
    };
  }
}
