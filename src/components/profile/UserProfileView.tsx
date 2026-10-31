"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Camera,
  Upload,
  User,
  AtSign,
  Mail,
  Phone,
  MapPin,
  FileText,
  Shield,
  Save,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { updateProfile, updateAvatar } from "@/redux/features/auth/authSlice";
import { useUpdateUserMutation } from "@/redux/features/auth/authApi";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const PRESET_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
];

export function UserProfileView() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [updateUserBackend] = useUpdateUserMutation();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states initialized from Redux user
  const [name, setName] = useState(user?.name || "");
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [avatarPreview, setAvatarPreview] = useState(user?.avatarUrl || "");
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Sync form when redux user state updates
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setUsername(user.username || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setAddress(user.address || "");
      setBio(user.bio || "");
      setAvatarPreview(user.avatarUrl || "");
    }
  }, [user]);

  // Handle image upload from file picker
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (PNG, JPG, WEBP)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file size should be less than 5MB");
      return;
    }

    setIsUploading(true);

    try {
      // 1. Instant local base64 preview
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Result = reader.result as string;
        setAvatarPreview(base64Result);
        dispatch(updateAvatar(base64Result));

        // 2. Try upload to backend if available
        try {
          const formData = new FormData();
          formData.append("file", file);
          const res = await fetch("http://localhost:5000/api/upload/image", {
            method: "POST",
            body: formData,
          });
          const data = await res.json();
          if (data?.url) {
            setAvatarPreview(data.url);
            dispatch(updateAvatar(data.url));
          }
        } catch {
          // Graceful fallback to persistent base64 if backend is not started
        }

        setIsUploading(false);
        toast.success("Profile photo updated successfully!", {
          icon: "📸",
        });
      };
      reader.readAsDataURL(file);
    } catch {
      setIsUploading(false);
      toast.error("Failed to process image");
    }
  };

  const handleSelectPreset = (url: string) => {
    setAvatarPreview(url);
    dispatch(updateAvatar(url));
    toast.success("Preset avatar applied!");
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanName = name.trim();
    const cleanUsername = username.trim().toLowerCase().replace(/^@/, "");
    const cleanEmail = email.trim();
    const cleanPhone = phone.trim();
    const cleanAddress = address.trim();
    const cleanBio = bio.trim();

    if (!cleanName) {
      toast.error("Name cannot be empty");
      return;
    }

    if (!cleanUsername) {
      toast.error("Username cannot be empty");
      return;
    }

    if (cleanUsername.length < 3) {
      toast.error("Username must be at least 3 characters");
      return;
    }

    if (!cleanEmail) {
      toast.error("Email cannot be empty");
      return;
    }

    setIsSaving(true);

    try {
      // 1. Update Redux store immediately
      dispatch(
        updateProfile({
          name: cleanName,
          username: cleanUsername,
          email: cleanEmail,
          phone: cleanPhone,
          address: cleanAddress,
          bio: cleanBio,
          avatarUrl: avatarPreview,
        })
      );

      // 2. Persist to backend if user id exists
      if (user?.id) {
        try {
          await updateUserBackend({
            id: user.id,
            data: {
              name: cleanName,
              username: cleanUsername,
              email: cleanEmail,
              phone: cleanPhone,
              address: cleanAddress,
              image: avatarPreview,
            },
          }).unwrap();
        } catch {
          // backend update fallback
        }
      }

      toast.success("Profile information updated successfully!", {
        icon: "✨",
      });
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setName(user?.name || "");
    setUsername(user?.username || "");
    setEmail(user?.email || "");
    setPhone(user?.phone || "");
    setAddress(user?.address || "");
    setBio(user?.bio || "");
    setAvatarPreview(user?.avatarUrl || "");
    toast("Form reset to saved values");
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex flex-col gap-6 max-w-5xl mx-auto w-full">
      {/* 1. Header Banner & Profile Card */}
      <Card className="relative overflow-hidden p-0 border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#151C2C] shadow-sm">
        {/* Decorative Top Banner */}
        <div className="h-32 sm:h-40 w-full bg-gradient-to-r from-[#6E00FF] via-indigo-600 to-purple-800 relative">
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <Badge variant="purple" className="bg-white/20 text-white backdrop-blur-md">
              <Shield className="w-3 h-3 mr-1" /> {user?.role || "USER"}
            </Badge>
          </div>
        </div>

        {/* Profile Details Bar */}
        <div className="px-6 pb-6 pt-0 relative flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-14 sm:-mt-16">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4">
            {/* Avatar with Camera Button */}
            <div className="relative group">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden ring-4 ring-white dark:ring-[#151C2C] shadow-lg bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt={name || "Profile"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#6E00FF] to-indigo-600 flex items-center justify-center text-white text-3xl font-extrabold uppercase">
                    {name?.charAt(0) || "U"}
                  </div>
                )}
              </div>

              {/* Upload Overlay Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                title="Upload photo"
                className="absolute inset-0 bg-black/40 text-white rounded-3xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer backdrop-blur-[2px]"
              >
                <Camera className="w-6 h-6" />
                <span className="text-[11px] font-semibold">Change</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="sm:hidden absolute bottom-0 right-0 p-2 rounded-full bg-[#6E00FF] text-white shadow-md"
              >
                <Camera className="w-4 h-4" />
              </button>

              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/png, image/jpeg, image/jpg, image/webp"
                className="hidden"
              />
            </div>

            {/* Name, Username & Basic Title */}
            <div className="text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center justify-center sm:justify-start gap-2">
                {name || "User Name"}
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              </h2>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-1">
                {username && (
                  <span className="text-xs font-mono font-semibold text-[#6E00FF] bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded-md border border-purple-200/50 dark:border-purple-800/50">
                    @{username.replace(/^@/, "")}
                  </span>
                )}
                <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  {email}
                </span>
              </div>
              {bio && (
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-1.5 max-w-md">
                  {bio}
                </p>
              )}
            </div>
          </div>

          {/* Quick upload button */}
          <div className="flex justify-center sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="rounded-xl gap-2 text-xs font-semibold border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              {isUploading ? "Uploading..." : "Upload New Photo"}
            </Button>
          </div>
        </div>
      </Card>

      {/* 2. Preset Avatars Selector */}
      <Card className="p-5 border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#151C2C]">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-[#6E00FF]" />
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Or Choose a Ready Avatar
          </h4>
        </div>
        <div className="flex items-center gap-3 overflow-x-auto pb-1">
          {PRESET_AVATARS.map((url, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectPreset(url)}
              className={`w-12 h-12 rounded-2xl overflow-hidden shrink-0 transition-all border-2 cursor-pointer ${
                avatarPreview === url
                  ? "border-[#6E00FF] scale-105 shadow-md"
                  : "border-transparent opacity-75 hover:opacity-100 hover:border-slate-300"
              }`}
            >
              <img src={url} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </Card>

      {/* 3. Personal Information Form */}
      <Card className="p-6 border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#151C2C]">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-[#6E00FF] flex items-center justify-center">
              <User className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">
                Personal Information
              </h3>
              <p className="text-xs text-slate-400">
                Update your identity, username, contact details and chat profile
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="flex flex-col gap-5">
          {/* Row 1: Full Name & Username */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" /> Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6E00FF]/40 focus:border-[#6E00FF] transition-all"
              />
            </div>

            {/* Username */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <AtSign className="w-3.5 h-3.5 text-slate-400" /> Username <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#6E00FF] select-none font-mono">
                  @
                </span>
                <input
                  type="text"
                  required
                  value={username.replace(/^@/, "")}
                  onChange={(e) =>
                    setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9._-]/g, ""))
                  }
                  placeholder="unique_username"
                  className="w-full h-11 pl-8 pr-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900 text-sm font-mono text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6E00FF]/40 focus:border-[#6E00FF] transition-all"
                />
              </div>
            </div>
          </div>

          {/* Row 2: Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Email Address */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" /> Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6E00FF]/40 focus:border-[#6E00FF] transition-all"
              />
            </div>

            {/* Phone Number */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" /> Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+880 1..."
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6E00FF]/40 focus:border-[#6E00FF] transition-all"
              />
            </div>
          </div>

          {/* Row 3: Address / Location */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" /> Location / Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="City, Country"
              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6E00FF]/40 focus:border-[#6E00FF] transition-all"
            />
          </div>

          {/* About / Bio */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" /> Bio / Status Message
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell others a little bit about yourself or your chat status..."
              className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6E00FF]/40 focus:border-[#6E00FF] transition-all resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              disabled={isSaving}
              onClick={handleReset}
              className="h-10 px-4 rounded-xl text-xs gap-1.5 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </Button>

            <Button
              type="submit"
              disabled={isSaving}
              className="h-10 px-6 rounded-xl bg-[#6E00FF] hover:bg-[#5b00d6] text-white text-xs font-bold gap-2 shadow-md shadow-[#6E00FF]/25 cursor-pointer"
            >
              {isSaving ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" /> Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

