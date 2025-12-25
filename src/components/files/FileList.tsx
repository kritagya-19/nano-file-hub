import { useState } from 'react';
import { 
  FileText, 
  Image, 
  Video, 
  Music, 
  Archive, 
  File,
  Folder,
  MoreVertical,
  Download,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FileItem, FolderItem } from '@/hooks/useFiles';
import { cn } from '@/lib/utils';

interface FileListProps {
  files: FileItem[];
  folders: FolderItem[];
  loading: boolean;
  onFolderClick: (folderId: string) => void;
  onDeleteFile: (file: FileItem) => void;
  onDeleteFolder: (folder: FolderItem) => void;
  onDownloadFile: (file: FileItem) => void;
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

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const FileList = ({
  files,
  folders,
  loading,
  onFolderClick,
  onDeleteFile,
  onDeleteFolder,
  onDownloadFile,
}: FileListProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass-card rounded-2xl p-4 animate-pulse">
            <div className="w-12 h-12 bg-muted rounded-xl mb-3" />
            <div className="h-4 bg-muted rounded w-3/4 mb-2" />
            <div className="h-3 bg-muted rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (folders.length === 0 && files.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
          <Folder className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">No files yet</h3>
        <p className="text-muted-foreground">
          Upload files or create folders to get started
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {/* Folders */}
      {folders.map((folder) => (
        <div
          key={folder.id}
          className="glass-card rounded-2xl p-4 hover-lift cursor-pointer group transition-all"
          onClick={() => onFolderClick(folder.id)}
        >
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
              <Folder className="w-6 h-6 text-primary" />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteFolder(folder);
                  }}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <h3 className="font-medium text-foreground truncate">{folder.name}</h3>
          <p className="text-xs text-muted-foreground mt-1">
            {formatDate(folder.created_at)}
          </p>
        </div>
      ))}

      {/* Files */}
      {files.map((file) => {
        const FileIcon = getFileIcon(file.mime_type);
        const isDeleting = deletingId === file.id;

        return (
          <div
            key={file.id}
            className={cn(
              'glass-card rounded-2xl p-4 hover-lift group transition-all',
              isDeleting && 'opacity-50 pointer-events-none'
            )}
          >
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-3">
                <FileIcon className="w-6 h-6 text-muted-foreground" />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onDownloadFile(file)}>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={async () => {
                      setDeletingId(file.id);
                      await onDeleteFile(file);
                      setDeletingId(null);
                    }}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <h3 className="font-medium text-foreground truncate" title={file.original_name}>
              {file.original_name}
            </h3>
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-muted-foreground">
                {formatFileSize(file.size)}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDate(file.created_at)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FileList;
