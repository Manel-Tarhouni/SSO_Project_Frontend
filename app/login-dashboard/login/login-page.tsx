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
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";

import { loginToOrganization } from "../../dashboard/services/user-service";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const orgId = searchParams.get("orgId") || "";

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
      // router.push("/dashboard/organization/users-assignment-per-org");
      router.push("/dashboard/organization");
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

        {/* Login Card */}
        <Card className="shadow-lg">
          {/*     <CardHeader>
            <div className="text-center space-y-2">
              <div className="flex justify-center">
                <div className="h-20 w-20  rounded-lg flex items-center justify-center">
                  <img
                    src="/logo-dashboard.png"
                    alt="Logo"
                    className="h-10 w-10 text-white mr-4"
                  />{" "}
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome</h1>
            </div>
           
            <CardDescription>
              Enter your credentials to access your workspace
            </CardDescription>
          </CardHeader>*/}
          <CardHeader className="flex flex-col items-center space-y-3">
            <div className="flex justify-center">
              <div className="h-20 w-20 rounded-lg flex items-center justify-center">
                <img
                  src="/logo-dashboard.png"
                  alt="Logo"
                  className="h-10 w-10"
                />
              </div>
            </div>

            <h1 className="text-2xl font-semibold text-gray-800 -mt-2">
              Welcome to dashboard
            </h1>

            <CardDescription className="text-center text-sm text-gray-600">
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
              <div>
                <a
                  href="/forgot-password"
                  className="text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  Forgot password?
                </a>
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
