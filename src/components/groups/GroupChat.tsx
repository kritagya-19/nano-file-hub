import { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Send, Loader2, MessageSquare } from "lucide-react";
import { format, isToday, isYesterday, isSameDay } from "date-fns";

interface Message {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  profile?: {
    full_name?: string;
    username?: string;
    avatar_url?: string;
  };
}

interface GroupChatProps {
  messages: Message[];
  currentUserId: string;
  onSendMessage: (content: string) => Promise<boolean>;
}

const formatMessageDate = (date: Date) => {
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "MMM d, yyyy");
};

const getInitials = (name?: string) => {
  if (!name) return "U";
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
};

export const GroupChat = ({
  messages,
  currentUserId,
  onSendMessage,
}: GroupChatProps) => {
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || isSending) return;
    setIsSending(true);
    const success = await onSendMessage(newMessage);
    setIsSending(false);
    if (success) {
      setNewMessage("");
      inputRef.current?.focus();
    }
  };

  // Group messages by date
  const groupedMessages: { date: Date; messages: Message[] }[] = [];
  messages.forEach((message) => {
    const messageDate = new Date(message.created_at);
    const lastGroup = groupedMessages[groupedMessages.length - 1];
    if (lastGroup && isSameDay(lastGroup.date, messageDate)) {
      lastGroup.messages.push(message);
    } else {
      groupedMessages.push({ date: messageDate, messages: [message] });
    }
  });

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Messages Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 sm:px-4 py-3">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center px-4">
              <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="w-7 h-7 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground font-medium">No messages yet</p>
              <p className="text-sm text-muted-foreground/70 mt-1">Start the conversation!</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {groupedMessages.map((group) => (
              <div key={group.date.toISOString()} className="space-y-2">
                {/* Date Separator */}
                <div className="flex items-center gap-3 py-2">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground px-2">
                    {formatMessageDate(group.date)}
                  </span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                {/* Messages */}
                {group.messages.map((message, idx) => {
                  const isOwn = message.user_id === currentUserId;
                  const prevMessage = group.messages[idx - 1];
                  const showAvatar = !prevMessage || prevMessage.user_id !== message.user_id;
                  const displayName = message.profile?.full_name || message.profile?.username || "User";

                  return (
                    <div
                      key={message.id}
                      className={cn("flex gap-2", isOwn ? "flex-row-reverse" : "flex-row")}
                    >
                      {/* Avatar */}
                      <div className={cn("shrink-0 w-8", !showAvatar && "invisible")}>
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-medium">
                          {getInitials(displayName)}
                        </div>
                      </div>

                      {/* Message */}
                      <div className={cn("max-w-[75%] sm:max-w-[65%]", isOwn ? "items-end" : "items-start")}>
                        {!isOwn && showAvatar && (
                          <p className="text-xs text-muted-foreground mb-1 ml-1">{displayName}</p>
                        )}
                        <div
                          className={cn(
                            "px-3 py-2 rounded-2xl text-sm",
                            isOwn
                              ? "bg-primary text-primary-foreground rounded-br-sm"
                              : "bg-muted rounded-bl-sm"
                          )}
                        >
                          <p className="break-words whitespace-pre-wrap">{message.content}</p>
                          <p className={cn(
                            "text-[10px] mt-1",
                            isOwn ? "text-primary-foreground/60" : "text-muted-foreground"
                          )}>
                            {format(new Date(message.created_at), "h:mm a")}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="p-3 sm:p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            disabled={isSending}
            className="h-10 sm:h-11 rounded-full text-sm"
          />
          <Button
            onClick={handleSend}
            disabled={isSending || !newMessage.trim()}
            size="icon"
            className="h-10 w-10 sm:h-11 sm:w-11 rounded-full shrink-0"
          >
            {isSending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
