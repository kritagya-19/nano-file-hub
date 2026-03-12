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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, CheckCheck, Star, Reply, Copy, Trash2, Download, FileText, SmilePlus } from "lucide-react";

export interface MessageReaction {
  emoji: string;
  count: number;
  userIds: string[];
  reactedByMe: boolean;
}

export interface MessageReadInfo {
  readByCount: number;
  totalMembers: number; // excluding sender
}

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
  reply_to?: string | null;
  reply_to_message?: {
    content: string;
    user_name: string;
  } | null;
  reactions?: MessageReaction[];
  readInfo?: MessageReadInfo;
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
  onReply?: (message: MessageData) => void;
  onReact?: (messageId: string, emoji: string) => void;
  onShowReadReceipts?: (messageId: string) => void;
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

const QUICK_EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

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
  onReply,
  onReact,
  onShowReadReceipts,
}: MessageBubbleProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
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

  const handleReact = (emoji: string) => {
    onReact?.(message.id, emoji);
    setShowEmojiPicker(false);
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
      <div className={cn("max-w-[75%] sm:max-w-[65%]", isOwn ? "items-end" : "items-start")}>
        <DropdownMenu open={showMenu} onOpenChange={setShowMenu}>
          <DropdownMenuTrigger asChild>
            <div className="cursor-pointer select-none">
              <div
                className={cn(
                  "relative px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg text-sm",
                  isOwn
                    ? "bg-primary text-primary-foreground rounded-tr-sm"
                    : "bg-muted rounded-tl-sm",
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

                {/* Reply preview */}
                {message.reply_to_message && (
                  <div className={cn(
                    "border-l-2 border-primary/60 pl-2 py-1 mb-1 rounded-r-sm text-xs",
                    isOwn ? "bg-primary-foreground/10" : "bg-background/50"
                  )}>
                    <p className={cn("font-medium", isOwn ? "text-primary-foreground/80" : "text-foreground/80")}>
                      {message.reply_to_message.user_name}
                    </p>
                    <p className={cn("truncate", isOwn ? "text-primary-foreground/60" : "text-muted-foreground")}>
                      {message.reply_to_message.content}
                    </p>
                  </div>
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
            {onReply && (
              <DropdownMenuItem onClick={() => onReply(message)}>
                <Reply className="w-4 h-4 mr-2" />
                Reply
              </DropdownMenuItem>
            )}
            {onReact && (
              <DropdownMenuItem onClick={(e) => {
                e.preventDefault();
                setShowMenu(false);
                setTimeout(() => setShowEmojiPicker(true), 100);
              }}>
                <SmilePlus className="w-4 h-4 mr-2" />
                React
              </DropdownMenuItem>
            )}
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

        {/* Reactions display */}
        {message.reactions && message.reactions.length > 0 && (
          <div className={cn("flex flex-wrap gap-1 mt-0.5", isOwn ? "justify-end" : "justify-start")}>
            {message.reactions.map((reaction) => (
              <button
                key={reaction.emoji}
                onClick={() => onReact?.(message.id, reaction.emoji)}
                className={cn(
                  "inline-flex items-center gap-0.5 text-xs px-1.5 py-0.5 rounded-full border transition-colors",
                  reaction.reactedByMe
                    ? "bg-primary/10 border-primary/30 text-foreground"
                    : "bg-muted/50 border-border text-muted-foreground hover:bg-muted"
                )}
              >
                <span>{reaction.emoji}</span>
                <span className="text-[10px]">{reaction.count}</span>
              </button>
            ))}
          </div>
        )}

        {/* Emoji picker popover */}
        <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
          <PopoverTrigger asChild>
            <div className="w-0 h-0 overflow-hidden" />
          </PopoverTrigger>
          <PopoverContent
            side={isOwn ? "left" : "right"}
            className="w-auto p-1.5"
            align="start"
          >
            <div className="flex gap-1">
              {QUICK_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleReact(emoji)}
                  className="text-xl hover:scale-125 transition-transform p-1 rounded hover:bg-muted"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Spacer for own messages */}
      {isOwn && <div className="w-8 shrink-0" />}
    </div>
  );
};
