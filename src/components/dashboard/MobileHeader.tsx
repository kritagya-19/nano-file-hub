import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  Shield,
} from "lucide-react";

const mainNavItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "My Files", url: "/dashboard/files", icon: FolderOpen },
  { title: "Groups", url: "/dashboard/groups", icon: Users },
  { title: "Shared", url: "/dashboard/shared", icon: Share2 },
];

interface MobileHeaderProps {
  storageUsed: number;
  storageTotal: number;
}

export function MobileHeader({ storageUsed, storageTotal }: MobileHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
    navigate("/");
  };

  const handleNavClick = () => setIsOpen(false);

  const handleProfileNav = (path: string) => {
    navigate(path);
  };

  const initial = (
    user?.user_metadata?.full_name?.[0] ||
    user?.email?.[0] ||
    "U"
  ).toUpperCase();
  const fullName = user?.user_metadata?.full_name || "User";

  return (
    <header className="lg:hidden sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur-xl">
      <div className="flex h-14 items-center justify-between px-4 gap-3">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-md shadow-primary/25">
            <Cloud className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-base font-bold text-foreground">
            Nano<span className="text-primary">File</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Profile dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground font-semibold shrink-0 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                {initial}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={8} className="w-64 rounded-xl p-1.5">
              <DropdownMenuLabel className="px-3 py-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground font-semibold shrink-0">
                    {initial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{fullName}</p>
                    <p className="text-xs font-normal text-muted-foreground truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleProfileNav("/dashboard/settings")}
                className="rounded-lg cursor-pointer py-2.5"
              >
                <Settings className="w-4 h-4 mr-2.5" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleProfileNav("/dashboard/upgrade")}
                className="rounded-lg cursor-pointer py-2.5"
              >
                <Sparkles className="w-4 h-4 mr-2.5 text-primary" />
                <span>Upgrade Plan</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleProfileNav("/dashboard/help")}
                className="rounded-lg cursor-pointer py-2.5"
              >
                <HelpCircle className="w-4 h-4 mr-2.5" />
                <span>Help & Support</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="rounded-lg cursor-pointer py-2.5 text-destructive focus:text-destructive"
              >
                <LogOut className="w-4 h-4 mr-2.5" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Hamburger Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] p-0 bg-card">
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

              <nav className="p-4 space-y-6">
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

                {isAdmin && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
                      Admin
                    </p>
                    <Link
                      to="/admin"
                      onClick={handleNavClick}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-primary hover:bg-primary/10 transition-all duration-200"
                    >
                      <Shield className="w-5 h-5" />
                      <span className="font-medium">Admin Panel</span>
                    </Link>
                  </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
