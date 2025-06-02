/*"use client";

import { Hotel } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div className="min-h-screen w-screen bg-gray-100 px-8 py-10">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4 max-w-6xl px-4">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold text-gray-800">
            Organization Management
          </h1>
          <p className="text-base text-gray-600 mt-2">
            Manage the organizations you do business with and customize the
            experience their users have when accessing your applications.
          </p>

      
          <div className="flex justify-center items-center px-4 mt-12">
            <div className="bg-white rounded-2xl shadow-2xl p-16 w-full max-w-4xl flex flex-col items-center">
          
              <Hotel className="text-gray-400 mb-8" size={100} />

 
              <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
                No organizations have been created yet.
              </h2>
              <p className="text-base text-gray-500 mb-8 text-center max-w-lg">
                You can create an organization to get started and manage how
                users interact with your applications.
              </p>

            
              <div className="w-full flex justify-center pl-10">
                <Button className="text-lg px-6 py-4 bg-gray-700 hover:bg-gray-800 text-white">
                  Create Organization
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
*/
"use client";

import { useState } from "react";
import OrganizationsPage from "./organization-page";

export default function Page() {
  return <OrganizationsPage />;
}
