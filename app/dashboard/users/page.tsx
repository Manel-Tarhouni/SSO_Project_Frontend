/*"use client";

import { fetchUserManagementSummaries } from "../services/user-service";
import { UserRow, columns } from "./columns";
import { DataTable } from "./data-table";
import { ClientCreateUserWrapper } from "./createuser-wrapper";
export default async function DemoPage() {
  const users: UserRow[] = await fetchUserManagementSummaries();

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
    
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
          <p className="text-sm text-gray-600 mt-1">
            A user-friendly interface that allows administrators to efficiently
            handle user accounts — from creating and managing access to
            resetting passwords, suspending, or removing users.
          </p>
        </div>

        <ClientCreateUserWrapper />
      </div>

      <div className="overflow-x-auto max-w-6xl px-4">
        <div className="w-full">
          <DataTable columns={columns} data={users} />
        </div>
      </div>
    </div>
  );
}*/
"use client";

export default async function DemoPage() {
  return <div className="flex flex-1 flex-col gap-4 p-4 pt-0"></div>;
}
