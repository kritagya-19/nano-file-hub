import { useState } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, CheckCheck, Star, Reply, Copy, Trash2, Download, FileText } from "lucide-react";

export interface MessageData {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  file_url?: string | null;
  file_name?: string | null;
  file_type?: string | null;
  file_size?: number | null;
  starred_by?: string[];
  profile?: {
    full_name?: string | null;
    username?: string | null;
    avatar_url?: string | null;
  };
}

interface MessageBubbleProps {
  message: MessageData;
  isOwn: boolean;
  showAvatar: boolean;
  showName: boolean;
  currentUserId: string;
  onStar: (messageId: string) => void;
  onUnstar: (messageId: string) => void;
  onDelete: (messageId: string) => void;
  onCopy: (content: string) => void;
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

const isImageType = (type?: string | null) => {
  if (!type) return false;
  return type.startsWith("image/");
};

const getInitials = (name?: string | null) => {
  if (!name) return "U";
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
};

// WhatsApp-like colors for group member names
const nameColors = [
  "text-emerald-600 dark:text-emerald-400",
  "text-blue-600 dark:text-blue-400",
  "text-purple-600 dark:text-purple-400",
  "text-pink-600 dark:text-pink-400",
  "text-orange-600 dark:text-orange-400",
  "text-cyan-600 dark:text-cyan-400",
  "text-amber-600 dark:text-amber-400",
  "text-rose-600 dark:text-rose-400",
];

const getNameColor = (userId: string) => {
  const hash = userId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return nameColors[hash % nameColors.length];
};

export const MessageBubble = ({
  message,
  isOwn,
  showAvatar,
  showName,
  currentUserId,
  onStar,
  onUnstar,
  onDelete,
  onCopy,
}: MessageBubbleProps) => {
  const [showMenu, setShowMenu] = useState(false);
  
  const isStarred = message.starred_by?.includes(currentUserId);
  const displayName = message.profile?.full_name || message.profile?.username || "User";
  const hasFile = !!message.file_url;
  const isImage = isImageType(message.file_type);
  const hasTextContent = message.content && !message.content.startsWith("Shared a file");

  const handleDownload = () => {
    if (message.file_url) {
      window.open(message.file_url, "_blank");
    }
  };

  return (
    <div
      className={cn("flex gap-2 px-3 sm:px-4 group relative", isOwn ? "flex-row-reverse" : "flex-row")}
    >
      {/* Avatar */}
      {!isOwn && (
        <div className={cn("shrink-0 w-8", !showAvatar && "invisible")}>
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground overflow-hidden">
            {message.profile?.avatar_url ? (
              <img 
                src={message.profile.avatar_url} 
                alt={displayName} 
                className="w-full h-full object-cover" 
              />
            ) : (
              getInitials(displayName)
            )}
          </div>
        </div>
      )}

      {/* Message Content */}
      <DropdownMenu open={showMenu} onOpenChange={setShowMenu}>
        <DropdownMenuTrigger asChild>
          <div
            className={cn(
              "max-w-[75%] sm:max-w-[65%] cursor-pointer select-none",
              isOwn ? "items-end" : "items-start"
            )}
          >
            <div
              className={cn(
                "relative px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg text-sm",
                isOwn
                  ? "bg-primary text-primary-foreground rounded-tr-sm"
                  : "bg-muted rounded-tl-sm",
                // Tail shape effect
                isOwn ? "before:content-[''] before:absolute before:-right-1 before:top-0 before:border-4 before:border-transparent before:border-t-primary before:border-l-primary"
                  : "before:content-[''] before:absolute before:-left-1 before:top-0 before:border-4 before:border-transparent before:border-t-muted before:border-r-muted"
              )}
            >
              {/* Name for group messages */}
              {!isOwn && showName && (
                <p className={cn("text-xs font-medium mb-0.5", getNameColor(message.user_id))}>
                  {displayName}
                </p>
              )}

              {/* Image attachment */}
              {hasFile && isImage && (
                <div className="mb-1 -mx-1 -mt-0.5 first:-mt-1">
                  <img
                    src={message.file_url!}
                    alt={message.file_name || "Image"}
                    className="max-w-full max-h-64 rounded-md object-cover"
                    loading="lazy"
                  />
                </div>
              )}

              {/* File attachment (non-image) */}
              {hasFile && !isImage && (
                <div
                  className={cn(
                    "flex items-center gap-2 p-2 rounded-md mb-1",
                    isOwn ? "bg-primary-foreground/10" : "bg-background/50"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-md flex items-center justify-center shrink-0",
                    isOwn ? "bg-primary-foreground/20" : "bg-muted"
                  )}>
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium truncate">{message.file_name || "File"}</p>
                    {message.file_size && (
                      <p className={cn("text-[10px]", isOwn ? "text-primary-foreground/60" : "text-muted-foreground")}>
                        {formatFileSize(message.file_size)}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Text content */}
              {hasTextContent && (
                <p className="break-words whitespace-pre-wrap leading-relaxed">{message.content}</p>
              )}

              {/* Time & status */}
              <div className={cn(
                "flex items-center gap-1 justify-end mt-0.5",
                isOwn ? "text-primary-foreground/60" : "text-muted-foreground"
              )}>
                {isStarred && <Star className="w-3 h-3 fill-current" />}
                <span className="text-[10px]">
                  {format(new Date(message.created_at), "h:mm a")}
                </span>
                {isOwn && (
                  <CheckCheck className="w-3.5 h-3.5 ml-0.5" />
                )}
              </div>
            </div>
          </div>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align={isOwn ? "end" : "start"} className="w-44">
          {isStarred ? (
            <DropdownMenuItem onClick={() => onUnstar(message.id)}>
              <Star className="w-4 h-4 mr-2" />
              Unstar
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => onStar(message.id)}>
              <Star className="w-4 h-4 mr-2" />
              Star
            </DropdownMenuItem>
          )}
          {hasTextContent && (
            <DropdownMenuItem onClick={() => onCopy(message.content)}>
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </DropdownMenuItem>
          )}
          {hasFile && (
            <DropdownMenuItem onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </DropdownMenuItem>
          )}
          {isOwn && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => onDelete(message.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Spacer for own messages */}
      {isOwn && <div className="w-8 shrink-0" />}
    </div>
  );
};
