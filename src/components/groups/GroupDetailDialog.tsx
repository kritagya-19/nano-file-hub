import { useState } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  Users,
  FileText,
  Crown,
  Shield,
  UserPlus,
  UserMinus,
  Share2,
  Download,
  Trash2,
  File,
  Image,
  Video,
  Music,
  Archive,
  Copy,
  Loader2,
  Hash,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface UserFile {
  id: string;
  name: string;
  original_name: string;
  size: number;
  mime_type: string | null;
  storage_path: string;
}

interface GroupDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  group: {
    id: string;
    name: string;
    description?: string | null;
    invite_code: string;
  };
  members: any[];
  groupFiles: any[];
  currentUserId: string;
  isAdmin: boolean;
  onInviteByUsername: (username: string) => Promise<boolean>;
  onRemoveMember: (memberId: string) => Promise<boolean>;
  onShareFile: (fileId: string) => Promise<boolean>;
  onUnshareFile: (groupFileId: string) => Promise<boolean>;
}

export const GroupDetailDialog = ({
  open,
  onOpenChange,
  group,
  members,
  groupFiles,
  currentUserId,
  isAdmin,
  onInviteByUsername,
  onRemoveMember,
  onShareFile,
  onUnshareFile,
}: GroupDetailDialogProps) => {
  const [activeTab, setActiveTab] = useState("members");
  const [inviteUsername, setInviteUsername] = useState("");
  const [isInviting, setIsInviting] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [userFiles, setUserFiles] = useState<UserFile[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const { toast } = useToast();

  const loadUserFiles = async () => {
    setLoadingFiles(true);
    try {
      const { data, error } = await supabase
        .from("files")
        .select("id, name, original_name, size, mime_type, storage_path")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setUserFiles(data || []);
    } catch (error) {
      console.error("Error loading files:", error);
    } finally {
      setLoadingFiles(false);
    }
  };

  const handleInvite = async () => {
    if (!inviteUsername.trim()) return;
    setIsInviting(true);
    const success = await onInviteByUsername(inviteUsername.trim());
    setIsInviting(false);
    if (success) {
      setInviteUsername("");
    }
  };

  const handleCopyInviteCode = () => {
    navigator.clipboard.writeText(group.invite_code);
    toast({ title: "Copied!", description: "Invite code copied to clipboard" });
  };

  const getFileIcon = (mimeType: string | null) => {
    if (!mimeType) return File;
    if (mimeType.startsWith("image/")) return Image;
    if (mimeType.startsWith("video/")) return Video;
    if (mimeType.startsWith("audio/")) return Music;
    if (mimeType.includes("zip") || mimeType.includes("rar")) return Archive;
    return FileText;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const downloadFile = async (storagePath: string, fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from("user-files")
        .createSignedUrl(storagePath, 3600);
      if (error) throw error;
      if (data?.signedUrl) {
        const link = document.createElement("a");
        link.href = data.signedUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("Download error:", error);
      toast({ variant: "destructive", title: "Download failed", description: "Could not download the file" });
    }
  };

  const sharedFileIds = groupFiles.map((gf) => gf.file_id);
  const availableFiles = userFiles.filter((f) => !sharedFileIds.includes(f.id));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] flex flex-col p-0 gap-0">
        {/* Header */}
        <DialogHeader className="p-4 sm:p-6 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Hash className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-lg font-semibold truncate">{group.name}</DialogTitle>
              {group.description && (
                <p className="text-sm text-muted-foreground truncate">{group.description}</p>
              )}
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleCopyInviteCode} className="mt-3 w-full">
            <Copy className="w-4 h-4 mr-2" />
            Copy Invite Code
          </Button>
        </DialogHeader>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <div className="px-4 sm:px-6 pt-4">
            <TabsList className="w-full grid grid-cols-2 h-10">
              <TabsTrigger value="members" className="text-sm">
                <Users className="w-4 h-4 mr-2" />
                Members ({members.length})
              </TabsTrigger>
              <TabsTrigger value="files" className="text-sm">
                <FileText className="w-4 h-4 mr-2" />
                Files ({groupFiles.length})
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Members Tab */}
          <TabsContent value="members" className="flex-1 m-0 mt-3 overflow-hidden">
            <ScrollArea className="h-full max-h-[350px] px-4 sm:px-6 pb-4">
              <div className="space-y-2">
                {isAdmin && (
                  <div className="flex gap-2 mb-3">
                    <Input
                      placeholder="Username to invite"
                      value={inviteUsername}
                      onChange={(e) => setInviteUsername(e.target.value)}
                      className="h-9 text-sm"
                    />
                    <Button size="sm" onClick={handleInvite} disabled={isInviting || !inviteUsername.trim()}>
                      {isInviting ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                    </Button>
                  </div>
                )}

                {members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-medium shrink-0">
                        {(member.profile?.full_name?.[0] || member.profile?.username?.[0] || "U").toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">
                          {member.profile?.full_name || member.profile?.username || "User"}
                        </p>
                        {member.profile?.username && (
                          <p className="text-xs text-muted-foreground">@{member.profile.username}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {member.role === "owner" && (
                        <Badge variant="secondary" className="text-xs">
                          <Crown className="w-3 h-3 mr-1" />
                          Owner
                        </Badge>
                      )}
                      {member.role === "admin" && (
                        <Badge variant="outline" className="text-xs">
                          <Shield className="w-3 h-3 mr-1" />
                          Admin
                        </Badge>
                      )}
                      {isAdmin && member.role !== "owner" && member.user_id !== currentUserId && (
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => onRemoveMember(member.id)}>
                          <UserMinus className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Files Tab */}
          <TabsContent value="files" className="flex-1 m-0 mt-3 overflow-hidden">
            <ScrollArea className="h-full max-h-[350px] px-4 sm:px-6 pb-4">
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mb-3"
                  onClick={() => {
                    setIsShareOpen(!isShareOpen);
                    if (!isShareOpen) loadUserFiles();
                  }}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share a File
                </Button>

                {isShareOpen && (
                  <div className="border rounded-lg p-3 mb-3 space-y-2 bg-muted/30">
                    <p className="text-xs text-muted-foreground font-medium">Select a file to share:</p>
                    {loadingFiles ? (
                      <div className="flex justify-center py-4">
                        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                      </div>
                    ) : availableFiles.length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-3">No files available</p>
                    ) : (
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {availableFiles.map((file) => {
                          const FileIcon = getFileIcon(file.mime_type);
                          return (
                            <button
                              key={file.id}
                              onClick={() => { onShareFile(file.id); setIsShareOpen(false); }}
                              className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-muted text-left text-sm"
                            >
                              <FileIcon className="w-4 h-4 text-muted-foreground shrink-0" />
                              <span className="truncate flex-1">{file.original_name}</span>
                              <span className="text-xs text-muted-foreground">{formatFileSize(file.size)}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {groupFiles.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No files shared yet</p>
                  </div>
                ) : (
                  groupFiles.map((groupFile) => {
                    const FileIcon = getFileIcon(groupFile.file?.mime_type || null);
                    return (
                      <div key={groupFile.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <FileIcon className="w-4 h-4 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-sm truncate">{groupFile.file?.original_name || "Unknown"}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatFileSize(groupFile.file?.size || 0)} • {format(new Date(groupFile.shared_at), "MMM d")}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {groupFile.file && (
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => downloadFile(groupFile.file!.storage_path, groupFile.file!.original_name)}>
                              <Download className="w-4 h-4" />
                            </Button>
                          )}
                          {(groupFile.shared_by === currentUserId || isAdmin) && (
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => onUnshareFile(groupFile.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
