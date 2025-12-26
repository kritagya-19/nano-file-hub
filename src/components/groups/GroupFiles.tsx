import { useState } from 'react';
import { GroupFile } from '@/hooks/useGroups';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { File, FileText, Image, Video, Music, Archive, Download, Trash2, Share2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useFiles } from '@/hooks/useFiles';
import { format } from 'date-fns';

interface GroupFilesProps {
  groupFiles: GroupFile[];
  onShareFile: (fileId: string) => Promise<boolean>;
  onUnshareFile: (groupFileId: string) => Promise<boolean>;
}

export const GroupFiles = ({ groupFiles, onShareFile, onUnshareFile }: GroupFilesProps) => {
  const { user } = useAuth();
  const { files: userFiles } = useFiles();
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType: string | null) => {
    if (!mimeType) return <File className="h-8 w-8" />;
    
    if (mimeType.startsWith('image/')) return <Image className="h-8 w-8 text-green-500" />;
    if (mimeType.startsWith('video/')) return <Video className="h-8 w-8 text-purple-500" />;
    if (mimeType.startsWith('audio/')) return <Music className="h-8 w-8 text-pink-500" />;
    if (mimeType.includes('pdf')) return <FileText className="h-8 w-8 text-red-500" />;
    if (mimeType.includes('zip') || mimeType.includes('rar')) return <Archive className="h-8 w-8 text-yellow-500" />;
    
    return <File className="h-8 w-8 text-blue-500" />;
  };

  const downloadFile = async (storagePath: string, fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('user-files')
        .createSignedUrl(storagePath, 3600);

      if (error) throw error;

      const link = document.createElement('a');
      link.href = data.signedUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleShareFile = async (fileId: string) => {
    await onShareFile(fileId);
    setShareDialogOpen(false);
  };

  // Filter out files that are already shared
  const sharedFileIds = groupFiles.map((gf) => gf.file_id);
  const availableFiles = userFiles.filter((f) => !sharedFileIds.includes(f.id));

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Shared Files ({groupFiles.length})</h3>
        <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share File
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Share a File</DialogTitle>
              <DialogDescription>Select a file from your files to share with the group.</DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[400px] mt-4">
              {availableFiles.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No files available to share. Upload files first.
                </p>
              ) : (
                <div className="space-y-2">
                  {availableFiles.map((file) => (
                    <Card
                      key={file.id}
                      className="cursor-pointer hover:bg-accent/50 transition-colors"
                      onClick={() => handleShareFile(file.id)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          {getFileIcon(file.mime_type)}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{file.original_name}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>

      {groupFiles.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <File className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No files shared yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {groupFiles.map((groupFile) => (
            <Card key={groupFile.id}>
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  {getFileIcon(groupFile.file?.mime_type || null)}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {groupFile.file?.original_name || 'Unknown file'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(groupFile.file?.size || 0)} • Shared {format(new Date(groupFile.shared_at), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {groupFile.file && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => downloadFile(groupFile.file!.storage_path, groupFile.file!.original_name)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                    {groupFile.shared_by === user?.id && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => onUnshareFile(groupFile.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
