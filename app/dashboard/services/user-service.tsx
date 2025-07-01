const API_BASE_URL = "http://localhost:5054/User";
import { fetchWithAuth } from "./fetch-with-auth";
interface LoginRequest {
  Email: string;
  password: string;
}
export interface UserSummary {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  //  provider: string;
}

interface RegisterRequest {
  email: string;
  firstname: string;
  lastname: string;
  password: string;
}
export interface LoginToOrganizationRequest {
  email: string;
  password: string;
  organizationId: string;
}
export interface UserOrgDetails {
  organizationId: string;
  organizationName: string;
  clientApps: string[];
  roles: string[];
}

export interface UserManagementSummary {
  id: string;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  organizationCount: number;
  roleCount: number;
  ClientAppCount: number;
  organizations: UserOrgDetails[];
}

export const registerUser = async (registerData: RegisterRequest) => {
  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(registerData),
    });

    const data = await response.json();

    if (!response.ok) {
      const message = data.message || "Erreur inconnue";
      const details = data.error || "Détails non disponibles";
      throw new Error(`${message}: ${details}`);
    }

    return data;
  } catch (error: any) {
    if (error instanceof Error) {
      throw new Error(error.message || "Erreur lors de l'inscription.");
    } else {
      throw new Error("Erreur inconnue lors de l'inscription.");
    }
  }
};

export const loginUser = async (loginData: LoginRequest) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(loginData),
    });

    const data = await response.json();

    if (!response.ok) {
      const message = data.Message || "Erreur de connexion.";
      throw new Error(message);
    }

    return data;
  } catch (error: any) {
    if (error instanceof Error) {
      throw new Error(error.message || "Erreur de requête.");
    } else {
      throw new Error("Une erreur inconnue s’est produite.");
    }
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/logout`, {
      method: "POST",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.Message || "Logout failed.");
    }

    localStorage.removeItem("accessToken");
  } catch (error: any) {
    if (error instanceof Error) {
      throw new Error(error.message || "An error occurred during logout.");
    } else {
      throw new Error("Unknown error during logout.");
    }
  }
};

export async function fetchCurrentUser() {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    throw new Error("No access token found");
  }

  const res = await fetch(`${API_BASE_URL}/CurrentUser`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch current user");
  }

  return res.json();
}

export const loginToOrganization = async (
  payload: LoginToOrganizationRequest
): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/LoginToOrg`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Failed to login to organization.");
    }

    const data = await response.json();
    return data.access_token;
  } catch (error: any) {
    throw new Error(
      error.message || "An error occurred during login to organization."
    );
  }
};
export async function fetchUsersByOrganization(
  organizationId: string
): Promise<UserSummary[]> {
  const response = await fetchWithAuth(
    `${API_BASE_URL}/users-per-organization/${organizationId}`,
    {
      method: "GET",
      credentials: "include", // cookies (if any)
      headers: { Accept: "application/json" },
    }
  );

  if (!response.ok) {
    let message = `${response.status} ${response.statusText}`;
    try {
      const err = await response.json();
      message = err?.message ?? message;
    } catch {}

    throw new Error(`Failed to load users: ${message}`);
  }

  return response.json() as Promise<UserSummary[]>;
}

export const fetchUserManagementSummaries = async (): Promise<
  UserManagementSummary[]
> => {
  const url = `${API_BASE_URL}/UserDetails`;

  const response = await fetchWithAuth(url, {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const { message, error } = await response.json().catch(() => ({}));
    throw new Error(message ?? error ?? "Error when trying to get users");
  }

  const data = (await response.json()) as UserManagementSummary[];
  return data;
};
export const removeUserFromOrganization = async (
  organizationId: string,
  userId: string
): Promise<void> => {
  await fetchWithAuth(
    `${API_BASE_URL}/organization/${organizationId}/user/${userId}`,
    {
      method: "DELETE",
    }
  );
};
export interface AssignUsersToRoleRequest {
  roleId: string;
  organizationId: string;
  userIds: string[];
}

export const assignUsersToRole = async (
  request: AssignUsersToRoleRequest
): Promise<string[]> => {
  const response = await fetchWithAuth(`${API_BASE_URL}/assign-role-to-users`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const { message } = await response.json().catch(() => ({
      message: "Failed to assign users to role.",
    }));
    throw new Error(message);
  }

  const data = await response.json();
  return data.assignedUserIds as string[];
};

export const fetchUsersByOrgAndRole = async (
  organizationId: string,
  roleId: string
): Promise<UserSummary[]> => {
  const response = await fetchWithAuth(
    `${API_BASE_URL}/organization/${organizationId}/role/${roleId}/usersPerRoleIdPerOrgId`,
    {
      method: "GET",
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch users: ${errorText}`);
  }

  return response.json();
};
