import { useState } from 'react';
import { Group } from '@/hooks/useGroups';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Users, LogIn, Trash2, Copy, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface GroupListProps {
  groups: Group[];
  loading: boolean;
  selectedGroupId: string | null;
  onSelectGroup: (groupId: string) => void;
  onCreateGroup: (name: string, description?: string) => Promise<Group | null>;
  onJoinGroup: (inviteCode: string) => Promise<boolean>;
  onDeleteGroup: (groupId: string) => Promise<boolean>;
  onLeaveGroup: (groupId: string) => Promise<boolean>;
}

export const GroupList = ({
  groups,
  loading,
  selectedGroupId,
  onSelectGroup,
  onCreateGroup,
  onJoinGroup,
  onDeleteGroup,
  onLeaveGroup,
}: GroupListProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) return;
    
    setIsCreating(true);
    const result = await onCreateGroup(newGroupName.trim(), newGroupDescription.trim() || undefined);
    setIsCreating(false);
    
    if (result) {
      setNewGroupName('');
      setNewGroupDescription('');
      setCreateDialogOpen(false);
      onSelectGroup(result.id);
    }
  };

  const handleJoinGroup = async () => {
    if (!inviteCode.trim()) return;
    
    setIsJoining(true);
    const success = await onJoinGroup(inviteCode.trim());
    setIsJoining(false);
    
    if (success) {
      setInviteCode('');
      setJoinDialogOpen(false);
    }
  };

  const copyInviteCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: 'Copied',
      description: 'Invite code copied to clipboard',
    });
  };

  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="flex-1">
              <Plus className="h-4 w-4 mr-2" />
              Create Group
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Group</DialogTitle>
              <DialogDescription>Create a group to share files and chat with others.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <Input
                placeholder="Group name"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
              />
              <Input
                placeholder="Description (optional)"
                value={newGroupDescription}
                onChange={(e) => setNewGroupDescription(e.target.value)}
              />
              <Button onClick={handleCreateGroup} disabled={isCreating || !newGroupName.trim()} className="w-full">
                {isCreating ? 'Creating...' : 'Create Group'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={joinDialogOpen} onOpenChange={setJoinDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" className="flex-1">
              <LogIn className="h-4 w-4 mr-2" />
              Join Group
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Join a Group</DialogTitle>
              <DialogDescription>Enter the invite code to join an existing group.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <Input
                placeholder="Invite code"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
              />
              <Button onClick={handleJoinGroup} disabled={isJoining || !inviteCode.trim()} className="w-full">
                {isJoining ? 'Joining...' : 'Join Group'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {groups.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No groups yet</p>
            <p className="text-sm text-muted-foreground">Create or join a group to get started</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {groups.map((group) => (
            <Card
              key={group.id}
              className={`cursor-pointer transition-colors hover:bg-accent/50 ${
                selectedGroupId === group.id ? 'border-primary bg-accent/30' : ''
              }`}
              onClick={() => onSelectGroup(group.id)}
            >
              <CardHeader className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base truncate">{group.name}</CardTitle>
                    {group.description && (
                      <CardDescription className="truncate">{group.description}</CardDescription>
                    )}
                  </div>
                  <div className="flex items-center gap-1 ml-2" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => copyInviteCode(group.invite_code)}
                      title="Copy invite code"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    {group.owner_id === user?.id ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => onDeleteGroup(group.id)}
                        title="Delete group"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onLeaveGroup(group.id)}
                        title="Leave group"
                      >
                        <LogOut className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
