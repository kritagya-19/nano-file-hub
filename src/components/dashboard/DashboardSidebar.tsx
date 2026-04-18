import { cn } from "@/lib/utils";
import { NavLink } from "@/components/NavLink";
import { useAdmin } from "@/hooks/useAdmin";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { UserProfileMenu } from "./UserProfileMenu";
import {
  Cloud,
  LayoutDashboard,
  FolderOpen,
  Users,
  Share2,
  ChevronLeft,
  ChevronRight,
  Shield,
} from "lucide-react";

const mainNavItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "My Files", url: "/dashboard/files", icon: FolderOpen },
  { title: "Groups", url: "/dashboard/groups", icon: Users },
  { title: "Shared", url: "/dashboard/shared", icon: Share2 },
];

interface DashboardSidebarProps {
  storageUsed: number;
  storageTotal: number;
}

export function DashboardSidebar({ storageUsed, storageTotal }: DashboardSidebarProps) {
  const { state, toggleSidebar } = useSidebar();
  const { isAdmin } = useAdmin();
  const collapsed = state === "collapsed";

  return (
    <Sidebar
      collapsible="icon"
      className={cn(
        "border-r border-border/50 bg-card/50 backdrop-blur-xl",
        "transition-all duration-300"
      )}
    >
      <SidebarHeader className="p-4 border-b border-border/50">
        <div className={cn(
          "flex items-center gap-2",
          collapsed ? "flex-col" : "justify-between"
        )}>
          <div className={cn(
            "flex items-center gap-3",
            collapsed && "justify-center"
          )}>
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/25 shrink-0">
              <Cloud className="w-5 h-5 text-primary-foreground" />
            </div>
            {!collapsed && (
              <span className="text-lg font-bold text-foreground">
                Nano<span className="text-primary">File</span>
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8 text-muted-foreground hover:text-foreground shrink-0"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {/* Main Navigation */}
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
              Main Menu
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={collapsed ? item.title : undefined}>
                    <NavLink
                      to={item.url}
                      end={item.url === "/dashboard"}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-xl",
                        "text-muted-foreground hover:text-foreground",
                        "hover:bg-muted/50 transition-all duration-200",
                        collapsed && "justify-center px-2"
                      )}
                      activeClassName="bg-primary/10 text-primary font-medium hover:bg-primary/15"
                    >
                      <item.icon className="w-5 h-5 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin Panel */}
        {isAdmin && (
          <SidebarGroup className="mt-auto">
            {!collapsed && (
              <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
                Admin
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip={collapsed ? "Admin Panel" : undefined}>
                    <NavLink
                      to="/admin"
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-xl",
                        "text-primary hover:text-primary",
                        "hover:bg-primary/10 transition-all duration-200",
                        collapsed && "justify-center px-2"
                      )}
                      activeClassName="bg-primary/10 text-primary font-medium"
                    >
                      <Shield className="w-5 h-5 shrink-0" />
                      {!collapsed && <span className="font-semibold">Admin Panel</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="p-3 space-y-2 border-t border-border/50">
        {/* User Profile with dropdown menu */}
        <UserProfileMenu collapsed={collapsed} side="top" align="start" />
      </SidebarFooter>
    </Sidebar>
  );
}
