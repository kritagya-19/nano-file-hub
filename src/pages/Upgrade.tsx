import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import Pricing from "@/components/landing/Pricing";
import { Loader2 } from "lucide-react";

const Upgrade = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <DashboardLayout storageUsed={0} storageTotal={5 * 1024 * 1024 * 1024}>
      <div className="p-6 lg:p-8">
        <Pricing />
      </div>
    </DashboardLayout>
  );
};

export default Upgrade;
