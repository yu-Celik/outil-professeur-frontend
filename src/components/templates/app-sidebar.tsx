"use client";

import * as React from "react";
import { useUserSession } from "@/hooks/use-user-session";
import {
  Book,
  Calendar,
  Camera,
  ChartBar,
  ClipboardList,
  LayoutDashboard,
  Database,
  FileText,
  FileImage,
  FileType,
  Folder,
  HelpCircle,
  Home,
  Building2,
  List,
  FileBarChart,
  GraduationCap,
  Search,
  Settings,
  UserCheck,
  Users,
} from "lucide-react";

import { NavMain } from "@/components/templates/nav-main";
import { NavSecondary } from "@/components/templates/nav-secondary";
import { NavUser } from "@/components/templates/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/organisms/sidebar";

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
      title: "Mes cours",
      url: "/dashboard/mes-cours",
      icon: Book,
    },
    {
      title: "Mes élèves",
      url: "/dashboard/mes-eleves",
      icon: Users,
    },
    {
      title: "Évaluations",
      url: "/dashboard/evaluations",
      icon: ClipboardList,
    },
    {
      title: "Réglages",
      url: "/dashboard/reglages",
      icon: Settings,
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
      title: "Settings",
      url: "#",
      icon: Settings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: HelpCircle,
    },
    {
      title: "Search",
      url: "#",
      icon: Search,
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
              <a href="#">
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
