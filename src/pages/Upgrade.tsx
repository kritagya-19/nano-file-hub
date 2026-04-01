import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import Pricing from "@/components/landing/Pricing";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import {
  Loader2,
  Crown,
  Calendar,
  CreditCard,
  Clock,
  DollarSign,
  Zap,
  ArrowRight,
} from "lucide-react";

interface Subscription {
  id: string;
  plan_name: string;
  price_amount: number;
  payment_method: string | null;
  started_at: string;
  expires_at: string;
  status: string;
  created_at: string;
}

const planFeatures: Record<string, string[]> = {
  Free: ["1 GB storage", "Up to 3 groups", "Basic file sharing", "50 MB max file size"],
  Pro: ["50 GB storage", "Unlimited groups", "Advanced sharing", "Priority support", "500 MB max file size", "File versioning", "Custom branding"],
  Max: ["500 GB storage", "Unlimited groups", "Enterprise-grade sharing", "24/7 support", "5 GB max file size", "File versioning & history", "Custom branding & domain", "Admin analytics", "API access"],
};

const Upgrade = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loadingSub, setLoadingSub] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(1);

      if (data && data.length > 0) {
        setSubscription(data[0] as Subscription);
      }
      setLoadingSub(false);
    };
    if (user) fetchSubscription();
  }, [user]);

  if (authLoading || loadingSub) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  const currentPlan = subscription?.plan_name || "Free";
  const daysRemaining = subscription
    ? Math.max(0, Math.ceil((new Date(subscription.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;

  return (
    <DashboardLayout storageUsed={0} storageTotal={5 * 1024 * 1024 * 1024}>
      <div className="p-6 lg:p-8 space-y-8">
        {/* Current Plan Card */}
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-6">My Plan</h1>

          <Card className="p-6 lg:p-8 bg-gradient-to-br from-primary/5 via-background to-background border-primary/20">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Crown className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-bold text-foreground">{currentPlan} Plan</h2>
                      <Badge variant={currentPlan === "Free" ? "secondary" : "default"} className="text-xs">
                        {currentPlan === "Free" ? "Current" : "Active"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {currentPlan === "Free"
                        ? "You're on the free plan. Upgrade for more features!"
                        : `Enjoying premium features with the ${currentPlan} plan.`}
                    </p>
                  </div>
                </div>

                {subscription && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                    <div className="p-3 rounded-xl bg-card border border-border/50">
                      <DollarSign className="w-4 h-4 text-primary mb-1" />
                      <p className="text-lg font-bold text-foreground">${subscription.price_amount}</p>
                      <p className="text-xs text-muted-foreground">Per month</p>
                    </div>
                    <div className="p-3 rounded-xl bg-card border border-border/50">
                      <Calendar className="w-4 h-4 text-primary mb-1" />
                      <p className="text-sm font-bold text-foreground">{format(new Date(subscription.started_at), "MMM d, yyyy")}</p>
                      <p className="text-xs text-muted-foreground">Started</p>
                    </div>
                    <div className="p-3 rounded-xl bg-card border border-border/50">
                      <Clock className="w-4 h-4 text-primary mb-1" />
                      <p className="text-sm font-bold text-foreground">{format(new Date(subscription.expires_at), "MMM d, yyyy")}</p>
                      <p className="text-xs text-muted-foreground">Expires</p>
                    </div>
                    <div className="p-3 rounded-xl bg-card border border-border/50">
                      <CreditCard className="w-4 h-4 text-primary mb-1" />
                      <p className="text-sm font-bold text-foreground">{subscription.payment_method}</p>
                      <p className="text-xs text-muted-foreground">Payment method</p>
                    </div>
                  </div>
                )}

                {daysRemaining !== null && (
                  <div className="flex items-center gap-2 text-sm">
                    <Zap className="w-4 h-4 text-primary" />
                    <span className="text-foreground font-medium">{daysRemaining} days remaining</span>
                    <span className="text-muted-foreground">in your billing cycle</span>
                  </div>
                )}
              </div>

              {/* Features list */}
              <div className="lg:min-w-[260px] p-4 rounded-xl bg-card border border-border/50">
                <h3 className="text-sm font-semibold text-foreground mb-3">Plan Features</h3>
                <ul className="space-y-2">
                  {(planFeatures[currentPlan] || planFeatures.Free).map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        </div>

        <Separator />

        {/* Upgrade options */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <ArrowRight className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-foreground">
              {currentPlan === "Free" ? "Upgrade Your Plan" : "Change Plan"}
            </h2>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            {currentPlan === "Free"
              ? "Unlock more storage, features, and priority support."
              : "Switch to a different plan anytime."}
          </p>
          <Pricing />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Upgrade;
