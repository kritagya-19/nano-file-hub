import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileText, Image, Video, Music, Archive, File, AlertCircle } from 'lucide-react';

interface SharedFile {
  id: string;
  original_name: string;
  size: number;
  mime_type: string | null;
  storage_path: string;
  created_at: string;
}

const getFileIcon = (mimeType: string | null) => {
  if (!mimeType) return File;
  if (mimeType.startsWith('image/')) return Image;
  if (mimeType.startsWith('video/')) return Video;
  if (mimeType.startsWith('audio/')) return Music;
  if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('tar')) return Archive;
  if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('text')) return FileText;
  return File;
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const Share = () => {
  const { shareToken } = useParams<{ shareToken: string }>();
  const [file, setFile] = useState<SharedFile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchSharedFile = async () => {
      if (!shareToken) {
        setError('Invalid share link');
        setLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await supabase
          .from('files')
          .select('id, original_name, size, mime_type, storage_path, created_at')
          .eq('share_token', shareToken)
          .eq('is_public', true)
          .maybeSingle();

        if (fetchError) throw fetchError;

        if (!data) {
          setError('File not found or link has expired');
        } else {
          setFile(data);
        }
      } catch (err: any) {
        console.error('Error fetching shared file:', err);
        setError('Failed to load shared file');
      } finally {
        setLoading(false);
      }
    };

    fetchSharedFile();
  }, [shareToken]);

  const handleDownload = async () => {
    if (!file) return;

    setDownloading(true);
    try {
      // Use signed URL for public downloads - works without authentication
      const { data: signedData, error: signedError } = await supabase.storage
        .from('user-files')
        .createSignedUrl(file.storage_path, 3600); // 1 hour expiry

      if (signedError || !signedData?.signedUrl) {
        throw signedError || new Error('Failed to generate download URL');
      }

      // Fetch the file using the signed URL
      const response = await fetch(signedData.signedUrl);
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.original_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error('Error downloading file:', err);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-16 h-16 bg-muted rounded-2xl mx-auto mb-4" />
          <div className="h-4 bg-muted rounded w-48" />
        </div>
      </div>
    );
  }

  if (error || !file) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">File Not Available</h2>
            <p className="text-muted-foreground">{error || 'This file is no longer available'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const FileIcon = getFileIcon(file.mime_type);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <FileIcon className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="break-all">{file.original_name}</CardTitle>
          <CardDescription>
            {formatFileSize(file.size)} • Shared file
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={handleDownload} 
            disabled={downloading}
            className="w-full"
            size="lg"
          >
            <Download className="w-4 h-4 mr-2" />
            {downloading ? 'Downloading...' : 'Download File'}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Files are shared securely. Only people with this link can access the file.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Share;
