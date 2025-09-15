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
            <div className="flex flex-1 flex-col">
              <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                  <div className="px-4 lg:px-6">{children}</div>
                </div>
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </ClassSelectionProvider>
    </PageTitleProvider>
  );
}
