import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { SettingsMobileNav } from "@/components/settings/SettingsMobileNav";
import { ProfileSection } from "@/components/settings/ProfileSection";
import { SecuritySection } from "@/components/settings/SecuritySection";
import { NotificationsSection } from "@/components/settings/NotificationsSection";
import { AppearanceSection } from "@/components/settings/AppearanceSection";
import { BillingSection } from "@/components/settings/BillingSection";
import { cn } from "@/lib/utils";
import {
  Loader2,
  User,
  Bell,
  Shield,
  Palette,
  ChevronRight,
  CreditCard,
} from "lucide-react";

interface ProfileData {
  full_name: string;
  username: string;
  email: string;
  avatar_url: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  fileUploads: boolean;
  groupActivity: boolean;
  weeklyDigest: boolean;
  marketingEmails: boolean;
}

const sections = [
  { id: "profile", label: "Profile", icon: User, description: "Your personal information" },
  { id: "billing", label: "Billing & Plan", icon: CreditCard, description: "Subscription and invoices" },
  { id: "notifications", label: "Notifications", icon: Bell, description: "How you get notified" },
  { id: "appearance", label: "Appearance", icon: Palette, description: "Customize the look" },
  { id: "security", label: "Security", icon: Shield, description: "Password & account" },
];

const Settings = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState("profile");
  const [profileData, setProfileData] = useState<ProfileData>({
    full_name: "",
    username: "",
    email: "",
    avatar_url: "",
  });
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    fileUploads: true,
    groupActivity: true,
    weeklyDigest: false,
    marketingEmails: false,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data && !error) {
        setProfileData({
          full_name: data.full_name || "",
          username: data.username || "",
          email: data.email || user.email || "",
          avatar_url: data.avatar_url || "",
        });
      }
    };

    loadProfile();
  }, [user]);

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

  const renderSection = () => {
    switch (activeSection) {
      case "profile":
        return (
          <ProfileSection
            user={user}
            profileData={profileData}
            setProfileData={setProfileData}
          />
        );
      case "billing":
        return <BillingSection />;
      case "notifications":
        return (
          <NotificationsSection
            notifications={notifications}
            setNotifications={setNotifications}
          />
        );
      case "appearance":
        return <AppearanceSection />;
      case "security":
        return <SecuritySection user={user} onSignOut={signOut} />;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account and preferences
          </p>
        </motion.div>

        {/* Mobile Navigation */}
        <SettingsMobileNav
          sections={sections}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 mt-4 lg:mt-0">
          {/* Desktop Sidebar Navigation */}
          <motion.nav
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden lg:block lg:w-72 shrink-0"
          >
            <div className="sticky top-8 space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl",
                    "transition-all duration-200 group",
                    activeSection === section.id
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-9 h-9 rounded-lg flex items-center justify-center transition-colors",
                        activeSection === section.id
                          ? "bg-primary-foreground/20"
                          : "bg-muted group-hover:bg-primary/10"
                      )}
                    >
                      <section.icon
                        className={cn(
                          "w-5 h-5",
                          activeSection === section.id
                            ? "text-primary-foreground"
                            : "text-primary"
                        )}
                      />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">{section.label}</p>
                      <p
                        className={cn(
                          "text-xs",
                          activeSection === section.id
                            ? "text-primary-foreground/70"
                            : "text-muted-foreground"
                        )}
                      >
                        {section.description}
                      </p>
                    </div>
                  </div>
                  <ChevronRight
                    className={cn(
                      "w-4 h-4 transition-transform",
                      activeSection === section.id && "translate-x-1"
                    )}
                  />
                </button>
              ))}
            </div>
          </motion.nav>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {renderSection()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
