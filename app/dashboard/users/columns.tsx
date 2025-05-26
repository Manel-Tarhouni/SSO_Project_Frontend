"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Eye,
  Trash2,
  ShieldBan,
  ShieldCheck,
  MoreHorizontal,
} from "lucide-react";
import { deleteUser, unblockUser } from "../services/admin-service";
import { BlockUserDialog } from "./BlockUserDialog";
import { useState } from "react";

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
    header: "Name",
    accessorKey: "name",
    cell: ({ row }) => {
      const user = row.original;
      return `${user.firstname} ${user.lastname}`;
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "provider",
    header: "Identity Provider",
  },
  {
    accessorKey: "loginCount",
    header: "Logins",
  },

  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,

    cell: ({ row }) => {
      const user = row.original;
      const [dialogOpen, setDialogOpen] = useState(false);

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
                className="group text-black hover:text-red-600 hover:bg-transparent"
                onClick={async () => {
                  try {
                    await deleteUser(user.id);
                    toast("Success", {
                      description: "User Deleted succesfully ",
                      duration: 9000,
                    });
                    setTimeout(() => {
                      window.location.reload();
                    }, 1500);
                  } catch (error: any) {
                    toast("Erreur", {
                      description: error.message || "Failed to Delete user",
                      duration: 5000,
                    });
                  }
                }}
              >
                <Trash2 className="mr-2 h-4 w-4 text-black group-hover:text-red-600" />
                <span className="group-hover:text-red-600">Delete User</span>
              </DropdownMenuItem>

              {user.lockoutEnd && new Date(user.lockoutEnd) > new Date() ? (
                <DropdownMenuItem
                  className="group text-white hover:text-green-600 hover:bg-transparent"
                  onClick={async () => {
                    try {
                      await unblockUser(user.id);
                      toast.success("Utilisateur débloqué avec succès.");
                      window.location.reload();
                    } catch (error: any) {
                      toast.error(error.message || "Erreur lors du déblocage.");
                    }
                  }}
                >
                  <ShieldCheck className="mr-2 h-4 w-4 text-black group-hover:text-green-600" />
                  <span className="group-hover:text-green-600">
                    Unblock User
                  </span>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={() => setDialogOpen(true)}
                  className="group text-black hover:text-red-600 hover:bg-transparent"
                >
                  <ShieldBan className="mr-2 h-4 w-4 text-black group-hover:text-red-600" />
                  <span className="group-hover:text-red-600">Block User</span>
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
