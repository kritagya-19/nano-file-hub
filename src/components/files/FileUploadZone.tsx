import { useCallback, useRef, useState } from 'react';
import { Upload, X, CheckCircle, AlertCircle, Loader2, Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFileUpload, UploadProgress } from '@/hooks/useFileUpload';
import { cn } from '@/lib/utils';

interface FileUploadZoneProps {
  folderId?: string;
  onUploadComplete?: () => void;
}

const FileUploadZone = ({ folderId, onUploadComplete }: FileUploadZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploads, uploadFiles, pauseUpload, resumeUpload, removeUpload, clearCompleted, formatFileSize } = useFileUpload();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await uploadFiles(files, folderId);
      onUploadComplete?.();
    }
  }, [uploadFiles, folderId, onUploadComplete]);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await uploadFiles(files, folderId);
      onUploadComplete?.();
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [uploadFiles, folderId, onUploadComplete]);

  const getStatusIcon = (status: UploadProgress['status']) => {
    switch (status) {
      case 'uploading':
        return <Loader2 className="w-4 h-4 animate-spin text-primary" />;
      case 'paused':
        return <Pause className="w-4 h-4 text-amber-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      default:
        return <Loader2 className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const activeUploads = uploads.filter(u => u.status !== 'completed');
  const completedUploads = uploads.filter(u => u.status === 'completed');

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          'border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300',
          isDragging
            ? 'border-primary bg-primary/5 scale-[1.02]'
            : 'border-border hover:border-primary/50 hover:bg-muted/50'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        <div className={cn(
          'w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors',
          isDragging ? 'bg-primary/10' : 'bg-secondary'
        )}>
          <Upload className={cn(
            'w-8 h-8 transition-colors',
            isDragging ? 'text-primary' : 'text-muted-foreground'
          )} />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {isDragging ? 'Drop files here' : 'Upload Files'}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Drag and drop files here, or click to select
        </p>
        <Button variant="outline" size="sm" className="pointer-events-none">
          Choose Files
        </Button>
      </div>

      {/* Upload Progress */}
      {uploads.length > 0 && (
        <div className="glass-card rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-foreground">
              Uploads ({activeUploads.length} active)
            </h4>
            {completedUploads.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearCompleted}>
                Clear completed
              </Button>
            )}
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {uploads.map((upload) => (
              <div
                key={upload.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-muted/50"
              >
                {getStatusIcon(upload.status)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-foreground truncate">
                      {upload.fileName}
                    </p>
                    <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                      {formatFileSize(upload.bytesUploaded)} / {formatFileSize(upload.fileSize)}
                    </span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all duration-300',
                        upload.status === 'completed' ? 'bg-green-500' :
                        upload.status === 'failed' ? 'bg-destructive' :
                        upload.status === 'paused' ? 'bg-amber-500' :
                        'gradient-bg'
                      )}
                      style={{ width: `${upload.progress}%` }}
                    />
                  </div>
                  {upload.error && (
                    <p className="text-xs text-destructive mt-1">{upload.error}</p>
                  )}
                  {upload.status === 'paused' && (
                    <p className="text-xs text-amber-600 mt-1">Paused - click resume to continue</p>
                  )}
                </div>
                
                {/* Pause/Resume/Remove buttons */}
                <div className="flex items-center gap-1">
                  {upload.status === 'uploading' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        pauseUpload(upload.id);
                      }}
                      className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                      title="Pause upload"
                    >
                      <Pause className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                    </button>
                  )}
                  {upload.status === 'paused' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        resumeUpload(upload.id);
                      }}
                      className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                      title="Resume upload"
                    >
                      <Play className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeUpload(upload.id);
                    }}
                    className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                    title="Cancel upload"
                  >
                    <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploadZone;
