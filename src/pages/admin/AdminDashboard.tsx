import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAdminStats } from "@/hooks/useAdmin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, UsersRound, HardDrive, TrendingUp, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const AdminDashboard = () => {
  const { stats, loading } = useAdminStats();

  const formatBytes = (bytes: number) => {
    const gb = bytes / (1024 * 1024 * 1024);
    return gb >= 1 ? `${gb.toFixed(2)} GB` : `${(bytes / (1024 * 1024)).toFixed(0)} MB`;
  };

  const statCards = stats
    ? [
        { title: "Total Users", value: stats.total_users, today: stats.users_today, icon: Users },
        { title: "Total Files", value: stats.total_files, today: stats.files_today, icon: FileText },
        { title: "Total Groups", value: stats.total_groups, today: stats.groups_today, icon: UsersRound },
        { title: "Storage Used", value: formatBytes(stats.total_storage_bytes), today: null, icon: HardDrive },
      ]
    : [];

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admin Overview</h1>
          <p className="text-muted-foreground mt-1">Monitor your platform at a glance</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {statCards.map((stat, i) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="relative overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </CardTitle>
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <stat.icon className="w-5 h-5 text-primary" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                      {stat.today !== null && (
                        <div className="flex items-center gap-1 mt-2">
                          <TrendingUp className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-green-600">+{stat.today} today</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
