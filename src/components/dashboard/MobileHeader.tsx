import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Cloud,
  Menu,
  LayoutDashboard,
  FolderOpen,
  Users,
  Share2,
  Settings,
  LogOut,
  HelpCircle,
  Sparkles,
  X,
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

interface MobileHeaderProps {
  storageUsed: number;
  storageTotal: number;
}

export function MobileHeader({ storageUsed, storageTotal }: MobileHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const usagePercent = (storageUsed / storageTotal) * 100;

  const formatStorage = (bytes: number) => {
    const gb = bytes / (1024 * 1024 * 1024);
    return gb >= 1 ? `${gb.toFixed(1)} GB` : `${(bytes / (1024 * 1024)).toFixed(0)} MB`;
  };

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
    navigate("/");
  };

  const handleNavClick = () => {
    setIsOpen(false);
  };

  return (
    <header className="lg:hidden sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur-xl">
      <div className="flex h-14 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-md shadow-primary/25">
            <Cloud className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-base font-bold text-foreground">
            Nano<span className="text-primary">File</span>
          </span>
        </Link>

        {/* Hamburger Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] p-0 bg-card">
            {/* Sheet Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <Cloud className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="text-base font-bold">
                  Nano<span className="text-primary">File</span>
                </span>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex flex-col h-[calc(100%-60px)]">
              <nav className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Main Menu */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
                    Main Menu
                  </p>
                  <div className="space-y-1">
                    {mainNavItems.map((item) => (
                      <Link
                        key={item.title}
                        to={item.url}
                        onClick={handleNavClick}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-xl",
                          "text-foreground/70 hover:text-foreground",
                          "hover:bg-muted/50 transition-all duration-200"
                        )}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Support Menu */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
                    Support
                  </p>
                  <div className="space-y-1">
                    {secondaryNavItems.map((item) => (
                      <Link
                        key={item.title}
                        to={item.url}
                        onClick={handleNavClick}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-xl",
                          "text-foreground/70 hover:text-foreground",
                          "hover:bg-muted/50 transition-all duration-200"
                        )}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </nav>

              {/* Footer */}
              <div className="p-4 space-y-4 border-t border-border/50">
                {/* Storage Usage */}
                <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-sm font-semibold text-foreground">Storage</span>
                  </div>
                  <Progress value={usagePercent} className="h-1.5 mb-2" />
                  <p className="text-xs text-muted-foreground">
                    {formatStorage(storageUsed)} of {formatStorage(storageTotal)} used
                  </p>
                </div>

                {/* User Profile */}
                <div className="flex items-center gap-3 p-2">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground font-semibold shrink-0">
                    {(user?.user_metadata?.full_name?.[0] || user?.email?.[0] || "U").toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {user?.user_metadata?.full_name || "User"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  </div>
                </div>

                {/* Sign Out */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="w-full text-muted-foreground hover:text-destructive hover:border-destructive/50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
