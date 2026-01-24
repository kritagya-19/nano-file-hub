import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { Star, FileText, Image } from "lucide-react";
import { cn } from "@/lib/utils";
import { MessageData } from "./MessageBubble";

interface StarredMessagesSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  messages: MessageData[];
  currentUserId: string;
  onUnstar: (messageId: string) => void;
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

const isImageType = (type?: string | null) => type?.startsWith("image/");

export const StarredMessagesSheet = ({
  open,
  onOpenChange,
  messages,
  currentUserId,
  onUnstar,
}: StarredMessagesSheetProps) => {
  const starredMessages = messages.filter((m) => m.starred_by?.includes(currentUserId));

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0">
        <SheetHeader className="px-4 py-3 border-b border-border">
          <SheetTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            Starred Messages
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-60px)]">
          {starredMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center px-4">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Star className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-medium text-foreground mb-1">No starred messages</h3>
              <p className="text-sm text-muted-foreground">
                Tap and hold on a message, then tap Star to save it here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {starredMessages.map((message) => {
                const displayName = message.profile?.full_name || message.profile?.username || "User";
                const isOwn = message.user_id === currentUserId;
                const hasFile = !!message.file_url;
                const isImage = isImageType(message.file_type);
                const hasTextContent = message.content && !message.content.startsWith("Shared a file");

                return (
                  <div key={message.id} className="p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "font-medium text-sm",
                          isOwn ? "text-primary" : "text-foreground"
                        )}>
                          {isOwn ? "You" : displayName}
                        </span>
                      </div>
                      <button
                        onClick={() => onUnstar(message.id)}
                        className="text-yellow-500 hover:text-yellow-600 transition-colors"
                      >
                        <Star className="w-4 h-4 fill-current" />
                      </button>
                    </div>

                    {/* Image */}
                    {hasFile && isImage && (
                      <a href={message.file_url!} target="_blank" rel="noopener noreferrer" className="block mb-2">
                        <img
                          src={message.file_url!}
                          alt={message.file_name || "Image"}
                          className="max-w-full max-h-40 rounded-lg object-cover"
                          loading="lazy"
                        />
                      </a>
                    )}

                    {/* File */}
                    {hasFile && !isImage && (
                      <a
                        href={message.file_url!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2 rounded-lg bg-muted mb-2"
                      >
                        <FileText className="w-5 h-5 text-muted-foreground" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">{message.file_name}</p>
                          {message.file_size && (
                            <p className="text-xs text-muted-foreground">
                              {formatFileSize(message.file_size)}
                            </p>
                          )}
                        </div>
                      </a>
                    )}

                    {/* Text */}
                    {hasTextContent && (
                      <p className="text-sm text-foreground mb-2 whitespace-pre-wrap">
                        {message.content}
                      </p>
                    )}

                    <p className="text-xs text-muted-foreground">
                      {format(new Date(message.created_at), "MMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
