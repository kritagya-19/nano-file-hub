import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useGroups, useGroupDetails, Group } from "@/hooks/useGroups";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  Loader2,
  Plus,
  Users,
  LogIn,
  Search,
  MoreVertical,
  Trash2,
  LogOut,
  Copy,
  Hash,
  Info,
} from "lucide-react";
import { GroupChat } from "@/components/groups/GroupChat";
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

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-2rem)] flex flex-col lg:flex-row gap-3 p-3 sm:gap-4 sm:p-4 lg:gap-6 lg:p-6">
        {/* Sidebar - Group List */}
        <div className="w-full lg:w-72 xl:w-80 shrink-0 flex flex-col">
          <div className="mb-4">
            <h1 className="text-lg sm:text-xl font-bold text-foreground">Groups</h1>
            <p className="text-muted-foreground text-sm">Chat with your teams</p>
          </div>

          <div className="flex gap-2 mb-3">
            <Button onClick={() => setIsCreateOpen(true)} size="sm" className="flex-1">
              <Plus className="w-4 h-4 mr-1.5" />
              Create
            </Button>
            <Button variant="outline" onClick={() => setIsJoinOpen(true)} size="sm" className="flex-1">
              <LogIn className="w-4 h-4 mr-1.5" />
              Join
            </Button>
          </div>

          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-sm"
            />
          </div>

          <ScrollArea className="flex-1 -mx-1 px-1">
            {groupsLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-14 bg-muted/50 animate-pulse rounded-lg" />
                ))}
              </div>
            ) : filteredGroups.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm font-medium text-foreground">
                  {searchQuery ? "No groups found" : "No groups yet"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {searchQuery ? "Try a different search" : "Create or join a group"}
                </p>
              </div>
            ) : (
              <div className="space-y-1">
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
        </div>

        {/* Main Content - Chat View */}
        <div className="flex-1 flex flex-col rounded-xl bg-card border border-border overflow-hidden min-h-[300px] lg:min-h-0">
          {!selectedGroupId || !group ? (
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="text-center">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-semibold text-foreground mb-1">Select a group</h3>
                <p className="text-sm text-muted-foreground">Choose a group to start chatting</p>
              </div>
            </div>
          ) : detailsLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="px-3 sm:px-4 py-3 border-b border-border flex items-center justify-between gap-3">
                <button
                  onClick={() => setIsDetailOpen(true)}
                  className="flex items-center gap-3 min-w-0 hover:opacity-80 transition-opacity"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Hash className="w-5 h-5 text-primary" />
                  </div>
                  <div className="min-w-0 text-left">
                    <h2 className="font-semibold text-foreground truncate">{group.name}</h2>
                    <p className="text-xs text-muted-foreground">
                      {members.length} {members.length === 1 ? "member" : "members"} • Tap for details
                    </p>
                  </div>
                </button>
                <Button variant="ghost" size="icon" onClick={() => setIsDetailOpen(true)} className="shrink-0">
                  <Info className="w-5 h-5" />
                </Button>
              </div>

              {/* Chat Messages */}
              <GroupChat
                messages={messages}
                currentUserId={user.id}
                onSendMessage={sendMessage}
              />
            </>
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
            <DialogTitle>Create New Group</DialogTitle>
            <DialogDescription>Create a group to chat and share files.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 pt-2">
            <Input
              placeholder="Group name"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              className="h-10"
            />
            <Textarea
              placeholder="Description (optional)"
              value={newGroupDescription}
              onChange={(e) => setNewGroupDescription(e.target.value)}
              className="resize-none"
              rows={2}
            />
            <Button onClick={handleCreateGroup} disabled={isCreating || !newGroupName.trim()} className="w-full">
              {isCreating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
              Create Group
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Join Group Dialog */}
      <Dialog open={isJoinOpen} onOpenChange={setIsJoinOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Join a Group</DialogTitle>
            <DialogDescription>Enter the invite code to join.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 pt-2">
            <Input
              placeholder="Invite code"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              className="h-10"
            />
            <Button onClick={handleJoinGroup} disabled={isJoining || !inviteCode.trim()} className="w-full">
              {isJoining ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <LogIn className="w-4 h-4 mr-2" />}
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
  <div
    className={cn(
      "group flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-colors",
      isSelected ? "bg-primary/10" : "hover:bg-muted/50"
    )}
    onClick={onSelect}
  >
    <div className="flex items-center gap-2.5 min-w-0">
      <div
        className={cn(
          "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
          isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
        )}
      >
        <Hash className="w-4 h-4" />
      </div>
      <div className="min-w-0">
        <p className={cn("font-medium text-sm truncate", isSelected && "text-primary")}>
          {group.name}
        </p>
        {group.description && (
          <p className="text-xs text-muted-foreground truncate">{group.description}</p>
        )}
      </div>
    </div>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
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
          <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={onDelete}>
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
);

export default Groups;
