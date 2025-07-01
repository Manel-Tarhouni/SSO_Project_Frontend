"use client";

import type React from "react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import DeleteRoleDialog from "./delete-role-dialog";
import {
  getRoleDetailsById,
  RoleDetails,
  assignPermissionsToRole,
  deleteRole,
} from "../../../services/role-service";
import UsersTab from "./users-tab";
import PermissionTab from "./permissions-tab";
import { cn } from "@/lib/utils";

import {
  Settings,
  Shield,
  Users,
  Building,
  Info,
  Save,
  Edit3,
  Trash2,
  Plus,
  X,
  ArrowLeft,
  Home,
  ChevronRight,
  ChevronDown,
  Check,
} from "lucide-react";

import { toast } from "sonner";
import {
  fetchAllPermissions,
  PermissionDto,
  fetchPermissionsByRoleId,
} from "../../../services/permission-service";
import {
  getUnassignedItems,
  groupItemsByKey,
  toggleSelection,
} from "../../../../helpers/selection-utils";

interface Props {
  roleId: string;
}

export default function RoleDetailsPage() {
  const router = useRouter();
  const [availablePermissions, setAvailablePermissions] = useState<
    PermissionDto[]
  >([]);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const data = await fetchAllPermissions();
        setAvailablePermissions(data);
      } catch (error) {
        console.error("Failed to fetch permissions:", error);
      }
    };

    fetchPermissions();
  }, []);

  const searchParams = useSearchParams();
  const roleId = searchParams.get("roleId");
  /* ───────────────────────── state ───────────────────────── */
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<RoleDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [permissions, setPermissions] = useState<PermissionDto[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
  });
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>(
    []
  );

  const unassignedPermissions = getUnassignedItems(
    availablePermissions,
    permissions
  );

  const groupedUnassignedPermissions = groupItemsByKey(
    unassignedPermissions,
    (p) => p.code.split("_")[0]
  );

  const handlePermissionToggle = (id: string) => {
    setSelectedPermissionIds((prev) => toggleSelection(prev, id));
  };

  const handleAssignPermissions = async () => {
    if (!role || selectedPermissionIds.length === 0) return;

    try {
      await assignPermissionsToRole(role.id, selectedPermissionIds);
      const updatedRole = await getRoleDetailsById(role.id);
      setRole(updatedRole);
      setSelectedPermissionIds([]);
      setIsPopoverOpen(false);
      toast.success("Permissions successfully assigned to role.");
    } catch (err) {
      console.error("Error assigning permissions:", err);
      toast.error("Failed to assign permissions. Please try again.");
    }
  };

  /* ─────────────────────── data fetch ────────────────────── */
  useEffect(() => {
    const fetchData = async () => {
      if (!roleId) return;

      try {
        const data = await getRoleDetailsById(roleId);
        setRole(data);

        setForm({
          name: data.name,
          description: data.description,
        });
        const assignedPermissions = await fetchPermissionsByRoleId(roleId);
        setPermissions(assignedPermissions);
      } catch (err) {
        console.error("Failed to fetch role details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [roleId]);

  /* ───────────────────── helper callbacks ─────────────────── */
  const handleField =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSave = async () => {
    try {
      // TODO: API call to save role
      toast.success("Role updated successfully");
      setIsEditing(false);
      if (role) {
        setRole({ ...role, ...form });
      }
    } catch (error) {
      toast.error("Failed to update role");
    }
  };
  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteRole = async () => {
    if (!roleId) {
      toast.error("Invalid role ID");
      return;
    }

    try {
      await deleteRole(roleId);
      toast.success("Role deleted successfully.");
      setIsDeleteDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to delete role.");
    }
  };

  const handleRemovePermission = (permissionId: string) => {
    setPermissions((prev) => prev.filter((p) => p.id !== permissionId));
    toast.success("Permission removed");
  };

  const handleDelete = async () => {
    try {
      // TODO: API call to delete role
      toast.success("Role deleted successfully");
      // Navigate back to roles list
    } catch (error) {
      toast.error("Failed to delete role");
    }
  };

  const handleGoBack = () => {
    router.push("/dashboard/organization/roles");
  };

  /* ─────────────────────── rendering ──────────────────────── */
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading role details…</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!role) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center text-muted-foreground">
              <Info className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">Failed to load role details</p>
              <Button variant="outline" onClick={handleGoBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Home className="h-4 w-4" />
          <ChevronRight className="h-4 w-4" />
          <span>Roles</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">{role.name}</span>
        </div>

        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handleGoBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Roles
            </Button>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage alt={role.name} />
                <AvatarFallback className="bg-primary/10 text-primary text-lg">
                  {role.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold">{role.name}</h1>
                <p className="text-muted-foreground">{role.organizationName}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Role configuration and permissions management
                </p>
              </div>
            </div>
          </div>

          {!isEditing && (
            <Button onClick={() => setIsEditing(true)}>
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Role
            </Button>
          )}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="permissions"
              className="flex items-center gap-2"
            >
              <Shield className="h-4 w-4" />
              Permissions
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardContent className="p-6 space-y-8">
                {/* ───── role info ───── */}
                <SubHeading icon={<Info className="h-5 w-5" />}>
                  Role Information
                </SubHeading>

                <div className="grid md:grid-cols-3 gap-4">
                  <StatCard
                    icon={<Users className="h-6 w-6 text-blue-600" />}
                    value={role.userCount.toString()}
                    label="Assigned Users"
                  />
                  <StatCard
                    icon={<Shield className="h-6 w-6 text-green-600" />}
                    value={role.permissionCount.toString()}
                    label="Permissions"
                  />
                  <StatCard
                    icon={<Building className="h-6 w-6 text-purple-600" />}
                    value="1"
                    label="Organization"
                  />
                </div>

                <Separator />

                {/* ───── basic settings ───── */}
                <SubHeading icon={<Settings className="h-5 w-5" />}>
                  Basic Settings
                </SubHeading>

                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    label="Role Name"
                    value={form.name}
                    readOnly={!isEditing}
                    onChange={handleField("name")}
                  />
                </div>

                <FormField
                  label="Description"
                  value={form.description}
                  textarea
                  readOnly={!isEditing}
                  onChange={handleField("description")}
                  hint="Describe the role's responsibilities and scope"
                />

                <Separator />

                {/* ───── metadata ───── */}
                <SubHeading icon={<Info className="h-5 w-5" />}>
                  Metadata
                </SubHeading>

                <div className="grid md:grid-cols-2 gap-4">
                  <DetailRow
                    icon={<Info className="h-4 w-4" />}
                    label="Created"
                    value="N/A"
                  />
                  <DetailRow
                    icon={<Info className="h-4 w-4" />}
                    label="Last Updated"
                    value="N/A"
                  />
                </div>
              </CardContent>

              {/* ───── footer inside card (update) ───── */}
              {isEditing && (
                <div className="flex justify-end gap-2 border-t p-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setForm({
                        name: role.name,
                        description: role.description,
                      });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" /> Save Changes
                  </Button>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Permissions Tab 
          <TabsContent value="permissions" className="space-y-6">
            <Card>
              <CardContent className="p-6 space-y-6">
                <SubHeading icon={<Shield className="h-5 w-5" />}>
                  Role Permissions
                </SubHeading>

              
                <div className="flex gap-2">
                  <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                    <PopoverTrigger asChild>
                      <PopoverTrigger asChild>
                        <div
                          role="combobox"
                          aria-expanded={isPopoverOpen}
                          tabIndex={0}
                          onClick={() => setIsPopoverOpen(!isPopoverOpen)}
                          className={cn(
                            "flex-1 flex items-center justify-between rounded-md border px-3 py-2 text-sm bg-transparent min-h-[40px] cursor-pointer",
                            unassignedPermissions.length === 0 &&
                              "opacity-50 cursor-not-allowed"
                          )}
                        >
                          {selectedPermissionIds.length === 0 ? (
                            <span className="text-muted-foreground">
                              Select permissions
                            </span>
                          ) : (
                            <div className="flex flex-wrap gap-1">
                              {selectedPermissionIds.map((id) => {
                                const permission = availablePermissions.find(
                                  (p) => p.id === id
                                );
                                if (!permission) return null;
                                return (
                                  <Badge
                                    key={id}
                                    variant="secondary"
                                    className="flex items-center gap-1"
                                  >
                                    {permission.name}
                                    <span
                                      onClick={(e) => {
                                        e.stopPropagation(); // prevent popover toggle
                                        handlePermissionToggle(id);
                                      }}
                                      className="cursor-pointer text-muted-foreground hover:text-foreground"
                                    >
                                      <X className="w-3 h-3" />
                                    </span>
                                  </Badge>
                                );
                              })}
                            </div>
                          )}

                          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </div>
                      </PopoverTrigger>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Search permissions..." />
                        <CommandList>
                          <CommandEmpty>No permissions found.</CommandEmpty>
                          <ScrollArea className="h-[300px]">
                            {Object.entries(groupedUnassignedPermissions).map(
                              ([group, perms]) => (
                                <CommandGroup key={group} heading={group}>
                                  {perms.map((permission) => (
                                    <CommandItem
                                      key={permission.id}
                                      onSelect={() =>
                                        handlePermissionToggle(permission.id)
                                      }
                                      className="flex items-start gap-3 p-3"
                                    >
                                      <Checkbox
                                        checked={selectedPermissionIds.includes(
                                          permission.id
                                        )}
                                        onChange={() =>
                                          handlePermissionToggle(permission.id)
                                        }
                                        className="mt-0.5"
                                      />
                                      <div className="flex-1 space-y-1">
                                        <div className="flex items-center gap-2">
                                          <span className="font-medium">
                                            {permission.name}
                                          </span>
                                          <Badge
                                            variant="outline"
                                            className="text-xs"
                                          >
                                            {permission.code}
                                          </Badge>
                                        </div>
                                        {permission.description && (
                                          <p className="text-xs text-muted-foreground">
                                            {permission.description}
                                          </p>
                                        )}
                                      </div>
                                      {selectedPermissionIds.includes(
                                        permission.id
                                      ) && (
                                        <Check className="h-4 w-4 text-primary" />
                                      )}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              )
                            )}
                          </ScrollArea>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  <Button
                    onClick={handleAssignPermissions}
                    disabled={selectedPermissionIds.length === 0}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>

                <Separator />

              
                <div className="space-y-3">
                  {permissions.map((permission) => (
                    <div
                      key={permission.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-start gap-3">
                        <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">
                              {permission.name}
                            </span>
                          </div>
                          {permission.description && (
                            <p className="text-sm text-muted-foreground">
                              {permission.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemovePermission(permission.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  {permissions.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      <Shield className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg mb-2">No permissions assigned</p>
                      <p className="text-sm">
                        Add permissions to define what this role can do
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>*/}
          {role && role.id && <PermissionTab roleId={role.id} />}
          {role && role.organizationId && (
            <UsersTab organizationId={role.organizationId} roleId={role.id} />
          )}
        </Tabs>

        {/* Danger Zone */}
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <h4 className="font-medium text-destructive">Delete Role</h4>
              <p className="text-sm text-muted-foreground">
                This action cannot be undone. All users will lose this role and
                its permissions.
              </p>
            </div>
            <Button variant="destructive" onClick={handleDeleteClick}>
              <Trash2 className="h-4 w-4 mr-2" /> Delete Role
            </Button>
          </CardContent>
        </Card>
        <DeleteRoleDialog
          open={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDeleteRole}
        />
      </div>
    </div>
  );
}

/* ───────────────────────── helper sub-components ─────────────────────── */

function DetailRow({
  icon,
  label,
  value,
  mono = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-muted-foreground mt-1">{icon}</span>
      <div className="flex flex-col flex-1 min-w-0">
        <span className="text-sm font-medium text-muted-foreground">
          {label}
        </span>
        <span
          className={`text-sm ${
            mono ? "font-mono break-all" : ""
          } text-foreground`}
        >
          {value}
        </span>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="bg-primary/5 rounded-lg p-6 flex flex-col items-center justify-center text-center">
      {icon}
      <span className="text-3xl font-bold mt-3">{value}</span>
      <span className="text-sm text-muted-foreground mt-1">{label}</span>
    </div>
  );
}

function SubHeading({
  children,
  icon,
  className = "",
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {icon} <h4 className="text-lg font-medium">{children}</h4>
    </div>
  );
}

function FormField({
  label,
  value,
  onChange,
  readOnly = false,
  textarea = false,
  mono = false,
  hint,
}: {
  label: string;
  value: string;
  onChange?: (e: React.ChangeEvent<any>) => void;
  readOnly?: boolean;
  textarea?: boolean;
  mono?: boolean;
  hint?: string;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="relative">
        {textarea ? (
          <Textarea
            value={value}
            onChange={onChange}
            rows={3}
            readOnly={readOnly}
            className={`${readOnly ? "bg-muted/50" : ""} ${
              mono ? "font-mono" : ""
            }`}
          />
        ) : (
          <Input
            value={value}
            onChange={onChange}
            readOnly={readOnly}
            className={`${readOnly ? "bg-muted/50" : ""} ${
              mono ? "font-mono" : ""
            }`}
          />
        )}
      </div>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
