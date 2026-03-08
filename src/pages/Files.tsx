import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useFiles } from "@/hooks/useFiles";
import { useToast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import FileUploadZone from "@/components/files/FileUploadZone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  Loader2,
  FolderPlus,
  Upload,
  Grid3X3,
  List,
  Home,
  ChevronRight,
  Folder,
  FileText,
  Image,
  Video,
  Music,
  Archive,
  File,
  MoreVertical,
  Download,
  Share2,
  Trash2,
  Link,
  Link2Off,
  Copy,
  Check,
  Search,
  SortAsc,
  Filter,
  Eye,
} from "lucide-react";
import FilePreviewModal from "@/components/files/FilePreviewModal";

const Files = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [folderPath, setFolderPath] = useState<{ id: string | null; name: string }[]>([
    { id: null, name: "My Files" },
  ]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [newFolderName, setNewFolderName] = useState("");
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [sharingId, setSharingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [storageUsage, setStorageUsage] = useState({ used: 0, total: 5 * 1024 * 1024 * 1024 });
  const [previewFileIndex, setPreviewFileIndex] = useState<number | null>(null);

  const {
    files,
    folders,
    loading: filesLoading,
    refetch,
    deleteFile,
    createFolder,
    deleteFolder,
    getFileUrl,
    getStorageUsage,
    shareFile,
    unshareFile,
    getShareLink,
  } = useFiles(currentFolderId);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchStorage = async () => {
      const usage = await getStorageUsage();
      setStorageUsage(usage);
    };
    fetchStorage();
  }, [getStorageUsage, files]);

  const handleFolderClick = useCallback(
    (folderId: string) => {
      const folder = folders.find((f) => f.id === folderId);
      if (folder) {
        setCurrentFolderId(folderId);
        setFolderPath((prev) => [...prev, { id: folderId, name: folder.name }]);
      }
    },
    [folders]
  );

  const handleBreadcrumbClick = useCallback(
    (index: number) => {
      const newPath = folderPath.slice(0, index + 1);
      setFolderPath(newPath);
      setCurrentFolderId(newPath[newPath.length - 1].id);
    },
    [folderPath]
  );

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;

    try {
      await createFolder(newFolderName.trim(), currentFolderId);
      setNewFolderName("");
      setIsCreateFolderOpen(false);
      toast({
        title: "Folder created",
        description: `"${newFolderName}" has been created.`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to create folder",
        description: error.message,
      });
    }
  };

  const handleDeleteFile = async (file: any) => {
    setDeletingId(file.id);
    try {
      await deleteFile(file.id, file.storage_path);
      toast({
        title: "File deleted",
        description: `"${file.original_name}" has been deleted.`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to delete file",
        description: error.message,
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteFolder = async (folder: any) => {
    try {
      await deleteFolder(folder.id);
      toast({
        title: "Folder deleted",
        description: `"${folder.name}" has been deleted.`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to delete folder",
        description: error.message,
      });
    }
  };

  const handleDownloadFile = async (file: any) => {
    try {
      const url = await getFileUrl(file.storage_path);
      if (url) {
        window.open(url, "_blank");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to download file",
        description: error.message,
      });
    }
  };

  const handleShareFile = async (file: any) => {
    setSharingId(file.id);
    try {
      const token = await shareFile(file.id);
      if (token) {
        const link = getShareLink(token);
        await navigator.clipboard.writeText(link);
        setCopiedId(file.id);
        toast({
          title: "Link copied!",
          description: "Share link has been copied to clipboard",
        });
        setTimeout(() => setCopiedId(null), 2000);
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to share file",
      });
    } finally {
      setSharingId(null);
    }
  };

  const handleUnshareFile = async (file: any) => {
    setSharingId(file.id);
    try {
      await unshareFile(file.id);
      toast({
        title: "Link removed",
        description: "File is no longer shared",
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove share link",
      });
    } finally {
      setSharingId(null);
    }
  };

  const handleCopyLink = async (file: any) => {
    if (!file.share_token) return;
    const link = getShareLink(file.share_token);
    await navigator.clipboard.writeText(link);
    setCopiedId(file.id);
    toast({
      title: "Link copied!",
      description: "Share link has been copied to clipboard",
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

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

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Filter files and folders based on search
  const filteredFolders = folders.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredFiles = files.filter((f) =>
    f.original_name.toLowerCase().includes(searchQuery.toLowerCase())
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
    <DashboardLayout storageUsed={storageUsage.used} storageTotal={storageUsage.total}>
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Files</h1>
            <p className="text-muted-foreground mt-1">
              {formatFileSize(storageUsage.used)} of {formatFileSize(storageUsage.total)} used
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-3"
          >
            <Dialog open={isCreateFolderOpen} onOpenChange={setIsCreateFolderOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="rounded-xl">
                  <FolderPlus className="w-4 h-4 mr-2" />
                  New Folder
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Folder</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <Input
                    placeholder="Folder name"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleCreateFolder()}
                    className="h-12 rounded-xl"
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsCreateFolderOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateFolder}>Create</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-xl shadow-lg shadow-primary/25">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Files
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Upload Files</DialogTitle>
                </DialogHeader>
                <div className="pt-4">
                  <FileUploadZone
                    folderId={currentFolderId || undefined}
                    onUploadComplete={() => refetch()}
                  />
                </div>
              </DialogContent>
            </Dialog>
          </motion.div>
        </div>

        {/* Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-card border border-border/50"
        >
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1 text-sm overflow-x-auto">
            {folderPath.map((item, index) => (
              <div key={item.id || "root"} className="flex items-center gap-1 shrink-0">
                {index > 0 && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                <button
                  onClick={() => handleBreadcrumbClick(index)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors",
                    index === folderPath.length - 1
                      ? "text-foreground font-medium bg-muted/50"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                  )}
                >
                  {index === 0 && <Home className="w-4 h-4" />}
                  {item.name}
                </button>
              </div>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:flex-initial sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 rounded-xl border-border/50"
              />
            </div>

            {/* View Toggle */}
            <div className="flex items-center rounded-xl border border-border/50 p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  viewMode === "grid"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  viewMode === "list"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* File Grid/List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {filesLoading ? (
            <div
              className={cn(
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                  : "space-y-2"
              )}
            >
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "animate-pulse rounded-2xl bg-card border border-border/50",
                    viewMode === "grid" ? "p-4" : "p-4 flex items-center gap-4"
                  )}
                >
                  <div className="w-12 h-12 bg-muted rounded-xl" />
                  {viewMode === "grid" ? (
                    <>
                      <div className="h-4 bg-muted rounded w-3/4 mt-3" />
                      <div className="h-3 bg-muted rounded w-1/2 mt-2" />
                    </>
                  ) : (
                    <div className="flex-1">
                      <div className="h-4 bg-muted rounded w-1/3" />
                      <div className="h-3 bg-muted rounded w-1/4 mt-2" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : filteredFolders.length === 0 && filteredFiles.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
                <Folder className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {searchQuery ? "No results found" : "No files yet"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery
                  ? "Try a different search term"
                  : "Upload files or create folders to get started"}
              </p>
              {!searchQuery && (
                <Button onClick={() => setIsUploadOpen(true)} className="rounded-xl">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Files
                </Button>
              )}
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <AnimatePresence mode="popLayout">
                {/* Folders */}
                {filteredFolders.map((folder, index) => (
                  <motion.div
                    key={folder.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.03 }}
                    onClick={() => handleFolderClick(folder.id)}
                    className={cn(
                      "group p-5 rounded-2xl cursor-pointer",
                      "bg-card border border-border/50",
                      "hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5",
                      "transition-all duration-200 hover:-translate-y-0.5"
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Folder className="w-6 h-6 text-primary" />
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 h-8 w-8"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteFolder(folder);
                            }}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <h3 className="font-medium text-foreground truncate mt-4">{folder.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(folder.created_at)}
                    </p>
                  </motion.div>
                ))}

                {/* Files */}
                {filteredFiles.map((file, index) => {
                  const FileIcon = getFileIcon(file.mime_type);
                  const isDeleting = deletingId === file.id;
                  const isShared = file.is_public && file.share_token;

                  return (
                    <motion.div
                      key={file.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: (filteredFolders.length + index) * 0.03 }}
                      className={cn(
                        "group relative p-5 rounded-2xl",
                        "bg-card border border-border/50",
                        "hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5",
                        "transition-all duration-200 hover:-translate-y-0.5",
                        isDeleting && "opacity-50 pointer-events-none"
                      )}
                    >
                      {isShared && (
                        <div className="absolute top-3 left-3">
                          <div
                            className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center"
                            title="Shared"
                          >
                            <Link className="w-3 h-3 text-primary" />
                          </div>
                        </div>
                      )}
                      <div className="flex items-start justify-between">
                        <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center">
                          <FileIcon className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="opacity-0 group-hover:opacity-100 h-8 w-8"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleDownloadFile(file)}>
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {isShared ? (
                              <>
                                <DropdownMenuItem onClick={() => handleCopyLink(file)}>
                                  {copiedId === file.id ? (
                                    <Check className="w-4 h-4 mr-2 text-green-500" />
                                  ) : (
                                    <Copy className="w-4 h-4 mr-2" />
                                  )}
                                  Copy Link
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleUnshareFile(file)}>
                                  <Link2Off className="w-4 h-4 mr-2" />
                                  Remove Link
                                </DropdownMenuItem>
                              </>
                            ) : (
                              <DropdownMenuItem onClick={() => handleShareFile(file)}>
                                <Share2 className="w-4 h-4 mr-2" />
                                Share with Link
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeleteFile(file)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <h3
                        className="font-medium text-foreground truncate mt-4"
                        title={file.original_name}
                      >
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
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          ) : (
            /* List View */
            <div className="rounded-2xl border border-border/50 overflow-hidden">
              {/* Header */}
              <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-muted/30 border-b border-border/50 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <div className="col-span-6 sm:col-span-5">Name</div>
                <div className="col-span-2 hidden sm:block">Size</div>
                <div className="col-span-3 hidden sm:block">Modified</div>
                <div className="col-span-6 sm:col-span-2 text-right">Actions</div>
              </div>

              {/* Rows */}
              <div className="divide-y divide-border/30">
                {filteredFolders.map((folder) => (
                  <div
                    key={folder.id}
                    onClick={() => handleFolderClick(folder.id)}
                    className="grid grid-cols-12 gap-4 px-4 py-3 items-center cursor-pointer hover:bg-muted/30 transition-colors group"
                  >
                    <div className="col-span-6 sm:col-span-5 flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Folder className="w-5 h-5 text-primary" />
                      </div>
                      <span className="font-medium text-foreground truncate">{folder.name}</span>
                    </div>
                    <div className="col-span-2 hidden sm:block text-sm text-muted-foreground">—</div>
                    <div className="col-span-3 hidden sm:block text-sm text-muted-foreground">
                      {formatDate(folder.created_at)}
                    </div>
                    <div className="col-span-6 sm:col-span-2 flex justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteFolder(folder);
                            }}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}

                {filteredFiles.map((file) => {
                  const FileIcon = getFileIcon(file.mime_type);
                  const isShared = file.is_public && file.share_token;

                  return (
                    <div
                      key={file.id}
                      className="grid grid-cols-12 gap-4 px-4 py-3 items-center hover:bg-muted/30 transition-colors group"
                    >
                      <div className="col-span-6 sm:col-span-5 flex items-center gap-3 min-w-0">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
                            <FileIcon className="w-5 h-5 text-muted-foreground" />
                          </div>
                          {isShared && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                              <Link className="w-2 h-2 text-primary-foreground" />
                            </div>
                          )}
                        </div>
                        <span className="font-medium text-foreground truncate" title={file.original_name}>
                          {file.original_name}
                        </span>
                      </div>
                      <div className="col-span-2 hidden sm:block text-sm text-muted-foreground">
                        {formatFileSize(file.size)}
                      </div>
                      <div className="col-span-3 hidden sm:block text-sm text-muted-foreground">
                        {formatDate(file.created_at)}
                      </div>
                      <div className="col-span-6 sm:col-span-2 flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleDownloadFile(file)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {isShared ? (
                              <>
                                <DropdownMenuItem onClick={() => handleCopyLink(file)}>
                                  {copiedId === file.id ? (
                                    <Check className="w-4 h-4 mr-2 text-green-500" />
                                  ) : (
                                    <Copy className="w-4 h-4 mr-2" />
                                  )}
                                  Copy Link
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleUnshareFile(file)}>
                                  <Link2Off className="w-4 h-4 mr-2" />
                                  Remove Link
                                </DropdownMenuItem>
                              </>
                            ) : (
                              <DropdownMenuItem onClick={() => handleShareFile(file)}>
                                <Share2 className="w-4 h-4 mr-2" />
                                Share
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeleteFile(file)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Files;
