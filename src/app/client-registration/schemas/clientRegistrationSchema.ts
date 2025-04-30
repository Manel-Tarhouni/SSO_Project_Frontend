import { z } from "zod";

export const basicInfoSchema = z.object({
  clientName: z.string().min(1, "Client name is required"),
  domain: z.string().url("Please enter a valid URL"),
  redirectUri: z.string().url("Please enter a valid Redirect URI"),
  isConfidential: z.boolean(),
  logoFile: z.instanceof(File).optional().nullable(),
  // logoFile: z.any().optional().nullable(),
});

export const registerClientSchema = basicInfoSchema.extend({
  allowedScopes: z
    .array(z.string())
    .min(1, "At least one allowed scope is required"),
});
