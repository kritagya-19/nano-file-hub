import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Send,
  Loader2,
  MessageSquare,
  Smile,
  Paperclip,
  MoreHorizontal,
} from "lucide-react";
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
  sending?: boolean;
}

const formatMessageDate = (date: Date) => {
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "MMMM d, yyyy");
};

const getInitials = (name?: string) => {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const getAvatarColor = (userId: string) => {
  const colors = [
    "from-violet-500 to-purple-600",
    "from-blue-500 to-cyan-500",
    "from-emerald-500 to-teal-500",
    "from-orange-500 to-amber-500",
    "from-pink-500 to-rose-500",
    "from-indigo-500 to-blue-500",
  ];
  const index = userId.charCodeAt(0) % colors.length;
  return colors[index];
};

export const GroupChat = ({
  messages,
  currentUserId,
  onSendMessage,
  sending = false,
}: GroupChatProps) => {
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
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
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 lg:px-6 py-4 scroll-smooth"
      >
        {messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center h-full"
          >
            <div className="text-center max-w-sm mx-auto">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/10">
                <MessageSquare className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No messages yet
              </h3>
              <p className="text-muted-foreground text-sm">
                Be the first to start the conversation! Share ideas, files, or just say hello.
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {groupedMessages.map((group, groupIndex) => (
                <div key={group.date.toISOString()} className="space-y-4">
                  {/* Date Separator */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4 py-2"
                  >
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                    <span className="text-xs font-medium text-muted-foreground px-3 py-1 rounded-full bg-muted/50 backdrop-blur-sm">
                      {formatMessageDate(group.date)}
                    </span>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                  </motion.div>

                  {/* Messages for this date */}
                  {group.messages.map((message, messageIndex) => {
                    const isOwn = message.user_id === currentUserId;
                    const prevMessage = group.messages[messageIndex - 1];
                    const nextMessage = group.messages[messageIndex + 1];
                    const isFirstInGroup = !prevMessage || prevMessage.user_id !== message.user_id;
                    const isLastInGroup = !nextMessage || nextMessage.user_id !== message.user_id;
                    const displayName = message.profile?.full_name || message.profile?.username || "User";

                    return (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ 
                          type: "spring", 
                          stiffness: 500, 
                          damping: 40,
                          delay: messageIndex * 0.02
                        }}
                        className={cn(
                          "flex gap-3",
                          isOwn ? "flex-row-reverse" : "flex-row",
                          !isLastInGroup && "mb-1"
                        )}
                      >
                        {/* Avatar */}
                        <div className={cn("shrink-0", !isFirstInGroup && "invisible")}>
                          <div
                            className={cn(
                              "w-8 h-8 lg:w-9 lg:h-9 rounded-full flex items-center justify-center text-white text-xs font-semibold shadow-lg",
                              "bg-gradient-to-br",
                              getAvatarColor(message.user_id)
                            )}
                          >
                            {getInitials(displayName)}
                          </div>
                        </div>

                        {/* Message Bubble */}
                        <div
                          className={cn(
                            "max-w-[75%] lg:max-w-[65%] group relative",
                            isOwn ? "items-end" : "items-start"
                          )}
                        >
                          {/* Sender name */}
                          {!isOwn && isFirstInGroup && (
                            <p className="text-xs font-medium text-muted-foreground mb-1 ml-1">
                              {displayName}
                            </p>
                          )}

                          <div
                            className={cn(
                              "relative px-4 py-2.5 transition-all duration-200",
                              isOwn
                                ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
                                : "bg-muted/80 backdrop-blur-sm border border-border/50",
                              // Dynamic border radius based on position in group
                              isOwn
                                ? cn(
                                    "rounded-2xl",
                                    isFirstInGroup && "rounded-tr-lg",
                                    isLastInGroup && "rounded-br-lg",
                                    !isFirstInGroup && !isLastInGroup && "rounded-r-lg"
                                  )
                                : cn(
                                    "rounded-2xl",
                                    isFirstInGroup && "rounded-tl-lg",
                                    isLastInGroup && "rounded-bl-lg",
                                    !isFirstInGroup && !isLastInGroup && "rounded-l-lg"
                                  )
                            )}
                          >
                            <p className="text-sm lg:text-[15px] leading-relaxed break-words whitespace-pre-wrap">
                              {message.content}
                            </p>

                            {/* Timestamp - shown on last message in group */}
                            {isLastInGroup && (
                              <p
                                className={cn(
                                  "text-[10px] mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity",
                                  isOwn ? "text-primary-foreground/60 text-right" : "text-muted-foreground"
                                )}
                              >
                                {format(new Date(message.created_at), "h:mm a")}
                              </p>
                            )}
                          </div>

                          {/* Quick timestamp tooltip */}
                          <div
                            className={cn(
                              "absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none",
                              isOwn ? "-left-16" : "-right-16"
                            )}
                          >
                            <span className="text-[10px] text-muted-foreground whitespace-nowrap bg-background/80 backdrop-blur-sm px-2 py-0.5 rounded-md border border-border/50">
                              {format(new Date(message.created_at), "h:mm a")}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Message Input Area */}
      <div className="p-4 lg:p-5 border-t border-border/50 bg-gradient-to-t from-background to-transparent">
        <div className="flex items-end gap-3">
          {/* Attachment Button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-xl shrink-0 text-muted-foreground hover:text-foreground hover:bg-muted/80"
          >
            <Paperclip className="w-5 h-5" />
          </Button>

          {/* Input Container */}
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              disabled={isSending}
              className={cn(
                "h-12 lg:h-14 rounded-2xl pr-12 text-[15px]",
                "bg-muted/50 border-border/50 focus:bg-background",
                "placeholder:text-muted-foreground/60",
                "transition-all duration-200"
              )}
            />
            
            {/* Emoji Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
            >
              <Smile className="w-5 h-5" />
            </Button>
          </div>

          {/* Send Button */}
          <motion.div
            initial={false}
            animate={{
              scale: newMessage.trim() ? 1 : 0.9,
              opacity: newMessage.trim() ? 1 : 0.5,
            }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <Button
              onClick={handleSend}
              disabled={isSending || !newMessage.trim()}
              className={cn(
                "h-12 w-12 lg:h-14 lg:w-14 rounded-2xl p-0",
                "bg-gradient-to-br from-primary to-primary/90",
                "shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40",
                "transition-all duration-200",
                !newMessage.trim() && "cursor-not-allowed"
              )}
            >
              {isSending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </motion.div>
        </div>

        {/* Typing indicator / hints */}
        <div className="mt-2 h-4 flex items-center">
          <p className="text-xs text-muted-foreground/60">
            Press <kbd className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono text-[10px]">Enter</kbd> to send
          </p>
        </div>
      </div>
    </div>
  );
};
