import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export function useAdmin() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    const checkAdmin = async () => {
      const { data, error } = await supabase.rpc('has_role', {
        _user_id: user.id,
        _role: 'admin',
      });
      setIsAdmin(!!data && !error);
      setLoading(false);
    };

    checkAdmin();
  }, [user]);

  return { isAdmin, loading };
}

export function useAdminStats() {
  const [stats, setStats] = useState<{
    total_users: number;
    total_files: number;
    total_groups: number;
    total_storage_bytes: number;
    users_today: number;
    files_today: number;
    groups_today: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc('get_admin_stats');
    if (!error && data) {
      setStats(data as any);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, loading, refetch: fetchStats };
}

export function useAdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error) setUsers(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, loading, refetch: fetchUsers };
}

export function useAdminFiles() {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFiles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('files')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error) setFiles(data || []);
    setLoading(false);
  };

  const deleteFile = async (fileId: string) => {
    await supabase.from('files').delete().eq('id', fileId);
    await fetchFiles();
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return { files, loading, refetch: fetchFiles, deleteFile };
}

export function useAdminGroups() {
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGroups = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('groups')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error) setGroups(data || []);
    setLoading(false);
  };

  const deleteGroup = async (groupId: string) => {
    await supabase.from('groups').delete().eq('id', groupId);
    await fetchGroups();
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return { groups, loading, refetch: fetchGroups, deleteGroup };
}
