const API_BASE_URL = "http://localhost:5054/Role";
import { fetchWithAuth } from "./fetch-with-auth";
export interface CreateRoleRequest {
  name: string;
  description?: string;
  organizationId: string;
}

export interface AssignUserToRoleRequest {
  userId: string;
  roleId: string;
  organizationId: string;
}

export interface CreateRoleRequest {
  name: string;
  description?: string;
  organizationId: string;
}

export interface AssignUserToRoleRequest {
  userId: string;
  roleId: string;
  organizationId: string;
}
export interface Role {
  id: string;
  name: string;
  description?: string;
  organizationId?: string;
  organizationName?: string;
  permissionCount: number;
  userCount: number;
}
export interface RolesNamesIds {
  id: string;
  name: string;
}
export interface RoleDetails {
  id: string;
  name: string;
  description: string;
  organizationId: string | null;
  organizationName: string | null;
  permissionCount: number;
  userCount: number;
  permissions: PermissionDto[];
  users: UserSummary[];
}

export interface UserSummary {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface PermissionDto {
  id: string;
  name: string;
  code: string;
  description: string;
}

export interface RoleWithPermissionsDto {
  id: string;
  name: string;
  description: string;
  organizationId: string | null;
  organizationName: string | null;
  permissionCount: number;
  userCount: number;
  permissions: PermissionDto[];
}

export async function fetchRolesPerOrg(
  organizationId: string
): Promise<RoleWithPermissionsDto[]> {
  // 🔄 call the endpoint that includes permissions
  const res = await fetchWithAuth(
    `${API_BASE_URL}/${organizationId}/roles-with-permissions`
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? "Failed to fetch roles");
  }
  return res.json();
}
export const createRole = async (data: CreateRoleRequest) => {
  const response = await fetchWithAuth(`${API_BASE_URL}/create-Role-PerOrg`, {
    method: "POST",
    body: JSON.stringify({
      name: data.name,
      description: data.description,
      organizationId: data.organizationId,
    }),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return await response.text();
};

export const fetchAllRolesNameId = async (): Promise<RolesNamesIds[]> => {
  const response = await fetchWithAuth(`${API_BASE_URL}/allRolesNameId`);

  if (!response.ok) {
    throw new Error("Failed to fetch roles");
  }

  return await response.json();
};

export const assignPermissionsToRole = async (
  roleId: string,
  permissionIds: string[]
) => {
  const response = await fetchWithAuth(
    `${API_BASE_URL}/${roleId}/assign-permissions`,
    {
      method: "POST",
      body: JSON.stringify(permissionIds),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to assign permissions.");
  }

  return await response.text(); // Or just return `response` if you don't care about the response message
};

export const assignUserToRole = async (data: AssignUserToRoleRequest) => {
  const response = await fetchWithAuth(
    `${API_BASE_URL}/assign-user-PerOrg/${data.organizationId}`,
    {
      method: "POST",
      body: JSON.stringify({
        userId: data.userId,
        roleId: data.roleId,
        organizationId: data.organizationId,
      }),
    }
  );

  return await response.text(); // "User assigned to role successfully."
};
export const getRolesPerOrganization = async (
  organizationId: string
): Promise<Role[]> => {
  const response = await fetchWithAuth(
    `${API_BASE_URL}/AllRolesPerOrg/${organizationId}`,
    {
      method: "GET",
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch roles: ${response.statusText}`);
  }

  return await response.json();
};
export const getAllRoles = async (): Promise<Role[]> => {
  const response = await fetchWithAuth(`${API_BASE_URL}/AllRoles`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch roles: ${response.statusText}`);
  }

  const roles: Role[] = await response.json();
  return roles;
};
export const deleteRole = async (roleId: string): Promise<void> => {
  const response = await fetchWithAuth(`${API_BASE_URL}/${roleId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    // Try to parse error message from response body
    let errorMessage = "Failed to delete role.";
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      // ignore parse errors
    }
    throw new Error(errorMessage);
  }
};

export const getRoleDetailsById = async (
  roleId: string
): Promise<RoleDetails> => {
  const response = await fetchWithAuth(`${API_BASE_URL}/${roleId}/details`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch role details: ${response.statusText}`);
  }

  return await response.json();
};
export const removePermissionFromRole = async (
  roleId: string,
  permissionId: string
): Promise<string> => {
  const response = await fetchWithAuth(
    `${API_BASE_URL}/${roleId}/permissions/${permissionId}`,
    { method: "DELETE" }
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message ?? "Failed to remove permission from role.");
  }

  const data = (await response.json()) as { message: string };
  return data.message;
};

export const removeUserFromRole = async (
  roleId: string,
  organizationId: string,
  userId: string
): Promise<string> => {
  const response = await fetchWithAuth(
    `${API_BASE_URL}/${roleId}/organization/${organizationId}/users/${userId}`,
    { method: "DELETE" }
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message ?? "Failed to remove user from role.");
  }

  const data = (await response.json()) as { message: string };
  return data.message;
};
