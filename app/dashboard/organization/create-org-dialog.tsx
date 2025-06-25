"use client";

import type React from "react";

import { useState, type ChangeEvent, type FormEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Building2,
  Upload,
  ImageIcon,
  X,
  Plus,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { createOrganization } from "../services/organization-service";
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
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const onNameChange = (e: ChangeEvent<HTMLInputElement>) =>
    setName(e.target.value);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      toast.error("Please select a valid image file");
    }
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
  };

  const resetForm = () => {
    setName("");
    setLogoFile(null);
    setLogoPreview(null);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Organization name is required");
      return;
    }

    setLoading(true);
    try {
      await createOrganization({ Name: name, logoFile });
      toast.success("Organization created successfully!");
      onOpenChange(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.message || "Failed to create organization.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onOpenChange(false);
      resetForm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-4 border-b">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl">
                Create New Organization
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Set up a new organization to manage users, applications, and
                permissions
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={onSubmit} className="flex-1 overflow-y-auto">
          <div className="space-y-6 p-1">
            {/* Organization Details */}
            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    <h4 className="text-lg font-medium">
                      Organization Details
                    </h4>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="org-name" className="text-sm font-medium">
                      Organization Name *
                    </Label>
                    <Input
                      id="org-name"
                      type="text"
                      value={name}
                      onChange={onNameChange}
                      placeholder="Enter organization name"
                      required
                      disabled={loading}
                      className="text-base"
                    />
                    <p className="text-xs text-muted-foreground">
                      This will be displayed across the platform and in user
                      interfaces
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Logo Upload */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-primary" />
                    <h4 className="text-lg font-medium">Organization Logo</h4>
                    <Badge variant="secondary" className="text-xs">
                      Optional
                    </Badge>
                  </div>

                  {logoPreview ? (
                    <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/30">
                      <Avatar className="h-16 w-16">
                        <AvatarImage
                          src={logoPreview || "/placeholder.svg"}
                          alt="Logo preview"
                        />
                        <AvatarFallback>Logo</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">{logoFile?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {logoFile && (logoFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={removeLogo}
                        disabled={loading}
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div
                      className={`
                        relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
                        ${
                          dragActive
                            ? "border-primary bg-primary/5"
                            : "border-muted-foreground/25 hover:border-muted-foreground/50"
                        }
                        ${
                          loading
                            ? "opacity-50 cursor-not-allowed"
                            : "cursor-pointer"
                        }
                      `}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      onClick={() =>
                        !loading && document.getElementById("org-logo")?.click()
                      }
                    >
                      <input
                        id="org-logo"
                        type="file"
                        accept="image/*"
                        onChange={onFileChange}
                        disabled={loading}
                        className="hidden"
                      />
                      <div className="space-y-3">
                        <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                          <Upload className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            Drop your logo here, or{" "}
                            <span className="text-primary">browse</span>
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            PNG, JPG, GIF up to 10MB
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="bg-blue-50/50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-blue-900">
                      What happens next?
                    </p>
                    <p className="text-xs text-blue-700">
                      After creating the organization, you can assign users,
                      configure applications, and set up roles and permissions
                      to manage access control.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !name.trim()}
              className="min-w-[120px]"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Organization
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
