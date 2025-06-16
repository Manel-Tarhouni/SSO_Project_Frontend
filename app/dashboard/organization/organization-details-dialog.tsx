"use client";
import {
  fetchUsersByOrganization,
  UserSummary,
} from "../services/user-service";

import {
  fetchOrganizationDetailsPerOrg,
  OrganizationDetails,
} from "../services/organization-service";
import {
  fetchRolesPerOrg,
  RoleWithPermissionsDto,
} from "../services/role-service";
import {
  ClientAppSummaryDto,
  fetchClientAppsByOrg,
} from "../services/clientapp-service";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Settings,
  Globe,
  Users,
  AppWindow,
  Shield,
  Trash2,
  UserPlus,
  ChevronDown,
  ChevronRight,
  Info,
  Calendar,
  Lock,
  Key,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const mockSelectedOrg = {
  orgId: "org_123456",
  displayName: "Acme Corporation",
  logo: "",
  domain: "acme.com",
  status: "active",
  createdAt: new Date().toISOString(),
  userCount: 42,
  clientAppCount: 3,
  roleCount: 5,
};

const mockUsers = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@example.com",
    avatar: "",
    role: "Admin",
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob@example.com",
    avatar: "",
    role: "Member",
  },
];

// Enhanced roles with permissions
const mockRoles = [
  {
    id: 1,
    name: "Admin",
    description: "Full access to organization",
    permissions: [
      {
        name: "User Management",
        code: "users:manage",
        description: "Create, update, and delete users",
      },
      {
        name: "Role Management",
        code: "roles:manage",
        description: "Create, update, and delete roles",
      },
      {
        name: "Application Management",
        code: "apps:manage",
        description: "Manage client applications",
      },
    ],
  },
  {
    id: 2,
    name: "Viewer",
    description: "Read-only access",
    permissions: [
      {
        name: "User Viewing",
        code: "users:read",
        description: "View user information",
      },
      {
        name: "Role Viewing",
        code: "roles:read",
        description: "View role information",
      },
    ],
  },
];

const mockClientApps = [
  {
    id: 1,
    name: "HR Portal",
    description: "Manage employee records",
    isConfidential: true,
  },
  {
    id: 2,
    name: "Public Dashboard",
    description: "Public analytics dashboard",
    isConfidential: false,
  },
];

function getStatusBadge(status: string) {
  const map = {
    active: (
      <Badge className="bg-green-100 text-green-800 border-green-200">
        Active
      </Badge>
    ),
    inactive: (
      <Badge className="bg-red-100 text-red-800 border-red-200">Inactive</Badge>
    ),
  };
  return map[status as keyof typeof map] || <Badge>Unknown</Badge>;
}

type Props = {
  /** id coming from the table row */
  orgId: string | null;
  /** open state controlled by the parent */
  open: boolean;
  /** propagate close / open events back up */
  onOpenChange: (open: boolean) => void;
};

export default function OrgDetailsDialog({ orgId, open, onOpenChange }: Props) {
  const selectedOrg = mockSelectedOrg;
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userError, setUserError] = useState<string | null>(null);
  const [roles, setRoles] = useState<RoleWithPermissionsDto[]>([]);
  const [expandedRoles, setExpandedRoles] = useState<string[]>([]); // Guid → string
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [roleError, setRoleError] = useState<string | null>(null);
  const [clientApps, setClientApps] = useState<ClientAppSummaryDto[]>([]);
  const [loadingApps, setLoadingApps] = useState(false);
  const [appsError, setAppsError] = useState<string | null>(null);

  const [loadingOrg, setLoadingOrg] = useState(false);
  const [orgError, setOrgError] = useState<string | null>(null);
  const [orgDetails, setOrgDetails] = useState<OrganizationDetails | null>(
    null
  );

  const toggleRoleExpand = (roleId: string) => {
    setExpandedRoles((prev) =>
      prev.includes(roleId)
        ? prev.filter((id) => id !== roleId)
        : [...prev, roleId]
    );
  };

  useEffect(() => {
    if (!open || !orgId) return; // don’t fire when closed

    setLoadingUsers(true);
    fetchUsersByOrganization(orgId)
      .then(setUsers)
      .catch((err) => setUserError(err.message))
      .finally(() => setLoadingUsers(false));
  }, [open, orgId]);

  useEffect(() => {
    if (!open || !orgId) return;

    setLoadingRoles(true);
    fetchRolesPerOrg(orgId)
      .then(setRoles)
      .catch((err) => setRoleError(err.message))
      .finally(() => setLoadingRoles(false));
  }, [open, orgId]);
  useEffect(() => {
    if (!open || !orgId) return;

    setLoadingApps(true);
    fetchClientAppsByOrg(orgId)
      .then(setClientApps)
      .catch((err) => setAppsError(err.message))
      .finally(() => setLoadingApps(false));
  }, [open, orgId]);
  useEffect(() => {
    if (!open || !orgId) return;

    setLoadingOrg(true);
    fetchOrganizationDetailsPerOrg(orgId)
      .then(setOrgDetails)
      .catch((err) => setOrgError(err.message))
      .finally(() => setLoadingOrg(false));
  }, [open, orgId]);
  const headerOrg = orgDetails ?? selectedOrg;
  if (!open) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-4 border-b">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage alt={headerOrg.displayName} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {headerOrg.displayName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <DialogTitle className="text-xl">
              {headerOrg.displayName}
            </DialogTitle>
          </div>
        </DialogHeader>

        {selectedOrg && (
          <Tabs
            defaultValue="overview"
            className="w-full flex-1 flex flex-col overflow-hidden"
          >
            <TabsList className="grid w-full grid-cols-4 mb-4">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Users
              </TabsTrigger>
              <TabsTrigger value="roles" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Roles
              </TabsTrigger>
              <TabsTrigger
                value="applications"
                className="flex items-center gap-2"
              >
                <AppWindow className="h-4 w-4" />
                Apps
              </TabsTrigger>
            </TabsList>

            <ScrollArea className="flex-1">
              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6 p-1">
                {loadingOrg ? (
                  <p className="text-muted-foreground text-sm">
                    Loading organization details…
                  </p>
                ) : orgError ? (
                  <p className="text-red-500 text-sm">Error: {orgError}</p>
                ) : orgDetails ? (
                  <Card>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-lg font-medium">
                              Organization Details
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Basic information about this organization
                            </p>
                          </div>
                          <div className="space-y-3">
                            {/* Organization ID */}
                            <div className="flex items-start gap-2">
                              <Key className="h-4 w-4 text-muted-foreground mt-1" />
                              <div className="flex flex-col flex-1 min-w-0">
                                <span className="text-sm font-medium text-muted-foreground">
                                  Organization ID
                                </span>
                                <span className="font-mono text-xs text-wrap break-all text-foreground">
                                  {orgDetails.orgId}
                                </span>
                              </div>
                            </div>

                            {/* Created Date */}
                            <div className="flex items-start gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground mt-1" />
                              <div className="flex flex-col">
                                <span className="text-sm font-medium text-muted-foreground">
                                  Created
                                </span>
                                <span className="text-sm text-foreground">
                                  {new Date(
                                    orgDetails.createdAt
                                  ).toLocaleDateString(undefined, {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>{" "}
                        </div>

                        <div className="space-y-4">
                          <div>
                            <h3 className="text-lg font-medium">Statistics</h3>
                            <p className="text-sm text-muted-foreground">
                              Current organization metrics
                            </p>
                          </div>

                          <div className="grid grid-cols-3 gap-4">
                            <div className="bg-primary/5 rounded-lg p-4 flex flex-col items-center justify-center">
                              <Users className="h-6 w-6 text-primary mb-2" />
                              <span className="text-2xl font-bold">
                                {orgDetails.userCount}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                Users
                              </span>
                            </div>

                            <div className="bg-primary/5 rounded-lg p-4 flex flex-col items-center justify-center">
                              <AppWindow className="h-6 w-6 text-primary mb-2" />
                              <span className="text-2xl font-bold">
                                {orgDetails.clientAppCount}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                Applications
                              </span>
                            </div>

                            <div className="bg-primary/5 rounded-lg p-4 flex flex-col items-center justify-center">
                              <Shield className="h-6 w-6 text-primary mb-2" />
                              <span className="text-2xl font-bold">
                                {orgDetails.roleCount}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                Roles
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : null}

                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => onOpenChange(false)}>
                    Close
                  </Button>
                  <Button variant="default">
                    <Settings className="h-4 w-4 mr-2" />
                    Manage Settings
                  </Button>
                </div>
              </TabsContent>

              {/* Users Tab */}
              <TabsContent value="users" className="space-y-4 p-1">
                {/* header & “Assign Users” button unchanged */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium">Organization Users</h3>
                    <p className="text-sm text-muted-foreground">
                      Manage users within the organization
                    </p>
                  </div>
                  <Button size="sm">
                    <Users className="h-4 w-4 mr-2" />
                    Assign User
                  </Button>
                </div>
                <Card>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Provider</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {/* 1️⃣  Loading skeleton */}
                      {loadingUsers && (
                        <TableRow>
                          <TableCell colSpan={3} className="py-6">
                            <div className="animate-pulse h-4 bg-muted rounded w-1/2 mx-auto" />
                          </TableCell>
                        </TableRow>
                      )}

                      {/* 2️⃣  Error message */}
                      {userError && !loadingUsers && (
                        <TableRow>
                          <TableCell
                            colSpan={3}
                            className="text-center py-6 text-destructive"
                          >
                            {userError}
                          </TableCell>
                        </TableRow>
                      )}

                      {/* 3️⃣  Actual data */}
                      {users.map((u) => (
                        <TableRow key={u.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8">
                                {/* Put avatar url on u later if you have one */}
                                <AvatarFallback className="bg-primary/10 text-primary">
                                  {u.firstname[0]}
                                  {u.lastname[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">
                                  {u.firstname} {u.lastname}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {u.email}
                                </div>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell>
                            <Badge
                              variant="outline"
                              className="bg-primary/5 text-primary border-primary/20"
                            >
                              {u.provider}
                            </Badge>
                          </TableCell>

                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}

                      {/* 4️⃣  Empty state */}
                      {!loadingUsers && !userError && users.length === 0 && (
                        <TableRow>
                          <TableCell
                            colSpan={3}
                            className="text-center py-6 text-muted-foreground"
                          >
                            No users assigned to this organization
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </Card>
              </TabsContent>

              <TabsContent value="roles" className="space-y-4 p-1">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium">Organization Roles</h3>
                    <p className="text-sm text-muted-foreground">
                      Manage roles and their permissions
                    </p>
                  </div>
                  <Button size="sm">
                    <Shield className="h-4 w-4 mr-2" />
                    Assign Roles
                  </Button>
                </div>

                {loadingRoles ? (
                  <p className="text-sm text-muted-foreground">
                    Loading roles...
                  </p>
                ) : roleError ? (
                  <p className="text-sm text-red-500">Error: {roleError}</p>
                ) : roles.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No roles found for this organization.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {roles.map((role) => (
                      <Card key={role.id} className="overflow-hidden">
                        <Collapsible
                          open={expandedRoles.includes(role.id.toString())}
                          onOpenChange={() =>
                            toggleRoleExpand(role.id.toString())
                          }
                        >
                          <div
                            className="p-4 flex items-center justify-between bg-card hover:bg-accent/5 cursor-pointer"
                            onClick={() => toggleRoleExpand(role.id.toString())}
                          >
                            <div className="flex items-center gap-3">
                              <div className="bg-primary/10 p-2 rounded-full">
                                <Shield className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <h4 className="font-medium">{role.name}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {role.description}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className="bg-primary/5 border-primary/20"
                              >
                                {role.permissionCount} Permissions
                              </Badge>
                              <Badge
                                variant="secondary"
                                className="ml-1 text-xs"
                              >
                                {role.userCount} Users
                              </Badge>
                              <CollapsibleTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                >
                                  {expandedRoles.includes(
                                    role.id.toString()
                                  ) ? (
                                    <ChevronDown className="h-4 w-4" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4" />
                                  )}
                                </Button>
                              </CollapsibleTrigger>
                            </div>
                          </div>

                          <CollapsibleContent>
                            <Separator />
                            <div className="p-4 bg-muted/30">
                              <h5 className="text-sm font-medium mb-3 flex items-center gap-2">
                                <Lock className="h-4 w-4" />
                                Permissions
                              </h5>
                              {Array.isArray(role.permissions) &&
                              role.permissions.length > 0 ? (
                                <div className="space-y-3">
                                  {role.permissions.map((permission) => (
                                    <div
                                      key={permission.id}
                                      className="bg-background rounded-md p-3 border"
                                    >
                                      <div className="flex items-center justify-between">
                                        <div className="font-medium">
                                          {permission.name}
                                        </div>
                                        <Badge
                                          variant="outline"
                                          className="font-mono text-xs"
                                        >
                                          {permission.code}
                                        </Badge>
                                      </div>
                                      <p className="text-sm text-muted-foreground mt-1">
                                        {permission.description}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-muted-foreground">
                                  No permissions assigned to this role.
                                </p>
                              )}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Applications Tab */}
              <TabsContent value="applications" className="space-y-4 p-1">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium">Client Applications</h3>
                    <p className="text-sm text-muted-foreground">
                      Manage applications assigned to this organization
                    </p>
                  </div>
                  <Button size="sm">
                    <AppWindow className="h-4 w-4 mr-2" />
                    Assign Applications
                  </Button>
                </div>

                {loadingApps ? (
                  <p className="text-sm text-muted-foreground">
                    Loading applications…
                  </p>
                ) : appsError ? (
                  <p className="text-sm text-red-500">Error: {appsError}</p>
                ) : clientApps.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No applications assigned to this organization.
                  </p>
                ) : (
                  <Card>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Application</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {clientApps.map((app) => (
                          <TableRow key={app.clientId}>
                            <TableCell>
                              <div className="font-medium">
                                {app.clientName}
                              </div>
                            </TableCell>
                            <TableCell>
                              {app.isConfidential ? (
                                <Badge
                                  variant="outline"
                                  className="bg-blue-50 text-blue-800 border-blue-200"
                                >
                                  Confidential
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="bg-green-50 text-green-800 border-green-200"
                                >
                                  Public
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Card>
                )}
              </TabsContent>
            </ScrollArea>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
