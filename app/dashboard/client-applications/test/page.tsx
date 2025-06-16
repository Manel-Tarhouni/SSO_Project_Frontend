"use client";

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
} from "lucide-react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

const mockRoles = [
  {
    id: 1,
    name: "Admin",
    description: "Full access to organization",
  },
  {
    id: 2,
    name: "Viewer",
    description: "Read-only access",
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

export default function OrgDetailsPage() {
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(true);
  const [isAssignUsersDialogOpen, setIsAssignUsersDialogOpen] = useState(false);
  const [isAssignRolesDialogOpen, setIsAssignRolesDialogOpen] = useState(false);
  const [isAssignAppsDialogOpen, setIsAssignAppsDialogOpen] = useState(false);

  const selectedOrg = mockSelectedOrg;

  return (
    <div>
      <Card>
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage
              src={selectedOrg.logo || "/placeholder.svg"}
              alt={selectedOrg.displayName}
            />
            <AvatarFallback className="text-lg">
              {selectedOrg.displayName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-xl font-semibold">{selectedOrg.displayName}</h3>
            <div className="flex items-center space-x-2 mt-1">
              {getStatusBadge(selectedOrg.status)}
              <Badge
                variant="outline"
                className="bg-blue-50 text-blue-800 border-blue-200"
              >
                <Globe className="h-3 w-3 mr-1" />
                {selectedOrg.domain}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Organization ID
            </p>
            <p className="font-mono text-sm">{selectedOrg.orgId}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Created</p>
            <p className="text-sm">
              {new Date(selectedOrg.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Users</p>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{selectedOrg.userCount}</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Applications
            </p>
            <div className="flex items-center space-x-2">
              <AppWindow className="h-4 w-4 text-muted-foreground" />
              <span>{selectedOrg.clientAppCount}</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Roles</p>
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span>{selectedOrg.roleCount}</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Status</p>
            <div>{getStatusBadge(selectedOrg.status)}</div>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t mt-6">
          <Button variant="default">
            <Settings className="h-4 w-4 mr-2" />
            Manage Settings
          </Button>
        </div>
      </Card>
      {selectedOrg && (
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="roles">Roles</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Users</h3>
              <Button
                size="sm"
                onClick={() => {
                  setIsDetailsDialogOpen(false);
                  setIsAssignUsersDialogOpen(true);
                }}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Assign Users
              </Button>
            </div>

            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
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
                            <div className="font-medium">{user.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Roles Tab */}
          <TabsContent value="roles" className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Roles</h3>
              <Button
                size="sm"
                onClick={() => {
                  setIsDetailsDialogOpen(false);
                  setIsAssignRolesDialogOpen(true);
                }}
              >
                <Shield className="h-4 w-4 mr-2" />
                Assign Roles
              </Button>
            </div>

            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockRoles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell>
                        <div className="font-medium">{role.name}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {role.description}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications" className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Applications</h3>
              <Button
                size="sm"
                onClick={() => {
                  setIsDetailsDialogOpen(false);
                  setIsAssignAppsDialogOpen(true);
                }}
              >
                <AppWindow className="h-4 w-4 mr-2" />
                Assign Applications
              </Button>
            </div>

            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Application</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockClientApps.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{app.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {app.description}
                          </div>
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
                          <Badge variant="outline">Public</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
