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
// services/role-service.ts
export interface PermissionDto {
  id: string; // Guid
  name: string;
  code: string;
  description: string;
}

export interface RoleWithPermissionsDto {
  id: string; // Guid
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
  const response = await fetchWithAuth(
    `${API_BASE_URL}/create-Role-PerOrg/${data.organizationId}`,
    {
      method: "POST",
      body: JSON.stringify({
        name: data.name,
        description: data.description,
        organizationId: data.organizationId, // optional here if backend doesn’t read it from body
      }),
    }
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return await response.text(); // "Role created successfully."
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
  permissionIds: string[],
  organizationId: string
) => {
  const response = await fetchWithAuth(
    `${API_BASE_URL}/${roleId}/assign-permissions-PerOrg/${organizationId}`,
    {
      method: "POST",
      body: JSON.stringify(permissionIds),
    }
  );

  return await response.text(); // "Permissions assigned successfully."
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
