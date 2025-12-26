import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useFiles } from '@/hooks/useFiles';
import { useGroups, useGroupDetails } from '@/hooks/useGroups';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import FileUploadZone from '@/components/files/FileUploadZone';
import FileList from '@/components/files/FileList';
import { GroupList } from '@/components/groups/GroupList';
import { GroupView } from '@/components/groups/GroupView';
import { 
  Cloud, 
  FolderOpen, 
  Users, 
  Settings, 
  LogOut,
  Loader2,
  FileText,
  HardDrive,
  ChevronRight,
  Home,
  FolderPlus,
  Upload
} from 'lucide-react';

const Dashboard = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState<'files' | 'groups'>('files');
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [folderPath, setFolderPath] = useState<{ id: string | null; name: string }[]>([
    { id: null, name: 'My Files' }
  ]);
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [storageUsage, setStorageUsage] = useState({ used: 0, total: 5 * 1024 * 1024 * 1024 });
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

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
  } = useFiles(currentFolderId);

  const {
    groups,
    loading: groupsLoading,
    createGroup,
    joinGroup,
    deleteGroup,
    leaveGroup,
  } = useGroups();

  const {
    group: selectedGroup,
    members,
    messages,
    files: groupFiles,
    loading: groupDetailsLoading,
    sendMessage,
    inviteByUsername,
    removeMember,
    shareFile,
    unshareFile,
  } = useGroupDetails(selectedGroupId);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchStorageUsage = async () => {
      const usage = await getStorageUsage();
      setStorageUsage(usage);
    };
    fetchStorageUsage();
  }, [getStorageUsage, files]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleFolderClick = useCallback((folderId: string) => {
    const folder = folders.find(f => f.id === folderId);
    if (folder) {
      setCurrentFolderId(folderId);
      setFolderPath(prev => [...prev, { id: folderId, name: folder.name }]);
    }
  }, [folders]);

  const handleBreadcrumbClick = useCallback((index: number) => {
    const newPath = folderPath.slice(0, index + 1);
    setFolderPath(newPath);
    setCurrentFolderId(newPath[newPath.length - 1].id);
  }, [folderPath]);

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;

    try {
      await createFolder(newFolderName.trim(), currentFolderId);
      setNewFolderName('');
      setIsCreateFolderOpen(false);
      toast({
        title: 'Folder created',
        description: `"${newFolderName}" has been created.`,
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Failed to create folder',
        description: error.message,
      });
    }
  };

  const handleDeleteFile = async (file: any) => {
    try {
      await deleteFile(file.id, file.storage_path);
      toast({
        title: 'File deleted',
        description: `"${file.original_name}" has been deleted.`,
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Failed to delete file',
        description: error.message,
      });
    }
  };

  const handleDeleteFolder = async (folder: any) => {
    try {
      await deleteFolder(folder.id);
      toast({
        title: 'Folder deleted',
        description: `"${folder.name}" has been deleted.`,
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Failed to delete folder',
        description: error.message,
      });
    }
  };

  const handleDownloadFile = async (file: any) => {
    try {
      const url = await getFileUrl(file.storage_path);
      if (url) {
        window.open(url, '_blank');
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Failed to download file',
        description: error.message,
      });
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleDeleteGroup = async (groupId: string): Promise<boolean> => {
    const success = await deleteGroup(groupId);
    if (success && selectedGroupId === groupId) {
      setSelectedGroupId(null);
    }
    return success;
  };

  const handleLeaveGroup = async (groupId: string): Promise<boolean> => {
    const success = await leaveGroup(groupId);
    if (success && selectedGroupId === groupId) {
      setSelectedGroupId(null);
    }
    return success;
  };

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

  const usagePercent = (storageUsage.used / storageUsage.total) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <a href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center shadow-card">
                <Cloud className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-foreground">
                Nano<span className="gradient-text">File</span>
              </span>
            </a>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-foreground">
                    {user.user_metadata?.full_name || 'User'}
                  </p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <div className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center text-primary-foreground font-semibold">
                  {(user.user_metadata?.full_name?.[0] || user.email?.[0] || 'U').toUpperCase()}
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleSignOut}>
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{files.length}</p>
                <p className="text-sm text-muted-foreground">Files</p>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{groups.length}</p>
                <p className="text-sm text-muted-foreground">Groups</p>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                <HardDrive className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {formatFileSize(storageUsage.used)} / {formatFileSize(storageUsage.total)}
                </p>
                <p className="text-xs text-muted-foreground">Storage Used</p>
              </div>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full gradient-bg rounded-full transition-all duration-500"
                style={{ width: `${Math.min(usagePercent, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'files' | 'groups')} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="files" className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              My Files
            </TabsTrigger>
            <TabsTrigger value="groups" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Groups
            </TabsTrigger>
          </TabsList>

          <TabsContent value="files" className="space-y-6">
            {/* Actions & Breadcrumb */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-1 text-sm">
                {folderPath.map((item, index) => (
                  <div key={item.id || 'root'} className="flex items-center gap-1">
                    {index > 0 && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                    <button
                      onClick={() => handleBreadcrumbClick(index)}
                      className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-colors ${
                        index === folderPath.length - 1
                          ? 'text-foreground font-medium'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      {index === 0 && <Home className="w-4 h-4" />}
                      {item.name}
                    </button>
                  </div>
                ))}
              </nav>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Dialog open={isCreateFolderOpen} onOpenChange={setIsCreateFolderOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <FolderPlus className="w-4 h-4" />
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
                        onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
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
                    <Button variant="hero" size="sm">
                      <Upload className="w-4 h-4" />
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
                        onUploadComplete={() => {
                          refetch();
                        }}
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* File List */}
            <FileList
              files={files}
              folders={folders}
              loading={filesLoading}
              onFolderClick={handleFolderClick}
              onDeleteFile={handleDeleteFile}
              onDeleteFolder={handleDeleteFolder}
              onDownloadFile={handleDownloadFile}
            />
          </TabsContent>

          <TabsContent value="groups" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[500px]">
              {/* Groups Sidebar */}
              <div className="lg:col-span-1">
                <div className="glass-card rounded-2xl p-4">
                  <h3 className="font-semibold mb-4">Your Groups</h3>
                  <GroupList
                    groups={groups}
                    loading={groupsLoading}
                    selectedGroupId={selectedGroupId}
                    onSelectGroup={setSelectedGroupId}
                    onCreateGroup={createGroup}
                    onJoinGroup={joinGroup}
                    onDeleteGroup={handleDeleteGroup}
                    onLeaveGroup={handleLeaveGroup}
                  />
                </div>
              </div>

              {/* Group Content */}
              <div className="lg:col-span-2">
                <div className="glass-card rounded-2xl h-full min-h-[500px]">
                  {selectedGroupId && selectedGroup ? (
                    <GroupView
                      group={selectedGroup}
                      members={members}
                      messages={messages}
                      files={groupFiles}
                      loading={groupDetailsLoading}
                      onSendMessage={sendMessage}
                      onInviteByUsername={inviteByUsername}
                      onRemoveMember={removeMember}
                      onShareFile={shareFile}
                      onUnshareFile={unshareFile}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      <div className="text-center">
                        <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium">Select a group</p>
                        <p className="text-sm">Choose a group from the sidebar to view its content</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
