import React from "react";
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
          {/* Sidebar */}
          <div className="w-full md:w-1/3 p-6 md:p-8 bg-white border-b md:border-b-0 md:border-r border-gray-200">
            <StepNavigation />
          </div>

          {/* Form Area */}
          <div className="w-full md:w-2/3 p-6 md:p-10 bg-white flex flex-col min-h-[600px]">
            {children}
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
