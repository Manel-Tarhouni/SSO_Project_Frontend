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
export interface OrganizationDropdownItem {
  id: string;
  name: string;
}
export const fetchOrganizationDropdownItems = async (): Promise<
  OrganizationDropdownItem[]
> => {
  const response = await fetch(`${API_BASE_URL}/allorgNameId`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Optional if your API needs cookies/session
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to fetch organizations.");
  }

  return response.json();
};

export const getOrganizationIdByName = async (
  name: string
): Promise<string | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/find-by-name/${name}`, {
      method: "GET",
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null; // Organization not found
      }
      const errorText = await response.text();
      throw new Error(errorText || "Failed to fetch organization.");
    }

    const data = await response.json();
    return data.orgId; // assuming the backend returns { orgId: "..." }
  } catch (error: any) {
    throw new Error(
      error.message || "An error occurred while fetching the organization."
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
/*
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
*/

export const fetchAllOrganizations = async () => {
  try {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      throw new Error("Access token is missing. Please login first.");
    }

    const response = await fetch(`${API_BASE_URL}/AllOrgs`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
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

/*
export interface Organization {
  orgId: string;
  displayName: string;
  createdAt: string; // ou Date si tu veux le convertir après
  logo: string | null;
  applicationsCount: number;
  userOrganizationsCount: number;
}

export const fetchAllOrganizations = async (): Promise<Organization[]> => {
  const token = localStorage.getItem("accessToken");
  const response = await fetch(`${API_BASE_URL}/AllOrgs`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to fetch organizations.");
  }

  return response.json();
};
*/
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
