/*"use client";

import { fetchUserManagementSummaries } from "../services/user-service";
import { UserRow, columns } from "./columns";
import { DataTable } from "./data-table";
import { ClientCreateUserWrapper } from "./createuser-wrapper";
export default async function DemoPage() {
  // const users: UserRow[] = await fetchUserManagementSummaries();

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
        <div className="w-full"></div>
      </div>
    </div>
  );
}
*/
"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Search } from "lucide-react";

import { fetchUserManagementSummaries } from "../services/user-service";
import { UserManagementSummary } from "../services/user-service";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ClientCreateUserWrapper } from "./createuser-wrapper";

export default function UserManagementPage() {
  const [users, setUsers] = useState<UserManagementSummary[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchUserManagementSummaries();
        setUsers(data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return users.filter(
      (u) =>
        u.email.toLowerCase().includes(q) ||
        `${u.firstname} ${u.lastname}`.toLowerCase().includes(q)
    );
  }, [users, searchQuery]);

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
          <p className="text-sm text-gray-600 mt-1">
            A user-friendly interface that allows administrators to efficiently
            handle user accounts.
          </p>
        </div>
        <ClientCreateUserWrapper />
      </div>

      {/* Card */}
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>Manage all platform users</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              disabled={loading}
            />
          </div>

          {/* User List */}
          {loading ? (
            <Skeleton className="w-full h-[300px] rounded-md" />
          ) : filteredUsers.length > 0 ? (
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between border p-4 rounded-md"
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback>
                        {user.firstname[0]}
                        {user.lastname[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {user.firstname} {user.lastname}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {user.email}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 text-right">
                    <div>{user.organizationCount} orgs</div>
                    <div>{user.roleCount} roles</div>
                    <div>{user.ClientAppCount} apps</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground pt-10">
              No users found.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
