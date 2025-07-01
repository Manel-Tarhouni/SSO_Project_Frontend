"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAllRoles, Role } from "../../../services/role-service";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft } from "lucide-react";
import CreateRoleDialog from "./create-role-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  UserPlus,
  Settings,
  Check,
  Crown,
  BarChart3,
  Eye,
} from "lucide-react";

// Mock data
const mockOrganizations = [
  {
    id: "1",
    name: "Acme Corporation",
    slug: "acme-corp",
    logo: "/placeholder.svg?height=32&width=32",
    description: "Leading technology solutions provider",
  },
  {
    id: "2",
    name: "TechStart Inc",
    slug: "techstart",
    logo: "/placeholder.svg?height=32&width=32",
    description: "Innovative startup focused on AI solutions",
  },
  {
    id: "3",
    name: "Global Enterprises",
    slug: "global-ent",
    logo: "/placeholder.svg?height=32&width=32",
    description: "Multinational business solutions",
  },
];

const mockPermissions = [
  {
    id: "read:users",
    name: "Read Users",
    category: "User Management",
    description: "View user profiles and information",
    icon: Users,
    level: "read",
  },

  {
    id: "write:analytics",
    name: "Write Analytics",
    category: "Analytics & Reports",
    description: "Create custom reports",
    icon: BarChart3,
    level: "write",
  },
  {
    id: "admin:system",
    name: "System Admin",
    category: "System Administration",
    description: "Full system administration access",
    icon: Crown,
    level: "admin",
  },
];

const mockUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@acme.com",
    avatar: "/placeholder.svg?height=32&width=32",
    role: "Admin",
    status: "active",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@acme.com",
    avatar: "/placeholder.svg?height=32&width=32",
    role: "Editor",
    status: "active",
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
    users: ["1", "2"],
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
  },
  {
    id: "2",
    name: "Content Editor",
    description: "Can manage content and view user information",
    organizationId: "1",
    organizationName: "Acme Corporation",
    permissions: ["read:users", "write:users", "read:organizations"],
    users: ["3"],
    createdAt: "2024-01-20",
    updatedAt: "2024-01-25",
  },
];

export default function RolesManagement() {
  //  const [roles, setRoles] = useState(mockRoles);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  // Create role form state
  const [roleForm, setRoleForm] = useState({
    name: "",
    description: "",
    organizationId: "",
  });
  const [loading, setLoading] = useState(false);
  // Role detail state
  const [rolePermissions, setRolePermissions] = useState<string[]>([]);
  const [roleUsers, setRoleUsers] = useState<string[]>([]);
  const [permissionsOpen, setPermissionsOpen] = useState(false);
  const [usersOpen, setUsersOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedRoleData = selectedRole
    ? roles.find((r) => r.id === selectedRole)
    : null;
  /*
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
        permissions: [],
        users: [],
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
      };

      setRoles([newRole, ...roles]);
      setRoleForm({ name: "", description: "", organizationId: "" });
      setIsCreateDialogOpen(false);

      // Auto-select the new role for editing
      setSelectedRole(newRole.id);
      setRolePermissions([]);
      setRoleUsers([]);
    } catch (error) {
      console.error("Failed to create role:", error);
    } finally {
      setIsLoading(false);
    }
  };
*/
  // Fetch roles on mount
  useEffect(() => {
    setLoading(true);
    getAllRoles()
      .then((data) => {
        setRoles(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load roles");
        setLoading(false);
      });
  }, []);
  /*
  const handleDeleteRole = (roleId: string) => {
    setRoles(roles.filter((role) => role.id !== roleId));
    if (selectedRole === roleId) {
      setSelectedRole(null);
    }
  };

  const handlePermissionToggle = (permissionId: string) => {
    if (!selectedRole) return;

    const updatedPermissions = rolePermissions.includes(permissionId)
      ? rolePermissions.filter((p) => p !== permissionId)
      : [...rolePermissions, permissionId];

    setRolePermissions(updatedPermissions);

    // Update the role in the state
    setRoles(
      roles.map((role) =>
        role.id === selectedRole
          ? {
              ...role,
              permissions: updatedPermissions,
              updatedAt: new Date().toISOString().split("T")[0],
            }
          : role
      )
    );
  };*/

  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (role.description?.toLowerCase().includes(searchQuery.toLowerCase()) ??
        false)
  );

  // Handle role selection
  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
  };

  if (loading) return <div>Loading roles...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  const getPermissionsByCategory = () => {
    const categories: Record<string, typeof mockPermissions> = {};
    mockPermissions.forEach((permission) => {
      if (!categories[permission.category]) {
        categories[permission.category] = [];
      }
      categories[permission.category].push(permission);
    });
    return categories;
  };

  const getPermissionLevelColor = (level: string) => {
    switch (level) {
      case "read":
        return "bg-blue-100 text-blue-800";
      case "write":
        return "bg-green-100 text-green-800";
      case "delete":
        return "bg-red-100 text-red-800";
      case "admin":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Role Management</h1>
          <p className="text-muted-foreground">
            Create and manage roles with specific permissions for your
            organizations
          </p>
        </div>
        <CreateRoleDialog
          open={isCreateDialogOpen}
          setOpen={setIsCreateDialogOpen}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Roles List */}
        <div className="lg:col-span-1">
          <Card className="h-fit">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Roles</CardTitle>
              <CardDescription>
                Select a role to manage permissions and users
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search roles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-9"
                />
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredRoles.map((role) => (
                  <div
                    key={role.id}
                    onClick={() => handleRoleSelect(role.id)}
                    className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-sm ${
                      selectedRole === role.id
                        ? "border-blue-500 bg-blue-50 shadow-sm"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">{role.name}</h4>
                        {selectedRole === role.id && (
                          <Check className="h-4 w-4 text-blue-600" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {role.description}
                      </p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          {role.organizationName}
                        </span>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {role.permissionCount} permissions
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {role.userCount} users
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredRoles.length === 0 && (
                  <div className="text-center py-8">
                    <Shield className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No roles found
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Role Details */}
        <div className="lg:col-span-2">
          {selectedRoleData ? (
            <div className="space-y-6">
              {/* Role Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <h2 className="text-xl font-semibold">
                          {selectedRoleData.name}
                        </h2>
                        <Badge variant="outline">
                          {selectedRoleData.organizationName}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground">
                        {selectedRoleData.description}
                      </p>
                      {/* Role Header       <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>•</span>
                      </div>*/}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View Role
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Settings className="h-4 w-4 mr-2" />
                          Role Settings
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Role
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
              </Card>

              <Tabs defaultValue="permissions" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger
                    value="permissions"
                    className="flex items-center space-x-2"
                  >
                    <Key className="h-4 w-4" />
                    <span>Permissions</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="users"
                    className="flex items-center space-x-2"
                  >
                    <Users className="h-4 w-4" />
                    <span>Users</span>
                  </TabsTrigger>
                </TabsList>

                {/* Permissions Tab */}
                <TabsContent value="permissions">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">Permissions</CardTitle>
                          <CardDescription>
                            Manage what this role can access and perform (
                            {rolePermissions.length} selected)
                          </CardDescription>
                        </div>
                        <Popover
                          open={permissionsOpen}
                          onOpenChange={setPermissionsOpen}
                        >
                          <PopoverTrigger asChild>
                            <Button variant="outline">
                              <Plus className="h-4 w-4 mr-2" />
                              Add Permissions
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-96 p-0" align="end">
                            <Command>
                              <CommandInput placeholder="Search permissions..." />
                              <CommandList className="max-h-80">
                                <CommandEmpty>
                                  No permissions found.
                                </CommandEmpty>
                                {Object.entries(getPermissionsByCategory()).map(
                                  ([category, permissions]) => (
                                    <CommandGroup
                                      key={category}
                                      heading={category}
                                    >
                                      {permissions.map((permission) => {
                                        const Icon = permission.icon;
                                        return (
                                          <CommandItem
                                            key={permission.id}
                                            className="flex items-center space-x-3 p-3"
                                          >
                                            <Checkbox
                                              checked={rolePermissions.includes(
                                                permission.id
                                              )}
                                            />
                                            <div className="flex items-center space-x-2">
                                              <Icon className="h-4 w-4 text-muted-foreground" />
                                              <div className="flex-1">
                                                <div className="flex items-center space-x-2">
                                                  <span className="font-medium">
                                                    {permission.name}
                                                  </span>
                                                  <Badge
                                                    variant="outline"
                                                    className={`text-xs ${getPermissionLevelColor(
                                                      permission.level
                                                    )}`}
                                                  >
                                                    {permission.level}
                                                  </Badge>
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                  {permission.description}
                                                </div>
                                              </div>
                                            </div>
                                          </CommandItem>
                                        );
                                      })}
                                    </CommandGroup>
                                  )
                                )}
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {rolePermissions.length > 0 ? (
                        <div className="space-y-4">
                          {Object.entries(getPermissionsByCategory()).map(
                            ([category, permissions]) => {
                              const categoryPermissions = permissions.filter(
                                (p) => rolePermissions.includes(p.id)
                              );
                              if (categoryPermissions.length === 0) return null;

                              return (
                                <div key={category} className="space-y-2">
                                  <h4 className="text-sm font-medium text-muted-foreground">
                                    {category}
                                  </h4>
                                  <div className="grid gap-2">
                                    {categoryPermissions.map((permission) => {
                                      const Icon = permission.icon;
                                      return (
                                        <div
                                          key={permission.id}
                                          className="flex items-center justify-between p-3 border rounded-lg"
                                        >
                                          <div className="flex items-center space-x-3">
                                            <Icon className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                              <div className="flex items-center space-x-2">
                                                <span className="font-medium">
                                                  {permission.name}
                                                </span>
                                                <Badge
                                                  variant="outline"
                                                  className={`text-xs ${getPermissionLevelColor(
                                                    permission.level
                                                  )}`}
                                                >
                                                  {permission.level}
                                                </Badge>
                                              </div>
                                              <div className="text-sm text-muted-foreground">
                                                {permission.description}
                                              </div>
                                            </div>
                                          </div>
                                          <Button variant="ghost" size="sm">
                                            <X className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Key className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                          <h3 className="text-sm font-medium mb-1">
                            No permissions assigned
                          </h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Add permissions to define what this role can access
                          </p>
                          <Button
                            variant="outline"
                            onClick={() => setPermissionsOpen(true)}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add First Permission
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Users Tab */}
                <TabsContent value="users">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">Users</CardTitle>
                          <CardDescription>
                            Manage users assigned to this role (
                            {roleUsers.length} assigned)
                          </CardDescription>
                        </div>
                        <Popover open={usersOpen} onOpenChange={setUsersOpen}>
                          <PopoverTrigger asChild>
                            <Button variant="outline">
                              <UserPlus className="h-4 w-4 mr-2" />
                              Assign Users
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80 p-0" align="end">
                            <Command>
                              <CommandInput placeholder="Search users..." />
                              <CommandList className="max-h-60">
                                <CommandEmpty>No users found.</CommandEmpty>
                                <CommandGroup>
                                  {mockUsers.map((user) => (
                                    <CommandItem className="flex items-center space-x-3 p-3">
                                      <Checkbox
                                        checked={roleUsers.includes(user.id)}
                                      />
                                      <Avatar className="h-8 w-8">
                                        <AvatarImage
                                          src={
                                            user.avatar || "/placeholder.svg"
                                          }
                                          alt={user.name}
                                        />
                                        <AvatarFallback>
                                          {user.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div className="flex-1">
                                        <div className="font-medium">
                                          {user.name}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                          {user.email}
                                        </div>
                                      </div>
                                      <Badge
                                        variant={
                                          user.status === "active"
                                            ? "default"
                                            : "secondary"
                                        }
                                        className="text-xs"
                                      >
                                        {user.status}
                                      </Badge>
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {roleUsers.length > 0 ? (
                        <div className="space-y-2">
                          {roleUsers.map((userId) => {
                            const user = mockUsers.find((u) => u.id === userId);
                            if (!user) return null;

                            return (
                              <div
                                key={user.id}
                                className="flex items-center justify-between p-3 border rounded-lg"
                              >
                                <div className="flex items-center space-x-3">
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
                                    <div className="font-medium">
                                      {user.name}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      {user.email}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Badge
                                    variant={
                                      user.status === "active"
                                        ? "default"
                                        : "secondary"
                                    }
                                    className="text-xs"
                                  >
                                    {user.status}
                                  </Badge>
                                  <Button variant="ghost" size="sm">
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                          <h3 className="text-sm font-medium mb-1">
                            No users assigned
                          </h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Assign users to grant them this role's permissions
                          </p>
                          <Button
                            variant="outline"
                            onClick={() => setUsersOpen(true)}
                          >
                            <UserPlus className="h-4 w-4 mr-2" />
                            Assign First User
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <Card className="h-96 flex items-center justify-center">
              <div className="text-center space-y-2">
                <Shield className="h-12 w-12 text-muted-foreground mx-auto" />
                <h3 className="text-lg font-medium">Select a role to manage</h3>
                <p className="text-muted-foreground">
                  Choose a role from the list to view and edit its permissions
                  and users
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-2 mb-4">
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/organization/roles")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Overview
        </Button>
      </div>
    </div>
  );
}
