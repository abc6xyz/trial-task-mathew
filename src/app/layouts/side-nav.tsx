"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { useSidebar } from "@/hooks/useSidebar";
import { useDashboard } from "@/providers/dashboardProvider";
import { Layout } from "@prisma/client";

export function SideNav() {
  const path = usePathname();
  const { isOpen } = useSidebar();
  const { layouts, selectLayout, selectedLayout } = useDashboard();

  return (
    <nav className="space-y-2">
      { layouts.length > 0 ?
      layouts.map((item, index) =>
        (
          <Link
            key={item.layout_id}
            href={'#'}
            className={cn(
              buttonVariants({ variant: 'ghost' }),
              'group relative flex h-12 justify-start',
              selectedLayout === index && 'bg-muted font-bold hover:bg-muted',
            )}
            onClick={()=>selectLayout(index)}
          >
            <Icons.dashboard className={cn('h-5 w-5')} />
            <span
              className={cn(
                'absolute left-12 text-base duration-200',
                !isOpen && "text-background opacity-0 transition-all duration-300 group-hover:z-50 group-hover:ml-4 group-hover:rounded group-hover:bg-foreground group-hover:p-2 group-hover:opacity-100"
              )}
            >
              {item.layout_name}
            </span>
          </Link>
        ),
      ):<></>}
    </nav>
  );
}