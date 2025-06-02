const API_BASE_URL = "http://localhost:5054/Organization";

export interface CreateOrganizationRequest {
  name: string;
  logoFile?: File | null;
}

export interface AssignUserRequest {
  UserId: string;
  OrganizationId: string;
}

export interface AssignRoleRequest {
  UserId: string;
  OrganizationId: string;
  RoleName: string;
}
export interface AcceptInvitationRequest {
  token: string;
  password: string;
}

export interface CreateClientInOrganizationRequest {
  OrganizationId: string;
  ClientName: string;
  RedirectUri: string;
  Domain: string;
  AllowedScopes: string[];
  LogoFile: File;
  IsConfidential: boolean;
}
export interface OrgStats {
  organizationCount: number;
  applicationCount: number;
  userCount: number;
}
export interface AcceptInvitationRequest {
  token: string;
  password: string;
  confirmPassword: string; // ce champ ne sera pas envoyé au backend, seulement utilisé côté validation
}
export interface InvitationDetailsResponse {
  email: string;
  organizationName: string;
  inviterFullName: string;
}
export interface SendInvitationRequest {
  email: string;
  organizationId: string;
  invitedByUserId: string;
}
export const sendInvitation = async (
  payload: SendInvitationRequest
): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Failed to send invitation.");
    }
  } catch (error: any) {
    throw new Error(
      error.message || "An error occurred while sending the invitation."
    );
  }
};
export const getInvitationDetails = async (
  token: string
): Promise<InvitationDetailsResponse> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/details?token=${encodeURIComponent(token)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Failed to fetch invitation details.");
    }

    const data: InvitationDetailsResponse = await response.json();
    return data;
  } catch (error: any) {
    throw new Error(
      error.message || "An error occurred while fetching invitation details."
    );
  }
};

export const acceptInvitation = async (
  data: AcceptInvitationRequest
): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/accept`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // utile si tu veux que le cookie de session soit utilisé
      body: JSON.stringify({
        token: data.token,
        password: data.password,
        confirmPassword: data.confirmPassword,
      }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to accept invitation.");
    }

    return result.data; // le token JWT retourné dans le successResult
  } catch (error: any) {
    throw new Error(
      error.message || "An error occurred while accepting the invitation."
    );
  }
};

// Create Organization
export const createOrganization = async (data: CreateOrganizationRequest) => {
  try {
    const formData = new FormData();
    formData.append("name", data.name);
    if (data.logoFile) {
      formData.append("logoFile", data.logoFile);
    }

    const response = await fetch(`${API_BASE_URL}/create`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result?.message || "Failed to create organization.");
    }
    return result;
  } catch (error: any) {
    throw new Error(
      error?.message || "An error occurred while creating the organization."
    );
  }
};
export const fetchOrgStats = async (): Promise<OrgStats> => {
  try {
    const response = await fetch(`${API_BASE_URL}/stats`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch organization stats.");
    }

    return await response.json();
  } catch (error: any) {
    throw new Error(error.message || "Error fetching organization stats.");
  }
};
// Get All Organizations
export const fetchAllOrganizations = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/AllOrgs`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch organizations.");
    }

    return await response.json();
  } catch (error: any) {
    throw new Error(
      error?.message || "An error occurred while fetching organizations."
    );
  }
};

// Assign User to Organization
export const assignUserToOrganization = async (data: AssignUserRequest) => {
  try {
    const response = await fetch(`${API_BASE_URL}/assign-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(
        result?.message || "Failed to assign user to organization."
      );
    }
    return result;
  } catch (error: any) {
    throw new Error(
      error?.message ||
        "An error occurred while assigning user to organization."
    );
  }
};

// Assign Role to User in Organization
export const assignRoleToUser = async (data: AssignRoleRequest) => {
  try {
    const response = await fetch(`${API_BASE_URL}/assign-role`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result?.message || "Failed to assign role to user.");
    }
    return result;
  } catch (error: any) {
    throw new Error(
      error?.message || "An error occurred while assigning role to user."
    );
  }
};

export const createClientForOrganization = async (
  request: CreateClientInOrganizationRequest
) => {
  const formData = new FormData();
  formData.append("OrganizationId", request.OrganizationId);
  formData.append("IsConfidential", String(request.IsConfidential));
  formData.append("ClientName", request.ClientName);
  formData.append("RedirectUri", request.RedirectUri);
  formData.append("Domain", request.Domain);
  request.AllowedScopes.forEach((scope, index) => {
    formData.append(`AllowedScopes[${index}]`, scope);
  });
  formData.append("LogoFile", request.LogoFile);

  const res = await fetch(`${API_BASE_URL}/clients`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to create client.");
  return data;
};

// Get Clients for Organization
export const fetchClientsForOrganization = async (organizationId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${organizationId}/clients`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch clients for organization.");
    }

    return await response.json();
  } catch (error: any) {
    throw new Error(
      error?.message || "An error occurred while fetching clients."
    );
  }
};

// Delete Client from Organization
export const deleteClientFromOrganization = async (
  organizationId: string,
  clientId: string
) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/${organizationId}/clients/${clientId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result?.message || "Failed to delete client.");
    }
    return result;
  } catch (error: any) {
    throw new Error(
      error?.message || "An error occurred while deleting client."
    );
  }
};
