import type React from "react";
import { FormProvider } from "./FormContext";
import StepNavigation from "./stepNavigation/page";
import { Card, CardContent } from "@/components/ui/card";
export default function ClientRegistrationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FormProvider>
      <div className="flex flex-1 flex-col gap-6 p-6 min-h-screen bg-white">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">
              Client App Registration
            </h1>
            <p className="text-muted-foreground">
              Register a new application to integrate with your SSO system.
            </p>
          </div>
        </div>
        {/* Main Card */}
        <Card className="w-full max-w-full lg:max-w-5xl rounded-xl shadow-lg overflow-x-auto">
          <CardContent className="flex flex-col lg:flex-row p-0">
            {/* Sidebar */}
            <div className="w-full lg:w-2/5 p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-gray-200 bg-white">
              <StepNavigation />
            </div>

            {/* Form Area */}
            <div className="w-full lg:w-3/5 p-6 lg:p-10 bg-white flex flex-col min-h-[600px]">
              {children}
            </div>
          </CardContent>
        </Card>
      </div>
    </FormProvider>
  );
}
