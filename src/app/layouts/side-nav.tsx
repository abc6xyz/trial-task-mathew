"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { useSidebar } from "@/hooks/useSidebar";

interface SideNavProps {
  items: string[];  
}

export function SideNav({ items }: SideNavProps) {
  const path = usePathname();
  const { isOpen } = useSidebar();

  return (
    <nav className="space-y-2">
      {items.map((item) =>
        (
          <Link
            key={item}
            href={item}
            className={cn(
              buttonVariants({ variant: 'ghost' }),
              'group relative flex h-12 justify-start',
              path === item && 'bg-muted font-bold hover:bg-muted',
            )}
          >
            <Icons.gitHub className={cn('h-5 w-5')} />
            <span
              className={cn(
                'absolute left-12 text-base duration-200',
                !isOpen && "text-background opacity-0 transition-all duration-300 group-hover:z-50 group-hover:ml-4 group-hover:rounded group-hover:bg-foreground group-hover:p-2 group-hover:opacity-100"
              )}
            >
              {item}
            </span>
          </Link>
        ),
      )}
    </nav>
  );
}