"use client";

import type React from "react";
import { getOrganizationIdByName } from "../../dashboard/services/organization-service"; // adjust the path if needed

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
import { Building2, ArrowRight, Clock, Check } from "lucide-react";

export default function OrganizationEntry() {
  const [orgName, setOrgName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = async () => {
    if (!orgName.trim()) return;

    setIsLoading(true);

    try {
      const orgId = await getOrganizationIdByName(orgName.trim());

      if (!orgId) {
        alert("Organization not found.");
        setIsLoading(false);
        return;
      }

      window.location.href = `http://localhost:3000/login-dashboard/login?orgId=${orgId}`;
    } catch (error) {
      console.error("Error fetching organization ID:", error);
      alert("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleContinue();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}

        {/* Main Card */}
        <Card className="shadow-lg">
          <CardHeader>
            {/*    <CardTitle>Enter Organization</CardTitle>
            <CardDescription>
              Enter your organization's name to access your workspace
            </CardDescription>*/}
            <div className="text-center space-y-2">
              <div className="flex justify-center">
                <div className="h-20 w-20  rounded-lg flex items-center justify-center">
                  <img
                    src="/logo-dashboard.png"
                    alt="Logo"
                    className="h-10 w-10 text-white mr-4"
                  />
                </div>
              </div>
              <h1 className="text-2xl font-semibold text-gray-800 -mt-2">
                Enter Organization
              </h1>
              <p className="text-gray-600">
                Enter your organization name to continue
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Organization Input */}
            <div className="space-y-2">
              <div className="relative">
                <Input
                  id="organization"
                  placeholder="Enter your Organization Name* "
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pr-20"
                />
                {/*     <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                  .workspace.com
                </div>*/}
              </div>
            </div>

            {/* Continue Button */}
            <Button
              onClick={handleContinue}
              disabled={!orgName.trim() || isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Verifying...
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>

            {/* Recent Organizations 
            {recentOrgs.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>Recent organizations</span>
                </div>
                <div className="space-y-2">
                  {recentOrgs.map((org, index) => (
                    <button
                      key={index}
                      onClick={() => handleOrgSelect(org.name)}
                      className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 bg-gray-100 rounded-md flex items-center justify-center">
                          <Building2 className="h-4 w-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            {org.displayName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {org.name}.workspace.com
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    </button>
                  ))}
                </div>
              </div>
            )}*/}
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <div className="h-5 w-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="h-3 w-3 text-blue-600" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-blue-900">
                  Need help finding your organization?
                </p>
                <p className="text-xs text-blue-700">
                  Contact your administrator or check your welcome email for the
                  correct organization name.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
