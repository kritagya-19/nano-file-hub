import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  MoreVertical,
  Phone,
  Video,
  Search,
  Star,
  Trash2,
  LogOut,
  Users,
  Bell,
  BellOff,
  Image,
} from "lucide-react";

interface ChatHeaderProps {
  groupName: string;
  memberCount: number;
  onlineCount?: number;
  avatarUrl?: string;
  isOwner: boolean;
  onOpenDetails: () => void;
  onViewStarred: () => void;
  onClearChat: () => void;
  onLeaveGroup: () => void;
  onSearch?: () => void;
}

export const ChatHeader = ({
  groupName,
  memberCount,
  onlineCount = 0,
  avatarUrl,
  isOwner,
  onOpenDetails,
  onViewStarred,
  onClearChat,
  onLeaveGroup,
  onSearch,
}: ChatHeaderProps) => {
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <div className="h-14 sm:h-16 px-2 sm:px-4 flex items-center justify-between bg-card border-b border-border">
        {/* Left: Avatar + Group Info */}
        <button
          onClick={onOpenDetails}
          className="flex items-center gap-2 sm:gap-3 min-w-0 hover:opacity-80 transition-opacity py-2 pr-2"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-primary/20 flex items-center justify-center shrink-0 overflow-hidden">
            {avatarUrl ? (
              <img src={avatarUrl} alt={groupName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-sm sm:text-base font-semibold text-primary">
                {getInitials(groupName)}
              </span>
            )}
          </div>
          <div className="min-w-0 text-left">
            <h2 className="font-semibold text-foreground truncate text-sm sm:text-base">
              {groupName}
            </h2>
            <p className="text-xs text-muted-foreground truncate">
              {memberCount} {memberCount === 1 ? "participant" : "participants"}
              {onlineCount > 0 && `, ${onlineCount} online`}
            </p>
          </div>
        </button>

        {/* Right: Actions */}
        <div className="flex items-center gap-1">
          {onSearch && (
            <Button variant="ghost" size="icon" onClick={onSearch} className="h-9 w-9">
              <Search className="w-5 h-5 text-muted-foreground" />
            </Button>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <MoreVertical className="w-5 h-5 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuItem onClick={onOpenDetails}>
                <Users className="w-4 h-4 mr-2" />
                Group info
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onViewStarred}>
                <Star className="w-4 h-4 mr-2" />
                Starred messages
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setShowClearDialog(true)}>
                <Trash2 className="w-4 h-4 mr-2" />
                Clear chat
              </DropdownMenuItem>
              {!isOwner && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => setShowLeaveDialog(true)}
                    className="text-destructive focus:text-destructive"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Exit group
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Clear Chat Dialog */}
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear this chat?</AlertDialogTitle>
            <AlertDialogDescription>
              Messages will only be removed from this device. Other members will still see them.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onClearChat();
                setShowClearDialog(false);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Clear
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Leave Group Dialog */}
      <AlertDialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Exit "{groupName}"?</AlertDialogTitle>
            <AlertDialogDescription>
              Only group admins will be notified that you left the group.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onLeaveGroup();
                setShowLeaveDialog(false);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Exit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
