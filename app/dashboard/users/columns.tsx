/*"use client";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Eye,
  Trash2,
  ShieldBan,
  ShieldCheck,
  MoreHorizontal,
} from "lucide-react";
import { deleteUser, unblockUser } from "../services/admin-service";
import { BlockUserDialog } from "./block-user-dialog";

export type UserRow = {
  id: string;
  email: string;
  provider: string;
  loginCount: number;
  firstname: string;
  lastname: string;
  lockoutEnabled: boolean;
  lockoutEnd: string | null;
};

export const columns: ColumnDef<UserRow>[] = [
  {
    accessorKey: "firstname",
    header: "User",
    cell: ({ row }) => {
      const user = row.original;
      const fullName = `${user.firstname} ${user.lastname}`;
      return (
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={`/placeholder.svg?height=32&width=32`}
              alt={fullName}
            />
            <AvatarFallback>
              {user.firstname[0]}
              {user.lastname[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{fullName}</div>
            <div className="text-sm text-muted-foreground">{user.email}</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "provider",
    header: "Provider",
    cell: ({ row }) => {
      const provider = row.getValue("provider") as string;
      return (
        <Badge variant="outline" className="capitalize">
          {provider}
        </Badge>
      );
    },
  },
  {
    accessorKey: "loginCount",
    header: "Logins",
    cell: ({ row }) => {
      return (
        <div className="text-sm font-medium">{row.getValue("loginCount")}</div>
      );
    },
  },

  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => {
      const user = row.original;
      const [dialogOpen, setDialogOpen] = useState(false);
      const isBlocked =
        user.lockoutEnd && new Date(user.lockoutEnd) > new Date();

      const handleDelete = async () => {
        try {
          await deleteUser(user.id);
          toast.success("User deleted successfully");
          setTimeout(() => window.location.reload(), 1500);
        } catch (error: any) {
          toast.error(error.message || "Failed to delete user");
        }
      };

      const handleUnblock = async () => {
        try {
          await unblockUser(user.id);
          toast.success("User unblocked successfully");
          window.location.reload();
        } catch (error: any) {
          toast.error(error.message || "Error unblocking user");
        }
      };

      return (
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(user.id)}
              >
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleDelete}
                className="group text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4 group-hover:text-red-600" />
                Delete User
              </DropdownMenuItem>
              {isBlocked ? (
                <DropdownMenuItem
                  onClick={handleUnblock}
                  className="group text-green-600"
                >
                  <ShieldCheck className="mr-2 h-4 w-4 group-hover:text-green-600" />
                  Unblock User
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={() => setDialogOpen(true)}
                  className="group text-red-600"
                >
                  <ShieldBan className="mr-2 h-4 w-4 group-hover:text-red-600" />
                  Block User
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <BlockUserDialog
            userId={user.id}
            open={dialogOpen}
            onOpenChange={setDialogOpen}
          />
        </div>
      );
    },
  },
];
*/

"use client";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Eye,
  Trash2,
  ShieldBan,
  ShieldCheck,
  MoreHorizontal,
} from "lucide-react";
import { deleteUser, unblockUser } from "../services/admin-service";
import { BlockUserDialog } from "./block-user-dialog";

export type UserRow = {
  id: string;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  organizationCount: number;
  roleCount: number;
  ClientAppCount: number;
};

export const columns: ColumnDef<UserRow>[] = [
  {
    accessorKey: "firstname",
    header: "User",
    cell: ({ row }) => {
      const user = row.original;
      const fullName = `${user.firstname} ${user.lastname}`;
      return (
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={`/placeholder.svg?height=32&width=32`}
              alt={fullName}
            />
            <AvatarFallback>
              {user.firstname[0]}
              {user.lastname[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{fullName}</div>
            <div className="text-sm text-muted-foreground">{user.email}</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "organizationCount",
    header: "Orgs",
    cell: ({ row }) => {
      return (
        <div className="text-sm font-medium">
          {row.getValue("organizationCount")}
        </div>
      );
    },
  },
  {
    accessorKey: "roleCount",
    header: "Roles",
    cell: ({ row }) => {
      return (
        <div className="text-sm font-medium">{row.getValue("roleCount")}</div>
      );
    },
  },
  {
    accessorKey: "ClientAppCount",
    header: "Apps",
    cell: ({ row }) => {
      return (
        <div className="text-sm font-medium">
          {row.getValue("ClientAppCount")}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => {
      const user = row.original;
      const [dialogOpen, setDialogOpen] = useState(false);
    },
  },
];
