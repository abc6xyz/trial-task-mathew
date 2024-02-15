"use client"

import { useState } from "react";

import { Button } from "@/components/ui/button"
import { DashboardDialog } from "@/components/dialogs/dashboard"
import { ChevronRightIcon } from "@radix-ui/react-icons"
import { cn } from "@/lib/utils"
import { useSidebar } from "@/hooks/useSidebar";
import { SideNav } from "./side-nav";

export default function Sidebar() {
  const { isOpen, toggle } = useSidebar()
  const [ status, setStatus ] = useState(false)
  
  const handleToggle = () => {
    setStatus(true);
    toggle();
    setTimeout(() => setStatus(false), 500);
  };

  return (
    <nav
      className={cn(
        `relative hidden h-screen border-r pt-20 md:block`,
        status && "duration-500",
        isOpen ? "w-72" : "w-[78px]",
      )}
    >
      <Button variant="outline" size="icon" onClick={handleToggle}
        className={cn(
          "absolute -right-5 top-20 cursor-pointer",
          !isOpen && "rotate-180"
        )}>
        <ChevronRightIcon className="h-5 w-5" />
      </Button>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="mt-3 space-y-1">
            <DashboardDialog />
            <SideNav />
          </div>
        </div>
      </div>
    </nav>
  )
}
