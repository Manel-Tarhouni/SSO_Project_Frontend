const API_BASE_URL = "http://localhost:5054/User";

export interface BlockUserRequest {
  value?: number;
  unit?: "minutes" | "hours" | "days";
}

export const blockUser = async (
  userId: string,
  blockData: BlockUserRequest,
  cookieHeader?: string
) => {
  try {
    const response = await fetch(`${API_BASE_URL}/block/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
      credentials: "include",
      body: JSON.stringify(blockData),
    });

    const data = await response.text();

    if (!response.ok) {
      throw new Error(data || "Failed to block user.");
    }

    return data;
  } catch (error: any) {
    throw new Error(
      error?.message || "An error occurred while blocking the user."
    );
  }
};

export const unblockUser = async (userId: string, cookieHeader?: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/unblock/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
      credentials: "include",
    });

    const data = await response.text();

    if (!response.ok) {
      throw new Error(data || "Failed to unblock user.");
    }

    return data;
  } catch (error: any) {
    throw new Error(
      error?.message || "An error occurred while unblocking the user."
    );
  }
};
export const deleteUser = async (userId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/delete/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const data = await response.json();
    if (!response.ok) {
      const message = data.Message || "Failed to delete user.";
      const error = data.Error || "";
      throw new Error(`${message} ${error}`);
    }

    return data;
  } catch (error: any) {
    throw new Error(
      error?.message || "Unknown error occurred while deleting user."
    );
  }
};

export async function fetchUsers(
  email?: string,
  provider?: string,
  name?: string
) {
  const res = await fetch(
    `${API_BASE_URL}/all?email=${email ?? ""}&provider=${provider ?? ""}&name=${
      name ?? ""
    }`,
    {
      cache: "no-store",
      next: { revalidate: 0 },
    }
  );

  if (!res.ok) throw new Error("Failed to fetch users");

  const rawUsers = await res.json();

  return rawUsers.map((user: any) => ({
    id: user.id,
    email: user.email,
    provider: user.provider || "Unknown",
    loginCount: user.loginCount ?? 0,
    firstname: user.firstname,
    lastname: user.lastname,
    lockoutEnabled: user.lockoutEnabled,
  }));
}
