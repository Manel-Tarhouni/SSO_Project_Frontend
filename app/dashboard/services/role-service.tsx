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

/*
export const createRole = async (data: CreateRoleRequest) => {
  const response = await fetchWithAuth(`${API_BASE_URL}/create`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  return await response.text(); // "Role created successfully."
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

  return await response.text(); // "Permissions assigned successfully."
};

export const assignUserToRole = async (data: AssignUserToRoleRequest) => {
  const response = await fetchWithAuth(`${API_BASE_URL}/assign-user`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  return await response.text(); // "User assigned to role successfully."
};
*/
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
