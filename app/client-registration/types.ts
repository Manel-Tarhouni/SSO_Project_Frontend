export interface FormErrors {
  [key: string]: string | undefined;
}

export enum RegisterClientRoutes {
  BASIC_INFO = "/client-registration/basic-info",
  AUTH_SETUP = "/client-registration/authorization-setup",
}

export interface FormData {
  clientName: string;
  domain: string;
  logoFile: File | null;
  isConfidential: boolean;
  redirectUri: string;
  allowedScopes: string[];
}
