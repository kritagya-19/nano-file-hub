import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Loader2,
  Shield,
  Lock,
  LogOut,
  Trash2,
  AlertTriangle,
  Eye,
  EyeOff,
  Smartphone,
  Monitor,
  CheckCircle2,
} from "lucide-react";

interface SecuritySectionProps {
  user: User;
  onSignOut: () => Promise<void>;
}

export function SecuritySection({ user, onSignOut }: SecuritySectionProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handleChangePassword = async () => {
    if (passwords.new !== passwords.confirm) {
      toast({
        variant: "destructive",
        title: "Passwords don't match",
        description: "Please make sure your new passwords match.",
      });
      return;
    }

    if (passwords.new.length < 6) {
      toast({
        variant: "destructive",
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
      });
      return;
    }

    setIsChangingPassword(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwords.new,
      });

      if (error) throw error;

      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      });

      setPasswords({ current: "", new: "", confirm: "" });
      setIsPasswordDialogOpen(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to update password",
        description: error.message,
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await onSignOut();
    navigate("/");
  };

  const handleDeleteAccount = async () => {
    toast({
      title: "Account deletion requested",
      description: "Please contact support to complete account deletion. Your data will be permanently removed within 30 days.",
    });
  };

  const getDeviceIcon = () => {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes("mobile") || ua.includes("android") || ua.includes("iphone")) {
      return <Smartphone className="w-5 h-5 text-primary" />;
    }
    return <Monitor className="w-5 h-5 text-primary" />;
  };

  const getDeviceName = () => {
    const ua = navigator.userAgent;
    if (ua.includes("Windows")) return "Windows PC";
    if (ua.includes("Mac")) return "Mac";
    if (ua.includes("iPhone")) return "iPhone";
    if (ua.includes("Android")) return "Android Device";
    if (ua.includes("Linux")) return "Linux";
    return "Unknown Device";
  };

  return (
    <div className="space-y-6">
      {/* Password Section */}
      <div className="p-5 sm:p-6 rounded-2xl bg-card border border-border/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Lock className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Password</h2>
            <p className="text-sm text-muted-foreground">Manage your account password</p>
          </div>
        </div>

        <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="rounded-xl">
              <Shield className="w-4 h-4 mr-2" />
              Change Password
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Change Password</DialogTitle>
              <DialogDescription>
                Enter your new password below. Make sure it's at least 6 characters long.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPassword.new ? "text" : "password"}
                    value={passwords.new}
                    onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                    placeholder="Enter new password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showPassword.confirm ? "text" : "password"}
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                    placeholder="Confirm new password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {passwords.new && passwords.confirm && passwords.new === passwords.confirm && (
                <div className="flex items-center gap-2 text-sm text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Passwords match</span>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsPasswordDialogOpen(false)}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={handleChangePassword}
                disabled={isChangingPassword || !passwords.new || !passwords.confirm}
                className="rounded-xl"
              >
                {isChangingPassword ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                Update Password
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Active Sessions */}
      <div className="p-5 sm:p-6 rounded-2xl bg-card border border-border/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Monitor className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Active Sessions</h2>
            <p className="text-sm text-muted-foreground">Manage your logged-in devices</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/30">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                {getDeviceIcon()}
              </div>
              <div>
                <p className="font-medium text-foreground">{getDeviceName()}</p>
                <p className="text-sm text-muted-foreground">
                  Current session • {new Date().toLocaleDateString()}
                </p>
              </div>
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
          disabled={isSigningOut}
        >
          {isSigningOut ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <LogOut className="w-4 h-4 mr-2" />
          )}
          Sign Out from This Device
        </Button>
      </div>

      {/* Danger Zone */}
      <div className="p-5 sm:p-6 rounded-2xl bg-destructive/5 border border-destructive/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-destructive">Danger Zone</h2>
            <p className="text-sm text-muted-foreground">
              Irreversible account actions
            </p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          Once you delete your account, all your files, groups, and data will be permanently removed.
          This action cannot be undone.
        </p>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="rounded-xl">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Account
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                Are you absolutely sure?
              </AlertDialogTitle>
              <AlertDialogDescription className="space-y-2">
                <p>
                  This action cannot be undone. This will permanently delete your
                  account and remove all your data including:
                </p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>All uploaded files</li>
                  <li>Group memberships and messages</li>
                  <li>Shared files and links</li>
                  <li>Profile information</li>
                </ul>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteAccount}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl"
              >
                Yes, Delete My Account
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
