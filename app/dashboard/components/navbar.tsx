/*"use client";

import { Menu, User } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { logoutUser } from "../services/user-service";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import * as Icon from "react-feather";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
export function Navbar() {
  const router = useRouter();
  const handleLogout = async () => {
    try {
      await logoutUser();
      router.push("/");
    } catch (error) {
      console.error("Error to deconnect :", error);
    }
  };
  return (
    <header className="sticky top-0 z-50 w-full bg-sidebar text-sm py-4 border-b ">
      <nav
        className="w-full max-w-full px-4 flex items-center justify-start gap-6 "
        aria-label="Global"
      >
        
        <div className="flex items-center gap-4">
          <div className="sm:hidden">
            <Sheet>
              <SheetTrigger className="text-red mt-1.5">
                <Menu />
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[340px]">
                <SheetHeader>
                  <SheetTitle className="text-left text-xl font-bold ml-3">
                    Admin Dashboard
                  </SheetTitle>
                  <SheetDescription />
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </div>
          <a>
            <SidebarTrigger />
          </a>
          <a href="/dashboard" className="text-xl font-semibold text-black">
            Admin Dashboard
          </a>
        </div>

        <div className="ml-240">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <span className="text-blackS cursor-pointer">
                <User size={20} />
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem
                className="text-red-400 py-2"
                onClick={handleLogout}
              >
                <Icon.LogOut size={15} className="mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </header>
  );
}
*/
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
import { fetchCurrentUser } from "../services/user-service";
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
          name: [userData.firstName, userData.lastName]
            .filter(Boolean)
            .join(" "),
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
      // await logoutUser()
      router.push("/");
    } catch (error) {
      console.error("Error to disconnect:", error);
    }
  };

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-4">
      {/* Left Section - Sidebar Trigger and Title */}
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />

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
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search organizations, users, logs..."
              className="w-full pl-10 pr-4 h-8 bg-gray-50 border-gray-200 focus:bg-white text-sm"
            />
          </div>
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

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 relative">
              <Bell className="h-4 w-4" />
              <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs bg-red-500 hover:bg-red-500 flex items-center justify-center">
                3
              </Badge>
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              Notifications
              <Badge variant="secondary" className="text-xs">
                3 new
              </Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex flex-col items-start p-4 cursor-pointer">
              <div className="font-medium">New user registered</div>
              <div className="text-sm text-gray-500">
                john.smith@company.com joined your organization
              </div>
              <div className="text-xs text-gray-400 mt-1">2 minutes ago</div>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start p-4 cursor-pointer">
              <div className="font-medium">Security alert</div>
              <div className="text-sm text-gray-500">
                Failed login attempt detected
              </div>
              <div className="text-xs text-gray-400 mt-1">1 hour ago</div>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start p-4 cursor-pointer">
              <div className="font-medium">System update</div>
              <div className="text-sm text-gray-500">
                New features are now available
              </div>
              <div className="text-xs text-gray-400 mt-1">3 hours ago</div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center text-blue-600 cursor-pointer">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

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
