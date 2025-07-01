/*"use client";

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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { Shield, Plus, AlertCircle } from "lucide-react";
import { createRole } from "../../../services/role-service";
import {
  fetchOrganizationDropdownItems,
  OrganizationDropdownItem,
} from "../../../services/organization-service";

export interface CreateRoleDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function CreateRoleDialog({
  open,
  setOpen,
}: CreateRoleDialogProps) {
  const [orgs, setOrgs] = useState<OrganizationDropdownItem[]>([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    organizationId: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchOrganizationDropdownItems();
        setOrgs(data);
      } catch (err) {
        console.error("Failed to fetch organizations", err);
      }
    };

    load();
  }, []);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      await createRole(form);
      setOpen(false);
      setForm({ name: "", description: "", organizationId: "" });
    } catch (err) {
      console.error("Role creation failed", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="shadow-sm flex items-center justify-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Role
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Shield className="h-4 w-4 text-blue-600" />
            </div>
            <DialogTitle className="text-xl">Create New Role</DialogTitle>
          </div>
          <DialogDescription className="text-base">
            Define a new role for your organization. You'll be able to assign
            permissions and users after creation.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="roleName">Role Name *</Label>
            <Input
              id="roleName"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g., Admin"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Role description..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="organization">Organization *</Label>
            <Select
              value={form.organizationId}
              onValueChange={(value) =>
                setForm({ ...form, organizationId: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an organization" />
              </SelectTrigger>
              <SelectContent>
                {orgs.map((org) => (
                  <SelectItem key={org.id} value={org.id}>
                    {org.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {form.name && form.organizationId && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-blue-900">Ready to create</p>
                  <p className="text-blue-700">
                    After creating this role, you’ll be able to assign
                    permissions and users to it.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="space-x-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!form.name || !form.organizationId || isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </>
            ) : (
              <>
                <Shield className="h-4 w-4 mr-2" />
                Create Role
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
*/

"use client";

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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Plus, AlertCircle, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { createRole } from "../../../services/role-service";
import {
  fetchOrganizationDropdownItems,
  OrganizationDropdownItem,
} from "../../../services/organization-service";
import { toast } from "sonner";
export interface CreateRoleDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function CreateRoleDialog({
  open,
  setOpen,
}: CreateRoleDialogProps) {
  const [orgs, setOrgs] = useState<OrganizationDropdownItem[]>([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    organizationId: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchOrganizationDropdownItems();
        setOrgs(data);
      } catch (err) {
        console.error("Failed to fetch organizations", err);
      }
    };
    load();
  }, []);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      await createRole(form);
      toast.success("Role created successfully!");
      setOpen(false);
      setForm({ name: "", description: "", organizationId: "" });
    } catch (err) {
      console.error("Role creation failed", err);
      toast.error("Failed to create role. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="shadow-sm flex items-center justify-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Role
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-4 border-b">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <DialogTitle className="text-xl">Create New Role</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Define a role for an organization and assign permissions later.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="flex-1 overflow-y-auto"
        >
          <div className="space-y-6 p-1">
            {/* Role Details Card */}
            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <h4 className="text-lg font-medium">Role Details</h4>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="roleName">Role Name *</Label>
                    <Input
                      id="roleName"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      placeholder="e.g., Admin"
                      disabled={isLoading}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={form.description}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                      placeholder="Role description..."
                      rows={3}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="organization">Organization *</Label>
                    <Select
                      value={form.organizationId}
                      onValueChange={(value) =>
                        setForm({ ...form, organizationId: value })
                      }
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select an organization" />
                      </SelectTrigger>
                      <SelectContent>
                        {orgs.map((org) => (
                          <SelectItem key={org.id} value={org.id}>
                            {org.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status Card */}
            {form.name && form.organizationId && (
              <Card className="bg-blue-50/50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-blue-900">
                        You're ready to create this role
                      </p>
                      <p className="text-xs text-blue-700">
                        After creation, you’ll be able to assign permissions and
                        users to this role.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 pt-6 border-t mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!form.name || !form.organizationId || isLoading}
              className="min-w-[120px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  Create Role
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
