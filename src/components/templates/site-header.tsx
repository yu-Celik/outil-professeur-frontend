"use client";

import { Button } from "@/components/atoms/button";
import { Separator } from "@/components/atoms/separator";
import { SidebarTrigger } from "@/components/organisms/sidebar";
import { usePageTitle } from "@/shared/hooks";
import { ActivePeriodBadge } from "@/components/molecules/active-period-badge";

export function SiteHeader() {
  const { title } = usePageTitle();

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center justify-between gap-1 px-4 lg:gap-2 lg:px-6">
        <div className="flex items-center gap-1 lg:gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <h1 className="text-xl font-semibold">{title}</h1>
        </div>
        <ActivePeriodBadge />
      </div>
    </header>
  );
}
