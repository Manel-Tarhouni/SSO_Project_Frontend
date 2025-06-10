"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Shield,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Users,
  Building2,
  Key,
  X,
  ChevronDown,
  UserPlus,
  Settings,
} from "lucide-react";
import { useRouter } from "next/navigation";
// Mock data
const mockOrganizations = [
  {
    id: "1",
    name: "Acme Corporation",
    slug: "acme-corp",
    logo: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "2",
    name: "TechStart Inc",
    slug: "techstart",
    logo: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "3",
    name: "Global Enterprises",
    slug: "global-ent",
    logo: "/placeholder.svg?height=32&width=32",
  },
];

const mockPermissions = [
  {
    id: "read:users",
    name: "Read Users",
    category: "User Management",
    description: "View user profiles and information",
  },
  {
    id: "write:users",
    name: "Write Users",
    category: "User Management",
    description: "Create and edit user accounts",
  },
  {
    id: "delete:users",
    name: "Delete Users",
    category: "User Management",
    description: "Remove user accounts",
  },
  {
    id: "read:organizations",
    name: "Read Organizations",
    category: "Organization Management",
    description: "View organization details",
  },
  {
    id: "write:organizations",
    name: "Write Organizations",
    category: "Organization Management",
    description: "Create and edit organizations",
  },
  {
    id: "delete:organizations",
    name: "Delete Organizations",
    category: "Organization Management",
    description: "Remove organizations",
  },
  {
    id: "read:roles",
    name: "Read Roles",
    category: "Role Management",
    description: "View roles and permissions",
  },
  {
    id: "write:roles",
    name: "Write Roles",
    category: "Role Management",
    description: "Create and edit roles",
  },
  {
    id: "delete:roles",
    name: "Delete Roles",
    category: "Role Management",
    description: "Remove roles",
  },
  {
    id: "read:analytics",
    name: "Read Analytics",
    category: "Analytics",
    description: "View analytics and reports",
  },
  {
    id: "write:analytics",
    name: "Write Analytics",
    category: "Analytics",
    description: "Create custom reports",
  },
  {
    id: "admin:system",
    name: "System Admin",
    category: "System",
    description: "Full system administration access",
  },
];

const mockUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@acme.com",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@acme.com",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "3",
    name: "Bob Wilson",
    email: "bob.wilson@acme.com",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "4",
    name: "Alice Johnson",
    email: "alice.johnson@acme.com",
    avatar: "/placeholder.svg?height=32&width=32",
  },
];

const mockRoles = [
  {
    id: "1",
    name: "Organization Admin",
    description:
      "Full administrative access to organization settings and users",
    organizationId: "1",
    organizationName: "Acme Corporation",
    permissions: [
      "read:users",
      "write:users",
      "delete:users",
      "read:organizations",
      "write:organizations",
    ],
    userCount: 3,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Content Editor",
    description: "Can manage content and view user information",
    organizationId: "1",
    organizationName: "Acme Corporation",
    permissions: ["read:users", "write:users", "read:organizations"],
    userCount: 8,
    createdAt: "2024-01-20",
  },
  {
    id: "3",
    name: "Analytics Viewer",
    description: "Read-only access to analytics and reports",
    organizationId: "2",
    organizationName: "TechStart Inc",
    permissions: ["read:analytics", "read:users"],
    userCount: 5,
    createdAt: "2024-01-25",
  },
];

export default function RoleManagementPage() {
  const router = useRouter();

  const [roles, setRoles] = useState(mockRoles);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isAssignUsersDialogOpen, setIsAssignUsersDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [permissionsOpen, setPermissionsOpen] = useState(false);

  // Create role form state
  const [roleForm, setRoleForm] = useState({
    name: "",
    description: "",
    organizationId: "",
    permissions: [] as string[],
  });

  // User assignment state
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.organizationName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateRole = async () => {
    if (!roleForm.name || !roleForm.organizationId) return;

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const selectedOrg = mockOrganizations.find(
        (org) => org.id === roleForm.organizationId
      );
      const newRole = {
        id: Date.now().toString(),
        name: roleForm.name,
        description: roleForm.description,
        organizationId: roleForm.organizationId,
        organizationName: selectedOrg?.name || "",
        permissions: roleForm.permissions,
        userCount: 0,
        createdAt: new Date().toISOString().split("T")[0],
      };

      setRoles([newRole, ...roles]);
      setRoleForm({
        name: "",
        description: "",
        organizationId: "",
        permissions: [],
      });
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error("Failed to create role:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRole = (roleId: string) => {
    setRoles(roles.filter((role) => role.id !== roleId));
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Role Management</h1>
          <p className="text-muted-foreground">
            Create and manage roles with specific permissions for your
            organizations
          </p>
        </div>
        <Button
          onClick={() =>
            router.push("/dashboard/organization/roles/create-role")
          }
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Role
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Roles</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roles.length}</div>
            <p className="text-xs text-muted-foreground">
              Across all organizations
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Organizations</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockOrganizations.length}</div>
            <p className="text-xs text-muted-foreground">
              With role assignments
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Permissions</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockPermissions.length}</div>
            <p className="text-xs text-muted-foreground">
              Available permissions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Assigned Users
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {roles.reduce((sum, role) => sum + role.userCount, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total role assignments
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Roles Management */}
      <Card>
        <CardHeader>
          <CardTitle>Roles</CardTitle>
          <CardDescription>
            Manage roles and their permissions across organizations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="flex items-center space-x-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search roles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Roles Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role</TableHead>
                  <TableHead>Organization</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRoles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{role.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {role.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={
                              mockOrganizations.find(
                                (org) => org.id === role.organizationId
                              )?.logo ||
                              "/placeholder.svg" ||
                              "/placeholder.svg"
                            }
                            alt={role.organizationName}
                          />
                          <AvatarFallback>
                            {role.organizationName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">
                          {role.organizationName}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {role.permissions.slice(0, 2).map((permissionId) => {
                          const permission = mockPermissions.find(
                            (p) => p.id === permissionId
                          );
                          return (
                            <Badge
                              key={permissionId}
                              variant="outline"
                              className="text-xs"
                            >
                              {permission?.name}
                            </Badge>
                          );
                        })}
                        {role.permissions.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{role.permissions.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{role.userCount}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(role.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Role
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedRole(role.id);
                              setIsAssignUsersDialogOpen(true);
                            }}
                          >
                            <UserPlus className="h-4 w-4 mr-2" />
                            Assign Users
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Settings className="h-4 w-4 mr-2" />
                            Manage Permissions
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteRole(role.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Role
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredRoles.length === 0 && (
              <div className="text-center py-8">
                <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No roles found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery
                    ? "Try adjusting your search"
                    : "Create your first role to get started"}
                </p>
                {!searchQuery && (
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Role
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Assign Users Dialog */}
      <Dialog
        open={isAssignUsersDialogOpen}
        onOpenChange={setIsAssignUsersDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Assign Users to Role</DialogTitle>
            <DialogDescription>
              Select users to assign to the{" "}
              {selectedRole
                ? roles.find((r) => r.id === selectedRole)?.name
                : ""}{" "}
              role.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search users..." className="pl-10" />
            </div>
            <div className="max-h-60 overflow-y-auto space-y-2">
              {mockUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center space-x-3 p-2 border rounded-lg"
                >
                  <Checkbox
                    checked={selectedUsers.includes(user.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedUsers([...selectedUsers, user.id]);
                      } else {
                        setSelectedUsers(
                          selectedUsers.filter((id) => id !== user.id)
                        );
                      }
                    }}
                  />
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user.avatar || "/placeholder.svg"}
                      alt={user.name}
                    />
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {user.email}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAssignUsersDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={() => setIsAssignUsersDialogOpen(false)}>
              Assign {selectedUsers.length} User
              {selectedUsers.length !== 1 ? "s" : ""}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
