"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import InviteUserDialog from "./assign-user-dialog";

import {
  Mail,
  Clock,
  XCircle,
  CheckCircle,
  Send,
  UserPlus,
  Search,
  Building2,
} from "lucide-react";
import type { InvitationDto } from "../../services/invitation-service";
import {
  getAllInvitations,
  sendInvitation,
} from "../../services/invitation-service";
import { fetchAllOrganizations } from "../../services/organization-service";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
interface Organization {
  orgId: string;
  displayName: string;
  logo?: string | null;
}
export default function InvitationManagement() {
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [inviteForm, setInviteForm] = useState({
    email: "",
    message: "",
  });
  const [invitations, setInvitations] = useState<InvitationDto[]>([]);
  const [filteredInvitations, setFilteredInvitations] = useState<
    InvitationDto[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrganization, setSelectedOrganization] = useState("all");
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  useEffect(() => {
    const loadOrganizations = async () => {
      try {
        const data = await fetchAllOrganizations();
        setOrganizations(data);
      } catch (error) {
        console.error("Failed to load organizations", error);
      }
    };

    loadOrganizations();
  }, []);

  const handleSendInvitation = async () => {
    setIsLoading(true);
    try {
      await sendInvitation({
        email: inviteForm.email,
        organizationId: selectedOrganization,
        invitedByUserId: "dd42813c-5f3f-46d9-ab31-cab04811ea24",
      });

      setIsInviteDialogOpen(false);
      setInviteForm({ email: "", message: "" });
      toast.success("Invitation sent successfully!", {
        description: `An invitation was sent to ${inviteForm.email}.`,
      });
      toast.success("Invitation sent!", {
        description: `We've emailed ${inviteForm.email}`,
        duration: 4000,
        action: {
          label: "Undo",
          onClick: () => console.log("Undo clicked"),
        },
      });
    } catch (error: any) {
      console.error("Failed to send invitation:", error.message);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    async function fetchInvitations() {
      setLoading(true);
      try {
        const data = await getAllInvitations();
        setInvitations(data);
        setFilteredInvitations(data);

        // Extract unique organizations from invitations for filter dropdown
        const uniqueOrgs = Array.from(
          new Map(
            data.map((inv) => [
              inv.organizationId,
              {
                id: inv.organizationId,
                name: inv.organizationName,
                logo: undefined, // Replace with real logos if available
              },
            ])
          ).values()
        );
        //   setOrganizations(uniqueOrgs);
      } catch (error) {
        console.error("Failed to load invitations:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchInvitations();
  }, []);

  // Filter invitations based on searchQuery and selectedOrganization
  useEffect(() => {
    let filtered = invitations;

    if (selectedOrganization !== "all") {
      filtered = filtered.filter(
        (inv) => inv.organizationId === selectedOrganization
      );
    }

    if (searchQuery.trim() !== "") {
      const lower = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (inv) =>
          inv.email.toLowerCase().includes(lower) ||
          inv.organizationName.toLowerCase().includes(lower) ||
          inv.invitedBy.toLowerCase().includes(lower)
      );
    }

    setFilteredInvitations(filtered);
  }, [searchQuery, selectedOrganization, invitations]);

  function getStatusBadge(status: string) {
    // Customize your badge UI here (could be a colored pill)
    let bg = "bg-gray-300 text-gray-800";
    if (status === "Pending") bg = "bg-yellow-100 text-yellow-800";
    else if (status === "Accepted") bg = "bg-green-100 text-green-800";
    else if (status === "Expired") bg = "bg-red-100 text-red-800";

    return (
      <span
        className={`${bg} rounded-full px-3 py-1 text-xs font-semibold uppercase`}
      >
        {status}
      </span>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Assignment</h1>
          <p className="text-muted-foreground">
            Invite users to join organizations and manage pending invitations
          </p>
        </div>
        <div>
          <InviteUserDialog />
        </div>
        {/*   <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Invite User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Invite User to Organization</DialogTitle>
              <DialogDescription>
                Send an invitation email to a user to join an organization.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="organization">Organization</Label>
                <Select
                  value={selectedOrganization}
                  onValueChange={setSelectedOrganization}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select organization" />
                  </SelectTrigger>
                  <SelectContent>
                    {organizations.map((org) => (
                      <SelectItem key={org.orgId} value={org.orgId}>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={org.logo || ""} />
                            <AvatarFallback>
                              {org.displayName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span>{org.displayName}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">User Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  value={inviteForm.email}
                  onChange={(e) =>
                    setInviteForm({ ...inviteForm, email: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="message">Custom Message (Optional)</Label>
                <Textarea
                  id="message"
                  placeholder="Add a  message..."
                  value={inviteForm.message}
                  onChange={(e) =>
                    setInviteForm({ ...inviteForm, message: e.target.value })
                  }
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsInviteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSendInvitation}
                disabled={
                  !inviteForm.email || !selectedOrganization || isLoading
                }
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Invitation
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>*/}
      </div>
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex justify-between items-center pb-2">
            <CardTitle className="text-sm font-medium">
              Total Invitations
            </CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              All time invitations sent
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex justify-between items-center pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Awaiting response</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex justify-between items-center pb-2">
            <CardTitle className="text-sm font-medium">Accepted</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Successfully joined</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex justify-between items-center pb-2">
            <CardTitle className="text-sm font-medium">Expired</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Need to resend</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Invitation Management</CardTitle>
          <CardDescription>
            Track and manage user invitations to organizations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by email, organization, or inviter..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                disabled={loading}
              />
            </div>
            <Select
              value={selectedOrganization}
              onValueChange={setSelectedOrganization}
              disabled={loading}
            >
              <SelectTrigger className="w-full sm:w-[200px]">
                <Building2 className="h-4 w-4 mr-2" />
                <SelectValue placeholder="All Organizations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Organizations</SelectItem>
                {organizations.map((org) => (
                  <SelectItem key={org.orgId} value={org.orgId}>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={org.logo || ""} />
                        <AvatarFallback>
                          {org.displayName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span>{org.displayName}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Invitations Table */}
          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Organization</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sent</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvitations.length > 0 ? (
                  filteredInvitations.map((inv) => (
                    <TableRow key={inv.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {inv.email
                                .split("@")[0]
                                .split(".")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{inv.email}</div>
                            <div className="text-sm text-muted-foreground">
                              Invited by {inv.invitedBy}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-6 w-6">
                            {/*
                            Replace with real image source if available,
                            fallback to initials
                          */}
                            <AvatarImage
                              src={
                                organizations.find(
                                  (org) => org.orgId === inv.organizationId
                                )?.logo || "/placeholder.svg"
                              }
                              alt={inv.organizationName}
                            />
                            <AvatarFallback>
                              {
                                inv.organizationName
                                  ? inv.organizationName
                                      .split(" ")
                                      .filter(Boolean) // remove empty strings (extra spaces)
                                      .map((word) => word[0].toUpperCase()) // get first letter uppercase
                                      .slice(0, 3) // limit to max 3 initials (optional)
                                      .join("")
                                  : "NA" // fallback if organizationName is empty or missing
                              }
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">
                            {inv.organizationName}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(inv.status)}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(inv.sentAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(inv.sentAt).toLocaleTimeString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(inv.expiresAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(inv.expiresAt).toLocaleTimeString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {/* Actions Dropdown or Buttons go here */}
                        <Button variant="ghost" size="sm">
                          {/* For example: Edit or Revoke */}
                          Actions
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <div className="text-center py-8">
                        <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">
                          No invitations found
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          {searchQuery || selectedOrganization !== "all"
                            ? "Try adjusting your search or filters"
                            : "Start by sending your first invitation"}
                        </p>
                        {selectedOrganization === "all" && !searchQuery && (
                          <Button>
                            <UserPlus className="h-4 w-4 mr-2" />
                            Send First Invitation
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
