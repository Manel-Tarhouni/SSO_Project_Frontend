"use client";

import {
  OrganizationDetails,
  fetchOrganizationDetails,
  deleteOrganization,
} from "../services/organization-service";
import OrgDetailsDialog from "./organization-details-dialog";
import {
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Shield,
  UserPlus,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CreateOrganizationWrapper } from "./create-organization_wrapper";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Plus,
  Search,
  Building2,
  CheckCircle2,
  Users,
  AppWindow,
  Calendar,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeleteOrganizationDialog from "./delete-organization";
export default function OrganizationManagement() {
  const [organizations, setOrganizations] = useState<OrganizationDetails[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<OrganizationDetails | null>(
    null
  );
  const handleDeleteClick = (org: OrganizationDetails) => {
    setSelectedOrg(org);
    setIsDeleteDialogOpen(true);
  };

  const [orgForm, setOrgForm] = useState({
    displayName: "",
    domain: "",
  });

  // Fetch organizations from backend on mount
  useEffect(() => {
    const loadOrganizations = async () => {
      const orgs = await fetchOrganizationDetails();
      setOrganizations(orgs);
    };
    loadOrganizations();
  }, []);
  const handleDeleteOrg = async () => {
    if (!selectedOrg) return;

    try {
      await deleteOrganization(selectedOrg.orgId);

      // Remove the deleted org from the UI
      setOrganizations((prev) =>
        prev.filter((org) => org.orgId !== selectedOrg.orgId)
      );

      setSelectedOrg(null);
      setIsDeleteDialogOpen(false);
    } catch (error: any) {
      console.error("Failed to delete organization:", error.message);
      alert("Failed to delete organization: " + error.message);
    }
  };

  const filteredOrgs = organizations.filter((org) => {
    const matchesSearch = org.displayName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  const stats = {
    total: organizations.length,
    totalUsers: organizations.reduce((sum, org) => sum + org.userCount, 0),
    totalApps: organizations.reduce((sum, org) => sum + org.clientAppCount, 0),
    totalRoles: organizations.reduce((sum, org) => sum + org.roleCount, 0),
  };

  const handleCreateOrg = () => {
    const newOrg: OrganizationDetails = {
      orgId: `org-${Date.now()}`,
      displayName: orgForm.displayName,
      createdAt: new Date().toISOString(),
      userCount: 0,
      clientAppCount: 0,
      roleCount: 0,
    };

    setOrganizations([newOrg, ...organizations]);
    setOrgForm({ displayName: "", domain: "" });
    setIsCreateDialogOpen(false);
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            Organizations Management
          </h1>
          <p className="text-muted-foreground">
            Manage organizations and their users, roles, and applications
          </p>
        </div>
        <CreateOrganizationWrapper />
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex justify-between items-center pb-2">
            <CardTitle className="text-sm font-medium">
              Total Organizations
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Across the dashboard
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex justify-between items-center pb-2">
            <CardTitle className="text-sm font-medium">Total Roles</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRoles}</div>
            <p className="text-xs text-muted-foreground">
              Across all organizations
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex justify-between items-center pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalUsers.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all organizations
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex justify-between items-center pb-2">
            <CardTitle className="text-sm font-medium">
              Total Applications
            </CardTitle>
            <AppWindow className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalApps}</div>
            <p className="text-xs text-muted-foreground">Client applications</p>
          </CardContent>
        </Card>
      </div>

      {/* Search Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Organizations</CardTitle>
          <CardDescription>View and manage your organizations</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search organizations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border rounded-xl shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="text-sm font-semibold">
                    Organization
                  </TableHead>
                  <TableHead className="text-sm font-semibold">Users</TableHead>
                  <TableHead className="text-sm font-semibold">
                    Applications
                  </TableHead>
                  <TableHead className="text-sm font-semibold">Roles</TableHead>
                  <TableHead className="text-sm font-semibold">
                    Created
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrgs.map((org) => (
                  <TableRow
                    key={org.orgId}
                    className="hover:bg-muted/40 transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 ring-1 ring-muted">
                          <AvatarImage alt={org.displayName} />
                          <AvatarFallback>
                            {org.displayName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{org.displayName}</p>
                          <p className="text-xs text-muted-foreground">
                            ID: {org.orgId}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1 text-sm">
                        <Users className="h-3.5 w-3.5 text-muted-foreground" />
                        {org.userCount}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1 text-sm">
                        <AppWindow className="h-3.5 w-3.5 text-muted-foreground" />
                        {org.clientAppCount}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1 text-sm">
                        <Shield className="h-3.5 w-3.5 text-muted-foreground" />
                        {org.roleCount}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        {new Date(org.createdAt).toLocaleDateString()}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedOrgId(org.orgId); // ‑‑ hand over the id
                              setDetailsOpen(true); // ‑‑ show the dialog
                            }}
                          >
                            <Building2 className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>

                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Organization
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <UserPlus className="h-4 w-4 mr-2" />
                            Assign Users
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Shield className="h-4 w-4 mr-2" />
                            Assign Roles
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <AppWindow className="h-4 w-4 mr-2" />
                            Assign Applications
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />

                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteClick(org)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Organization
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredOrgs.length === 0 && (
              <div className="text-center py-8">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No organizations found
                </h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </div>
          <DeleteOrganizationDialog
            open={isDeleteDialogOpen}
            onClose={() => setIsDeleteDialogOpen(false)}
            onConfirm={handleDeleteOrg}
          />
          <OrgDetailsDialog
            orgId={selectedOrgId}
            open={detailsOpen}
            onOpenChange={(o) => setDetailsOpen(o)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
