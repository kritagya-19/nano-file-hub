import { useState, useRef, useEffect, useCallback } from "react";
import { format, isToday, isYesterday, isSameDay } from "date-fns";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

import { ChatHeader } from "./ChatHeader";
import { ChatInput } from "./ChatInput";
import { MessageBubble, MessageData, MessageReaction } from "./MessageBubble";
import { StarredMessagesSheet } from "./StarredMessagesSheet";
import { ReadReceiptDialog, ReadReceipt } from "./ReadReceiptDialog";

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
  onSendMessage: (content: string, fileData?: { url: string; name: string; type: string; size: number }, replyToId?: string) => Promise<boolean>;
  onOpenDetails: () => void;
  onLeaveGroup: () => void;
  onClearChat: () => void;
  onStarMessage: (messageId: string) => void;
  onUnstarMessage: (messageId: string) => void;
  onDeleteMessage: (messageId: string) => void;
  onBack?: () => void;
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
  onBack,
}: GroupChatViewProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showStarred, setShowStarred] = useState(false);
  const [replyTo, setReplyTo] = useState<{ id: string; content: string; userName: string } | null>(null);
  const [reactions, setReactions] = useState<Record<string, MessageReaction[]>>({});
  const [messageReads, setMessageReads] = useState<Record<string, { user_id: string; read_at: string }[]>>({});
  const [readReceiptMessageId, setReadReceiptMessageId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Fetch reactions for current group messages
  useEffect(() => {
    const fetchReactions = async () => {
      if (messages.length === 0) return;
      const messageIds = messages.map(m => m.id);
      
      const { data, error } = await supabase
        .from('message_reactions')
        .select('*')
        .in('message_id', messageIds);

      if (error || !data) return;

      const grouped: Record<string, MessageReaction[]> = {};
      data.forEach((r: any) => {
        if (!grouped[r.message_id]) grouped[r.message_id] = [];
        const existing = grouped[r.message_id].find(e => e.emoji === r.emoji);
        if (existing) {
          existing.count++;
          existing.userIds.push(r.user_id);
          if (r.user_id === currentUserId) existing.reactedByMe = true;
        } else {
          grouped[r.message_id].push({
            emoji: r.emoji,
            count: 1,
            userIds: [r.user_id],
            reactedByMe: r.user_id === currentUserId,
          });
        }
      });
      setReactions(grouped);
    };

    fetchReactions();
  }, [messages, currentUserId]);

  // Fetch read receipts for messages
  useEffect(() => {
    const fetchReads = async () => {
      if (messages.length === 0) return;
      const messageIds = messages.map(m => m.id);

      const { data, error } = await supabase
        .from('message_reads')
        .select('*')
        .in('message_id', messageIds);

      if (error || !data) return;

      const grouped: Record<string, { user_id: string; read_at: string }[]> = {};
      data.forEach((r: any) => {
        if (!grouped[r.message_id]) grouped[r.message_id] = [];
        grouped[r.message_id].push({ user_id: r.user_id, read_at: r.read_at });
      });
      setMessageReads(grouped);
    };

    fetchReads();
  }, [messages]);

  // Mark messages as read when viewing the chat
  const markMessagesAsRead = useCallback(async () => {
    if (messages.length === 0) return;
    
    // Find messages not sent by current user that haven't been read
    const unreadMessageIds = messages
      .filter(m => m.user_id !== currentUserId)
      .filter(m => !messageReads[m.id]?.some(r => r.user_id === currentUserId))
      .map(m => m.id);

    if (unreadMessageIds.length === 0) return;

    // Batch insert read receipts (ignore conflicts)
    const inserts = unreadMessageIds.map(id => ({
      message_id: id,
      user_id: currentUserId,
    }));

    await supabase.from('message_reads').upsert(inserts, { onConflict: 'message_id,user_id' });

    // Update local state
    setMessageReads(prev => {
      const updated = { ...prev };
      unreadMessageIds.forEach(id => {
        if (!updated[id]) updated[id] = [];
        if (!updated[id].some(r => r.user_id === currentUserId)) {
          updated[id] = [...updated[id], { user_id: currentUserId, read_at: new Date().toISOString() }];
        }
      });
      return updated;
    });
  }, [messages, currentUserId, messageReads]);

  useEffect(() => {
    markMessagesAsRead();
  }, [messages.length]);

  const handleReact = async (messageId: string, emoji: string) => {
    // Check if already reacted with this emoji
    const existing = reactions[messageId]?.find(r => r.emoji === emoji && r.reactedByMe);
    
    if (existing) {
      // Remove reaction
      await supabase
        .from('message_reactions')
        .delete()
        .eq('message_id', messageId)
        .eq('user_id', currentUserId)
        .eq('emoji', emoji);

      setReactions(prev => {
        const updated = { ...prev };
        if (updated[messageId]) {
          updated[messageId] = updated[messageId]
            .map(r => r.emoji === emoji ? { ...r, count: r.count - 1, reactedByMe: false, userIds: r.userIds.filter(id => id !== currentUserId) } : r)
            .filter(r => r.count > 0);
        }
        return updated;
      });
    } else {
      // Add reaction
      const { error } = await supabase.from('message_reactions').insert({
        message_id: messageId,
        user_id: currentUserId,
        emoji,
      });
      if (error) return;

      setReactions(prev => {
        const updated = { ...prev };
        if (!updated[messageId]) updated[messageId] = [];
        const ex = updated[messageId].find(r => r.emoji === emoji);
        if (ex) {
          updated[messageId] = updated[messageId].map(r =>
            r.emoji === emoji ? { ...r, count: r.count + 1, reactedByMe: true, userIds: [...r.userIds, currentUserId] } : r
          );
        } else {
          updated[messageId] = [...updated[messageId], { emoji, count: 1, userIds: [currentUserId], reactedByMe: true }];
        }
        return updated;
      });
    }
  };

  const handleFileAttach = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast({ variant: "destructive", title: "File too large", description: "Maximum file size is 10MB" });
      return;
    }
    setSelectedFile(file);
  };

  const uploadFile = async (file: File): Promise<{ url: string; name: string; type: string; size: number } | null> => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `group-chat/${group.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from("user-files").upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data: signedData, error: signedError } = await supabase.storage.from("user-files").createSignedUrl(fileName, 60 * 60 * 24 * 365);
      if (signedError) throw signedError;
      return { url: signedData.signedUrl, name: file.name, type: file.type, size: file.size };
    } catch (error: any) {
      toast({ variant: "destructive", title: "Upload failed", description: error.message || "Could not upload file" });
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
      if (!uploaded) { setIsSending(false); return; }
      fileData = uploaded;
    }

    const success = await onSendMessage(
      content || (selectedFile ? `Shared a file: ${selectedFile.name}` : ""),
      fileData,
      replyTo?.id
    );

    setIsSending(false);
    if (success) {
      setSelectedFile(null);
      setReplyTo(null);
    }
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({ title: "Copied to clipboard" });
  };

  const handleReply = (message: MessageData) => {
    const userName = message.profile?.full_name || message.profile?.username || "User";
    setReplyTo({ id: message.id, content: message.content, userName });
  };

  // Build reply lookup map
  const replyMap = new Map<string, { content: string; user_name: string }>();
  messages.forEach(m => {
    const name = m.profile?.full_name || m.profile?.username || "User";
    replyMap.set(m.id, { content: m.content, user_name: name });
  });

  // Enrich messages with reply info, reactions, and read info
  const otherMembersCount = members.filter(m => m.user_id !== currentUserId).length;
  const enrichedMessages: MessageData[] = messages.map(m => ({
    ...m,
    reply_to_message: m.reply_to ? replyMap.get(m.reply_to) || null : null,
    reactions: reactions[m.id] || [],
    readInfo: m.user_id === currentUserId ? {
      readByCount: messageReads[m.id]?.length || 0,
      totalMembers: otherMembersCount,
    } : undefined,
  }));

  // Group messages by date
  const groupedMessages: { date: Date; messages: MessageData[] }[] = [];
  enrichedMessages.forEach((message) => {
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
      <ChatHeader
        groupName={group.name}
        memberCount={members.length}
        isOwner={isOwner}
        onOpenDetails={onOpenDetails}
        onViewStarred={() => setShowStarred(true)}
        onClearChat={onClearChat}
        onLeaveGroup={onLeaveGroup}
        onBack={onBack}
      />

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto bg-[url('/chat-bg-pattern.png')] bg-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(var(--background), 0.92), rgba(var(--background), 0.92))`,
        }}
      >
        {enrichedMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full px-4">
            <div className="text-center max-w-xs">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-10 h-10 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Messages and calls are end-to-end encrypted. No one outside of this chat can read or listen to them.
              </p>
              <p className="text-xs text-muted-foreground">Start the conversation!</p>
            </div>
          </div>
        ) : (
          <div className="py-2 space-y-1">
            {groupedMessages.map((g) => (
              <div key={g.date.toISOString()}>
                <div className="flex justify-center py-2 px-4">
                  <span className="text-[11px] font-medium text-muted-foreground bg-muted/80 px-3 py-1 rounded-md shadow-sm">
                    {formatMessageDate(g.date)}
                  </span>
                </div>
                <div className="space-y-0.5">
                  {g.messages.map((message, idx) => {
                    const isOwn = message.user_id === currentUserId;
                    const prevMessage = g.messages[idx - 1];
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
                        onReact={handleReact}
                        onShowReadReceipts={(msgId) => setReadReceiptMessageId(msgId)}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ChatInput
        onSendMessage={handleSendMessage}
        onAttachFile={handleFileAttach}
        selectedFile={selectedFile}
        onRemoveFile={() => setSelectedFile(null)}
        disabled={isSending}
        isUploading={isUploading}
        replyTo={replyTo}
        onCancelReply={() => setReplyTo(null)}
      />

      <StarredMessagesSheet
        open={showStarred}
        onOpenChange={setShowStarred}
        messages={enrichedMessages}
        currentUserId={currentUserId}
        onUnstar={onUnstarMessage}
      />
    </div>
  );
};
