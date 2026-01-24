import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { MoreVertical, Trash2, LogOut, Copy, Pin, BellOff } from "lucide-react";
import { format, isToday, isYesterday } from "date-fns";

interface Group {
  id: string;
  name: string;
  description: string | null;
  owner_id: string;
  invite_code: string;
  created_at: string;
}

interface GroupListItemProps {
  group: Group;
  isSelected: boolean;
  isOwner: boolean;
  lastMessage?: {
    content: string;
    created_at: string;
    sender_name?: string;
  };
  unreadCount?: number;
  onSelect: () => void;
  onCopyCode: () => void;
  onDelete: () => void;
  onLeave: () => void;
}

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  if (isToday(date)) {
    return format(date, "h:mm a");
  }
  if (isYesterday(date)) {
    return "Yesterday";
  }
  return format(date, "MM/dd/yy");
};

export const GroupListItem = ({
  group,
  isSelected,
  isOwner,
  lastMessage,
  unreadCount = 0,
  onSelect,
  onCopyCode,
  onDelete,
  onLeave,
}: GroupListItemProps) => {
  return (
    <div
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors relative group",
        isSelected ? "bg-primary/10" : "hover:bg-muted/50"
      )}
      onClick={onSelect}
    >
      {/* Avatar */}
      <div
        className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center shrink-0 text-sm font-semibold",
          isSelected
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        )}
      >
        {getInitials(group.name)}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 py-0.5">
        <div className="flex items-center justify-between gap-2">
          <h3 className={cn(
            "font-medium text-sm truncate",
            isSelected && "text-primary"
          )}>
            {group.name}
          </h3>
          {lastMessage && (
            <span className="text-[11px] text-muted-foreground shrink-0">
              {formatTime(lastMessage.created_at)}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between gap-2 mt-0.5">
          <p className="text-xs text-muted-foreground truncate">
            {lastMessage ? (
              <>
                {lastMessage.sender_name && (
                  <span className="font-medium">{lastMessage.sender_name}: </span>
                )}
                {lastMessage.content}
              </>
            ) : (
              group.description || "No messages yet"
            )}
          </p>
          {unreadCount > 0 && (
            <span className="bg-primary text-primary-foreground text-[10px] font-medium px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 absolute right-2 top-1/2 -translate-y-1/2"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={onCopyCode}>
            <Copy className="w-4 h-4 mr-2" />
            Copy invite code
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {isOwner ? (
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={onDelete}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete group
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={onLeave}>
              <LogOut className="w-4 h-4 mr-2" />
              Exit group
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
