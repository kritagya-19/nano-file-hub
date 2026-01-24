import { useState, useRef } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2,
  User as UserIcon,
  Save,
  Camera,
  AtSign,
  Mail,
  Trash2,
} from "lucide-react";

interface ProfileData {
  full_name: string;
  username: string;
  email: string;
  avatar_url: string;
}

interface ProfileSectionProps {
  user: User;
  profileData: ProfileData;
  setProfileData: (data: ProfileData) => void;
}

export function ProfileSection({ user, profileData, setProfileData }: ProfileSectionProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload an image file (JPG, PNG, GIF).",
      });
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Please upload an image smaller than 2MB.",
      });
      return;
    }

    setIsUploadingAvatar(true);

    try {
      // Create a unique file path
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      // Add cache buster to force refresh
      const avatarUrl = `${publicUrl}?t=${Date.now()}`;

      // Update profile in database
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: avatarUrl })
        .eq("id", user.id);

      if (updateError) throw updateError;

      setProfileData({ ...profileData, avatar_url: avatarUrl });

      toast({
        title: "Avatar updated",
        description: "Your profile photo has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message || "Failed to upload avatar.",
      });
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveAvatar = async () => {
    if (!user) return;

    setIsUploadingAvatar(true);
    try {
      // List and delete files in user's avatar folder
      const { data: files } = await supabase.storage
        .from("avatars")
        .list(user.id);

      if (files && files.length > 0) {
        const filesToDelete = files.map((file) => `${user.id}/${file.name}`);
        await supabase.storage.from("avatars").remove(filesToDelete);
      }

      // Update profile
      const { error } = await supabase
        .from("profiles")
        .update({ avatar_url: null })
        .eq("id", user.id);

      if (error) throw error;

      setProfileData({ ...profileData, avatar_url: "" });

      toast({
        title: "Avatar removed",
        description: "Your profile photo has been removed.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to remove avatar",
        description: error.message,
      });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: profileData.full_name,
          username: profileData.username,
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

  const getInitials = () => {
    if (profileData.full_name) {
      return profileData.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return user.email?.[0]?.toUpperCase() || "U";
  };

  return (
    <div className="space-y-6">
      {/* Avatar Section */}
      <div className="p-5 sm:p-6 rounded-2xl bg-card border border-border/50">
        <h2 className="text-lg font-semibold text-foreground mb-6">Profile Photo</h2>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative group">
            <Avatar className="w-24 h-24 sm:w-28 sm:h-28 border-4 border-primary/10">
              <AvatarImage src={profileData.avatar_url} alt="Profile" />
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-2xl sm:text-3xl font-bold">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            
            {isUploadingAvatar && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-full">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            )}
          </div>

          <div className="flex flex-col items-center sm:items-start gap-3">
            <div className="text-center sm:text-left">
              <p className="font-medium text-foreground">Profile Photo</p>
              <p className="text-sm text-muted-foreground">
                JPG, PNG or GIF. Max 2MB.
              </p>
            </div>
            
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingAvatar}
                className="rounded-xl"
              >
                <Camera className="w-4 h-4 mr-2" />
                Upload
              </Button>
              {profileData.avatar_url && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveAvatar}
                  disabled={isUploadingAvatar}
                  className="rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Info Section */}
      <div className="p-5 sm:p-6 rounded-2xl bg-card border border-border/50">
        <h2 className="text-lg font-semibold text-foreground mb-6">
          Personal Information
        </h2>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-sm font-medium">
              Full Name
            </Label>
            <div className="relative">
              <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="fullName"
                value={profileData.full_name}
                onChange={(e) =>
                  setProfileData({ ...profileData, full_name: e.target.value })
                }
                className="pl-10 h-11 rounded-xl"
                placeholder="Enter your full name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-medium">
              Username
            </Label>
            <div className="relative">
              <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="username"
                value={profileData.username}
                onChange={(e) =>
                  setProfileData({ ...profileData, username: e.target.value })
                }
                className="pl-10 h-11 rounded-xl"
                placeholder="Choose a username"
              />
            </div>
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                value={profileData.email}
                disabled
                className="pl-10 h-11 rounded-xl bg-muted/50"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Email cannot be changed. Contact support for assistance.
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
  );
}
