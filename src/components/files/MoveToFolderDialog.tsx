import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Folder, Home, Loader2, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FolderItem } from '@/hooks/useFiles';

interface MoveToFolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fileName: string;
  currentFolderId: string | null;
  getAllFolders: () => Promise<FolderItem[]>;
  onMove: (targetFolderId: string | null) => Promise<void>;
}

const MoveToFolderDialog = ({
  open,
  onOpenChange,
  fileName,
  currentFolderId,
  getAllFolders,
  onMove,
}: MoveToFolderDialogProps) => {
  const [allFolders, setAllFolders] = useState<FolderItem[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [moving, setMoving] = useState(false);

  useEffect(() => {
    if (open) {
      setLoading(true);
      setSelectedFolderId(null);
      getAllFolders().then((folders) => {
        setAllFolders(folders);
        setLoading(false);
      });
    }
  }, [open, getAllFolders]);

  const handleMove = async () => {
    setMoving(true);
    try {
      await onMove(selectedFolderId);
      onOpenChange(false);
    } catch {
      // Error handled by parent
    } finally {
      setMoving(false);
    }
  };

  // Build a simple flat list with root + all folders, excluding current folder
  const destinations = [
    { id: null, name: 'My Files (Root)', isRoot: true },
    ...allFolders.filter((f) => f.id !== currentFolderId),
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Move "{fileName}"</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 pt-2">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : (
            <div className="max-h-64 overflow-y-auto space-y-1">
              {destinations.map((dest) => (
                <button
                  key={dest.id || 'root'}
                  onClick={() => setSelectedFolderId(dest.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors',
                    selectedFolderId === dest.id
                      ? 'bg-primary/10 border border-primary/30'
                      : 'hover:bg-muted/50 border border-transparent'
                  )}
                >
                  <div
                    className={cn(
                      'w-9 h-9 rounded-lg flex items-center justify-center shrink-0',
                      selectedFolderId === dest.id ? 'bg-primary/20' : 'bg-muted/50'
                    )}
                  >
                    {dest.id === null ? (
                      <Home className="w-4 h-4 text-primary" />
                    ) : (
                      <Folder className="w-4 h-4 text-primary" />
                    )}
                  </div>
                  <span className="font-medium text-sm text-foreground truncate">
                    {dest.name}
                  </span>
                  {selectedFolderId === dest.id && (
                    <ChevronRight className="w-4 h-4 text-primary ml-auto shrink-0" />
                  )}
                </button>
              ))}
              {destinations.length <= 1 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No other folders available
                </p>
              )}
            </div>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleMove}
              disabled={moving || selectedFolderId === currentFolderId}
            >
              {moving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Move
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MoveToFolderDialog;
