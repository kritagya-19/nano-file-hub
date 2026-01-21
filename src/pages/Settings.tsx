import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  Loader2,
  User,
  Bell,
  Shield,
  Trash2,
  Save,
  Camera,
  Mail,
  AtSign,
  FileText,
  Upload,
  Users,
  MessageSquare,
  AlertTriangle,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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

const Settings = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [activeSection, setActiveSection] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);
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

  const handleSaveProfile = async () => {
    if (!user) return;
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: profileData.full_name,
          username: profileData.username,
          avatar_url: profileData.avatar_url,
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been saved successfully.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to update profile",
        description: error.message,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    toast({
      title: "Account deletion requested",
      description: "Please contact support to complete account deletion.",
    });
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
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

  const sections = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account settings and preferences
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <motion.nav
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-64 shrink-0"
          >
            <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl whitespace-nowrap",
                    "transition-all duration-200",
                    activeSection === section.id
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )}
                >
                  <section.icon className="w-5 h-5 shrink-0" />
                  <span className="font-medium">{section.label}</span>
                </button>
              ))}
            </div>
          </motion.nav>

          {/* Content */}
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-1"
          >
            {activeSection === "profile" && (
              <div className="space-y-6">
                {/* Profile Card */}
                <div className="p-6 rounded-2xl bg-card border border-border/50">
                  <h2 className="text-lg font-semibold text-foreground mb-6">
                    Profile Information
                  </h2>

                  {/* Avatar */}
                  <div className="flex items-center gap-6 mb-8">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-3xl font-bold text-primary-foreground">
                        {profileData.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U"}
                      </div>
                      <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors">
                        <Camera className="w-4 h-4" />
                      </button>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Profile Photo</p>
                      <p className="text-sm text-muted-foreground">
                        JPG, PNG or GIF. Max 2MB.
                      </p>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-sm font-medium">
                        Full Name
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="fullName"
                          value={profileData.full_name}
                          onChange={(e) =>
                            setProfileData({ ...profileData, full_name: e.target.value })
                          }
                          className="pl-11 h-12 rounded-xl"
                          placeholder="John Doe"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-sm font-medium">
                        Username
                      </Label>
                      <div className="relative">
                        <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="username"
                          value={profileData.username}
                          onChange={(e) =>
                            setProfileData({ ...profileData, username: e.target.value })
                          }
                          className="pl-11 h-12 rounded-xl"
                          placeholder="johndoe"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email Address
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="email"
                          value={profileData.email}
                          disabled
                          className="pl-11 h-12 rounded-xl bg-muted/50"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Contact support to change your email address
                      </p>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div className="flex justify-end">
                    <Button
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="rounded-xl shadow-lg shadow-primary/25"
                    >
                      {isSaving ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      Save Changes
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "notifications" && (
              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-card border border-border/50">
                  <h2 className="text-lg font-semibold text-foreground mb-2">
                    Notification Preferences
                  </h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    Choose how you want to be notified about activity
                  </p>

                  <div className="space-y-6">
                    {/* Email Notifications */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/30">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Mail className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">Email Notifications</p>
                          <p className="text-sm text-muted-foreground">
                            Receive notifications via email
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={notifications.emailNotifications}
                        onCheckedChange={(checked) =>
                          setNotifications({ ...notifications, emailNotifications: checked })
                        }
                      />
                    </div>

                    {/* File Uploads */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/30">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Upload className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">File Upload Alerts</p>
                          <p className="text-sm text-muted-foreground">
                            Get notified when uploads complete
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={notifications.fileUploads}
                        onCheckedChange={(checked) =>
                          setNotifications({ ...notifications, fileUploads: checked })
                        }
                      />
                    </div>

                    {/* Group Activity */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/30">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Users className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">Group Activity</p>
                          <p className="text-sm text-muted-foreground">
                            Updates from your groups and teams
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={notifications.groupActivity}
                        onCheckedChange={(checked) =>
                          setNotifications({ ...notifications, groupActivity: checked })
                        }
                      />
                    </div>

                    {/* Weekly Digest */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/30">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">Weekly Digest</p>
                          <p className="text-sm text-muted-foreground">
                            Summary of your weekly activity
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={notifications.weeklyDigest}
                        onCheckedChange={(checked) =>
                          setNotifications({ ...notifications, weeklyDigest: checked })
                        }
                      />
                    </div>

                    {/* Marketing Emails */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/30">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <MessageSquare className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">Marketing Emails</p>
                          <p className="text-sm text-muted-foreground">
                            News, updates and special offers
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={notifications.marketingEmails}
                        onCheckedChange={(checked) =>
                          setNotifications({ ...notifications, marketingEmails: checked })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "security" && (
              <div className="space-y-6">
                {/* Password Section */}
                <div className="p-6 rounded-2xl bg-card border border-border/50">
                  <h2 className="text-lg font-semibold text-foreground mb-2">
                    Password & Security
                  </h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    Keep your account secure
                  </p>

                  <div className="space-y-4">
                    <Button variant="outline" className="w-full sm:w-auto rounded-xl">
                      <Shield className="w-4 h-4 mr-2" />
                      Change Password
                    </Button>
                  </div>
                </div>

                {/* Sessions */}
                <div className="p-6 rounded-2xl bg-card border border-border/50">
                  <h2 className="text-lg font-semibold text-foreground mb-2">
                    Active Sessions
                  </h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    Manage your logged-in devices
                  </p>

                  <div className="p-4 rounded-xl bg-muted/30 border border-border/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">Current Session</p>
                        <p className="text-sm text-muted-foreground">
                          {navigator.userAgent.includes("Windows")
                            ? "Windows"
                            : navigator.userAgent.includes("Mac")
                            ? "macOS"
                            : "Unknown"}{" "}
                          • This device
                        </p>
                      </div>
                      <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-medium">
                        Active
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="mt-4 rounded-xl"
                    onClick={handleSignOut}
                  >
                    Sign Out All Devices
                  </Button>
                </div>

                {/* Danger Zone */}
                <div className="p-6 rounded-2xl bg-destructive/5 border border-destructive/20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-destructive" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-destructive">Danger Zone</h2>
                      <p className="text-sm text-muted-foreground">
                        Irreversible actions
                      </p>
                    </div>
                  </div>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="rounded-xl">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your
                          account and remove all your data from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteAccount}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete Account
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
