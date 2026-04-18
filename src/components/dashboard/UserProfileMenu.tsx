import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Settings,
  LogOut,
  HelpCircle,
  Sparkles,
  ChevronUp,
} from "lucide-react";

interface UserProfileMenuProps {
  collapsed?: boolean;
  align?: "start" | "end" | "center";
  side?: "top" | "right" | "bottom" | "left";
  variant?: "sidebar" | "compact";
}

export function UserProfileMenu({
  collapsed = false,
  align = "end",
  side = "top",
  variant = "sidebar",
}: UserProfileMenuProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const initial = (
    user?.user_metadata?.full_name?.[0] ||
    user?.email?.[0] ||
    "U"
  ).toUpperCase();
  const fullName = user?.user_metadata?.full_name || "User";
  const email = user?.email ?? "";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "w-full flex items-center gap-3 p-2 rounded-xl",
            "hover:bg-muted/60 transition-colors text-left",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            collapsed && "justify-center p-2"
          )}
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground font-semibold shrink-0 shadow-sm">
            {initial}
          </div>
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {fullName}
                </p>
                <p className="text-xs text-muted-foreground truncate">{email}</p>
              </div>
              <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
            </>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side={side}
        align={align}
        sideOffset={8}
        className="w-64 rounded-xl p-1.5"
      >
        <DropdownMenuLabel className="px-3 py-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground font-semibold shrink-0">
              {initial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{fullName}</p>
              <p className="text-xs font-normal text-muted-foreground truncate">
                {email}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => navigate("/dashboard/settings")}
          className="rounded-lg cursor-pointer py-2.5"
        >
          <Settings className="w-4 h-4 mr-2.5" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => navigate("/dashboard/upgrade")}
          className="rounded-lg cursor-pointer py-2.5"
        >
          <Sparkles className="w-4 h-4 mr-2.5 text-primary" />
          <span>Upgrade Plan</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => navigate("/dashboard/help")}
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
  );
}
