import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface UploadProgress {
  id: string;
  fileName: string;
  fileSize: number;
  bytesUploaded: number;
  progress: number;
  status: 'pending' | 'uploading' | 'paused' | 'completed' | 'failed';
  error?: string;
}

export const useFileUpload = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploads, setUploads] = useState<UploadProgress[]>([]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const uploadFile = useCallback(async (file: File, folderId?: string) => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Not authenticated',
        description: 'Please sign in to upload files.',
      });
      return null;
    }

    const uploadId = crypto.randomUUID();
    const storagePath = `${user.id}/${uploadId}-${file.name}`;

    // Add upload to tracking
    const newUpload: UploadProgress = {
      id: uploadId,
      fileName: file.name,
      fileSize: file.size,
      bytesUploaded: 0,
      progress: 0,
      status: 'pending',
    };

    setUploads(prev => [...prev, newUpload]);

    try {
      // Create upload record in database
      const { error: dbError } = await supabase.from('uploads').insert({
        id: uploadId,
        user_id: user.id,
        file_name: file.name,
        file_size: file.size,
        mime_type: file.type,
        folder_id: folderId || null,
        status: 'uploading',
        storage_path: storagePath,
      });

      if (dbError) throw dbError;

      // Update status to uploading
      setUploads(prev =>
        prev.map(u =>
          u.id === uploadId ? { ...u, status: 'uploading' as const } : u
        )
      );

      // Upload file to storage with progress simulation
      // Note: Supabase JS client doesn't support native progress tracking,
      // so we simulate progress based on file size
      const uploadPromise = supabase.storage
        .from('user-files')
        .upload(storagePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setUploads(prev =>
          prev.map(u => {
            if (u.id === uploadId && u.status === 'uploading') {
              const newProgress = Math.min(u.progress + Math.random() * 15, 95);
              return {
                ...u,
                progress: newProgress,
                bytesUploaded: Math.floor((newProgress / 100) * u.fileSize),
              };
            }
            return u;
          })
        );
      }, 200);

      const { error: uploadError } = await uploadPromise;
      clearInterval(progressInterval);

      if (uploadError) throw uploadError;

      // Create file record in database
      const { error: fileError } = await supabase.from('files').insert({
        user_id: user.id,
        folder_id: folderId || null,
        name: file.name,
        original_name: file.name,
        size: file.size,
        mime_type: file.type,
        storage_path: storagePath,
      });

      if (fileError) throw fileError;

      // Update upload status to completed
      await supabase
        .from('uploads')
        .update({ status: 'completed', bytes_uploaded: file.size })
        .eq('id', uploadId);

      setUploads(prev =>
        prev.map(u =>
          u.id === uploadId
            ? { ...u, status: 'completed' as const, progress: 100, bytesUploaded: file.size }
            : u
        )
      );

      toast({
        title: 'Upload complete',
        description: `${file.name} uploaded successfully.`,
      });

      return uploadId;
    } catch (error: any) {
      console.error('Upload error:', error);

      await supabase
        .from('uploads')
        .update({ status: 'failed' })
        .eq('id', uploadId);

      setUploads(prev =>
        prev.map(u =>
          u.id === uploadId
            ? { ...u, status: 'failed' as const, error: error.message }
            : u
        )
      );

      toast({
        variant: 'destructive',
        title: 'Upload failed',
        description: error.message,
      });

      return null;
    }
  }, [user, toast]);

  const uploadFiles = useCallback(async (files: FileList | File[], folderId?: string) => {
    const fileArray = Array.from(files);
    const results = await Promise.all(fileArray.map(file => uploadFile(file, folderId)));
    return results.filter(Boolean);
  }, [uploadFile]);

  const removeUpload = useCallback((uploadId: string) => {
    setUploads(prev => prev.filter(u => u.id !== uploadId));
  }, []);

  const clearCompleted = useCallback(() => {
    setUploads(prev => prev.filter(u => u.status !== 'completed'));
  }, []);

  return {
    uploads,
    uploadFile,
    uploadFiles,
    removeUpload,
    clearCompleted,
    formatFileSize,
  };
};
