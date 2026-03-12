import { format } from "date-fns";
import { Check, CheckCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export interface ReadReceipt {
  userId: string;
  userName: string;
  avatarUrl?: string | null;
  readAt: string | null; // null = not read
}

interface ReadReceiptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  receipts: ReadReceipt[];
}

const getInitials = (name: string) => {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
};

export const ReadReceiptDialog = ({ open, onOpenChange, receipts }: ReadReceiptDialogProps) => {
  const readReceipts = receipts.filter(r => r.readAt);
  const unreadReceipts = receipts.filter(r => !r.readAt);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-base">Message Info</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
          {/* Read by */}
          {readReceipts.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-1.5 mb-2 px-1">
                <CheckCheck className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Read by
                </span>
              </div>
              <div className="space-y-2">
                {readReceipts.map((r) => (
                  <div key={r.userId} className="flex items-center gap-3 px-1">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground overflow-hidden shrink-0">
                      {r.avatarUrl ? (
                        <img src={r.avatarUrl} alt={r.userName} className="w-full h-full object-cover" />
                      ) : (
                        getInitials(r.userName)
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{r.userName}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {format(new Date(r.readAt!), "MMM d, h:mm a")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Not read */}
          {unreadReceipts.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-2 px-1">
                <Check className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Not seen
                </span>
              </div>
              <div className="space-y-2">
                {unreadReceipts.map((r) => (
                  <div key={r.userId} className="flex items-center gap-3 px-1">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground overflow-hidden shrink-0">
                      {r.avatarUrl ? (
                        <img src={r.avatarUrl} alt={r.userName} className="w-full h-full object-cover" />
                      ) : (
                        getInitials(r.userName)
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{r.userName}</p>
                      <p className="text-[11px] text-muted-foreground">Not seen yet</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
