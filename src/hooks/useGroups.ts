import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

export interface Group {
  id: string;
  name: string;
  description: string | null;
  owner_id: string;
  invite_code: string;
  created_at: string;
}

export interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member';
  joined_at: string;
  profile?: {
    full_name: string | null;
    email: string | null;
    username: string | null;
  };
}

export interface GroupMessage {
  id: string;
  group_id: string;
  user_id: string;
  content: string;
  created_at: string;
  profile?: {
    full_name: string | null;
    username: string | null;
  };
}

export interface GroupFile {
  id: string;
  group_id: string;
  file_id: string;
  shared_by: string;
  shared_at: string;
  file?: {
    id: string;
    name: string;
    original_name: string;
    size: number;
    mime_type: string | null;
    storage_path: string;
  };
}

export const useGroups = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGroups = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('groups')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGroups(data || []);
    } catch (error: any) {
      console.error('Error fetching groups:', error);
      toast({
        title: 'Error',
        description: 'Failed to load groups',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createGroup = async (name: string, description?: string) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('groups')
        .insert({
          name,
          description,
          owner_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      setGroups(prev => [data, ...prev]);
      toast({
        title: 'Success',
        description: 'Group created successfully',
      });
      return data;
    } catch (error: any) {
      console.error('Error creating group:', error);
      toast({
        title: 'Error',
        description: 'Failed to create group',
        variant: 'destructive',
      });
      return null;
    }
  };

  const joinGroup = async (inviteCode: string) => {
    if (!user) return false;

    try {
      const { data, error } = await supabase.rpc('join_group_by_code', { 
        code: inviteCode 
      });

      if (error) {
        const errorMessage = error.message.includes('Already a member')
          ? 'You are already a member of this group'
          : error.message.includes('Invalid invite code')
          ? 'Invalid invite code'
          : 'Failed to join group';
        
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
        return false;
      }

      await fetchGroups();
      toast({
        title: 'Success',
        description: 'Joined group successfully',
      });
      return true;
    } catch (error: any) {
      console.error('Error joining group:', error);
      toast({
        title: 'Error',
        description: 'Failed to join group',
        variant: 'destructive',
      });
      return false;
    }
  };

  const deleteGroup = async (groupId: string) => {
    try {
      const { error } = await supabase
        .from('groups')
        .delete()
        .eq('id', groupId);

      if (error) throw error;

      setGroups(prev => prev.filter(g => g.id !== groupId));
      toast({
        title: 'Success',
        description: 'Group deleted successfully',
      });
      return true;
    } catch (error: any) {
      console.error('Error deleting group:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete group',
        variant: 'destructive',
      });
      return false;
    }
  };

  const leaveGroup = async (groupId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('group_members')
        .delete()
        .eq('group_id', groupId)
        .eq('user_id', user.id);

      if (error) throw error;

      setGroups(prev => prev.filter(g => g.id !== groupId));
      toast({
        title: 'Success',
        description: 'Left group successfully',
      });
      return true;
    } catch (error: any) {
      console.error('Error leaving group:', error);
      toast({
        title: 'Error',
        description: 'Failed to leave group',
        variant: 'destructive',
      });
      return false;
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [user]);

  return {
    groups,
    loading,
    createGroup,
    joinGroup,
    deleteGroup,
    leaveGroup,
    refetch: fetchGroups,
  };
};

export const useGroupDetails = (groupId: string | null) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [group, setGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [files, setFiles] = useState<GroupFile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGroupDetails = async () => {
    if (!groupId || !user) return;

    try {
      // Fetch group
      const { data: groupData, error: groupError } = await supabase
        .from('groups')
        .select('*')
        .eq('id', groupId)
        .single();

      if (groupError) throw groupError;
      setGroup(groupData);

      // Fetch members
      const { data: membersData, error: membersError } = await supabase
        .from('group_members')
        .select('*')
        .eq('group_id', groupId)
        .order('joined_at', { ascending: true });

      if (membersError) throw membersError;

      // Fetch profiles for members
      const memberUserIds = membersData?.map(m => m.user_id) || [];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, full_name, email, username')
        .in('id', memberUserIds);

      const profilesMap = new Map(profilesData?.map(p => [p.id, p]) || []);
      
      const membersWithProfiles: GroupMember[] = (membersData || []).map(m => ({
        ...m,
        role: m.role as 'owner' | 'admin' | 'member',
        profile: profilesMap.get(m.user_id) || undefined,
      }));
      
      setMembers(membersWithProfiles);

      // Fetch messages
      const { data: messagesData, error: messagesError } = await supabase
        .from('group_messages')
        .select('*')
        .eq('group_id', groupId)
        .order('created_at', { ascending: true });

      if (messagesError) throw messagesError;

      // Fetch profiles for message authors
      const messageUserIds = [...new Set(messagesData?.map(m => m.user_id) || [])];
      const { data: messageProfilesData } = await supabase
        .from('profiles')
        .select('id, full_name, username')
        .in('id', messageUserIds);

      const messageProfilesMap = new Map(messageProfilesData?.map(p => [p.id, p]) || []);
      
      const messagesWithProfiles: GroupMessage[] = (messagesData || []).map(m => ({
        ...m,
        profile: messageProfilesMap.get(m.user_id) || undefined,
      }));
      
      setMessages(messagesWithProfiles);

      // Fetch shared files
      const { data: groupFilesData, error: filesError } = await supabase
        .from('group_files')
        .select('*')
        .eq('group_id', groupId)
        .order('shared_at', { ascending: false });

      if (filesError) throw filesError;

      // Fetch file details
      const fileIds = groupFilesData?.map(gf => gf.file_id) || [];
      const { data: filesData } = await supabase
        .from('files')
        .select('id, name, original_name, size, mime_type, storage_path')
        .in('id', fileIds);

      const filesMap = new Map(filesData?.map(f => [f.id, f]) || []);
      
      const filesWithDetails: GroupFile[] = (groupFilesData || []).map(gf => ({
        ...gf,
        file: filesMap.get(gf.file_id) || undefined,
      }));
      
      setFiles(filesWithDetails);

    } catch (error: any) {
      console.error('Error fetching group details:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (content: string) => {
    if (!groupId || !user || !content.trim()) return false;

    try {
      const { data, error } = await supabase
        .from('group_messages')
        .insert({
          group_id: groupId,
          user_id: user.id,
          content: content.trim(),
        })
        .select()
        .single();

      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive',
      });
      return false;
    }
  };

  const inviteByUsername = async (username: string) => {
    if (!groupId || !user) return false;

    try {
      // Find user by username
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .maybeSingle();

      if (profileError) throw profileError;
      
      if (!profileData) {
        toast({
          title: 'Error',
          description: 'User not found',
          variant: 'destructive',
        });
        return false;
      }

      // Add member
      const { error } = await supabase
        .from('group_members')
        .insert({
          group_id: groupId,
          user_id: profileData.id,
          role: 'member',
        });

      if (error) {
        if (error.code === '23505') {
          toast({
            title: 'Error',
            description: 'User is already a member',
            variant: 'destructive',
          });
        } else {
          throw error;
        }
        return false;
      }

      await fetchGroupDetails();
      toast({
        title: 'Success',
        description: 'Member invited successfully',
      });
      return true;
    } catch (error: any) {
      console.error('Error inviting member:', error);
      toast({
        title: 'Error',
        description: 'Failed to invite member',
        variant: 'destructive',
      });
      return false;
    }
  };

  const removeMember = async (memberId: string) => {
    try {
      const { error } = await supabase
        .from('group_members')
        .delete()
        .eq('id', memberId);

      if (error) throw error;

      setMembers(prev => prev.filter(m => m.id !== memberId));
      toast({
        title: 'Success',
        description: 'Member removed successfully',
      });
      return true;
    } catch (error: any) {
      console.error('Error removing member:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove member',
        variant: 'destructive',
      });
      return false;
    }
  };

  const shareFile = async (fileId: string) => {
    if (!groupId || !user) return false;

    try {
      const { error } = await supabase
        .from('group_files')
        .insert({
          group_id: groupId,
          file_id: fileId,
          shared_by: user.id,
        });

      if (error) {
        if (error.code === '23505') {
          toast({
            title: 'Error',
            description: 'File already shared',
            variant: 'destructive',
          });
        } else {
          throw error;
        }
        return false;
      }

      await fetchGroupDetails();
      toast({
        title: 'Success',
        description: 'File shared successfully',
      });
      return true;
    } catch (error: any) {
      console.error('Error sharing file:', error);
      toast({
        title: 'Error',
        description: 'Failed to share file',
        variant: 'destructive',
      });
      return false;
    }
  };

  const unshareFile = async (groupFileId: string) => {
    try {
      const { error } = await supabase
        .from('group_files')
        .delete()
        .eq('id', groupFileId);

      if (error) throw error;

      setFiles(prev => prev.filter(f => f.id !== groupFileId));
      toast({
        title: 'Success',
        description: 'File unshared successfully',
      });
      return true;
    } catch (error: any) {
      console.error('Error unsharing file:', error);
      toast({
        title: 'Error',
        description: 'Failed to unshare file',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Real-time subscription for messages
  useEffect(() => {
    if (!groupId) return;

    const channel = supabase
      .channel(`group-messages-${groupId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'group_messages',
          filter: `group_id=eq.${groupId}`,
        },
        async (payload) => {
          // Fetch the profile for the new message
          const { data: profileData } = await supabase
            .from('profiles')
            .select('full_name, username')
            .eq('id', payload.new.user_id)
            .single();

          const newMessage: GroupMessage = {
            id: payload.new.id,
            group_id: payload.new.group_id,
            user_id: payload.new.user_id,
            content: payload.new.content,
            created_at: payload.new.created_at,
            profile: profileData || undefined,
          };
          
          setMessages(prev => [...prev, newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [groupId]);

  useEffect(() => {
    fetchGroupDetails();
  }, [groupId, user]);

  return {
    group,
    members,
    messages,
    files,
    loading,
    sendMessage,
    inviteByUsername,
    removeMember,
    shareFile,
    unshareFile,
    refetch: fetchGroupDetails,
  };
};
