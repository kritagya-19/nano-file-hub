import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import {
  Loader2,
  Search,
  Share2,
  Users,
  Globe,
  Link,
  Copy,
  Download,
  MoreVertical,
  Link2Off,
  File,
  FileText,
  Image,
  Video,
  Music,
  Archive,
  ExternalLink,
  Check,
  FolderOpen,
} from "lucide-react";
import { format } from "date-fns";

interface SharedFile {
  id: string;
  name: string;
  original_name: string;
  size: number;
  mime_type: string | null;
  storage_path: string;
  share_token: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

interface GroupSharedFile {
  id: string;
  group_id: string;
  file_id: string;
  shared_by: string;
  shared_at: string;
  file: {
    id: string;
    name: string;
    original_name: string;
    size: number;
    mime_type: string | null;
    storage_path: string;
  } | null;
  group: {
    id: string;
    name: string;
  } | null;
  sharer_profile: {
    full_name: string | null;
    username: string | null;
  } | null;
}

const Shared = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("my-shared");
  const [searchQuery, setSearchQuery] = useState("");
  const [mySharedFiles, setMySharedFiles] = useState<SharedFile[]>([]);
  const [groupFiles, setGroupFiles] = useState<GroupSharedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchSharedFiles = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Fetch files I've shared publicly
      const { data: publicFiles, error: publicError } = await supabase
        .from("files")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_public", true)
        .not("share_token", "is", null)
        .order("updated_at", { ascending: false });

      if (publicError) throw publicError;
      setMySharedFiles(publicFiles || []);

      // Fetch files shared with me via groups
      // First get groups I'm a member of
      const { data: memberships, error: memberError } = await supabase
        .from("group_members")
        .select("group_id")
        .eq("user_id", user.id);

      if (memberError) throw memberError;

      if (memberships && memberships.length > 0) {
        const groupIds = memberships.map((m) => m.group_id);

        // Get files shared in those groups (excluding files I shared)
        const { data: sharedFiles, error: sharedError } = await supabase
          .from("group_files")
          .select("*")
          .in("group_id", groupIds)
          .neq("shared_by", user.id)
          .order("shared_at", { ascending: false });

        if (sharedError) throw sharedError;

        if (sharedFiles && sharedFiles.length > 0) {
          // Fetch file details
          const fileIds = sharedFiles.map((sf) => sf.file_id);
          const { data: filesData } = await supabase
            .from("files")
            .select("id, name, original_name, size, mime_type, storage_path")
            .in("id", fileIds);

          // Fetch group details
          const uniqueGroupIds = [...new Set(sharedFiles.map((sf) => sf.group_id))];
          const { data: groupsData } = await supabase
            .from("groups")
            .select("id, name")
            .in("id", uniqueGroupIds);

          // Fetch sharer profiles
          const sharerIds = [...new Set(sharedFiles.map((sf) => sf.shared_by))];
          const { data: profilesData } = await supabase
            .from("profiles")
            .select("id, full_name, username")
            .in("id", sharerIds);

          const filesMap = new Map(filesData?.map((f) => [f.id, f]) || []);
          const groupsMap = new Map(groupsData?.map((g) => [g.id, g]) || []);
          const profilesMap = new Map(profilesData?.map((p) => [p.id, p]) || []);

          const enrichedFiles: GroupSharedFile[] = sharedFiles.map((sf) => ({
            ...sf,
            file: filesMap.get(sf.file_id) || null,
            group: groupsMap.get(sf.group_id) || null,
            sharer_profile: profilesMap.get(sf.shared_by) || null,
          }));

          setGroupFiles(enrichedFiles);
        } else {
          setGroupFiles([]);
        }
      } else {
        setGroupFiles([]);
      }
    } catch (error: any) {
      console.error("Error fetching shared files:", error);
      toast({
        variant: "destructive",
        title: "Failed to load shared files",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    fetchSharedFiles();
  }, [fetchSharedFiles]);

  const getFileIcon = (mimeType: string | null) => {
    if (!mimeType) return File;
    if (mimeType.startsWith("image/")) return Image;
    if (mimeType.startsWith("video/")) return Video;
    if (mimeType.startsWith("audio/")) return Music;
    if (mimeType.includes("zip") || mimeType.includes("rar")) return Archive;
    if (mimeType.includes("pdf") || mimeType.includes("document")) return FileText;
    return File;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const getShareLink = (shareToken: string) => {
    return `${window.location.origin}/share/${shareToken}`;
  };

  const handleCopyLink = async (shareToken: string, fileId: string) => {
    const link = getShareLink(shareToken);
    await navigator.clipboard.writeText(link);
    setCopiedId(fileId);
    toast({
      title: "Link copied!",
      description: "Share link has been copied to clipboard",
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = async (storagePath: string, fileName: string) => {
    try {
      const { data } = await supabase.storage
        .from("user-files")
        .createSignedUrl(storagePath, 3600);

      if (data?.signedUrl) {
        window.open(data.signedUrl, "_blank");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Download failed",
        description: error.message,
      });
    }
  };

  const handleUnshare = async (fileId: string) => {
    try {
      const { error } = await supabase
        .from("files")
        .update({ is_public: false, share_token: null })
        .eq("id", fileId);

      if (error) throw error;

      setMySharedFiles((prev) => prev.filter((f) => f.id !== fileId));
      toast({
        title: "Link removed",
        description: "File is no longer publicly shared",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to unshare",
        description: error.message,
      });
    }
  };

  const handleOpenSharePage = (shareToken: string) => {
    window.open(getShareLink(shareToken), "_blank");
  };

  // Filter files based on search
  const filteredMyFiles = mySharedFiles.filter((f) =>
    f.original_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGroupFiles = groupFiles.filter(
    (gf) =>
      gf.file?.original_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gf.group?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Shared Files
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your shared files and access files shared with you
            </p>
          </div>
        </motion.div>

        {/* Search & Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search shared files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 rounded-xl border-border/50"
            />
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="h-12 p-1 rounded-xl bg-muted/50">
              <TabsTrigger
                value="my-shared"
                className="rounded-lg px-6 data-[state=active]:shadow-sm"
              >
                <Globe className="w-4 h-4 mr-2" />
                My Shared Links
                {mySharedFiles.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {mySharedFiles.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="from-groups"
                className="rounded-lg px-6 data-[state=active]:shadow-sm"
              >
                <Users className="w-4 h-4 mr-2" />
                From Groups
                {groupFiles.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {groupFiles.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            {/* My Shared Files Tab */}
            <TabsContent value="my-shared" className="mt-6">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="h-28 bg-muted/50 animate-pulse rounded-2xl"
                    />
                  ))}
                </div>
              ) : filteredMyFiles.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
                    <Share2 className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {searchQuery ? "No files found" : "No shared files yet"}
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                    {searchQuery
                      ? "Try a different search term"
                      : "Share files from the Files page to create public links"}
                  </p>
                  {!searchQuery && (
                    <Button
                      onClick={() => navigate("/dashboard/files")}
                      className="rounded-xl"
                    >
                      <FolderOpen className="w-4 h-4 mr-2" />
                      Go to Files
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <AnimatePresence mode="popLayout">
                    {filteredMyFiles.map((file, index) => {
                      const FileIcon = getFileIcon(file.mime_type);
                      return (
                        <motion.div
                          key={file.id}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ delay: index * 0.05 }}
                          className="group p-4 rounded-2xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200"
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                              <FileIcon className="w-6 h-6 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-foreground truncate">
                                {file.original_name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {formatFileSize(file.size)}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge
                                  variant="secondary"
                                  className="text-xs bg-green-500/10 text-green-600 border-green-500/20"
                                >
                                  <Globe className="w-3 h-3 mr-1" />
                                  Public
                                </Badge>
                              </div>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleCopyLink(file.share_token!, file.id)
                                  }
                                >
                                  {copiedId === file.id ? (
                                    <Check className="w-4 h-4 mr-2" />
                                  ) : (
                                    <Copy className="w-4 h-4 mr-2" />
                                  )}
                                  Copy link
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleOpenSharePage(file.share_token!)
                                  }
                                >
                                  <ExternalLink className="w-4 h-4 mr-2" />
                                  Open share page
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleDownload(
                                      file.storage_path,
                                      file.original_name
                                    )
                                  }
                                >
                                  <Download className="w-4 h-4 mr-2" />
                                  Download
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => handleUnshare(file.id)}
                                >
                                  <Link2Off className="w-4 h-4 mr-2" />
                                  Remove link
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          {/* Quick Actions */}
                          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/50">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 rounded-lg h-9"
                              onClick={() =>
                                handleCopyLink(file.share_token!, file.id)
                              }
                            >
                              {copiedId === file.id ? (
                                <Check className="w-3 h-3 mr-1.5" />
                              ) : (
                                <Link className="w-3 h-3 mr-1.5" />
                              )}
                              {copiedId === file.id ? "Copied!" : "Copy Link"}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="rounded-lg h-9"
                              onClick={() =>
                                handleDownload(
                                  file.storage_path,
                                  file.original_name
                                )
                              }
                            >
                              <Download className="w-3 h-3" />
                            </Button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </TabsContent>

            {/* From Groups Tab */}
            <TabsContent value="from-groups" className="mt-6">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="h-28 bg-muted/50 animate-pulse rounded-2xl"
                    />
                  ))}
                </div>
              ) : filteredGroupFiles.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
                    <Users className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {searchQuery ? "No files found" : "No files from groups yet"}
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                    {searchQuery
                      ? "Try a different search term"
                      : "Files shared by group members will appear here"}
                  </p>
                  {!searchQuery && (
                    <Button
                      onClick={() => navigate("/dashboard/groups")}
                      className="rounded-xl"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Go to Groups
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <AnimatePresence mode="popLayout">
                    {filteredGroupFiles.map((groupFile, index) => {
                      if (!groupFile.file) return null;
                      const FileIcon = getFileIcon(groupFile.file.mime_type);
                      return (
                        <motion.div
                          key={groupFile.id}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ delay: index * 0.05 }}
                          className="group p-4 rounded-2xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200"
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                              <FileIcon className="w-6 h-6 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-foreground truncate">
                                {groupFile.file.original_name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {formatFileSize(groupFile.file.size)}
                              </p>
                              <div className="flex items-center gap-2 mt-2 flex-wrap">
                                <Badge
                                  variant="secondary"
                                  className="text-xs bg-blue-500/10 text-blue-600 border-blue-500/20"
                                >
                                  <Users className="w-3 h-3 mr-1" />
                                  {groupFile.group?.name || "Group"}
                                </Badge>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                handleDownload(
                                  groupFile.file!.storage_path,
                                  groupFile.file!.original_name
                                )
                              }
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>

                          {/* Meta Info */}
                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50 text-xs text-muted-foreground">
                            <span>
                              Shared by{" "}
                              {groupFile.sharer_profile?.full_name ||
                                groupFile.sharer_profile?.username ||
                                "Unknown"}
                            </span>
                            <span>
                              {format(
                                new Date(groupFile.shared_at),
                                "MMM d, yyyy"
                              )}
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Shared;
