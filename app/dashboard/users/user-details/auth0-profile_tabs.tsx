import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import {
  User,
  Shield,
  Smartphone,
  Activity,
  Settings,
  Crown,
  Key,
  Globe,
  Clock,
  Unlock,
  Fingerprint,
  BadgeCheck,
} from "lucide-react";
type Props = {
  userId: string;
};
type ConnectedApp = {
  logo: string;
  clientName: string;
  clientId: string;
  connectedAt: string; // ISO date string
};
export default function Component({ userId }: Props) {
  const [apps, setApps] = useState<ConnectedApp[]>([]);
  useEffect(() => {
    const fetchApps = async () => {
      try {
        const res = await fetch(
          `http://localhost:5054/OAuth/AppsPerUser/${userId}`
        );
        if (!res.ok) throw new Error("Failed to fetch connected apps");
        const data = await res.json();
        setApps(data);
      } catch (error) {
        console.error("Error loading connected apps:", error);
      }
    };

    fetchApps();
  }, [userId]);
  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Profile Header */}
      <div className="mb-8 ">
        <Card>
          <CardContent className="pt-6 ">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src="/placeholder.svg?height=80&width=80"
                  alt="Profile"
                />
                <AvatarFallback className="text-lg">MT</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h1 className="text-2xl font-bold">Manel Tarhouni</h1>
                <p className="text-muted-foreground">
                  Manel.Tarhouni@esprit.tn
                </p>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">Verified</Badge>
                  <Badge variant="outline">Admin</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profile Tabs */}
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="applications" className="flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            Apps
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Logs
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center gap-2">
            <Unlock className="h-4 w-4" />
            Permissions
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center gap-2">
            <BadgeCheck className="h-4 w-4" />
            Roles
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="mt-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your personal details and profile information.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue="John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue="Doe" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue="john.doe@company.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" defaultValue="+1 (555) 123-4567" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" defaultValue="Acme Corp" />
                </div>
                <Button className="bg-cyan-600 hover:bg-cyan-700 text-white">
                  Save Changes
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
                <CardDescription>
                  Upload a new profile picture or remove the current one.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src="/placeholder.svg?height=64&width=64"
                      alt="Profile"
                    />
                    <AvatarFallback>MT</AvatarFallback>
                  </Avatar>
                  <div className="space-x-2">
                    <Button
                      variant="outline"
                      className="bg-white text-cyan-600"
                    >
                      Upload New
                    </Button>
                    <Button variant="outline" className="bg-white text-red-500">
                      Remove
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Danger Zone</CardTitle>
                <CardDescription>
                  Irreversible and destructive actions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
                    <div>
                      <p className="font-medium text-red-600">Delete Account</p>
                      <p className="text-sm text-muted-foreground">
                        Permanently delete your account and all data
                      </p>
                    </div>
                    <Button variant="destructive">Delete</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="mt-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>
                  Change your password to keep your account secure.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
                <Button className="bg-cyan-600 text-white">
                  Update Password
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>
                  Add an extra layer of security to your account.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">SMS Authentication</p>
                    <p className="text-sm text-muted-foreground">
                      Receive codes via SMS
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">Authenticator App</p>
                    <p className="text-sm text-muted-foreground">
                      Use an authenticator app
                    </p>
                  </div>
                  <Switch />
                </div>
                <Button variant="outline" className="w-full">
                  <Key className="h-4 w-4 mr-2" />
                  Setup Authenticator
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Applications Tab */}
        <TabsContent value="applications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Connected Applications</CardTitle>
              <CardDescription>
                Manage applications that have access to your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {apps.length === 0 ? (
                  <p className="text-muted-foreground">
                    No connected apps found.
                  </p>
                ) : (
                  apps.map((app, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                          {app.logo ? (
                            <img
                              src={`http://localhost:5054/${app.logo}`}
                              alt={app.clientName}
                              className="h-8 w-8 object-contain"
                            />
                          ) : (
                            <Globe className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{app.clientName}</p>
                          <p className="text-sm text-muted-foreground">
                            Client ID: {app.clientId}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm">
                            Connected{" "}
                            {new Date(app.connectedAt).toLocaleString()}
                          </p>
                          <Badge variant="default">Active</Badge>
                        </div>
                        <Button variant="outline" size="sm">
                          Revoke
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        {/* Logs Tab */}
        <TabsContent value="logs" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Activity Logs</CardTitle>
              <CardDescription>
                View your recent account activity and login history.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    action: "Successful Login",
                    details: "",
                    time: "2 minutes ago",
                    type: "success",
                  },
                  {
                    action: "Password Changed",
                    details: "",
                    time: "2 hours ago",
                    type: "warning",
                  },
                  {
                    action: "Failed Login Attempt",
                    details: "",
                    time: "1 day ago",
                    type: "error",
                  },
                  {
                    action: "Profile Updated",
                    details: "",
                    time: "2 days ago",
                    type: "info",
                  },
                  {
                    action: "New Device Login",
                    details: "",
                    time: "3 days ago",
                    type: "warning",
                  },
                ].map((log, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-4 border rounded-lg"
                  >
                    <div
                      className={`h-2 w-2 rounded-full ${
                        log.type === "success"
                          ? "bg-green-500"
                          : log.type === "warning"
                          ? "bg-yellow-500"
                          : log.type === "error"
                          ? "bg-red-500"
                          : "bg-blue-500"
                      }`}
                    />
                    <div className="flex-1">
                      <p className="font-medium">{log.action}</p>
                      <p className="text-sm text-muted-foreground">
                        {log.details}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">{log.time}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        {/* permissions Tab */}
        <TabsContent value="permissions" className="mt-6"></TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="mt-6">
          <div className="grid gap-6"></div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
