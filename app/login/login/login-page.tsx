"use client";

import { useState } from "react";
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
import { Building2, ArrowLeft, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mock organization from URL params
  const orgName = "acme-corp";
  const orgDisplayName = "Acme Corporation";

  const handleLogin = async () => {
    setIsLoading(true);
    // Simulate login
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Login successful");
    setIsLoading(false);
  };

  const handleBackToOrg = () => {
    // Navigate back to organization selection
    console.log("Back to organization selection");
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
            Sign in to {orgDisplayName}
          </h1>
          <p className="text-gray-600">{orgName}.workspace.com</p>
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
            {/* Email Input */}
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

            {/* Password Input */}
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

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  //    onCheckedChange={setRememberMe}
                />
                <Label htmlFor="remember" className="text-sm">
                  Remember me
                </Label>
              </div>
              <button className="text-sm text-blue-600 hover:underline">
                Forgot password?
              </button>
            </div>

            {/* Sign In Button */}
            <Button
              onClick={handleLogin}
              disabled={!email || !password || isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>

            {/* SSO Options */}
            <div className="space-y-3">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <Button variant="outline" className="w-full">
                <svg
                  className="h-4 w-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 0C5.373 0 0 5.373 0 12a12 12 0 008.205 11.385c.6.111.82-.26.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.085 1.84 1.24 1.84 1.24 1.07 1.834 2.807 1.304 3.492.997.108-.775.419-1.305.762-1.605-2.665-.303-5.467-1.332-5.467-5.93 0-1.31.467-2.381 1.236-3.221-.124-.303-.536-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 016.003 0c2.29-1.552 3.296-1.23 3.296-1.23.655 1.653.243 2.873.12 3.176.77.84 1.235 1.911 1.235 3.22 0 4.61-2.807 5.624-5.48 5.921.43.371.823 1.104.823 2.224v3.293c0 .319.218.694.825.576A12.003 12.003 0 0024 12c0-6.627-5.373-12-12-12z"
                    clipRule="evenodd"
                  />
                </svg>
                Continue with GitHub
              </Button>

              <Button variant="outline" className="w-full">
                <svg
                  className="h-4 w-4 mr-2"
                  viewBox="0 0 533.5 544.3"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M533.5 278.4c0-17.7-1.6-35-4.8-51.7H272v97.9h147.3c-6.4 34.6-25.8 63.9-55 83.5v68.9h88.8c52-47.9 80.4-118.5 80.4-198.6z"
                    fill="#4285f4"
                  />
                  <path
                    d="M272 544.3c73.2 0 134.6-24.3 179.4-66.1l-88.8-68.9c-24.7 16.6-56.4 26.4-90.6 26.4-69.7 0-128.7-47-149.8-110.1H30.2v69.5c44.3 88.1 135.3 149.2 241.8 149.2z"
                    fill="#34a853"
                  />
                  <path
                    d="M122.2 325.6c-10.4-30.5-10.4-63.3 0-93.8V162.3H30.2c-40.7 81.6-40.7 178.1 0 259.7l92-70.4z"
                    fill="#fbbc04"
                  />
                  <path
                    d="M272 107.7c38.6-.6 75.7 13.8 104.2 40.4l78.1-78.1C402.6 26.5 338.7-.3 272 0 166.5 0 75.5 61.1 30.2 149.2l92 69.5c21-63.1 80-111.1 149.8-111z"
                    fill="#ea4335"
                  />
                </svg>
                Continue with Google
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Back to Organization */}
        <div className="text-center">
          <button
            onClick={handleBackToOrg}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to organization selection
          </button>
        </div>

        {/* Footer */}
        <div className="text-center space-y-2">
          <p className="text-xs text-gray-500">
            New to {orgDisplayName}?
            <button className="text-blue-600 hover:underline ml-1">
              Contact your administrator
            </button>
          </p>
          <div className="flex justify-center space-x-4 text-xs text-gray-400">
            <button className="hover:text-gray-600">Privacy Policy</button>
            <button className="hover:text-gray-600">Terms of Service</button>
            <button className="hover:text-gray-600">Help</button>
          </div>
        </div>
      </div>
    </div>
  );
}
