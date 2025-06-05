"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Building2, Eye, EyeOff } from "lucide-react";

import { loginToOrganization } from "../../dashboard/services/organization-service";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const orgId = searchParams.get("orgId") || "";
  const orgDisplayName = "Acme Corporation"; // Ideally fetched dynamically using orgId or passed as param
  const orgName = "acme-corp"; // Same as above

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!orgId) {
      alert("Organization ID is missing.");
      return;
    }
    setIsLoading(true);
    try {
      const accessToken = await loginToOrganization({
        email,
        password,
        organizationId: orgId,
      });
      console.log("Access token:", accessToken);

      // Save token and redirect
      localStorage.setItem("accessToken", accessToken);
      console.log("Redirecting now...");
      router.push("/dashboard/organization/users-assignment-per-org");
      console.log("Redirect triggered");
    } catch (error: any) {
      alert(error.message || "Login failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <Building2 className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Sign in to dashboard
          </h1>
        </div>

        {/* Login Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>
              Enter your credentials to access your workspace
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              onClick={handleLogin}
              disabled={isLoading || !email || !password}
              className="w-full"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
