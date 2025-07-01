"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import {
  LayoutGrid,
  Users,
  SquareActivity,
  Hotel,
  Settings,
  ChevronRight,
  Bell,
  ChevronDown,
  User,
  LogOut,
  HelpCircle,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { fetchCurrentUser, logoutUser } from "../services/user-service";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";

import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";

const items = [
  {
    title: "Applications",
    icon: LayoutGrid,
    subItems: [
      {
        title: "Applications Management",
        url: "/dashboard/client-applications/client-apps-management",
      },
    ],
  },
  {
    title: "Users",
    icon: Users,
    subItems: [
      { title: "Users Management", url: "/dashboard/users" },
      {
        title: "Roles Management",
        url: "/dashboard/organization/roles",
      },
    ],
  },
  {
    title: "Organizations",
    icon: Hotel,
    subItems: [
      { title: "Organizations Management", url: "/dashboard/organization" },
      {
        title: "Invitations ",
        url: "/dashboard/organization/users-assignment-per-org",
      },
    ],
  },
  {
    title: "Activity",
    icon: SquareActivity,
    subItems: [],
  },
];

export function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();
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
    <Sidebar collapsible="icon">
      <SidebarContent>
        {/*}     <div className="flex justify-end p-2">
          <SidebarTrigger className="shrink-0 data-[collapsed=false]:hidden" />
        </div>
        <SidebarGroup>
          <SidebarGroupLabel className="mb-6 flex items-center gap-2">
            <img src="/logo-dashboard.png" alt="Logo" className="h-5 w-5" />
            <span>Dashboard</span>
          </SidebarGroupLabel> */}
        <SidebarGroup>
          <SidebarGroupLabel className="mb-6 flex items-center justify-between gap-2 px-2">
            <div className="flex items-center gap-2">
              <img src="/logo-dashboard.png" alt="Logo" className="h-5 w-5" />
              <span>Dashboard</span>
            </div>
          </SidebarGroupLabel>

          <SidebarMenu>
            <SidebarMenuItem className="flex justify-end">
              <SidebarTrigger className="shrink-0" />
            </SidebarMenuItem>
            {items.map((item) => (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                      {item.icon && <item.icon className="h-4 w-4" />}
                      <span>{item.title}</span>
                      {item.subItems.length > 0 && (
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      )}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {item.subItems.length > 0 && (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.subItems.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild>
                              <Link
                                href={subItem.url}
                                className="flex flex-1 items-center"
                              >
                                {subItem.title}
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  )}
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-2 border-t">
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
      </SidebarFooter>
    </Sidebar>
  );
}
