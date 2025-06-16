"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface DeleteOrganizationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteOrganizationDialog({
  open,
  onClose,
  onConfirm,
}: DeleteOrganizationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Organization</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this organization? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-red-50 border border-red-200 rounded-md p-4 my-4">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Warning</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>
                  Deleting this organization will remove all associated users,
                  roles, and applications. This action is permanent and cannot
                  be reversed.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete Organization
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
