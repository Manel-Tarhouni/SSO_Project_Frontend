const API_URL = "http://localhost:5054/Client";

export interface ClientResponse {
  clientId: string;
  client_name: string;
  redirect_uri: string;
  domain: string;
  allowed_scopes: string[];
  logoUrl: string | null;
}

export interface RegisterClientRequest {
  isConfidential: boolean;
  clientName: string;
  redirectUri: string;
  allowedScopes: string[];
  domain: string;
  logoFile?: File | null;
}

const handleFetchError = async (response: Response) => {
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error_description || "Something went wrong.");
  }
  return response.json();
};

export const registerClient = async (
  request: RegisterClientRequest
): Promise<{ client_id: string }> => {
  const formData = new FormData();
  formData.append("IsConfidential", String(request.isConfidential));
  formData.append("ClientName", request.clientName);
  formData.append("RedirectUri", request.redirectUri);
  request.allowedScopes.forEach((scope) =>
    formData.append("AllowedScopes", scope)
  );
  formData.append("Domain", request.domain);
  if (request.logoFile) {
    formData.append("LogoFile", request.logoFile);
  }

  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  return await handleFetchError(response);
};

export const fetchAllClients = async (): Promise<ClientResponse[]> => {
  const response = await fetch(`${API_URL}/AllClients`, {
    method: "GET",
    credentials: "include",
  });

  return await handleFetchError(response);
};

export const fetchClientById = async (
  clientId: string
): Promise<ClientResponse> => {
  const response = await fetch(`${API_URL}/GetClientByClientId/${clientId}`, {
    method: "GET",
    credentials: "include",
  });

  const data = await handleFetchError(response);

  return {
    clientId: data.clientId,
    client_name: data.client_name,
    redirect_uri: data.redirect_Uri,
    domain: data.domain,
    allowed_scopes: data.allowed_Scopes,
    logoUrl: data.logoUrl ?? null,
  };
};
