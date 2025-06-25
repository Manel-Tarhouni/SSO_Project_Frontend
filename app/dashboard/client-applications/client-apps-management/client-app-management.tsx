"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DeleteApplicationDialog from "../delete-client-app";
import { Filter, Lock, Plus, Search, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  getClientDetails,
  ClientDetailsDto,
  deleteClientApp,
} from "../../services/clientapp-service";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { MoreHorizontal, Edit, Trash2, Eye, Key } from "lucide-react";
import { toast } from "sonner";
import ViewDetailsDialog from "../client-app-details-dialog/client-app-details-dialog";
import {
  fetchClientFullDetails,
  ClientFullDetailsDto,
} from "../../services/clientapp-service";

interface Organization {
  id: string;
  name: string;
}

export default function ClientApplicationsManagement() {
  const [clientApps, setClientApps] = useState<ClientDetailsDto[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [organizationFilter, setOrganizationFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [confidentialFilter, setConfidentialFilter] = useState("all");

  const [isViewDetailsDialogOpen, setIsViewDetailsDialogOpen] = useState(false);
  const [selectedAppForView, setSelectedAppForView] =
    useState<ClientFullDetailsDto | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const apps = await getClientDetails();
        setClientApps(apps);

        const uniqueOrgs = apps.reduce<Organization[]>((acc, app) => {
          if (!acc.find((o) => o.name === app.organizationName)) {
            acc.push({
              id: app.organizationName,
              name: app.organizationName,
            });
          }
          return acc;
        }, []);

        setOrganizations(uniqueOrgs);
      } catch (error) {
        console.error("Failed to fetch client applications", error);
      }
    };

    fetchData();
  }, []);

  const filteredApps = clientApps.filter((app) => {
    const matchesSearch =
      app.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.organizationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.redirect_Uri.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesOrg =
      organizationFilter === "all" ||
      app.organizationName === organizationFilter;

    const matchesConfidential =
      confidentialFilter === "all" ||
      (confidentialFilter === "confidential" && app.isConfidential) ||
      (confidentialFilter === "public" && !app.isConfidential);

    return matchesSearch && matchesOrg && matchesConfidential;
  });
  const [selectedApp, setSelectedApp] = useState<ClientDetailsDto | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const handleDeleteClick = (app: ClientDetailsDto) => {
    setSelectedApp(app);
    setIsDeleteDialogOpen(true);
  };

  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClientApp = async () => {
    if (!selectedApp) return;

    setIsDeleting(true);
    try {
      await deleteClientApp(selectedApp.id);
      setClientApps((prev) =>
        prev.filter((app) => app.clientId !== selectedApp.clientId)
      );
      setSelectedApp(null);
      setIsDeleteDialogOpen(false);
      toast.success("Application deleted successfully.");
    } catch (error: any) {
      console.error("Failed to delete client application:", error.message);
      toast.error("Failed to delete client application: " + error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            Applications Management
          </h1>
          <p className="text-muted-foreground">
            Manage OAuth 2.0 client applications and their authentication
            settings
          </p>
        </div>
        <Link href="/dashboard/client-applications/client-app-registration/basic-info">
          <Button size="lg" className="shadow-sm">
            <Plus className="h-4 w-4 mr-2" />
            Register New Application
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Confidential Clients
            </CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {clientApps.filter((app) => app.isConfidential).length}
            </div>
            <p className="text-xs text-muted-foreground">With client secrets</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Connected Users
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {clientApps.reduce((sum, app) => sum + app.numberOfUsers, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total authenticated users
            </p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Applications</CardTitle>
          <CardDescription>
            View and manage your OAuth 2.0 client applications
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search applications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select
              value={organizationFilter}
              onValueChange={setOrganizationFilter}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Organization" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Organizations</SelectItem>
                {organizations.map((org) => (
                  <SelectItem key={org.id} value={org.name}>
                    {org.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={confidentialFilter}
              onValueChange={setConfidentialFilter}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="confidential">Confidential</SelectItem>
                <SelectItem value="public">Public</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Applications Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client Name</TableHead>
                  <TableHead>Organization</TableHead>
                  <TableHead>Redirect URI</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Users</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApps.map((app) => (
                  <TableRow key={app.clientId} className="hover:bg-accent">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src="/placeholder.svg"
                            alt={app.client_name}
                          />
                          <AvatarFallback>
                            {app.client_name
                              ?.split(" ")
                              .map((word) => word[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase() || "NA"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <span className="font-medium">{app.client_name}</span>
                          <div className="text-xs text-muted-foreground">
                            ID: {app.clientId}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback>
                            {app.organizationName
                              ?.split(" ")
                              .map((word) => word[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase() || "NA"}
                          </AvatarFallback>
                        </Avatar>
                        <span>{app.organizationName}</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div
                        className="max-w-[220px] truncate text-sm"
                        title={app.redirect_Uri}
                      >
                        {app.redirect_Uri}
                      </div>
                    </TableCell>

                    <TableCell>
                      {app.isConfidential ? (
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-800 border-blue-200"
                        >
                          <Lock className="h-3 w-3 mr-1" />
                          Confidential
                        </Badge>
                      ) : (
                        <Badge variant="outline">Public</Badge>
                      )}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{app.numberOfUsers.toLocaleString()}</span>
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
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedClientId(app.id); // Just set the ID
                              setIsViewDetailsDialogOpen(true); // Then open the dialog
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>

                          {app.isConfidential && (
                            <DropdownMenuItem>
                              <Key className="h-4 w-4 mr-2" />
                              Assign to Organization
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />

                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteClick(app)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Application
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {selectedApp && (
            <DeleteApplicationDialog
              open={isDeleteDialogOpen}
              onClose={() => setIsDeleteDialogOpen(false)}
              onConfirm={handleDeleteClientApp} // <-- ici, appelle la bonne fonction
            />
          )}
          {selectedClientId && (
            <ViewDetailsDialog
              open={isViewDetailsDialogOpen}
              onClose={() => setIsViewDetailsDialogOpen(false)}
              clientId={selectedClientId}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
