import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useFiles } from "@/hooks/useFiles";
import { useGroups } from "@/hooks/useGroups";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { QuickAction } from "@/components/dashboard/QuickAction";
import { RecentFiles } from "@/components/dashboard/RecentFiles";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Loader2,
  FileText,
  Users,
  HardDrive,
  Upload,
  FolderPlus,
  UserPlus,
  Share2,
  ArrowRight,
  Sparkles,
  Clock,
  TrendingUp,
} from "lucide-react";

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [storageUsage, setStorageUsage] = useState({ used: 0, total: 5 * 1024 * 1024 * 1024 });

  const { files, loading: filesLoading, getStorageUsage } = useFiles(null);
  const { groups, loading: groupsLoading } = useGroups();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchStorageUsage = async () => {
      const usage = await getStorageUsage();
      setStorageUsage(usage);
    };
    fetchStorageUsage();
  }, [getStorageUsage, files]);

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

  const formatStorage = (bytes: number) => {
    const gb = bytes / (1024 * 1024 * 1024);
    return gb >= 1 ? `${gb.toFixed(1)} GB` : `${(bytes / (1024 * 1024)).toFixed(0)} MB`;
  };

  const usagePercent = Math.round((storageUsage.used / storageUsage.total) * 100);
  const greeting = new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 18 ? "Good afternoon" : "Good evening";

  const recentFiles = files.slice(0, 5).map((file) => ({
    id: file.id,
    name: file.original_name,
    size: file.size,
    type: file.mime_type || "application/octet-stream",
    updatedAt: file.updated_at,
  }));

  return (
    <DashboardLayout storageUsed={storageUsage.used} storageTotal={storageUsage.total}>
      <div className="p-6 lg:p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              {greeting}, {user.user_metadata?.full_name?.split(" ")[0] || "there"}! 👋
            </h1>
            <p className="text-muted-foreground mt-1">
              Here's what's happening with your files today.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="flex items-center gap-3"
          >
            <Link to="/dashboard/files">
              <Button variant="outline" className="rounded-xl">
                <FolderPlus className="w-4 h-4 mr-2" />
                New Folder
              </Button>
            </Link>
            <Link to="/dashboard/files">
              <Button className="rounded-xl shadow-lg shadow-primary/25">
                <Upload className="w-4 h-4 mr-2" />
                Upload Files
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <StatCard
            title="Total Files"
            value={files.length}
            subtitle="Across all folders"
            icon={FileText}
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Active Groups"
            value={groups.length}
            subtitle="Collaborations"
            icon={Users}
          />
          <StatCard
            title="Storage Used"
            value={`${usagePercent}%`}
            subtitle={`${formatStorage(storageUsage.used)} of ${formatStorage(storageUsage.total)}`}
            icon={HardDrive}
          />
          <StatCard
            title="Shared Files"
            value={files.filter((f) => f.is_public).length}
            subtitle="Public links active"
            icon={Share2}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Quick Actions</h2>
            </div>
            <div className="space-y-3">
              <QuickAction
                title="Upload Files"
                description="Drag and drop or browse to upload"
                icon={Upload}
                href="/dashboard/files"
                color="primary"
              />
              <QuickAction
                title="Create Group"
                description="Start collaborating with your team"
                icon={UserPlus}
                href="/dashboard/groups"
                color="secondary"
              />
              <QuickAction
                title="Share Files"
                description="Generate secure sharing links"
                icon={Share2}
                href="/dashboard/shared"
                color="accent"
              />
            </div>

            {/* Upgrade Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={cn(
                "relative p-6 rounded-2xl overflow-hidden",
                "bg-gradient-to-br from-primary via-primary/90 to-primary/80"
              )}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Upgrade to Pro</h3>
                <p className="text-sm text-white/80 mb-4">
                  Get 100GB storage, priority support, and advanced features.
                </p>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="bg-white text-primary hover:bg-white/90"
                  onClick={() => navigate("/dashboard/upgrade")}
                >
                  Upgrade Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Recent Files */}
          <div className="lg:col-span-2">
            <div className={cn(
              "h-full p-6 rounded-2xl",
              "bg-card border border-border/50"
            )}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Recent Files</h2>
                    <p className="text-sm text-muted-foreground">Your latest uploads</p>
                  </div>
                </div>
                <Link to="/dashboard/files">
                  <Button variant="ghost" size="sm" className="text-primary">
                    View All
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>

              <RecentFiles files={recentFiles} />
            </div>
          </div>
        </div>

        {/* Activity Section */}
        <div className={cn(
          "p-6 rounded-2xl",
          "bg-card border border-border/50"
        )}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Activity Overview</h2>
              <p className="text-sm text-muted-foreground">Your file activity this week</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Files Uploaded", value: files.length, icon: Upload },
              { label: "Files Shared", value: files.filter((f) => f.is_public).length, icon: Share2 },
              { label: "Groups Joined", value: groups.length, icon: Users },
              { label: "Storage Used", value: formatStorage(storageUsage.used), icon: HardDrive },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="p-4 rounded-xl bg-muted/30 border border-border/30"
              >
                <stat.icon className="w-5 h-5 text-primary mb-2" />
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
