import { z } from "zod";

// schema for basic info
export const basicInfoSchema = z.object({
  clientName: z.string().min(1, "Client name is required"),
  domain: z.string().url("Please enter a valid URL"),
  redirectUri: z.string().url("Please enter a valid Redirect URI"),
  isConfidential: z.boolean(),
  logoFile: z.instanceof(File).optional().nullable(),
});

// schema with allowedScopes
export const registerClientSchema = basicInfoSchema.extend({
  allowedScopes: z.array(z.string()).nonempty("At least one scope is required"),
});
