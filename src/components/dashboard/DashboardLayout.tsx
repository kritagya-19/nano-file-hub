import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";
import { MobileHeader } from "./MobileHeader";
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
      <div className="min-h-screen flex flex-col lg:flex-row w-full bg-background">
        {/* Mobile Header with hamburger menu */}
        <MobileHeader storageUsed={storageUsed} storageTotal={storageTotal} />
        
        {/* Desktop Sidebar - hidden on mobile */}
        <div className="hidden lg:block">
          <DashboardSidebar storageUsed={storageUsed} storageTotal={storageTotal} />
        </div>
        
        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
