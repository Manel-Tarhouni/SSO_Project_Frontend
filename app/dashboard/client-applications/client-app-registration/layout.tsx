/*import React from "react";
import { FormProvider } from "./FormContext";
import StepNavigation from "./stepNavigation/page";

export default function ClientRegistrationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FormProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center px-6 py-12">
        <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white shadow-xl rounded-3xl overflow-hidden transition-all">
        
          <div className="w-full md:w-1/3 p-6 md:p-8 bg-white border-b md:border-b-0 md:border-r border-gray-200">
            <StepNavigation />
          </div>

      
          <div className="w-full md:w-2/3 p-6 md:p-10 bg-white flex flex-col min-h-[600px]">
            {children}
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
*/

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
        <Card className="w-full max-w-6xl mx-auto rounded-xl shadow-lg overflow-hidden">
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
