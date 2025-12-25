import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface FileItem {
  id: string;
  name: string;
  original_name: string;
  size: number;
  mime_type: string | null;
  storage_path: string;
  folder_id: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface FolderItem {
  id: string;
  name: string;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
}

export const useFiles = (folderId?: string | null) => {
  const { user } = useAuth();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFiles = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch files
      let filesQuery = supabase
        .from('files')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (folderId) {
        filesQuery = filesQuery.eq('folder_id', folderId);
      } else {
        filesQuery = filesQuery.is('folder_id', null);
      }

      const { data: filesData, error: filesError } = await filesQuery;
      if (filesError) throw filesError;

      // Fetch folders
      let foldersQuery = supabase
        .from('folders')
        .select('*')
        .eq('user_id', user.id)
        .order('name', { ascending: true });

      if (folderId) {
        foldersQuery = foldersQuery.eq('parent_id', folderId);
      } else {
        foldersQuery = foldersQuery.is('parent_id', null);
      }

      const { data: foldersData, error: foldersError } = await foldersQuery;
      if (foldersError) throw foldersError;

      setFiles(filesData || []);
      setFolders(foldersData || []);
    } catch (err: any) {
      console.error('Error fetching files:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user, folderId]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const deleteFile = useCallback(async (fileId: string, storagePath: string) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('user-files')
        .remove([storagePath]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('files')
        .delete()
        .eq('id', fileId);

      if (dbError) throw dbError;

      setFiles(prev => prev.filter(f => f.id !== fileId));
      return true;
    } catch (err: any) {
      console.error('Error deleting file:', err);
      throw err;
    }
  }, []);

  const createFolder = useCallback(async (name: string, parentId?: string | null) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('folders')
        .insert({
          user_id: user.id,
          name,
          parent_id: parentId || null,
        })
        .select()
        .single();

      if (error) throw error;

      setFolders(prev => [...prev, data]);
      return data;
    } catch (err: any) {
      console.error('Error creating folder:', err);
      throw err;
    }
  }, [user]);

  const deleteFolder = useCallback(async (folderId: string) => {
    try {
      const { error } = await supabase
        .from('folders')
        .delete()
        .eq('id', folderId);

      if (error) throw error;

      setFolders(prev => prev.filter(f => f.id !== folderId));
      return true;
    } catch (err: any) {
      console.error('Error deleting folder:', err);
      throw err;
    }
  }, []);

  const getFileUrl = useCallback(async (storagePath: string) => {
    const { data } = await supabase.storage
      .from('user-files')
      .createSignedUrl(storagePath, 3600); // 1 hour expiry

    return data?.signedUrl || null;
  }, []);

  const getStorageUsage = useCallback(async () => {
    if (!user) return { used: 0, total: 5 * 1024 * 1024 * 1024 }; // 5GB default

    try {
      const { data, error } = await supabase
        .from('files')
        .select('size')
        .eq('user_id', user.id);

      if (error) throw error;

      const used = data?.reduce((acc, file) => acc + (file.size || 0), 0) || 0;
      return { used, total: 5 * 1024 * 1024 * 1024 };
    } catch (err) {
      console.error('Error getting storage usage:', err);
      return { used: 0, total: 5 * 1024 * 1024 * 1024 };
    }
  }, [user]);

  return {
    files,
    folders,
    loading,
    error,
    refetch: fetchFiles,
    deleteFile,
    createFolder,
    deleteFolder,
    getFileUrl,
    getStorageUsage,
  };
};
