"use client";

import { useEffect, useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, X, ChevronDown } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
} from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { removeUserFromRole } from "../../../services/role-service";
import {
  assignUsersToRole,
  fetchUsersByOrganization,
  UserSummary,
  fetchUsersByOrgAndRole,
} from "../../../services/user-service";
import {
  getUnassignedItems,
  groupItemsByKey,
  toggleSelection,
} from "../../../../helpers/selection-utils";
import { toast } from "sonner";
interface UsersTabProps {
  organizationId: string;
  roleId: string;
}
export default function UsersTab({ organizationId, roleId }: UsersTabProps) {
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [availableUsers, setAvailableUsers] = useState<UserSummary[]>([]);
  //  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const selectedUser = availableUsers.find((u) => u.id === selectedUserId);
  const unassignedUsers = availableUsers.filter(
    (u) => !users.find((assigned) => assigned.id === u.id)
  );
  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      try {
        const orgUsers = await fetchUsersByOrganization(organizationId);
        setAvailableUsers(orgUsers);
      } catch (error) {
        console.error("Failed to load users", error);
      } finally {
        setLoading(false); // <--- and this here
      }
    };

    if (organizationId) {
      loadUsers();
    }
  }, [organizationId]);

  const handleAssignUsers = async () => {
    if (!selectedUserIds.length) return;

    try {
      const result = await assignUsersToRole({
        organizationId,
        roleId,
        userIds: selectedUserIds,
      });

      const newlyAssignedUsers = availableUsers.filter((u) =>
        result.includes(u.id)
      );

      if (newlyAssignedUsers.length === 0) {
        toast.warning("All selected users were already assigned.");
      } else if (newlyAssignedUsers.length < selectedUserIds.length) {
        toast.info(
          `${newlyAssignedUsers.length} user(s) assigned. ${
            selectedUserIds.length - newlyAssignedUsers.length
          } already assigned.`
        );
      } else {
        toast.success("All selected users assigned successfully.");
      }

      // Update UI
      setUsers((prev) => [...prev, ...newlyAssignedUsers]);
      setSelectedUserIds([]);
      setIsPopoverOpen(false);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message ?? "Failed to assign users.");
    }
  };
  useEffect(() => {
    const loadAssignedUsers = async () => {
      setLoading(true);
      try {
        const assignedUsers = await fetchUsersByOrgAndRole(
          organizationId,
          roleId
        );
        setUsers(assignedUsers);
      } catch (error) {
        console.error("Failed to fetch assigned users:", error);
        toast.error("Could not load assigned users.");
      } finally {
        setLoading(false);
      }
    };

    if (organizationId && roleId) {
      loadAssignedUsers();
    }
  }, [organizationId, roleId]);

  const handleRemoveUser = async (userId: string) => {
    try {
      const message = await removeUserFromRole(roleId, organizationId, userId);

      toast.success(message || "User removed from role.");

      // Update UI
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (error: any) {
      console.error(error);
      toast.error(error.message ?? "Failed to remove user from role.");
    }
  };

  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const handleUserToggle = (id: string) => {
    setSelectedUserIds((prev) => toggleSelection(prev, id));
  };

  return (
    <TabsContent value="users" className="space-y-6">
      <Card>
        <CardContent className="p-6 space-y-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Users className="h-5 w-5" />
            Assigned Users
          </h2>

          {/* Add User */}
          <div className="flex gap-2">
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <div
                  role="combobox"
                  aria-expanded={isPopoverOpen}
                  tabIndex={0}
                  onClick={() => setIsPopoverOpen(!isPopoverOpen)}
                  className={cn(
                    "flex-1 flex items-center justify-between rounded-md border px-3 py-2 text-sm bg-transparent min-h-[40px] cursor-pointer",
                    unassignedUsers.length === 0 &&
                      "opacity-50 cursor-not-allowed"
                  )}
                >
                  {selectedUserIds.length === 0 ? (
                    <span className="text-muted-foreground">
                      Select users to add
                    </span>
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {selectedUserIds.map((id) => {
                        const user = availableUsers.find((u) => u.id === id);
                        if (!user) return null;
                        return (
                          <Badge
                            key={id}
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            {user.firstname} {user.lastname}
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUserToggle(id);
                              }}
                              className="cursor-pointer text-muted-foreground hover:text-foreground"
                            >
                              <X className="w-3 h-3" />
                            </span>
                          </Badge>
                        );
                      })}
                    </div>
                  )}
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </div>
              </PopoverTrigger>

              <PopoverContent className="w-[400px] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search users..." />
                  <CommandList>
                    {loading ? (
                      <CommandItem disabled>Loading...</CommandItem>
                    ) : unassignedUsers.length === 0 ? (
                      <CommandEmpty>No users found</CommandEmpty>
                    ) : (
                      <ScrollArea className="h-[300px]">
                        {unassignedUsers.map((user) => (
                          <CommandItem
                            key={user.id}
                            onSelect={() => handleUserToggle(user.id)}
                            className="flex items-start gap-3 p-3"
                          >
                            <Checkbox
                              checked={selectedUserIds.includes(user.id)}
                              onChange={() => handleUserToggle(user.id)}
                              className="mt-0.5"
                            />
                            <div className="flex-1 space-y-1">
                              <p className="font-medium">
                                {user.firstname} {user.lastname}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {user.email}
                              </p>
                            </div>
                          </CommandItem>
                        ))}
                      </ScrollArea>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            <Button
              disabled={selectedUserIds.length === 0}
              onClick={handleAssignUsers}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>

          <Separator />

          {/* Users List */}
          <div className="space-y-3">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={"/placeholder.svg"}
                      alt={user.firstname}
                    />
                    <AvatarFallback>
                      {`${user.firstname?.[0] || "NA"}${
                        user.lastname?.[0] || "NA"
                      }`}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {user.firstname} {user.lastname}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => handleRemoveUser(user.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {users.length === 0 && !loading && (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">No users assigned</p>
                <p className="text-sm">
                  Add users to grant them this role's permissions
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
