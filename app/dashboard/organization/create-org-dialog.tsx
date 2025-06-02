"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createOrganization } from "../services/organization-service"; // adjust path to your API file
import { toast } from "sonner";

interface CreateOrgDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateOrgDialog({
  open,
  onOpenChange,
}: CreateOrgDialogProps) {
  const [name, setName] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const onNameChange = (e: ChangeEvent<HTMLInputElement>) =>
    setName(e.target.value);

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setLogoFile(e.target.files[0]);
    } else {
      setLogoFile(null);
    }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Organization name is required");
      return;
    }

    setLoading(true);
    try {
      await createOrganization({ name, logoFile });
      toast.success("Organization created successfully!");
      onOpenChange(false); // close dialog
      setName("");
      setLogoFile(null);
    } catch (error: any) {
      toast.error(error.message || "Failed to create organization.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Organization</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="org-name"
              className="block text-sm font-medium text-gray-700"
            >
              Organization Name
            </label>
            <Input
              id="org-name"
              type="text"
              value={name}
              onChange={onNameChange}
              placeholder="Enter organization name"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label
              htmlFor="org-logo"
              className="block text-sm font-medium text-gray-700"
            >
              Logo (optional)
            </label>
            <input
              id="org-logo"
              type="file"
              accept="image/*"
              onChange={onFileChange}
              disabled={loading}
              className="mt-1"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
