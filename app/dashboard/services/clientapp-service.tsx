const API_BASE_URL = "http://localhost:5054/Client";
import { fetchWithAuth } from "./fetch-with-auth";

export interface ClientDetailsDto {
  client_name: string;
  isConfidential: boolean;
  redirect_Uri: string;
  clientId: string;
  organizationName: string;
  numberOfUsers: number;
}

export interface RegisterClientWithOrgRequest {
  organizationId: string;
  isConfidential: boolean;
  client_name: string;
  redirectUri: string;
  allowedScopes: string;
  domain: string;
  logoFile: File;
}

export const getClientDetails = async (): Promise<ClientDetailsDto[]> => {
  const response = await fetchWithAuth(`${API_BASE_URL}/Orgdetails`, {
    method: "GET",
  });
  return response.json();
};
export const registerClientWithOrg = async (
  payload: RegisterClientWithOrgRequest
): Promise<ClientDetailsDto> => {
  const formData = new FormData();
  formData.append("OrganizationId", payload.organizationId);
  formData.append("IsConfidential", String(payload.isConfidential));
  formData.append("Client_name", payload.client_name);
  formData.append("RedirectUri", payload.redirectUri);
  formData.append("AllowedScopes", payload.allowedScopes);
  formData.append("Domain", payload.domain);
  formData.append("LogoFile", payload.logoFile);

  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    throw new Error("Access token is missing. Please login first.");
  }

  const response = await fetch(`${API_BASE_URL}/register-with-org`, {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: "include",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Failed to register client`);
  }

  return response.json();
};
export interface ClientAppSummaryDto {
  clientId: string;
  clientName: string;
  isConfidential: boolean;
}

// 🔽 This is the function that calls your endpoint
export const fetchClientAppsByOrg = async (
  organizationId: string
): Promise<ClientAppSummaryDto[]> => {
  const response = await fetchWithAuth(
    `${API_BASE_URL}/apps-per-org/${organizationId}`
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message ?? "Failed to fetch client apps");
  }

  return response.json();
};
