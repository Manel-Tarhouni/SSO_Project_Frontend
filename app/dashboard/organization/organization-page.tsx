"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Users,
  Settings,
  Trash2,
  Edit,
  Eye,
  Calendar,
  Globe,
  MoreHorizontal,
  Building2,
} from "lucide-react";
import {
  fetchAllOrganizations,
  fetchOrgStats,
  OrgStats,
} from "../services/organization-service";
import { CreateOrganizationWrapper } from "./create-organization_wrapper";
type Organization = {
  orgId: string;
  displayName: string;
  createdAt: string;
  logo: string | null;
  applicationsCount: number;
  userOrganizationsCount: number;
  // Add any other fields if backend expands them later (like description, domain, status, plan)
};

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [stats, setStats] = useState<OrgStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const getOrganizations = async () => {
      try {
        const orgs = await fetchAllOrganizations();
        setOrganizations(orgs);
      } catch (err: any) {
        setError(err.message || "Failed to load organizations.");
      } finally {
        setIsLoading(false);
      }
    };

    getOrganizations();
  }, []);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchOrgStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to load stats:", error);
      } finally {
        setStatsLoading(false);
      }
    };
    loadStats();
  }, []);
  return (
    <div className="space-y-6 ml-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        {/* Left: Heading and subtitle */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Organizations</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage and monitor your organizations
          </p>
        </div>

        {/* Right: Create button aligned to far right */}
        <CreateOrganizationWrapper />
      </div>

      <div className="space-y-4">
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Organizations
              </CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? "..." : stats?.organizationCount ?? 0}
              </div>
              <p className="text-xs text-muted-foreground">
                +2 from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Applications
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? "..." : stats?.applicationCount ?? 0}
              </div>
              <p className="text-xs text-muted-foreground">
                +1 from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Members
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? "..." : stats?.userCount ?? 0}
              </div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Organizations</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Loading organizations...</p>
            ) : error ? (
              <p className="text-red-600">Error: {error}</p>
            ) : organizations.length > 0 ? (
              organizations.map((org) => (
                <div
                  key={org.orgId}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                >
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={`http://localhost:5054/${org.logo}`}
                        alt={org.displayName}
                      />
                      <AvatarFallback>
                        {(
                          org.displayName
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("") || "ORG"
                        ).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <h3 className="font-semibold">{org.displayName}</h3>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span className="flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          {org.userOrganizationsCount} users
                        </span>
                        <span className="flex items-center">
                          <Building2 className="h-3 w-3 mr-1" />
                          {org.applicationsCount} apps
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          Created{" "}
                          {new Intl.DateTimeFormat("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }).format(new Date(org.createdAt))}
                        </span>
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      {/*     <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Organization
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>*/}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No organizations found
                </h3>
                <p className="text-muted-foreground mb-4">
                  Get started by creating your first organization
                </p>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Organization
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
