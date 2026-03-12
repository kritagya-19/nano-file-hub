import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useGroups, useGroupDetails, Group } from "@/hooks/useGroups";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  Loader2,
  Plus,
  Users,
  LogIn,
  Search,
  MessageCircle,
  Settings,
} from "lucide-react";
import { GroupChatView } from "@/components/groups/GroupChatView";
import { GroupListItem } from "@/components/groups/GroupListItem";
import { GroupDetailDialog } from "@/components/groups/GroupDetailDialog";

const Groups = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    groups,
    loading: groupsLoading,
    createGroup,
    joinGroup,
    deleteGroup,
    leaveGroup,
  } = useGroups();

  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});

  // Fetch unread message counts per group
  const fetchUnreadCounts = useCallback(async () => {
    if (!user || groups.length === 0) return;

    try {
      // Get all messages across all groups not sent by current user
      const groupIds = groups.map(g => g.id);
      const { data: allMessages, error: msgError } = await supabase
        .from('group_messages')
        .select('id, group_id')
        .in('group_id', groupIds)
        .neq('user_id', user.id);

      if (msgError || !allMessages || allMessages.length === 0) {
        setUnreadCounts({});
        return;
      }

      const messageIds = allMessages.map(m => m.id);
      // Get which of these the current user has read
      const { data: reads, error: readError } = await supabase
        .from('message_reads')
        .select('message_id')
        .in('message_id', messageIds)
        .eq('user_id', user.id);

      if (readError) {
        setUnreadCounts({});
        return;
      }

      const readSet = new Set(reads?.map(r => r.message_id) || []);
      const counts: Record<string, number> = {};
      allMessages.forEach(m => {
        if (!readSet.has(m.id)) {
          counts[m.group_id] = (counts[m.group_id] || 0) + 1;
        }
      });
      setUnreadCounts(counts);
    } catch {
      // silently fail
    }
  }, [user, groups]);

  useEffect(() => {
    fetchUnreadCounts();
  }, [fetchUnreadCounts, messages]);

  const {
    group,
    members,
    messages,
    files: groupFiles,
    loading: detailsLoading,
    sendMessage,
    inviteByUsername,
    removeMember,
    shareFile,
    unshareFile,
    starMessage,
    unstarMessage,
    deleteMessage,
    clearChat,
  } = useGroupDetails(selectedGroupId);

  const isOwner = group?.owner_id === user?.id;
  const isAdmin = members.some(
    (m) => m.user_id === user?.id && (m.role === "owner" || m.role === "admin")
  );

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (groups.length > 0 && !selectedGroupId) {
      setSelectedGroupId(groups[0].id);
    }
  }, [groups, selectedGroupId]);

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) return;
    setIsCreating(true);
    const result = await createGroup(newGroupName.trim(), newGroupDescription.trim() || undefined);
    setIsCreating(false);
    if (result) {
      setNewGroupName("");
      setNewGroupDescription("");
      setIsCreateOpen(false);
      setSelectedGroupId(result.id);
    }
  };

  const handleJoinGroup = async () => {
    if (!inviteCode.trim()) return;
    setIsJoining(true);
    const success = await joinGroup(inviteCode.trim());
    setIsJoining(false);
    if (success) {
      setInviteCode("");
      setIsJoinOpen(false);
    }
  };

  const handleCopyInviteCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({ title: "Copied!", description: "Invite code copied to clipboard" });
  };

  const handleDeleteGroup = async (groupId: string) => {
    const success = await deleteGroup(groupId);
    if (success && selectedGroupId === groupId) {
      setSelectedGroupId(groups.length > 1 ? groups.find(g => g.id !== groupId)?.id || null : null);
    }
  };

  const handleLeaveGroup = async (groupId: string) => {
    const success = await leaveGroup(groupId);
    if (success && selectedGroupId === groupId) {
      setSelectedGroupId(groups.length > 1 ? groups.find(g => g.id !== groupId)?.id || null : null);
      setShowMobileChat(false);
    }
  };

  const handleSelectGroup = (groupId: string) => {
    setSelectedGroupId(groupId);
    setShowMobileChat(true);
  };

  const filteredGroups = groups.filter((g) =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get last message for each group (simplified - just show description for now)
  const getLastMessage = (groupId: string) => {
    // In a real app, you'd track this per-group
    return undefined;
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-2rem)] flex overflow-hidden">
        {/* Sidebar - Group List (WhatsApp style) */}
        <div className={cn(
          "w-full md:w-[350px] lg:w-[400px] shrink-0 flex flex-col border-r border-border bg-card",
          showMobileChat && selectedGroupId ? "hidden md:flex" : "flex"
        )}>
          {/* Header */}
          <div className="h-14 sm:h-16 px-4 flex items-center justify-between border-b border-border bg-card">
            <h1 className="text-xl font-bold text-foreground">Chats</h1>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={() => setIsCreateOpen(true)}>
                <Plus className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="p-2 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search or start new chat"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-sm bg-muted/50 border-0 focus-visible:ring-1"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-3 py-2 flex gap-2 border-b border-border">
            <Button 
              onClick={() => setIsCreateOpen(true)} 
              size="sm" 
              variant="outline"
              className="flex-1 h-8 text-xs"
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              New Group
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setIsJoinOpen(true)} 
              size="sm" 
              className="flex-1 h-8 text-xs"
            >
              <LogIn className="w-3.5 h-3.5 mr-1.5" />
              Join Group
            </Button>
          </div>

          {/* Groups List */}
          <ScrollArea className="flex-1">
            {groupsLoading ? (
              <div className="space-y-2 p-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-muted/50 animate-pulse rounded-lg" />
                ))}
              </div>
            ) : filteredGroups.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 px-4 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <MessageCircle className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="font-medium text-foreground mb-1">
                  {searchQuery ? "No groups found" : "No groups yet"}
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  {searchQuery ? "Try a different search" : "Create or join a group to start chatting"}
                </p>
                {!searchQuery && (
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => setIsCreateOpen(true)}>
                      <Plus className="w-4 h-4 mr-1" />
                      Create
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setIsJoinOpen(true)}>
                      <LogIn className="w-4 h-4 mr-1" />
                      Join
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div>
                {filteredGroups.map((g) => (
                  <GroupListItem
                    key={g.id}
                    group={g}
                    isSelected={selectedGroupId === g.id}
                    isOwner={g.owner_id === user.id}
                    lastMessage={getLastMessage(g.id)}
                    unreadCount={unreadCounts[g.id] || 0}
                    onSelect={() => handleSelectGroup(g.id)}
                    onCopyCode={() => handleCopyInviteCode(g.invite_code)}
                    onDelete={() => handleDeleteGroup(g.id)}
                    onLeave={() => handleLeaveGroup(g.id)}
                  />
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Main Content - Chat View */}
        <div className={cn(
          "flex-1 flex flex-col min-w-0",
          !showMobileChat && !selectedGroupId ? "hidden md:flex" : "flex",
          showMobileChat && selectedGroupId ? "flex" : "hidden md:flex"
        )}>
          {!selectedGroupId || !group ? (
            <div className="flex-1 flex items-center justify-center bg-muted/20">
              <div className="text-center px-4">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Users className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Welcome to Groups</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Select a group to start chatting or create a new one to connect with your team.
                </p>
              </div>
            </div>
          ) : detailsLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <GroupChatView
              group={group}
              messages={messages}
              members={members}
              currentUserId={user.id}
              isOwner={isOwner}
              onSendMessage={sendMessage}
              onOpenDetails={() => setIsDetailOpen(true)}
              onLeaveGroup={() => handleLeaveGroup(group.id)}
              onClearChat={clearChat}
              onStarMessage={starMessage}
              onUnstarMessage={unstarMessage}
              onDeleteMessage={deleteMessage}
              onBack={() => setShowMobileChat(false)}
            />
          )}
        </div>
      </div>

      {/* Group Detail Dialog */}
      {group && (
        <GroupDetailDialog
          open={isDetailOpen}
          onOpenChange={setIsDetailOpen}
          group={group}
          members={members}
          groupFiles={groupFiles}
          currentUserId={user.id}
          isAdmin={isAdmin}
          onInviteByUsername={inviteByUsername}
          onRemoveMember={removeMember}
          onShareFile={shareFile}
          onUnshareFile={unshareFile}
        />
      )}

      {/* Create Group Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New group</DialogTitle>
            <DialogDescription>Create a group to chat and share files with your team.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <Input
                placeholder="Group name"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                className="h-11"
              />
            </div>
            <div>
              <Textarea
                placeholder="Group description (optional)"
                value={newGroupDescription}
                onChange={(e) => setNewGroupDescription(e.target.value)}
                className="resize-none"
                rows={3}
              />
            </div>
            <Button 
              onClick={handleCreateGroup} 
              disabled={isCreating || !newGroupName.trim()} 
              className="w-full h-11"
            >
              {isCreating ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )}
              Create Group
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Join Group Dialog */}
      <Dialog open={isJoinOpen} onOpenChange={setIsJoinOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Join a group</DialogTitle>
            <DialogDescription>Enter the invite code shared by a group member.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <Input
              placeholder="Enter invite code"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              className="h-11 text-center text-lg tracking-wider"
            />
            <Button 
              onClick={handleJoinGroup} 
              disabled={isJoining || !inviteCode.trim()} 
              className="w-full h-11"
            >
              {isJoining ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <LogIn className="w-4 h-4 mr-2" />
              )}
              Join Group
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Groups;
