"use client";

import { useState, useEffect } from "react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Eye, EyeOff, Mail, Shield, User, X } from "lucide-react";
import {
  acceptInvitation,
  getInvitationDetails,
} from "../../dashboard/services/invitation-service";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function PasswordSetting() {
  const searchParams = useSearchParams();
  const router = useRouter();
  //const token = searchParams.get("token") || "";
  const token = searchParams.get("token") || "";

  const [invitation, setInvitation] = useState<{
    organizationName: string;
    inviterFullName: string;
    email: string;
    role?: string;
    inviterRole?: string;
    expiresAt?: string;
    organizationLogo?: string;
  } | null>(null);

  const [isInvitationValid, setIsInvitationValid] = useState<boolean | null>(
    null
  );
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!token) return;

    getInvitationDetails(token)
      .then((data) => {
        setInvitation(data);
        setIsInvitationValid(true);
      })
      .catch(() => {
        setIsInvitationValid(false);
      });
  }, [token]);

  const validatePassword = (pwd: string) => {
    const validationErrors: string[] = [];
    if (pwd.length < 8) validationErrors.push("Minimum 8 characters required");
    if (!/[A-Z]/.test(pwd))
      validationErrors.push("Must contain an uppercase letter");
    if (!/[a-z]/.test(pwd))
      validationErrors.push("Must contain a lowercase letter");
    if (!/\d/.test(pwd)) validationErrors.push("Must contain a number");
    if (!/[!@#$%^&*(),.?\":{}|<>]/.test(pwd))
      validationErrors.push("Must contain a special character");
    return validationErrors;
  };

  const handleAcceptInvitation = async () => {
    const validationErrors = validatePassword(password);
    if (password !== confirmPassword)
      validationErrors.push("Passwords do not match");

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setErrors([]);
    setSuccessMessage("");

    try {
      await acceptInvitation({ token, password });
      setSuccessMessage("Account created successfully! Redirecting...");

      router.push("/dashboard/organization/users-assignment-per-org");
    } catch (error: any) {
      setErrors([error.message || "Failed to accept invitation."]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isInvitationValid === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <X className="h-6 w-6 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Invalid Invitation
              </h2>
              <p className="text-gray-600">
                This invitation link is invalid or has expired. Please contact
                your administrator for a new invitation.
              </p>
              <Button variant="outline" onClick={() => router.push("/")}>
                Go to Homepage
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {invitation && (
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={invitation.organizationLogo || "/placeholder.svg"}
                  alt={invitation.organizationName}
                />
                <AvatarFallback className="text-lg bg-blue-600 text-white">
                  {invitation.organizationName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Join {invitation.organizationName}
            </h1>
            <p className="text-gray-600">
              Complete your account setup to get started
            </p>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Invitation Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Organization</span>
                  <span className="font-medium">
                    {invitation.organizationName}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Your Email</span>
                  <span className="font-medium">{invitation.email}</span>
                </div>
                {invitation.role && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Role</span>
                    <Badge variant="secondary">{invitation.role}</Badge>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Invited by</span>
                  <div className="text-right">
                    <div className="font-medium">
                      {invitation.inviterFullName}
                    </div>
                    {invitation.inviterRole && (
                      <div className="text-xs text-gray-500">
                        {invitation.inviterRole}
                      </div>
                    )}
                  </div>
                </div>
                {invitation.expiresAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Expires</span>
                    <span className="text-sm">
                      {new Date(invitation.expiresAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Password Form */}
        <Card className="shadow-xl rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5 text-indigo-600" />
              Set Your Password
            </CardTitle>
            <CardDescription>
              Create a secure password for your account
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {errors.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <ul className="list-disc list-inside space-y-1">
                    {errors.map((err, idx) => (
                      <li key={idx}>{err}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {successMessage && (
              <Alert
                variant="default"
                className="text-green-600 border-green-300 bg-green-50"
              >
                {successMessage}
              </Alert>
            )}

            <Button
              onClick={handleAcceptInvitation}
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 transition-colors"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Account...
                </>
              ) : (
                <>
                  <User className="mr-2 h-4 w-4" />
                  Accept Invitation
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
