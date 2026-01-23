import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Send, Loader2, MessageSquare, Paperclip, X, Image, FileText, File } from "lucide-react";
import { format, isToday, isYesterday, isSameDay } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  file_url?: string | null;
  file_name?: string | null;
  file_type?: string | null;
  file_size?: number | null;
  profile?: {
    full_name?: string;
    username?: string;
    avatar_url?: string;
  };
}

interface GroupChatProps {
  messages: Message[];
  currentUserId: string;
  groupId: string;
  onSendMessage: (content: string, fileData?: { url: string; name: string; type: string; size: number }) => Promise<boolean>;
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

export const GroupChat = ({
  messages,
  currentUserId,
  groupId,
  onSendMessage,
}: GroupChatProps) => {
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({ variant: "destructive", title: "File too large", description: "Max file size is 10MB" });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const uploadFile = async (file: File): Promise<{ url: string; name: string; type: string; size: number } | null> => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${groupId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from("user-files")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("user-files")
        .getPublicUrl(fileName);

      return {
        url: urlData.publicUrl,
        name: file.name,
        type: file.type,
        size: file.size,
      };
    } catch (error) {
      console.error("Upload error:", error);
      toast({ variant: "destructive", title: "Upload failed", description: "Could not upload file" });
      return null;
    }
  };

  const handleSend = async () => {
    if ((!newMessage.trim() && !selectedFile) || isSending) return;
    
    setIsSending(true);
    
    let fileData: { url: string; name: string; type: string; size: number } | undefined;
    
    if (selectedFile) {
      setIsUploading(true);
      const uploaded = await uploadFile(selectedFile);
      setIsUploading(false);
      
      if (!uploaded) {
        setIsSending(false);
        return;
      }
      fileData = uploaded;
    }

    const success = await onSendMessage(newMessage || (selectedFile ? `Shared a file: ${selectedFile.name}` : ""), fileData);
    
    setIsSending(false);
    if (success) {
      setNewMessage("");
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
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

  const renderFilePreview = (message: Message, isOwn: boolean) => {
    if (!message.file_url) return null;

    if (isImageType(message.file_type)) {
      return (
        <a href={message.file_url} target="_blank" rel="noopener noreferrer" className="block mt-2">
          <img
            src={message.file_url}
            alt={message.file_name || "Image"}
            className="max-w-full max-h-48 rounded-lg object-cover"
            loading="lazy"
          />
        </a>
      );
    }

    return (
      <a
        href={message.file_url}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "flex items-center gap-2 mt-2 p-2 rounded-lg transition-colors",
          isOwn ? "bg-primary-foreground/10 hover:bg-primary-foreground/20" : "bg-background/50 hover:bg-background/80"
        )}
      >
        <div className={cn(
          "w-8 h-8 rounded flex items-center justify-center shrink-0",
          isOwn ? "bg-primary-foreground/20" : "bg-muted"
        )}>
          <FileText className="w-4 h-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium truncate">{message.file_name || "File"}</p>
          {message.file_size && (
            <p className={cn("text-[10px]", isOwn ? "text-primary-foreground/60" : "text-muted-foreground")}>
              {formatFileSize(message.file_size)}
            </p>
          )}
        </div>
      </a>
    );
  };

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
                          {message.content && !message.content.startsWith("Shared a file:") && (
                            <p className="break-words whitespace-pre-wrap">{message.content}</p>
                          )}
                          {renderFilePreview(message, isOwn)}
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

      {/* Selected File Preview */}
      {selectedFile && (
        <div className="px-3 sm:px-4 py-2 border-t border-border bg-muted/30">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-background border border-border">
            <div className="w-10 h-10 rounded bg-muted flex items-center justify-center shrink-0">
              {isImageType(selectedFile.type) ? (
                <Image className="w-5 h-5 text-muted-foreground" />
              ) : (
                <File className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={handleRemoveFile}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="p-3 sm:p-4 border-t border-border">
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileSelect}
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip,.rar"
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 shrink-0"
            onClick={() => fileInputRef.current?.click()}
            disabled={isSending}
          >
            <Paperclip className="w-5 h-5" />
          </Button>
          <Input
            ref={inputRef}
            placeholder={selectedFile ? "Add a caption..." : "Type a message..."}
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
            disabled={isSending || (!newMessage.trim() && !selectedFile)}
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
        {isUploading && (
          <p className="text-xs text-muted-foreground mt-2 text-center">Uploading file...</p>
        )}
      </div>
    </div>
  );
};
