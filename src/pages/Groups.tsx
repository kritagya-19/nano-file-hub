import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useGroups, useGroupDetails, Group } from "@/hooks/useGroups";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  Loader2,
  Plus,
  Users,
  LogIn,
  Search,
  MessageSquare,
  FileText,
  MoreVertical,
  Trash2,
  LogOut,
  Copy,
  Crown,
  Shield,
  UserPlus,
  UserMinus,
  Send,
  Share2,
  Download,
  File,
  Image,
  Video,
  Music,
  Archive,
  ChevronRight,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface UserFile {
  id: string;
  name: string;
  original_name: string;
  size: number;
  mime_type: string | null;
  storage_path: string;
}

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
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

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
  } = useGroupDetails(selectedGroupId);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  // Auto-select first group when groups load
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
    toast({
      title: "Copied!",
      description: "Invite code copied to clipboard",
    });
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
    }
  };

  const filteredGroups = groups.filter((g) =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-2rem)] flex flex-col lg:flex-row gap-4 p-4 lg:gap-6 lg:p-6">
        {/* Sidebar - Group List */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full lg:w-80 shrink-0 flex flex-col"
        >
          {/* Header */}
          <div className="mb-4 lg:mb-6">
            <h1 className="text-xl lg:text-2xl font-bold text-foreground">Groups</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Collaborate with your teams
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mb-4">
            <Button
              onClick={() => setIsCreateOpen(true)}
              className="flex-1 rounded-xl shadow-lg shadow-primary/25"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsJoinOpen(true)}
              className="flex-1 rounded-xl"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Join
            </Button>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 rounded-xl border-border/50"
            />
          </div>

          {/* Group List */}
          <ScrollArea className="flex-1 -mx-2 px-2">
            {groupsLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-16 bg-muted/50 animate-pulse rounded-xl"
                  />
                ))}
              </div>
            ) : filteredGroups.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">
                  {searchQuery ? "No groups found" : "No groups yet"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {searchQuery
                    ? "Try a different search"
                    : "Create or join a group to start"}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredGroups.map((g) => (
                  <GroupListItem
                    key={g.id}
                    group={g}
                    isSelected={selectedGroupId === g.id}
                    isOwner={g.owner_id === user.id}
                    onSelect={() => setSelectedGroupId(g.id)}
                    onCopyCode={() => handleCopyInviteCode(g.invite_code)}
                    onDelete={() => handleDeleteGroup(g.id)}
                    onLeave={() => handleLeaveGroup(g.id)}
                  />
                ))}
              </div>
            )}
          </ScrollArea>
        </motion.div>

        {/* Main Content - Group View */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex-1 flex flex-col rounded-2xl bg-card border border-border/50 overflow-hidden min-h-[400px] lg:min-h-0"
        >
          {!selectedGroupId || !group ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Select a group
                </h3>
                <p className="text-muted-foreground">
                  Choose a group from the list to view details
                </p>
              </div>
            </div>
          ) : detailsLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <GroupDetailView
              group={group}
              members={members}
              messages={messages}
              groupFiles={groupFiles}
              currentUserId={user.id}
              onSendMessage={sendMessage}
              onInviteByUsername={inviteByUsername}
              onRemoveMember={removeMember}
              onShareFile={shareFile}
              onUnshareFile={unshareFile}
              onCopyInviteCode={() => handleCopyInviteCode(group.invite_code)}
            />
          )}
        </motion.div>
      </div>

      {/* Create Group Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Group</DialogTitle>
            <DialogDescription>
              Create a group to share files and chat with others.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Input
              placeholder="Group name"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              className="h-12 rounded-xl"
            />
            <Textarea
              placeholder="Description (optional)"
              value={newGroupDescription}
              onChange={(e) => setNewGroupDescription(e.target.value)}
              className="rounded-xl resize-none"
              rows={3}
            />
            <Button
              onClick={handleCreateGroup}
              disabled={isCreating || !newGroupName.trim()}
              className="w-full rounded-xl"
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Join a Group</DialogTitle>
            <DialogDescription>
              Enter the invite code to join an existing group.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Input
              placeholder="Invite code"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              className="h-12 rounded-xl"
            />
            <Button
              onClick={handleJoinGroup}
              disabled={isJoining || !inviteCode.trim()}
              className="w-full rounded-xl"
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

// Group List Item Component
interface GroupListItemProps {
  group: Group;
  isSelected: boolean;
  isOwner: boolean;
  onSelect: () => void;
  onCopyCode: () => void;
  onDelete: () => void;
  onLeave: () => void;
}

const GroupListItem = ({
  group,
  isSelected,
  isOwner,
  onSelect,
  onCopyCode,
  onDelete,
  onLeave,
}: GroupListItemProps) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className={cn(
      "group p-3 lg:p-4 rounded-xl cursor-pointer transition-all duration-200",
      "border border-transparent hover:border-border/50",
      isSelected
        ? "bg-primary/10 border-primary/30"
        : "hover:bg-muted/50"
    )}
    onClick={onSelect}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
            isSelected
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
          )}
        >
          <Users className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className={cn("font-medium truncate", isSelected ? "text-primary" : "text-foreground")}>
            {group.name}
          </p>
          {group.description && (
            <p className="text-xs text-muted-foreground truncate">
              {group.description}
            </p>
          )}
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
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
              Leave group
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </motion.div>
);

// Group Detail View Component
interface GroupDetailViewProps {
  group: Group;
  members: any[];
  messages: any[];
  groupFiles: any[];
  currentUserId: string;
  onSendMessage: (content: string) => Promise<boolean>;
  onInviteByUsername: (username: string) => Promise<boolean>;
  onRemoveMember: (memberId: string) => Promise<boolean>;
  onShareFile: (fileId: string) => Promise<boolean>;
  onUnshareFile: (groupFileId: string) => Promise<boolean>;
  onCopyInviteCode: () => void;
}

const GroupDetailView = ({
  group,
  members,
  messages,
  groupFiles,
  currentUserId,
  onSendMessage,
  onInviteByUsername,
  onRemoveMember,
  onShareFile,
  onUnshareFile,
  onCopyInviteCode,
}: GroupDetailViewProps) => {
  const [activeTab, setActiveTab] = useState("chat");
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [inviteUsername, setInviteUsername] = useState("");
  const [isInviting, setIsInviting] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [userFiles, setUserFiles] = useState<UserFile[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const { toast } = useToast();

  const isAdmin = members.some(
    (m) => m.user_id === currentUserId && (m.role === "owner" || m.role === "admin")
  );

  const loadUserFiles = async () => {
    setLoadingFiles(true);
    try {
      const { data, error } = await supabase
        .from("files")
        .select("id, name, original_name, size, mime_type, storage_path")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUserFiles(data || []);
    } catch (error) {
      console.error("Error loading files:", error);
    } finally {
      setLoadingFiles(false);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim() || sending) return;
    setSending(true);
    const success = await onSendMessage(newMessage);
    setSending(false);
    if (success) {
      setNewMessage("");
    }
  };

  const handleInvite = async () => {
    if (!inviteUsername.trim()) return;
    setIsInviting(true);
    const success = await onInviteByUsername(inviteUsername.trim());
    setIsInviting(false);
    if (success) {
      setInviteUsername("");
      setIsInviteOpen(false);
    }
  };

  const handleShareFile = async (fileId: string) => {
    const success = await onShareFile(fileId);
    if (success) {
      setIsShareOpen(false);
    }
  };

  const getFileIcon = (mimeType: string | null) => {
    if (!mimeType) return File;
    if (mimeType.startsWith("image/")) return Image;
    if (mimeType.startsWith("video/")) return Video;
    if (mimeType.startsWith("audio/")) return Music;
    if (mimeType.includes("zip") || mimeType.includes("rar")) return Archive;
    return FileText;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const downloadFile = async (storagePath: string, fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from("user-files")
        .createSignedUrl(storagePath, 3600);
        
      if (error) throw error;
      
      if (data?.signedUrl) {
        const link = document.createElement("a");
        link.href = data.signedUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("Download error:", error);
      toast({
        variant: "destructive",
        title: "Download failed",
        description: "Could not download the file",
      });
    }
  };

  // Filter files not already shared
  const sharedFileIds = groupFiles.map((gf) => gf.file_id);
  const availableFiles = userFiles.filter((f) => !sharedFileIds.includes(f.id));

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 lg:p-6 border-b border-border/50">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 lg:gap-4 min-w-0">
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 lg:w-6 lg:h-6 text-primary" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg lg:text-xl font-bold text-foreground truncate">{group.name}</h2>
              {group.description && (
                <p className="text-sm text-muted-foreground truncate">{group.description}</p>
              )}
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={onCopyInviteCode} className="rounded-xl shrink-0">
            <Copy className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Invite Code</span>
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
        <div className="px-4 lg:px-6 pt-4">
          <TabsList className="w-full grid grid-cols-3 h-10 lg:h-12 p-1 rounded-xl bg-muted/50">
            <TabsTrigger value="chat" className="rounded-lg data-[state=active]:shadow-sm text-xs lg:text-sm">
              <MessageSquare className="w-4 h-4 mr-1 lg:mr-2" />
              <span className="hidden sm:inline">Chat</span>
            </TabsTrigger>
            <TabsTrigger value="members" className="rounded-lg data-[state=active]:shadow-sm text-xs lg:text-sm">
              <Users className="w-4 h-4 mr-1 lg:mr-2" />
              <span className="hidden sm:inline">Members</span> ({members.length})
            </TabsTrigger>
            <TabsTrigger value="files" className="rounded-lg data-[state=active]:shadow-sm text-xs lg:text-sm">
              <FileText className="w-4 h-4 mr-1 lg:mr-2" />
              <span className="hidden sm:inline">Files</span> ({groupFiles.length})
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Chat Tab */}
        <TabsContent value="chat" className="flex-1 flex flex-col m-0 mt-4 overflow-hidden">
          <ScrollArea className="flex-1 px-4 lg:px-6">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full py-12">
                <div className="text-center">
                  <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No messages yet</p>
                  <p className="text-sm text-muted-foreground">Start the conversation!</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3 lg:space-y-4 pb-4">
                {messages.map((message) => {
                  const isOwn = message.user_id === currentUserId;
                  return (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn("flex", isOwn ? "justify-end" : "justify-start")}
                    >
                      <div
                        className={cn(
                          "max-w-[85%] lg:max-w-[75%] rounded-2xl px-3 lg:px-4 py-2 lg:py-3",
                          isOwn
                            ? "bg-primary text-primary-foreground rounded-br-md"
                            : "bg-muted rounded-bl-md"
                        )}
                      >
                        {!isOwn && (
                          <p className="text-xs font-medium mb-1 opacity-70">
                            {message.profile?.full_name || message.profile?.username || "User"}
                          </p>
                        )}
                        <p className="break-words text-sm lg:text-base">{message.content}</p>
                        <p
                          className={cn(
                            "text-xs mt-1",
                            isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
                          )}
                        >
                          {format(new Date(message.created_at), "HH:mm")}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </ScrollArea>

          {/* Message Input */}
          <div className="p-3 lg:p-4 border-t border-border/50">
            <div className="flex gap-2 lg:gap-3">
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                disabled={sending}
                className="h-10 lg:h-12 rounded-xl"
              />
              <Button
                onClick={handleSend}
                disabled={sending || !newMessage.trim()}
                className="h-10 lg:h-12 px-4 lg:px-6 rounded-xl"
              >
                {sending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Members Tab */}
        <TabsContent value="members" className="flex-1 m-0 mt-4 overflow-hidden">
          <ScrollArea className="h-full px-4 lg:px-6">
            <div className="space-y-3 lg:space-y-4 pb-4">
              {/* Invite Button */}
              {isAdmin && (
                <Button
                  onClick={() => setIsInviteOpen(true)}
                  className="w-full rounded-xl"
                  variant="outline"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Invite Member
                </Button>
              )}

              {/* Members List */}
              {members.map((member) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-3 lg:p-4 rounded-xl bg-muted/30 border border-border/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground font-semibold text-sm lg:text-base">
                      {(member.profile?.full_name?.[0] || member.profile?.username?.[0] || "U").toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm lg:text-base">
                        {member.profile?.full_name || member.profile?.username || "User"}
                      </p>
                      {member.profile?.username && (
                        <p className="text-xs lg:text-sm text-muted-foreground">
                          @{member.profile.username}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {member.role === "owner" && (
                      <Badge variant="default" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20 text-xs">
                        <Crown className="w-3 h-3 mr-1" />
                        Owner
                      </Badge>
                    )}
                    {member.role === "admin" && (
                      <Badge variant="secondary" className="text-xs">
                        <Shield className="w-3 h-3 mr-1" />
                        Admin
                      </Badge>
                    )}
                    {isAdmin && member.role !== "owner" && member.user_id !== currentUserId && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => onRemoveMember(member.id)}
                      >
                        <UserMinus className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Files Tab */}
        <TabsContent value="files" className="flex-1 m-0 mt-4 overflow-hidden">
          <ScrollArea className="h-full px-4 lg:px-6">
            <div className="space-y-3 lg:space-y-4 pb-4">
              {/* Share Button */}
              <Button
                onClick={() => {
                  setIsShareOpen(true);
                  loadUserFiles();
                }}
                className="w-full rounded-xl"
                variant="outline"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share File
              </Button>

              {/* Files List */}
              {groupFiles.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No files shared yet</p>
                </div>
              ) : (
                groupFiles.map((groupFile) => {
                  const FileIcon = getFileIcon(groupFile.file?.mime_type || null);
                  return (
                    <motion.div
                      key={groupFile.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between p-3 lg:p-4 rounded-xl bg-muted/30 border border-border/30"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <FileIcon className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-foreground truncate text-sm lg:text-base">
                            {groupFile.file?.original_name || "Unknown file"}
                          </p>
                          <p className="text-xs lg:text-sm text-muted-foreground">
                            {formatFileSize(groupFile.file?.size || 0)} •{" "}
                            {format(new Date(groupFile.shared_at), "MMM d, yyyy")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {groupFile.file && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              downloadFile(groupFile.file!.storage_path, groupFile.file!.original_name)
                            }
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        )}
                        {(groupFile.shared_by === currentUserId || isAdmin) && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => onUnshareFile(groupFile.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {/* Invite Dialog */}
      <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Member</DialogTitle>
            <DialogDescription>
              Enter the username of the person you want to invite.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Input
              placeholder="Username"
              value={inviteUsername}
              onChange={(e) => setInviteUsername(e.target.value)}
              className="h-12 rounded-xl"
            />
            <Button
              onClick={handleInvite}
              disabled={isInviting || !inviteUsername.trim()}
              className="w-full rounded-xl"
            >
              {isInviting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <UserPlus className="w-4 h-4 mr-2" />
              )}
              Invite Member
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Share File Dialog */}
      <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share a File</DialogTitle>
            <DialogDescription>
              Select a file from your files to share with the group.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[400px] mt-4">
            {loadingFiles ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : availableFiles.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No files available to share</p>
                <p className="text-sm text-muted-foreground">
                  Upload files first in the Files section
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {availableFiles.map((file) => {
                  const FileIcon = getFileIcon(file.mime_type);
                  return (
                    <div
                      key={file.id}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 cursor-pointer transition-colors border border-transparent hover:border-border/50"
                      onClick={() => handleShareFile(file.id)}
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <FileIcon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-foreground truncate">
                          {file.original_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Groups;
