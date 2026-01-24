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
  uploadUrl?: string; // Store the URL for resuming
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

            // Update bytes_uploaded in database periodically (every 10%)
            const currentProgress = Math.floor(progress / 10) * 10;
            const instance = uploadInstancesRef.current.get(uploadId);
            if (instance) {
              const lastProgress = Math.floor((instance.upload as any)._lastReportedProgress || 0);
              if (currentProgress > lastProgress) {
                (instance.upload as any)._lastReportedProgress = currentProgress;
                supabase
                  .from('uploads')
                  .update({ bytes_uploaded: bytesUploaded })
                  .eq('id', uploadId);
              }
            }
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
          onAfterResponse: (req, res) => {
            // Capture the upload URL after the first response for resuming
            const uploadUrl = res.getHeader('Location');
            if (uploadUrl) {
              const instance = uploadInstancesRef.current.get(uploadId);
              if (instance) {
                instance.uploadUrl = uploadUrl;
              }
            }
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
    if (instance && instance.uploadUrl) {
      // Get fresh session token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          variant: 'destructive',
          title: 'Session expired',
          description: 'Please sign in again to continue.',
        });
        return;
      }

      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

      // Create a new upload instance with the stored URL to resume from
      const resumedUpload = new tus.Upload(instance.file, {
        endpoint: `https://${projectId}.supabase.co/storage/v1/upload/resumable`,
        uploadUrl: instance.uploadUrl, // Use the stored URL to resume
        retryDelays: [0, 3000, 5000, 10000, 20000],
        headers: {
          authorization: `Bearer ${session.access_token}`,
          apikey: anonKey,
        },
        uploadDataDuringCreation: true,
        removeFingerprintOnSuccess: true,
        chunkSize: 6 * 1024 * 1024,
        metadata: {
          bucketName: 'user-files',
          objectName: instance.storagePath,
          contentType: instance.file.type,
          cacheControl: '3600',
        },
        onError: async (error) => {
          console.error('Resume upload error:', error);

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
          const { error: fileError } = await supabase.from('files').insert({
            user_id: session.user.id,
            folder_id: null,
            name: instance.file.name,
            original_name: instance.file.name,
            size: instance.file.size,
            mime_type: instance.file.type,
            storage_path: instance.storagePath,
          });

          if (fileError) {
            console.error('File record error:', fileError);
          }

          await supabase
            .from('uploads')
            .update({ status: 'completed', bytes_uploaded: instance.file.size })
            .eq('id', uploadId);

          setUploads(prev =>
            prev.map(u =>
              u.id === uploadId
                ? { ...u, status: 'completed' as const, progress: 100, bytesUploaded: instance.file.size }
                : u
            )
          );

          toast({
            title: 'Upload complete',
            description: `${instance.file.name} uploaded successfully.`,
          });

          uploadInstancesRef.current.delete(uploadId);
        },
        onAfterResponse: (req, res) => {
          const uploadUrl = res.getHeader('Location');
          if (uploadUrl) {
            instance.uploadUrl = uploadUrl;
          }
        },
      });

      // Update the stored instance with the new upload
      instance.upload = resumedUpload;
      uploadInstancesRef.current.set(uploadId, instance);

      await supabase
        .from('uploads')
        .update({ status: 'uploading' })
        .eq('id', uploadId);

      setUploads(prev =>
        prev.map(u =>
          u.id === uploadId ? { ...u, status: 'uploading' as const } : u
        )
      );

      resumedUpload.start();

      toast({
        title: 'Upload resumed',
        description: 'Continuing from where you left off...',
      });
    } else if (instance && !instance.uploadUrl) {
      // No upload URL stored yet - restart the upload
      toast({
        title: 'Restarting upload',
        description: 'Upload will start from beginning.',
      });
      instance.upload.start();
      
      setUploads(prev =>
        prev.map(u =>
          u.id === uploadId ? { ...u, status: 'uploading' as const } : u
        )
      );
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
