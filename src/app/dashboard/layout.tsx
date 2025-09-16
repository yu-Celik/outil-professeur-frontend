import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SidebarInset, SidebarProvider } from "@/components/organisms/sidebar";
import { AppSidebar } from "@/components/templates/app-sidebar";
import { SiteHeader } from "@/components/templates/site-header";
import { PageTitleProvider } from "@/shared/hooks";
import { ClassSelectionProvider } from "@/contexts/class-selection-context";
import { auth } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return (
    <PageTitleProvider>
      <ClassSelectionProvider>
        <SidebarProvider
          style={
            {
              "--sidebar-width": "calc(var(--spacing) * 72)",
              "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties
          }
        >
          <AppSidebar variant="inset" />
          <SidebarInset>
            <SiteHeader />
            {children}
          </SidebarInset>
        </SidebarProvider>
      </ClassSelectionProvider>
    </PageTitleProvider>
  );
}
