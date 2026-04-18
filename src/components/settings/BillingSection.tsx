import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, CalendarDays, CreditCard, ArrowRight, BadgeCheck } from "lucide-react";

interface Subscription {
  id: string;
  plan_name: string;
  price_amount: number;
  payment_method: string | null;
  started_at: string;
  expires_at: string;
  status: string;
}

export function BillingSection() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      setSubscription(data as Subscription | null);
      setLoading(false);
    };
    load();
  }, [user]);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const daysRemaining = subscription
    ? Math.max(
        0,
        Math.ceil(
          (new Date(subscription.expires_at).getTime() - Date.now()) /
            (1000 * 60 * 60 * 24)
        )
      )
    : 0;

  const planName = subscription?.plan_name || "Free";
  const isPaid = !!subscription && subscription.price_amount > 0;

  return (
    <div className="space-y-6">
      <div className="p-5 sm:p-6 rounded-2xl bg-card border border-border/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Current Plan</h2>
            <p className="text-sm text-muted-foreground">
              Your active subscription details
            </p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-2xl font-bold text-foreground">
                      {planName}
                    </h3>
                    {isPaid && (
                      <BadgeCheck className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {isPaid
                      ? `₹${subscription!.price_amount} / month`
                      : "No charges — free forever"}
                  </p>
                </div>
                <Button
                  onClick={() => navigate("/dashboard/upgrade")}
                  className="rounded-xl"
                >
                  {isPaid ? "Change Plan" : "Upgrade"}
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>

            {isPaid && subscription && (
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-muted/30 border border-border/30">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                    <CalendarDays className="w-3.5 h-3.5" />
                    Started
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    {formatDate(subscription.started_at)}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-muted/30 border border-border/30">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                    <CalendarDays className="w-3.5 h-3.5" />
                    Renews on
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    {formatDate(subscription.expires_at)}
                    <span className="text-xs text-muted-foreground ml-2">
                      ({daysRemaining} days)
                    </span>
                  </p>
                </div>
                {subscription.payment_method && (
                  <div className="p-4 rounded-xl bg-muted/30 border border-border/30 sm:col-span-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <CreditCard className="w-3.5 h-3.5" />
                      Payment Method
                    </div>
                    <p className="text-sm font-medium text-foreground capitalize">
                      {subscription.payment_method}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
