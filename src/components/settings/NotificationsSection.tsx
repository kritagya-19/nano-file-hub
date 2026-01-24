import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  Bell,
  Mail,
  Upload,
  Users,
  FileText,
  MessageSquare,
  BellRing,
} from "lucide-react";

interface NotificationSettings {
  emailNotifications: boolean;
  fileUploads: boolean;
  groupActivity: boolean;
  weeklyDigest: boolean;
  marketingEmails: boolean;
}

interface NotificationsSectionProps {
  notifications: NotificationSettings;
  setNotifications: (settings: NotificationSettings) => void;
}

const notificationItems = [
  {
    id: "emailNotifications",
    icon: Mail,
    title: "Email Notifications",
    description: "Receive important updates via email",
    key: "emailNotifications" as keyof NotificationSettings,
  },
  {
    id: "fileUploads",
    icon: Upload,
    title: "File Upload Alerts",
    description: "Get notified when uploads complete",
    key: "fileUploads" as keyof NotificationSettings,
  },
  {
    id: "groupActivity",
    icon: Users,
    title: "Group Activity",
    description: "Updates from your groups and teams",
    key: "groupActivity" as keyof NotificationSettings,
  },
  {
    id: "weeklyDigest",
    icon: FileText,
    title: "Weekly Digest",
    description: "Summary of your weekly activity",
    key: "weeklyDigest" as keyof NotificationSettings,
  },
  {
    id: "marketingEmails",
    icon: MessageSquare,
    title: "Product Updates",
    description: "News, tips and feature announcements",
    key: "marketingEmails" as keyof NotificationSettings,
  },
];

export function NotificationsSection({ 
  notifications, 
  setNotifications 
}: NotificationsSectionProps) {
  const { toast } = useToast();

  const handleToggle = (key: keyof NotificationSettings, checked: boolean) => {
    setNotifications({ ...notifications, [key]: checked });
    
    toast({
      title: checked ? "Notification enabled" : "Notification disabled",
      description: `You will ${checked ? "now" : "no longer"} receive ${key.replace(/([A-Z])/g, " $1").toLowerCase()}.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="p-5 sm:p-6 rounded-2xl bg-card border border-border/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <BellRing className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Notification Preferences
            </h2>
            <p className="text-sm text-muted-foreground">
              Choose how you want to be notified
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {notificationItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-foreground">{item.title}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {item.description}
                  </p>
                </div>
              </div>
              <Switch
                checked={notifications[item.key]}
                onCheckedChange={(checked) => handleToggle(item.key, checked)}
                className="shrink-0 ml-4"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-5 sm:p-6 rounded-2xl bg-card border border-border/50">
        <h3 className="text-base font-semibold text-foreground mb-4">
          Quick Actions
        </h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => {
              const allEnabled = Object.values(notifications).every(Boolean);
              const newState: NotificationSettings = {
                emailNotifications: !allEnabled,
                fileUploads: !allEnabled,
                groupActivity: !allEnabled,
                weeklyDigest: !allEnabled,
                marketingEmails: !allEnabled,
              };
              setNotifications(newState);
              toast({
                title: allEnabled ? "All notifications disabled" : "All notifications enabled",
              });
            }}
            className="px-4 py-2 rounded-xl text-sm font-medium bg-muted/50 hover:bg-muted text-foreground transition-colors"
          >
            {Object.values(notifications).every(Boolean) ? "Disable All" : "Enable All"}
          </button>
        </div>
      </div>
    </div>
  );
}
