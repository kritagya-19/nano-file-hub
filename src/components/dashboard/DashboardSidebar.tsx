import { cn } from "@/lib/utils";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";
import { useNavigate } from "react-router-dom";
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
import { Progress } from "@/components/ui/progress";
import {
  Cloud,
  LayoutDashboard,
  FolderOpen,
  Users,
  Share2,
  Settings,
  LogOut,
  HelpCircle,
  Sparkles,
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

const secondaryNavItems = [
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
  { title: "Help & Support", url: "/dashboard/help", icon: HelpCircle },
];

interface DashboardSidebarProps {
  storageUsed: number;
  storageTotal: number;
}

export function DashboardSidebar({ storageUsed, storageTotal }: DashboardSidebarProps) {
  const { state, toggleSidebar } = useSidebar();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const collapsed = state === "collapsed";

  const usagePercent = (storageUsed / storageTotal) * 100;

  const formatStorage = (bytes: number) => {
    const gb = bytes / (1024 * 1024 * 1024);
    return gb >= 1 ? `${gb.toFixed(1)} GB` : `${(bytes / (1024 * 1024)).toFixed(0)} MB`;
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <Sidebar
      collapsible="icon"
      className={cn(
        "border-r border-border/50 bg-card/50 backdrop-blur-xl",
        "transition-all duration-300"
      )}
    >
      <SidebarHeader className="p-4">
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

        {/* Secondary Navigation */}
        <SidebarGroup className="mt-auto">
          {!collapsed && (
            <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
              Support
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={collapsed ? item.title : undefined}>
                    <NavLink
                      to={item.url}
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
      </SidebarContent>

      <SidebarFooter className="p-4 space-y-4">
        {/* Storage Usage */}
        {!collapsed && (
          <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">Storage</span>
            </div>
            <Progress value={usagePercent} className="h-2 mb-2" />
            <p className="text-xs text-muted-foreground">
              {formatStorage(storageUsed)} of {formatStorage(storageTotal)} used
            </p>
          </div>
        )}

        {/* User Profile */}
        <div className={cn(
          "flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer",
          collapsed && "justify-center p-2"
        )}>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground font-semibold shrink-0">
            {(user?.user_metadata?.full_name?.[0] || user?.email?.[0] || "U").toUpperCase()}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {user?.user_metadata?.full_name || "User"}
              </p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          )}
        </div>

        {/* Sign Out & Toggle */}
        <div className={cn(
          "flex items-center gap-2",
          collapsed ? "flex-col" : "justify-between"
        )}>
          <Button
            variant="ghost"
            size={collapsed ? "icon" : "sm"}
            onClick={handleSignOut}
            className="text-muted-foreground hover:text-destructive"
          >
            <LogOut className="w-4 h-4" />
            {!collapsed && <span className="ml-2">Sign Out</span>}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="text-muted-foreground"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
