export interface FormErrors {
  [key: string]: string | undefined;
}

export enum RegisterClientRoutes {
  BASIC_INFO = "/dashboard/client-applications/client-app-registration/basic-info",
  AUTH_SETUP = "/dashboard/client-applications/client-app-registration/authorization-setup",
}

export interface FormData {
  clientName: string;
  domain: string;
  logoFile: File | null;
  isConfidential: boolean;
  redirectUri: string;
  allowedScopes: string[];
}
