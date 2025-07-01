"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { removePermissionFromRole } from "../../../services/role-service";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ChevronDown, Check, Plus, Shield, X, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  fetchAllPermissions,
  PermissionDto,
  fetchPermissionsByRoleId,
} from "../../../services/permission-service";
import {
  getRoleDetailsById,
  RoleDetails,
  assignPermissionsToRole,
} from "../../../services/role-service";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  getUnassignedItems,
  groupItemsByKey,
  toggleSelection,
} from "../../../../helpers/selection-utils";
interface PermissionTabProps {
  roleId: string;
}

export default function PermissionTab({ roleId }: PermissionTabProps) {
  const [permissions, setPermissions] = useState<PermissionDto[]>([]);
  const [availablePermissions, setAvailablePermissions] = useState<
    PermissionDto[]
  >([]);
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>(
    []
  );
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const unassignedPermissions = getUnassignedItems(
    availablePermissions,
    permissions
  );

  const groupedUnassignedPermissions = groupItemsByKey(
    unassignedPermissions,
    (p) => p.code.split("_")[0]
  );

  /*
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
  }, []);*/
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const all = await fetchAllPermissions();
        const assigned = await fetchPermissionsByRoleId(roleId);
        setAvailablePermissions(all);
        setPermissions(assigned);
      } catch (error) {
        console.error("Failed to fetch permissions:", error);
      }
    };

    if (roleId) {
      fetchPermissions();
    }
  }, [roleId]);

  const handlePermissionToggle = (id: string) => {
    setSelectedPermissionIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleAssignPermissions = async () => {
    if (selectedPermissionIds.length === 0) return;

    try {
      await assignPermissionsToRole(roleId, selectedPermissionIds);
      setSelectedPermissionIds([]);
      setIsPopoverOpen(false);
      toast.success("Permissions successfully assigned to role.");
    } catch (err) {
      console.error("Error assigning permissions:", err);
      toast.error("Failed to assign permissions. Please try again.");
    }
  };

  const handleRemovePermission = async (permissionId: string) => {
    try {
      await removePermissionFromRole(roleId, permissionId);
      setPermissions((prev) => prev.filter((p) => p.id !== permissionId));
      toast.success("Permission removed");
    } catch (err: any) {
      toast.error(err.message ?? "Failed to remove permission");
    }
  };

  return (
    <TabsContent value="permissions" className="space-y-6">
      <Card>
        <CardContent className="p-6 space-y-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Users className="h-5 w-5" />
            Assigned Users
          </h2>
          {/* Add Permission */}
          <div className="flex gap-2">
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <div
                  role="combobox"
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
                        return permission ? (
                          <Badge
                            key={id}
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            {permission.name}
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePermissionToggle(id);
                              }}
                              className="cursor-pointer text-muted-foreground hover:text-foreground"
                            >
                              <X className="w-3 h-3" />
                            </span>
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  )}
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </div>
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
                                ) && <Check className="h-4 w-4 text-primary" />}
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

          {/* Permissions List */}
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
                      <span className="font-medium">{permission.name}</span>
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
                  className="text-destructive hover:text-destructive"
                  onClick={() => handleRemovePermission(permission.id)}
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
    </TabsContent>
  );
}
