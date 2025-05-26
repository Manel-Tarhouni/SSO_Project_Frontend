"use client";

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
        {/* Menu + Admin Dashboard title */}
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
