import { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileItem } from '@/hooks/useFiles';
import {
  ChevronLeft,
  ChevronRight,
  Download,
  X,
  Loader2,
  FileText,
  Eye,
} from 'lucide-react';

interface FilePreviewModalProps {
  files: FileItem[];
  currentIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
  getFileUrl: (storagePath: string) => Promise<string | null>;
  onDownload: (file: FileItem) => void;
}

const isPreviewable = (mimeType: string | null): boolean => {
  if (!mimeType) return false;
  if (mimeType.startsWith('image/')) return true;
  if (mimeType === 'application/pdf') return true;
  if (mimeType.startsWith('text/')) return true;
  if (['application/json', 'application/xml', 'text/csv', 'text/markdown'].includes(mimeType)) return true;
  return false;
};

const isTextType = (mimeType: string | null): boolean => {
  if (!mimeType) return false;
  if (mimeType.startsWith('text/')) return true;
  if (['application/json', 'application/xml'].includes(mimeType)) return true;
  return false;
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const FilePreviewModal = ({
  files,
  currentIndex,
  onClose,
  onNavigate,
  getFileUrl,
  onDownload,
}: FilePreviewModalProps) => {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [textContent, setTextContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const file = currentIndex !== null ? files[currentIndex] : null;

  const fetchPreview = useCallback(async () => {
    if (!file) return;
    setLoading(true);
    setSignedUrl(null);
    setTextContent(null);

    try {
      const url = await getFileUrl(file.storage_path);
      if (!url) return;
      setSignedUrl(url);

      if (isTextType(file.mime_type)) {
        const res = await fetch(url);
        const text = await res.text();
        setTextContent(text);
      }
    } catch (err) {
      console.error('Failed to load preview:', err);
    } finally {
      setLoading(false);
    }
  }, [file, getFileUrl]);

  useEffect(() => {
    fetchPreview();
  }, [fetchPreview]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (currentIndex === null) return;
      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        onNavigate(currentIndex - 1);
      } else if (e.key === 'ArrowRight' && currentIndex < files.length - 1) {
        onNavigate(currentIndex + 1);
      }
    },
    [currentIndex, files.length, onNavigate]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!file || currentIndex === null) return null;

  const canPreview = isPreviewable(file.mime_type);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center h-full min-h-[300px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
          <p className="text-sm text-muted-foreground">Loading preview...</p>
        </div>
      );
    }

    if (!canPreview || !signedUrl) {
      return (
        <div className="flex flex-col items-center justify-center h-full min-h-[300px] gap-4">
          <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center">
            <FileText className="w-8 h-8 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="text-foreground font-medium">Preview not available</p>
            <p className="text-sm text-muted-foreground mt-1">
              This file type cannot be previewed in the browser
            </p>
          </div>
          <Button onClick={() => onDownload(file)} className="rounded-xl">
            <Download className="w-4 h-4 mr-2" />
            Download File
          </Button>
        </div>
      );
    }

    if (file.mime_type?.startsWith('image/')) {
      return (
        <div className="flex items-center justify-center h-full min-h-[300px] max-h-[70vh]">
          <img
            src={signedUrl}
            alt={file.original_name}
            className="max-w-full max-h-[70vh] object-contain rounded-lg"
          />
        </div>
      );
    }

    if (file.mime_type === 'application/pdf') {
      return (
        <iframe
          src={signedUrl}
          title={file.original_name}
          className="w-full h-[70vh] rounded-lg border border-border/50"
        />
      );
    }

    if (isTextType(file.mime_type) && textContent !== null) {
      return (
        <div className="max-h-[70vh] overflow-auto rounded-lg border border-border/50 bg-muted/30">
          <pre className="p-4 text-sm text-foreground whitespace-pre-wrap break-words font-mono">
            {textContent}
          </pre>
        </div>
      );
    }

    return null;
  };

  return (
    <Dialog open={currentIndex !== null} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-5xl max-h-[95vh] p-0 gap-0 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Eye className="w-4 h-4 text-primary" />
            </div>
            <div className="min-w-0">
              <h3 className="font-medium text-foreground text-sm truncate">
                {file.original_name}
              </h3>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(file.size)} · {currentIndex + 1} of {files.length}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onDownload(file)}
              title="Download"
            >
              <Download className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="relative p-4">
          {renderContent()}

          {/* Navigation */}
          {files.length > 1 && (
            <>
              {currentIndex > 0 && (
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full h-10 w-10 shadow-lg"
                  onClick={() => onNavigate(currentIndex - 1)}
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
              )}
              {currentIndex < files.length - 1 && (
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full h-10 w-10 shadow-lg"
                  onClick={() => onNavigate(currentIndex + 1)}
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FilePreviewModal;
