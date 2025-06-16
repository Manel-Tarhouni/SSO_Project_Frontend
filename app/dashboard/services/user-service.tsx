const API_BASE_URL = "http://localhost:5054/User";
import { fetchWithAuth } from "./fetch-with-auth";
interface LoginRequest {
  Email: string;
  password: string;
}
// services/user-service.ts
export interface UserSummary {
  id: string; // Guid as string
  email: string;
  firstname: string;
  lastname: string;
  provider: string; // "local" | "Google" | ...
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
  organizationId: string; // or Guid if using a Guid type package
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

    // Optionally clear token or localStorage here if you store tokens
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
  /** optional abort controller, timeout, etc. */
): Promise<UserSummary[]> {
  // we rely on your existing wrapper so cookies / JWT go with the request
  const response = await fetchWithAuth(
    `${API_BASE_URL}/users-per-organization/${organizationId}`,
    {
      method: "GET",
      credentials: "include", // cookies (if any)
      headers: { Accept: "application/json" },
    }
  );

  // If you keep fetchWithAuth slim, still check .ok here
  if (!response.ok) {
    // Try to parse error payload if the API returns {message, …}
    let message = `${response.status} ${response.statusText}`;
    try {
      const err = await response.json();
      message = err?.message ?? message;
    } catch {
      /* body not JSON – keep default */
    }

    throw new Error(`Failed to load users: ${message}`);
  }

  return response.json() as Promise<UserSummary[]>;
}
