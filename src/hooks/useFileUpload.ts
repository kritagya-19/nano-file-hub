import { useState, useCallback, useRef } from 'react';
import * as tus from 'tus-js-client';
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

interface TusUploadInstance {
  upload: tus.Upload;
  file: File;
  storagePath: string;
}

export const useFileUpload = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const uploadInstancesRef = useRef<Map<string, TusUploadInstance>>(new Map());

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

      // Get session for auth token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No session');

      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

      return new Promise<string | null>((resolve) => {
        const upload = new tus.Upload(file, {
          endpoint: `https://${projectId}.supabase.co/storage/v1/upload/resumable`,
          retryDelays: [0, 3000, 5000, 10000, 20000],
          headers: {
            authorization: `Bearer ${session.access_token}`,
            apikey: anonKey,
          },
          uploadDataDuringCreation: true,
          removeFingerprintOnSuccess: true,
          chunkSize: 6 * 1024 * 1024, // 6MB chunks
          metadata: {
            bucketName: 'user-files',
            objectName: storagePath,
            contentType: file.type,
            cacheControl: '3600',
          },
          onError: async (error) => {
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

            uploadInstancesRef.current.delete(uploadId);
            resolve(null);
          },
          onProgress: (bytesUploaded, bytesTotal) => {
            const progress = Math.round((bytesUploaded / bytesTotal) * 100);
            
            setUploads(prev =>
              prev.map(u =>
                u.id === uploadId
                  ? { ...u, status: 'uploading' as const, progress, bytesUploaded }
                  : u
              )
            );
          },
          onSuccess: async () => {
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

            if (fileError) {
              console.error('File record error:', fileError);
            }

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

            uploadInstancesRef.current.delete(uploadId);
            resolve(uploadId);
          },
        });

        // Store the upload instance for pause/resume
        uploadInstancesRef.current.set(uploadId, { upload, file, storagePath });

        // Update status to uploading
        setUploads(prev =>
          prev.map(u =>
            u.id === uploadId ? { ...u, status: 'uploading' as const } : u
          )
        );

        // Check for previous uploads and resume if found
        upload.findPreviousUploads().then((previousUploads) => {
          if (previousUploads.length > 0) {
            upload.resumeFromPreviousUpload(previousUploads[0]);
          }
          upload.start();
        });
      });
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

  const pauseUpload = useCallback(async (uploadId: string) => {
    const instance = uploadInstancesRef.current.get(uploadId);
    if (instance) {
      instance.upload.abort();
      
      await supabase
        .from('uploads')
        .update({ status: 'paused' })
        .eq('id', uploadId);

      setUploads(prev =>
        prev.map(u =>
          u.id === uploadId ? { ...u, status: 'paused' as const } : u
        )
      );

      toast({
        title: 'Upload paused',
        description: 'You can resume this upload anytime.',
      });
    }
  }, [toast]);

  const resumeUpload = useCallback(async (uploadId: string) => {
    const instance = uploadInstancesRef.current.get(uploadId);
    if (instance) {
      await supabase
        .from('uploads')
        .update({ status: 'uploading' })
        .eq('id', uploadId);

      setUploads(prev =>
        prev.map(u =>
          u.id === uploadId ? { ...u, status: 'uploading' as const } : u
        )
      );

      instance.upload.start();

      toast({
        title: 'Upload resumed',
        description: 'Continuing upload...',
      });
    }
  }, [toast]);

  const uploadFiles = useCallback(async (files: FileList | File[], folderId?: string) => {
    const fileArray = Array.from(files);
    const results = await Promise.all(fileArray.map(file => uploadFile(file, folderId)));
    return results.filter(Boolean);
  }, [uploadFile]);

  const removeUpload = useCallback((uploadId: string) => {
    // Abort if still uploading
    const instance = uploadInstancesRef.current.get(uploadId);
    if (instance) {
      instance.upload.abort();
      uploadInstancesRef.current.delete(uploadId);
    }
    setUploads(prev => prev.filter(u => u.id !== uploadId));
  }, []);

  const clearCompleted = useCallback(() => {
    setUploads(prev => prev.filter(u => u.status !== 'completed'));
  }, []);

  return {
    uploads,
    uploadFile,
    uploadFiles,
    pauseUpload,
    resumeUpload,
    removeUpload,
    clearCompleted,
    formatFileSize,
  };
};
