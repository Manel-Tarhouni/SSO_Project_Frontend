import { fetchWithAuth } from "./fetch-with-auth";

const API_BASE_URL = "http://localhost:5054/Permission";

export interface PermissionDto {
  id: string;
  name: string;
  description: string;
  code: string;
}

export interface CreatePermissionRequest {
  name: string;
  description?: string;
  code: string;
}

export async function fetchAllPermissions(): Promise<PermissionDto[]> {
  const response = await fetchWithAuth(`${API_BASE_URL}`, {
    method: "GET",
  });
  return response.json();
}

export async function fetchPermissionById(id: string): Promise<PermissionDto> {
  const response = await fetchWithAuth(`${API_BASE_URL}/${id}`, {
    method: "GET",
  });
  return response.json();
}

// Create a new permission
export async function createPermission(
  data: CreatePermissionRequest
): Promise<PermissionDto> {
  const response = await fetchWithAuth(`${API_BASE_URL}`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function updatePermission(
  permission: PermissionDto
): Promise<void> {
  await fetchWithAuth(`${API_BASE_URL}/${permission.id}`, {
    method: "PUT",
    body: JSON.stringify(permission),
  });
}

export async function deletePermission(id: string): Promise<void> {
  await fetchWithAuth(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
  });
}

export async function fetchUserPermissions(
  userId: string,
  organizationId: string
): Promise<PermissionDto[]> {
  const response = await fetchWithAuth(
    `${API_BASE_URL}/${userId}/AllpermissionsPerUserPerOrg/${organizationId}`,
    { method: "GET" }
  );
  return response.json();
}
export async function fetchPermissionsByRoleId(
  roleId: string
): Promise<PermissionDto[]> {
  const response = await fetchWithAuth(`${API_BASE_URL}/per-role/${roleId}`, {
    method: "GET",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to fetch permissions for the role.");
  }

  return response.json();
}
