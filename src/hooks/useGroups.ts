import { useState, useEffect, useCallback } from 'react';
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

// Hook for managing list of groups
export const useGroups = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGroups = useCallback(async () => {
    if (!user) {
      setGroups([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
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
  }, [user, toast]);

  const createGroup = async (name: string, description?: string): Promise<Group | null> => {
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session || !user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to create a group',
        variant: 'destructive',
      });
      return null;
    }

    console.log('Creating group with user ID:', user.id);
    console.log('Session user ID:', session.user.id);

    try {
      const { data, error } = await supabase
        .from('groups')
        .insert({
          name: name.trim(),
          description: description?.trim() || null,
          owner_id: session.user.id, // Use session user ID to ensure fresh auth
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      // Refresh groups list
      await fetchGroups();
      
      toast({
        title: 'Success',
        description: 'Group created successfully',
      });
      return data;
    } catch (error: any) {
      console.error('Error creating group:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create group',
        variant: 'destructive',
      });
      return null;
    }
  };

  const joinGroup = async (inviteCode: string): Promise<boolean> => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to join a group',
        variant: 'destructive',
      });
      return false;
    }

    try {
      const { error } = await supabase.rpc('join_group_by_code', {
        code: inviteCode.trim(),
      });

      if (error) {
        let errorMessage = 'Failed to join group';
        if (error.message.includes('Already a member')) {
          errorMessage = 'You are already a member of this group';
        } else if (error.message.includes('Invalid invite code')) {
          errorMessage = 'Invalid invite code';
        }
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

  const deleteGroup = async (groupId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('groups')
        .delete()
        .eq('id', groupId);

      if (error) throw error;

      setGroups((prev) => prev.filter((g) => g.id !== groupId));
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

  const leaveGroup = async (groupId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('group_members')
        .delete()
        .eq('group_id', groupId)
        .eq('user_id', user.id);

      if (error) throw error;

      setGroups((prev) => prev.filter((g) => g.id !== groupId));
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
  }, [fetchGroups]);

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

// Hook for managing a single group's details
export const useGroupDetails = (groupId: string | null) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [group, setGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [files, setFiles] = useState<GroupFile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGroupDetails = useCallback(async () => {
    if (!groupId || !user) {
      setGroup(null);
      setMembers([]);
      setMessages([]);
      setFiles([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Fetch group info
      const { data: groupData, error: groupError } = await supabase
        .from('groups')
        .select('*')
        .eq('id', groupId)
        .maybeSingle();

      if (groupError) throw groupError;
      if (!groupData) {
        toast({
          title: 'Error',
          description: 'Group not found',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }
      setGroup(groupData);

      // Fetch members
      const { data: membersData, error: membersError } = await supabase
        .from('group_members')
        .select('*')
        .eq('group_id', groupId)
        .order('joined_at', { ascending: true });

      if (membersError) throw membersError;

      // Get profiles for members
      if (membersData && membersData.length > 0) {
        const memberUserIds = membersData.map((m) => m.user_id);
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, full_name, username')
          .in('id', memberUserIds);

        const profilesMap = new Map(profilesData?.map((p) => [p.id, p]) || []);

        const enrichedMembers: GroupMember[] = membersData.map((m) => ({
          ...m,
          role: m.role as 'owner' | 'admin' | 'member',
          profile: profilesMap.get(m.user_id),
        }));
        setMembers(enrichedMembers);
      } else {
        setMembers([]);
      }

      // Fetch messages
      const { data: messagesData, error: messagesError } = await supabase
        .from('group_messages')
        .select('*')
        .eq('group_id', groupId)
        .order('created_at', { ascending: true });

      if (messagesError) throw messagesError;

      if (messagesData && messagesData.length > 0) {
        const messageUserIds = [...new Set(messagesData.map((m) => m.user_id))];
        const { data: messageProfilesData } = await supabase
          .from('profiles')
          .select('id, full_name, username')
          .in('id', messageUserIds);

        const messageProfilesMap = new Map(
          messageProfilesData?.map((p) => [p.id, p]) || []
        );

        const enrichedMessages: GroupMessage[] = messagesData.map((m) => ({
          ...m,
          profile: messageProfilesMap.get(m.user_id),
        }));
        setMessages(enrichedMessages);
      } else {
        setMessages([]);
      }

      // Fetch shared files
      const { data: groupFilesData, error: filesError } = await supabase
        .from('group_files')
        .select('*')
        .eq('group_id', groupId)
        .order('shared_at', { ascending: false });

      if (filesError) throw filesError;

      if (groupFilesData && groupFilesData.length > 0) {
        const fileIds = groupFilesData.map((gf) => gf.file_id);
        const { data: filesData } = await supabase
          .from('files')
          .select('id, name, original_name, size, mime_type, storage_path')
          .in('id', fileIds);

        const filesMap = new Map(filesData?.map((f) => [f.id, f]) || []);

        const enrichedFiles: GroupFile[] = groupFilesData.map((gf) => ({
          ...gf,
          file: filesMap.get(gf.file_id),
        }));
        setFiles(enrichedFiles);
      } else {
        setFiles([]);
      }
    } catch (error: any) {
      console.error('Error fetching group details:', error);
      toast({
        title: 'Error',
        description: 'Failed to load group details',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [groupId, user, toast]);

  // Send a message
  const sendMessage = async (content: string): Promise<boolean> => {
    if (!groupId || !user || !content.trim()) return false;

    try {
      const { error } = await supabase.from('group_messages').insert({
        group_id: groupId,
        user_id: user.id,
        content: content.trim(),
      });

      if (error) throw error;
      
      // Manually add message to state for instant feedback
      const newMessage: GroupMessage = {
        id: crypto.randomUUID(),
        group_id: groupId,
        user_id: user.id,
        content: content.trim(),
        created_at: new Date().toISOString(),
        profile: {
          full_name: null,
          username: null,
        },
      };
      setMessages((prev) => [...prev, newMessage]);
      
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

  // Invite a user by username
  const inviteByUsername = async (username: string): Promise<boolean> => {
    if (!groupId || !user) return false;

    try {
      // Find user by username
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username.trim())
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
      const { error } = await supabase.from('group_members').insert({
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

  // Remove a member
  const removeMember = async (memberId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('group_members')
        .delete()
        .eq('id', memberId);

      if (error) throw error;

      setMembers((prev) => prev.filter((m) => m.id !== memberId));
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

  // Share a file to the group
  const shareFile = async (fileId: string): Promise<boolean> => {
    if (!groupId || !user) return false;

    try {
      const { error } = await supabase.from('group_files').insert({
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

  // Unshare a file from the group
  const unshareFile = async (groupFileId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('group_files')
        .delete()
        .eq('id', groupFileId);

      if (error) throw error;

      setFiles((prev) => prev.filter((f) => f.id !== groupFileId));
      toast({
        title: 'Success',
        description: 'File removed from group',
      });
      return true;
    } catch (error: any) {
      console.error('Error unsharing file:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove file',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Fetch details when groupId changes
  useEffect(() => {
    fetchGroupDetails();
  }, [fetchGroupDetails]);

  // Set up realtime subscription for messages
  useEffect(() => {
    if (!groupId || !user) return;

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
          const newMessage = payload.new as GroupMessage;
          
          // Skip if it's our own message (already added optimistically)
          if (newMessage.user_id === user.id) return;

          // Fetch profile for the message author
          const { data: profileData } = await supabase
            .from('profiles')
            .select('id, full_name, username')
            .eq('id', newMessage.user_id)
            .maybeSingle();

          const enrichedMessage: GroupMessage = {
            ...newMessage,
            profile: profileData || undefined,
          };

          setMessages((prev) => {
            // Avoid duplicates
            if (prev.some((m) => m.id === newMessage.id)) return prev;
            return [...prev, enrichedMessage];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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
