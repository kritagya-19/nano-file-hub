import { Group, GroupMember, GroupMessage, GroupFile } from '@/hooks/useGroups';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { GroupChat } from './GroupChat';
import { GroupMembers } from './GroupMembers';
import { GroupFiles } from './GroupFiles';
import { MessageSquare, Users, FileText, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface GroupViewProps {
  group: Group;
  members: GroupMember[];
  messages: GroupMessage[];
  files: GroupFile[];
  loading: boolean;
  onSendMessage: (content: string) => Promise<boolean>;
  onInviteByUsername: (username: string) => Promise<boolean>;
  onRemoveMember: (memberId: string) => Promise<boolean>;
  onShareFile: (fileId: string) => Promise<boolean>;
  onUnshareFile: (groupFileId: string) => Promise<boolean>;
}

export const GroupView = ({
  group,
  members,
  messages,
  files,
  loading,
  onSendMessage,
  onInviteByUsername,
  onRemoveMember,
  onShareFile,
  onUnshareFile,
}: GroupViewProps) => {
  const { toast } = useToast();

  const copyInviteCode = () => {
    navigator.clipboard.writeText(group.invite_code);
    toast({
      title: 'Copied',
      description: 'Invite code copied to clipboard',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Card className="rounded-none border-x-0 border-t-0">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{group.name}</CardTitle>
              {group.description && (
                <CardDescription>{group.description}</CardDescription>
              )}
            </div>
            <Button variant="outline" size="sm" onClick={copyInviteCode}>
              <Copy className="h-4 w-4 mr-2" />
              Copy Invite Code
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="chat" className="flex-1 flex flex-col">
        <TabsList className="mx-4 mt-2">
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Chat
          </TabsTrigger>
          <TabsTrigger value="members" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Members ({members.length})
          </TabsTrigger>
          <TabsTrigger value="files" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Files ({files.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="flex-1 m-0 data-[state=active]:flex data-[state=active]:flex-col">
          <GroupChat messages={messages} onSendMessage={onSendMessage} />
        </TabsContent>

        <TabsContent value="members" className="flex-1 m-0 overflow-auto">
          <GroupMembers
            group={group}
            members={members}
            onInviteByUsername={onInviteByUsername}
            onRemoveMember={onRemoveMember}
          />
        </TabsContent>

        <TabsContent value="files" className="flex-1 m-0 overflow-auto">
          <GroupFiles
            groupFiles={files}
            onShareFile={onShareFile}
            onUnshareFile={onUnshareFile}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
