const API_BASE_URL = "http://localhost:5054/Invitation";
import { fetchWithAuth } from "./fetch-with-auth";
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

export interface AcceptInvitationRequest {
  token: string;
  password: string;
}
export enum InvitationStatus {
  Pending = "Pending",
  Accepted = "Accepted",
  Expired = "Expired",
}

export interface InvitationDto {
  id: string; // <-- add this
  email: string;
  organizationId: string;
  organizationName: string;
  invitedBy: string; // <-- add this
  sentAt: string;
  expiresAt: string; // <-- add this
  status: InvitationStatus;
}
/*
export const getAllInvitations = async (): Promise<InvitationDto[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/allInvitations`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Failed to fetch invitations.");
    }

    const invitations: InvitationDto[] = await response.json();
    return invitations;
  } catch (error: any) {
    throw new Error(
      error.message || "An error occurred while fetching invitations."
    );
  }
};
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
};*/
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
      credentials: "include",
      body: JSON.stringify({
        token: data.token,
        password: data.password,
      }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to accept invitation.");
    }

    return result.data;
  } catch (error: any) {
    throw new Error(
      error.message || "An error occurred while accepting the invitation."
    );
  }
};

export const getAllInvitations = async (): Promise<InvitationDto[]> => {
  const response = await fetchWithAuth(`${API_BASE_URL}/allInvitations`, {
    method: "GET",
  });
  return response.json();
};
export const sendInvitation = async (
  payload: SendInvitationRequest
): Promise<void> => {
  await fetchWithAuth(`${API_BASE_URL}/send`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}; /*
export const getInvitationDetails = async (
  token: string
): Promise<InvitationDetailsResponse> => {
  const response = await fetchWithAuth(
    `${API_BASE_URL}/details?token=${encodeURIComponent(token)}`,
    { method: "GET" }
  );
  return response.json();
};
export const acceptInvitation = async (
  data: AcceptInvitationRequest
): Promise<string> => {
  const response = await fetchWithAuth(`${API_BASE_URL}/accept`, {
    method: "POST",
    body: JSON.stringify({
      token: data.token,
      password: data.password,
    }),
  });

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.message || "Failed to accept invitation.");
  }

  return result.data;
};
*/
