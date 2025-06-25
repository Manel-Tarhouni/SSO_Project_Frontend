"use client";

import {
  Bell,
  ChevronDown,
  Search,
  Settings,
  User,
  LogOut,
  HelpCircle,
} from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { fetchCurrentUser, logoutUser } from "../services/user-service";
import { useEffect, useState } from "react";

export function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<{
    name: string;
    email: string;
  } | null>(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const userData = await fetchCurrentUser();

        setUser({
          name: userData.name,
          email: userData.email,
        });
      } catch (error) {
        console.error("Error fetching current user", error);
      }
    };

    getUser();
  }, []);

  if (!user) return null;
  const handleLogout = async () => {
    try {
      await logoutUser();
      router.push("/login-dashboard/organization-entry");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-4">
      {/* Left Section - Sidebar Trigger and Title */}
      <div className="flex items-center gap-2">
        {/*   <SidebarTrigger className="-ml-1" />*/}

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <h1 className="text-sm font-semibold text-gray-900">
              Admin Dashboard
            </h1>
          </div>
        </div>
      </div>

      {/* Center Section - Search */}
      <div className="flex flex-1 items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="relative"></div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Search Button (Mobile) */}
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 md:hidden">
          <Search className="h-4 w-4" />
          <span className="sr-only">Search</span>
        </Button>

        {/* Help */}
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <HelpCircle className="h-4 w-4" />
          <span className="sr-only">Help</span>
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 px-2 gap-2 hover:bg-gray-50">
              <Avatar className="h-6 w-6">
                <AvatarImage
                  src={"/placeholder.svg"} // Replace with user avatar if available
                  alt={user.name}
                />
                <AvatarFallback className="text-xs">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="hidden lg:flex flex-col items-start">
                <span className="text-xs font-medium text-gray-900">
                  {user.name}
                </span>
              </div>
              <ChevronDown className="h-3 w-3 text-gray-400" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              Account Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Bell className="mr-2 h-4 w-4" />
              Notification Settings
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="cursor-pointer">
              <HelpCircle className="mr-2 h-4 w-4" />
              Help & Support
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
