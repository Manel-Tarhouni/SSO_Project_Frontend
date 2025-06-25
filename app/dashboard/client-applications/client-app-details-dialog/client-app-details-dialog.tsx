/*"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Lock, Users, Trash2, Save, Eye, EyeOff } from "lucide-react";

interface ViewDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  clientId: string;
}

import { useEffect, useState } from "react";
import {
  fetchClientFullDetails,
  ClientFullDetailsDto,
} from "../../services/clientapp-service";

export default function ViewDetailsDialog({
  open,
  onClose,
  clientId,
}: ViewDetailsDialogProps) {
  const [clientApp, setClientApp] = useState<ClientFullDetailsDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    clientName: "",
    redirectUri: "",
    scopes: "",
  });
  const [showClientSecret, setShowClientSecret] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch client details when dialog opens or clientId changes
  useEffect(() => {
    if (!open || !clientId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchClientFullDetails(clientId);
        setClientApp(data);
        // Set form data based on fetched client details
        setFormData({
          clientName: data.clientName,
          redirectUri: data.redirectUri,
          scopes: data.scopes.join(" "), // assuming scopes is string[]
        });
      } catch (e) {
        console.error("Failed to fetch client details", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [open, clientId]);
  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>Loading client details...</DialogContent>
      </Dialog>
    );
  }

  if (!clientApp) {
    return null;
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdate = async () => {};

  const handleDelete = async () => {};

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              {clientApp.isConfidential ? (
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-800 border-blue-200"
                >
                  <Lock className="h-3 w-3 mr-1" />
                  Confidential
                </Badge>
              ) : (
                <Badge variant="outline">Public</Badge>
              )}
              Application Details
            </div>
          </DialogTitle>
          <DialogDescription>
            View and update the OAuth 2.0 client application configuration
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
         
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clientId">Client ID</Label>
                <Input
                  id="clientId"
                  value={clientApp.clientId || ""}
                  readOnly
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientSecret">Client Secret</Label>
                <div className="relative">
                  <Input
                    id="clientSecret"
                    type={showClientSecret ? "text" : "password"}
                    value={clientApp.clientSecret || "N/A"}
                    readOnly
                    className="bg-muted pr-10"
                  />
                  {clientApp.clientSecret && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowClientSecret(!showClientSecret)}
                    >
                      {showClientSecret ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientName">Client Name</Label>
              <Input
                id="clientName"
                value={formData.clientName}
                onChange={(e) =>
                  handleInputChange("clientName", e.target.value)
                }
                placeholder="Enter client name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="redirectUri">Redirect URI</Label>
              <Input
                id="redirectUri"
                value={formData.redirectUri}
                onChange={(e) =>
                  handleInputChange("redirectUri", e.target.value)
                }
                placeholder="Enter redirect URI"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="scopes">Scopes</Label>
              <Textarea
                id="scopes"
                value={formData.scopes}
                onChange={(e) => handleInputChange("scopes", e.target.value)}
                placeholder="Enter scopes (space-separated)"
                rows={3}
              />
            </div>
          </div>

          <Separator />

          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Organization & Usage</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="organization">Organization</Label>
                <Input
                  id="organization"
                  value={clientApp.organizationName || ""}
                  readOnly
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="numberOfUsers">Number of Users</Label>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="numberOfUsers"
                    value={(clientApp.numberOfUsers || 0).toLocaleString()}
                    readOnly
                    className="bg-muted"
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator />

        
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Application Type</h3>
            <div className="flex items-center gap-2">
              {clientApp.isConfidential ? (
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-800 border-blue-200"
                >
                  <Lock className="h-3 w-3 mr-1" />
                  Confidential Client
                </Badge>
              ) : (
                <Badge variant="outline">Public Client</Badge>
              )}
              <span className="text-sm text-muted-foreground">
                {clientApp.isConfidential
                  ? "Can securely store client credentials"
                  : "Cannot securely store client credentials"}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting || isUpdating}
            className="mr-auto"
          >
            {isDeleting ? (
              "Deleting..."
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Application
              </>
            )}
          </Button>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isUpdating || isDeleting}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={isUpdating || isDeleting}>
              {isUpdating ? (
                "Updating..."
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Update Application
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
*/
/*
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Lock, Users, Trash2, Save, Eye, EyeOff } from "lucide-react";

import { useEffect, useState } from "react";
import {
  fetchClientFullDetails,
  ClientFullDetailsDto,
} from "../../services/clientapp-service";

interface ViewDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  clientId: string;
}

export default function ViewDetailsDialog({
  open,
  onClose,
  clientId,
}: ViewDetailsDialogProps) {
  const [clientApp, setClientApp] = useState<ClientFullDetailsDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [showClientSecret, setShowClientSecret] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    clientName: "",
    redirectUri: "",
    scopes: "",
  });

  // Fetch client details on open and clientId change
  useEffect(() => {
    if (!open || !clientId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchClientFullDetails(clientId);
        setClientApp(data);

        // Initialize formData from fetched data
        setFormData({
          clientName: data.clientName,
          redirectUri: data.redirectUri,
          scopes: data.scopes.join(" "),
        });
      } catch (e) {
        console.error("Failed to fetch client details", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [open, clientId]);

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex items-center justify-center">
          Loading client details...
        </DialogContent>
      </Dialog>
    );
  }

  if (!clientApp) return null;

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdate = async () => {
    // Your update logic here
  };

  const handleDelete = async () => {
    // Your delete logic here
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Application Details
          </DialogTitle>
          <DialogDescription>
            View and update the OAuth 2.0 client application configuration
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <section className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clientId">Client ID</Label>
                <Input
                  id="clientId"
                  value={clientApp.clientId || ""}
                  readOnly
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientSecret">Client Secret</Label>
                <div className="relative">
                  <Input
                    id="clientSecret"
                    type={showClientSecret ? "text" : "password"}
                    value={clientApp.clientSecret || "N/A"}
                    readOnly
                    className="bg-muted pr-10"
                  />
                  {clientApp.clientSecret && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowClientSecret(!showClientSecret)}
                    >
                      {showClientSecret ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientName">Client Name</Label>
              <Input
                id="clientName"
                value={formData.clientName}
                onChange={(e) =>
                  handleInputChange("clientName", e.target.value)
                }
                placeholder="Enter client name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="redirectUri">Redirect URI</Label>
              <Input
                id="redirectUri"
                value={formData.redirectUri}
                onChange={(e) =>
                  handleInputChange("redirectUri", e.target.value)
                }
                placeholder="Enter redirect URI"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="scopes">Scopes</Label>
              <Textarea
                id="scopes"
                value={formData.scopes}
                onChange={(e) => handleInputChange("scopes", e.target.value)}
                placeholder="Enter scopes (space-separated)"
                rows={3}
              />
            </div>
          </section>

          <Separator />

          <section className="space-y-4">
            <h3 className="text-lg font-semibold">Organization & Usage</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="organization">Organization</Label>
                <Input
                  id="organization"
                  value={clientApp.organizationName || ""}
                  readOnly
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="numberOfUsers">Number of Users</Label>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="numberOfUsers"
                    value={(clientApp.numberOfUsers || 0).toLocaleString()}
                    readOnly
                    className="bg-muted"
                  />
                </div>
              </div>
            </div>
          </section>

          <Separator />

          <section className="space-y-4">
            <h3 className="text-lg font-semibold">Application Type</h3>
          </section>
        </div>

        <DialogFooter className="flex justify-between">
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting || isUpdating}
            className="mr-auto"
          >
            {isDeleting ? (
              "Deleting..."
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Application
              </>
            )}
          </Button>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isUpdating || isDeleting}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={isUpdating || isDeleting}>
              {isUpdating ? (
                "Updating..."
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Update Application
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
*/

/* ──────────────────────────────────────────────────────────────────────────
   Client-app details dialog
   -------------------------------------------------------------------------
   – keeps your existing props (open | onClose | clientId)
   – fetches full details via fetchClientFullDetails
   – fancy Radix-style UI:
       • Header with avatar & badges
       • Tabs (Overview | Configuration | Security)
       • Pretty cards / stats
   – update & delete callbacks are left as TODOs
   – file must be saved as .tsx and used in a "use client" component
   – requires shadcn/ui (or identical component aliases) + lucide
   ---------------------------------------------------------------------- */

"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Lock,
  Globe,
  Users,
  Key,
  Building,
  LinkIcon,
  Eye,
  EyeOff,
  Save,
  Trash2,
  Edit3,
  Settings,
  Shield,
  Info,
  AppWindow,
} from "lucide-react";
import { toast } from "sonner";
import {
  ClientFullDetailsDto,
  fetchClientFullDetails,
  deleteClientApp,
} from "../../services/clientapp-service";

interface Props {
  open: boolean;
  onClose: () => void;
  clientId: string;
}

export default function ViewDetailsDialog({ open, onClose, clientId }: Props) {
  /* ───────────────────────── state ───────────────────────── */
  const [loading, setLoading] = useState(false);
  const [client, setClient] = useState<ClientFullDetailsDto | null>(null);

  const [showSecret, setShowSecret] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    clientName: "",
    redirectUri: "",
    scopes: "",
  });

  /* ─────────────────────── data fetch ────────────────────── */
  useEffect(() => {
    if (!open || !clientId) return;
    (async () => {
      setLoading(true);
      try {
        const data = await fetchClientFullDetails(clientId);
        setClient(data);
        setForm({
          clientName: data.clientName,
          redirectUri: data.redirectUri,
          scopes: data.scopes.join(" "),
        });
      } catch (e) {
        console.error("Failed to fetch client details", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [open, clientId]);
  const handleDeleteClick = async (client: ClientFullDetailsDto) => {
    try {
      await deleteClientApp(client.id);
      toast.success("Application deleted successfully.");
    } catch (error) {
      console.error("Failed to delete application", error);
      toast.error("Failed to delete client application: ");
    }
  };

  /* ───────────────────── helper callbacks ─────────────────── */
  const handleField =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSave = async () => {
    // TODO → call your PATCH/PUT endpoint, then refetch or update state
    setIsEditing(false);
  };
  const handleDelete = async () => {
    // TODO → call DELETE endpoint then onClose()
  };

  /* ─────────────────────── rendering ──────────────────────── */
  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] flex flex-col">
        {/* header */}
        <DialogHeader className="pb-4 border-b">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage alt={client?.clientName ?? ""} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {(client?.clientName ?? "CA")
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <DialogTitle className="text-xl">
                {client?.clientName}
              </DialogTitle>
              <DialogDescription className="text-sm">
                OAuth 2.0 client application configuration
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* body */}
        {loading ? (
          <div className="flex flex-1 items-center justify-center p-8">
            Loading details…
          </div>
        ) : client ? (
          <ScrollArea className="flex-1 overflow-y-auto">
            <Card className="m-4">
              <CardContent className="p-6 space-y-8">
                {/* ───── client credentials ───── */}
                <SubHeading icon={<Key className="h-5 w-5" />}>
                  Client Credentials
                </SubHeading>

                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    label="Client ID"
                    value={client.clientId}
                    readOnly
                    mono
                  />
                  <FormField
                    label="Client Secret"
                    value={client.clientSecret ?? "••••••••"}
                    secret
                    showSecret={showSecret}
                    toggleSecret={() => setShowSecret(!showSecret)}
                    readOnly
                    mono
                  />
                </div>

                <Separator />

                {/* ───── basic settings ───── */}
                <SubHeading icon={<Settings className="h-5 w-5" />}>
                  Basic Settings
                </SubHeading>

                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    label="Application Name"
                    value={form.clientName}
                    readOnly={!isEditing}
                    onChange={handleField("clientName")}
                  />
                  <FormField
                    label="Redirect URI"
                    value={form.redirectUri}
                    readOnly={!isEditing}
                    onChange={handleField("redirectUri")}
                  />
                </div>

                <FormField
                  label="OAuth Scopes"
                  value={form.scopes}
                  textarea
                  readOnly={!isEditing}
                  onChange={handleField("scopes")}
                  hint="Space-separated list of scopes"
                />

                <Separator />

                {/* ───── misc info ───── */}
                <SubHeading icon={<Info className="h-5 w-5" />}>
                  Additional Information
                </SubHeading>

                <div className="grid md:grid-cols-2 gap-4">
                  <DetailRow
                    icon={<Building className="h-4 w-4" />}
                    label="Organization"
                    value={client.organizationName || "—"}
                  />
                  <DetailRow
                    icon={<Users className="h-4 w-4" />}
                    label="Connected Users"
                    value={client.numberOfUsers.toString()}
                  />
                </div>
              </CardContent>

              {/* ───── footer inside card (update) ───── */}
              {isEditing && (
                <div className="flex justify-end gap-2 border-t p-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setForm({
                        clientName: client.clientName,
                        redirectUri: client.redirectUri,
                        scopes: client.scopes.join(" "),
                      });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" /> Save Changes
                  </Button>
                </div>
              )}
            </Card>

            {/* ───── danger zone ───── */}
            <Card className="m-4 border-destructive/20 bg-destructive/5">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-destructive">
                    Delete Application
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    This action cannot be undone.
                  </p>
                </div>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteClick(client)}
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </Button>
              </CardContent>
            </Card>
          </ScrollArea>
        ) : (
          <div className="flex flex-1 items-center justify-center p-8">
            Failed to load data.
          </div>
        )}

        {/* bottom action bar */}
        <DialogFooter className="pt-4">
          {!isEditing && (
            <Button
              variant="secondary"
              className="mr-auto"
              onClick={() => setIsEditing(true)}
            >
              <Edit3 className="h-4 w-4 mr-2" /> Edit Configuration
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ───────────────────────── helper sub-components ─────────────────────── */

function DetailRow({
  icon,
  label,
  value,
  mono = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-muted-foreground mt-1">{icon}</span>
      <div className="flex flex-col flex-1 min-w-0">
        <span className="text-sm font-medium text-muted-foreground">
          {label}
        </span>
        <span
          className={`text-sm ${
            mono ? "font-mono break-all" : ""
          } text-foreground`}
        >
          {value}
        </span>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="bg-primary/5 rounded-lg p-4 flex flex-col items-center justify-center">
      {icon}
      <span className="text-2xl font-bold mt-2">{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

function AppTypeCallout({ confidential }: { confidential: boolean }) {
  return (
    <div className="bg-muted/30 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        {confidential ? (
          <Lock className="h-4 w-4 text-blue-600" />
        ) : (
          <Globe className="h-4 w-4 text-green-600" />
        )}
        <span className="font-medium">
          {confidential ? "Confidential Client" : "Public Client"}
        </span>
      </div>
      <p className="text-sm text-muted-foreground">
        {confidential
          ? "Can securely store client credentials and authenticate with the authorization server."
          : "Cannot securely store client credentials (ideal for single-page or mobile apps)."}
      </p>
    </div>
  );
}

function SectionHeader({
  title,
  description,
  right,
}: {
  title: string;
  description?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h3 className="text-lg font-medium">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {right}
    </div>
  );
}

function SubHeading({
  children,
  icon,
  className = "",
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {icon} <h4 className="text-lg font-medium">{children}</h4>
    </div>
  );
}

function FormField({
  label,
  value,
  onChange,
  readOnly = false,
  textarea = false,
  mono = false,
  hint,
  secret = false,
  showSecret,
  toggleSecret,
}: {
  label: string;
  value: string;
  onChange?: (e: React.ChangeEvent<any>) => void;
  readOnly?: boolean;
  textarea?: boolean;
  mono?: boolean;
  hint?: string;
  secret?: boolean;
  showSecret?: boolean;
  toggleSecret?: () => void;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="relative">
        {textarea ? (
          <Textarea
            value={value}
            onChange={onChange}
            rows={3}
            readOnly={readOnly}
            className={`${readOnly ? "bg-muted/50" : ""} ${
              mono ? "font-mono" : ""
            }`}
          />
        ) : (
          <Input
            type={secret && !showSecret ? "password" : "text"}
            value={value}
            onChange={onChange}
            readOnly={readOnly}
            className={`${readOnly ? "bg-muted/50" : ""} ${
              mono ? "font-mono" : ""
            } pr-10`}
          />
        )}
        {secret && toggleSecret && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3"
            onClick={toggleSecret}
          >
            {showSecret ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
