"use client";

import {
  LayoutGrid,
  Users,
  SquareActivity,
  Hotel,
  Search,
  Settings,
  ChevronRight,
} from "lucide-react";

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

import { NavUser } from "./nav-user";

const items = [
  {
    title: "Application Management",
    icon: LayoutGrid,
    subItems: [
      { title: "Applications", url: "#" },
      { title: "SSO Integration", url: "#" },
    ],
  },
  {
    title: "User Management",
    icon: Users,
    subItems: [
      { title: "Users", url: "/dashboard/Users" },
      { title: "Roles", url: "#" },
    ],
  },
  {
    title: "Organizations",
    icon: Hotel,
    subItems: [],
  },
  {
    title: "Activity",
    icon: SquareActivity,
    subItems: [],
  },
  {
    title: "Search",
    icon: Search,
    subItems: [],
  },
  {
    title: "Settings",
    icon: Settings,
    subItems: [],
  },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="mb-6 flex items-center gap-2">
            <img src="/logo-dashboard.png" alt="Logo" className="h-5 w-5" />
            <span>Dashboard</span>
          </SidebarGroupLabel>
          <SidebarMenu>
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
                              <a href={subItem.url}>
                                <span>{subItem.title}</span>
                              </a>
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
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
