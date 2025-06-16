"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, UserPlus } from "lucide-react";
import { toast } from "sonner";

import { sendInvitation } from "../../services/invitation-service";
import { fetchAllOrganizations } from "../../services/organization-service";
import {
  fetchAllRolesNameId,
  RolesNamesIds,
} from "../../services/role-service";

interface Organization {
  orgId: string;
  displayName: string;
  logo?: string | null;
}

export default function InviteUserDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrganization, setSelectedOrganization] = useState("");
  const [roles, setroles] = useState<RolesNamesIds[]>([]);

  const [inviteForm, setInviteForm] = useState({
    email: "",
    message: "",
  });
  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchAllRolesNameId();
        setroles(data);
      } catch (err) {
        console.error("Failed to fetch organizations", err);
      }
    };

    load();
  }, []);
  useEffect(() => {
    async function loadOrganizations() {
      try {
        const orgs = await fetchAllOrganizations();
        setOrganizations(orgs);
        if (orgs.length > 0) setSelectedOrganization(orgs[0].orgId);
      } catch (err) {
        console.error("Failed to load organizations", err);
      }
    }
    loadOrganizations();
  }, []);

  const handleSendInvitation = async () => {
    if (!inviteForm.email || !selectedOrganization) return;
    setIsLoading(true);
    try {
      await sendInvitation({
        email: inviteForm.email,
        organizationId: selectedOrganization,
        invitedByUserId: "dd42813c-5f3f-46d9-ab31-cab04811ea24", // replace as needed
      });
      toast.success("Invitation sent!", {
        description: `Invitation sent to ${inviteForm.email}.`,
      });
      setInviteForm({ email: "", message: "" });
      setIsOpen(false);
    } catch (error: any) {
      toast.error("Failed to send invitation: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
              placeholder="Add a message..."
              value={inviteForm.message}
              onChange={(e) =>
                setInviteForm({ ...inviteForm, message: e.target.value })
              }
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSendInvitation}
            disabled={!inviteForm.email || !selectedOrganization || isLoading}
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
  );
}
