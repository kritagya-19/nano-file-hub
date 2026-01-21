import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
  storageUsed?: number;
  storageTotal?: number;
}

export function DashboardLayout({ 
  children, 
  storageUsed = 0, 
  storageTotal = 5 * 1024 * 1024 * 1024 
}: DashboardLayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar storageUsed={storageUsed} storageTotal={storageTotal} />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
