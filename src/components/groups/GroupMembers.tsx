import { useState } from 'react';
import { GroupMember, Group } from '@/hooks/useGroups';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { UserPlus, UserMinus, Crown, Shield, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface GroupMembersProps {
  group: Group;
  members: GroupMember[];
  onInviteByUsername: (username: string) => Promise<boolean>;
  onRemoveMember: (memberId: string) => Promise<boolean>;
}

export const GroupMembers = ({
  group,
  members,
  onInviteByUsername,
  onRemoveMember,
}: GroupMembersProps) => {
  const { user } = useAuth();
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [isInviting, setIsInviting] = useState(false);

  const isAdmin = members.some(
    (m) => m.user_id === user?.id && (m.role === 'owner' || m.role === 'admin')
  );

  const handleInvite = async () => {
    if (!username.trim()) return;

    setIsInviting(true);
    const success = await onInviteByUsername(username.trim());
    setIsInviting(false);

    if (success) {
      setUsername('');
      setInviteDialogOpen(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case 'admin':
        return <Shield className="h-4 w-4 text-blue-500" />;
      default:
        return <User className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'owner':
        return <Badge variant="default">Owner</Badge>;
      case 'admin':
        return <Badge variant="secondary">Admin</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Members ({members.length})</h3>
        {isAdmin && (
          <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <UserPlus className="h-4 w-4 mr-2" />
                Invite
              </Button>
            </DialogTrigger>
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
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Button
                  onClick={handleInvite}
                  disabled={isInviting || !username.trim()}
                  className="w-full"
                >
                  {isInviting ? 'Inviting...' : 'Invite Member'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="space-y-2">
        {members.map((member) => (
          <Card key={member.id}>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getRoleIcon(member.role)}
                  <div>
                    <p className="font-medium">
                      {member.profile?.full_name || member.profile?.username || 'Unknown User'}
                    </p>
                    {member.profile?.username && (
                      <p className="text-sm text-muted-foreground">@{member.profile.username}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getRoleBadge(member.role)}
                  {isAdmin && member.role !== 'owner' && member.user_id !== user?.id && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => onRemoveMember(member.id)}
                    >
                      <UserMinus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
