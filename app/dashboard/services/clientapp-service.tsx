const API_BASE_URL = "http://localhost:5054/Client";
import { fetchWithAuth } from "./fetch-with-auth";

export interface ClientDetailsDto {
  id: string;
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
export interface ClientFullDetailsDto {
  id: string;
  clientId: string;
  clientSecret: string | null;
  clientName: string;
  redirectUri: string;
  scopes: string[];
  numberOfUsers: number;
  organizationName: string | null;
}
export const fetchClientFullDetails = async (
  id: string
): Promise<ClientFullDetailsDto> => {
  const res = await fetchWithAuth(`${API_BASE_URL}/${id}/client-details`);

  if (!res.ok) {
    const err = await res.text().catch(() => "");
    throw new Error(err || "Failed to fetch client details");
  }

  return res.json();
};
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
  id: string;
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

export const deleteClientApp = async (id: string): Promise<void> => {
  await fetchWithAuth(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
  });
};
export const deleteClientFromOrg = async (
  organizationId: string,
  clientId: string
): Promise<void> => {
  await fetchWithAuth(`${API_BASE_URL}/${organizationId}/${clientId}`, {
    method: "DELETE",
  });
};
