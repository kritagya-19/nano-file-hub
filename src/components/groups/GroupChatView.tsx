import { useState, useRef, useEffect } from "react";
import { format, isToday, isYesterday, isSameDay } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, MessageSquare, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

import { ChatHeader } from "./ChatHeader";
import { ChatInput } from "./ChatInput";
import { MessageBubble, MessageData } from "./MessageBubble";
import { StarredMessagesSheet } from "./StarredMessagesSheet";

interface GroupChatViewProps {
  group: {
    id: string;
    name: string;
    description?: string | null;
    owner_id: string;
  };
  messages: MessageData[];
  members: any[];
  currentUserId: string;
  isOwner: boolean;
  onSendMessage: (content: string, fileData?: { url: string; name: string; type: string; size: number }) => Promise<boolean>;
  onOpenDetails: () => void;
  onLeaveGroup: () => void;
  onClearChat: () => void;
  onStarMessage: (messageId: string) => void;
  onUnstarMessage: (messageId: string) => void;
  onDeleteMessage: (messageId: string) => void;
}

const formatMessageDate = (date: Date) => {
  if (isToday(date)) return "TODAY";
  if (isYesterday(date)) return "YESTERDAY";
  return format(date, "MMMM d, yyyy").toUpperCase();
};

export const GroupChatView = ({
  group,
  messages,
  members,
  currentUserId,
  isOwner,
  onSendMessage,
  onOpenDetails,
  onLeaveGroup,
  onClearChat,
  onStarMessage,
  onUnstarMessage,
  onDeleteMessage,
}: GroupChatViewProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showStarred, setShowStarred] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleFileAttach = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Maximum file size is 10MB",
      });
      return;
    }
    setSelectedFile(file);
  };

  const uploadFile = async (file: File): Promise<{ url: string; name: string; type: string; size: number } | null> => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `group-chat/${group.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("user-files")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: signedData, error: signedError } = await supabase.storage
        .from("user-files")
        .createSignedUrl(fileName, 60 * 60 * 24 * 365);

      if (signedError) throw signedError;

      return {
        url: signedData.signedUrl,
        name: file.name,
        type: file.type,
        size: file.size,
      };
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message || "Could not upload file",
      });
      return null;
    }
  };

  const handleSendMessage = async (content: string) => {
    if ((!content.trim() && !selectedFile) || isSending) return;

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

    const success = await onSendMessage(
      content || (selectedFile ? `Shared a file: ${selectedFile.name}` : ""),
      fileData
    );

    setIsSending(false);
    if (success) {
      setSelectedFile(null);
    }
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({ title: "Copied to clipboard" });
  };

  // Group messages by date
  const groupedMessages: { date: Date; messages: MessageData[] }[] = [];
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
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <ChatHeader
        groupName={group.name}
        memberCount={members.length}
        isOwner={isOwner}
        onOpenDetails={onOpenDetails}
        onViewStarred={() => setShowStarred(true)}
        onClearChat={onClearChat}
        onLeaveGroup={onLeaveGroup}
      />

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto bg-[url('/chat-bg-pattern.png')] bg-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(var(--background), 0.92), rgba(var(--background), 0.92))`,
        }}
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full px-4">
            <div className="text-center max-w-xs">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-10 h-10 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Messages and calls are end-to-end encrypted. No one outside of this chat can read or listen to them.
              </p>
              <p className="text-xs text-muted-foreground">
                Start the conversation!
              </p>
            </div>
          </div>
        ) : (
          <div className="py-2 space-y-1">
            {groupedMessages.map((group) => (
              <div key={group.date.toISOString()}>
                {/* Date Separator */}
                <div className="flex justify-center py-2 px-4">
                  <span className="text-[11px] font-medium text-muted-foreground bg-muted/80 px-3 py-1 rounded-md shadow-sm">
                    {formatMessageDate(group.date)}
                  </span>
                </div>

                {/* Messages */}
                <div className="space-y-0.5">
                  {group.messages.map((message, idx) => {
                    const isOwn = message.user_id === currentUserId;
                    const prevMessage = group.messages[idx - 1];
                    const showAvatar = !prevMessage || prevMessage.user_id !== message.user_id;
                    const showName = !isOwn && showAvatar;

                    return (
                      <MessageBubble
                        key={message.id}
                        message={message}
                        isOwn={isOwn}
                        showAvatar={showAvatar}
                        showName={showName}
                        currentUserId={currentUserId}
                        onStar={onStarMessage}
                        onUnstar={onUnstarMessage}
                        onDelete={onDeleteMessage}
                        onCopy={handleCopy}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <ChatInput
        onSendMessage={handleSendMessage}
        onAttachFile={handleFileAttach}
        selectedFile={selectedFile}
        onRemoveFile={() => setSelectedFile(null)}
        disabled={isSending}
        isUploading={isUploading}
      />

      {/* Starred Messages Sheet */}
      <StarredMessagesSheet
        open={showStarred}
        onOpenChange={setShowStarred}
        messages={messages}
        currentUserId={currentUserId}
        onUnstar={onUnstarMessage}
      />
    </div>
  );
};
