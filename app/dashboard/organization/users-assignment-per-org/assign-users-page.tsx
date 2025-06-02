"use client";

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
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Mail,
  Clock,
  XCircle,
  CheckCircle,
  Send,
  UserPlus,
} from "lucide-react";
import {
  fetchAllOrganizations,
  sendInvitation,
} from "../../services/organization-service";

interface Organization {
  orgId: string;
  displayName: string;
  logo?: string | null;
}
import { toast } from "sonner";

export default function AssignUsersPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrganization, setSelectedOrganization] = useState("");
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    email: "",
    message: "",
  });

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
      /*   toast.success("Invitation sent successfully!", {
        description: `An invitation was sent to ${inviteForm.email}.`,
      });*/
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

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Assignment</h1>
          <p className="text-muted-foreground">
            Invite users to join organizations and manage pending invitations
          </p>
        </div>
        <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
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
              {/* Organization Selection */}
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

              {/* Email Input */}
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

              {/* Optional Message */}
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
        </Dialog>
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
    </div>
  );
}
