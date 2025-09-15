"use client";

import {
  BarChart3,
  Building2,
  Calendar,
  Camera,
  ClipboardList,
  Database,
  FileBarChart,
  FileImage,
  FileText,
  FileType,
  HelpCircle,
  Home,
  Search,
  Settings,
  Sparkles,
  Users,
} from "lucide-react";
import type * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/organisms/sidebar";

import { NavMain } from "@/components/templates/nav-main";
import { NavSecondary } from "@/components/templates/nav-secondary";
import { NavUser } from "@/components/templates/nav-user";
import { useUserSession } from "@/features/settings";

const data = {
  user: {
    id: "mock-user-id",
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Accueil",
      url: "/dashboard/accueil",
      icon: Home,
    },
    {
      title: "Calendrier",
      url: "/dashboard/calendrier",
      icon: Calendar,
    },
    {
      title: "Gestion des participations",
      url: "/dashboard/sessions",
      icon: ClipboardList,
    },
    {
      title: "Mes élèves",
      url: "/dashboard/mes-eleves",
      icon: Users,
    },
    {
      title: "Évaluations",
      url: "/dashboard/evaluations",
      icon: FileBarChart,
    },
    {
      title: "Appréciations IA",
      url: "/dashboard/appreciations",
      icon: Sparkles,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: Camera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: FileText,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: FileImage,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Paramètres",
      url: "/dashboard/reglages",
      icon: Settings,
    },
    {
      title: "Aide",
      url: "/dashboard/#",
      icon: HelpCircle,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: Database,
    },
    {
      name: "Reports",
      url: "#",
      icon: FileBarChart,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: FileType,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUserSession();

  const userData = user || data.user;

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/dashboard/accueil">
                <Building2 className="!size-5" />
                <span className="text-base font-semibold">Acme Inc.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  );
}
