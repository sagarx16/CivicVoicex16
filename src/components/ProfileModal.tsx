"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AVATAR_PRESETS = [
  {
    id: "preset-student",
    name: "Smart Student",
    url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150&h=150",
  },
  {
    id: "preset-director",
    name: "Tech Director",
    url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150&h=150",
  },
  {
    id: "preset-lead",
    name: "Community Liaison",
    url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150&h=150",
  },
  {
    id: "preset-advocate",
    name: "Public Advocate",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150",
  },
  {
    id: "preset-innovator",
    name: "Civic Innovator",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150",
  },
  {
    id: "preset-volunteer",
    name: "Youth Volunteer",
    url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150",
  },
];

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const router = useRouter();
  const { user } = useUser();
  const { signOut } = useClerk();
  const [profileName, setProfileName] = useState("Sagar Pathak");
  const [avatarUrl, setAvatarUrl] = useState(AVATAR_PRESETS[0].url);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editAvatar, setEditAvatar] = useState("");
  const [customUrlInput, setCustomUrlInput] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync profile data from localStorage
  useEffect(() => {
    const syncProfile = () => {
      const storedName = localStorage.getItem("civicvoice_user_name") || "Sagar Pathak";
      const storedAvatar = localStorage.getItem("civicvoice_avatar_url") || AVATAR_PRESETS[0].url;
      setProfileName(storedName);
      setAvatarUrl(storedAvatar);
    };

    syncProfile();
    window.addEventListener("profile-updated", syncProfile);
    return () => window.removeEventListener("profile-updated", syncProfile);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = editName.trim() || "Sagar Pathak";
    const finalAvatar = editAvatar || AVATAR_PRESETS[0].url;

    localStorage.setItem("civicvoice_user_name", finalName);
    localStorage.setItem("civicvoice_avatar_url", finalAvatar);
    window.dispatchEvent(new Event("profile-updated"));

    setProfileName(finalName);
    setAvatarUrl(finalAvatar);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsEditing(false);
    }, 1200);
  };

  const handleToggleEdit = () => {
    if (!isEditing) {
      setEditName(profileName);
      setEditAvatar(avatarUrl);
      setCustomUrlInput(avatarUrl.startsWith("data:") ? "" : avatarUrl);
      setSavedSuccess(false);
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }
  };

  const handleLogout = async () => {
    onClose();
    await signOut(() => router.push("/"));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Profile Card Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">

        {/* Banner Header with Gradient */}
        <div className="relative h-28 sm:h-32 bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 p-4 sm:p-5 flex items-start justify-between">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/20 backdrop-blur-md text-white text-xs font-bold border border-white/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Active Citizen · District 9</span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/25 hover:bg-black/40 text-white flex items-center justify-center transition-colors focus:outline-none"
            aria-label="Close profile"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Profile Content Body */}
        <div className="px-5 sm:px-6 pb-6 pt-0 relative">

          {/* Avatar Section & Action Button */}
          <div className="flex items-end justify-between -mt-12 sm:-mt-14 mb-4">
            <div className="relative group">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-white shadow-lg bg-stone-100">
                <Image
                  src={user?.imageUrl || avatarUrl}
                  alt={user?.fullName || profileName}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <button
                type="button"
                onClick={handleToggleEdit}
                className="absolute bottom-0 right-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-500 hover:bg-amber-600 text-white border-2 border-white shadow-md flex items-center justify-center transition-transform hover:scale-105"
                title="Change Photo / Edit"
              >
                <span className="material-symbols-outlined text-[16px] sm:text-[18px]">
                  {isEditing ? "close" : "photo_camera"}
                </span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleEdit}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 border ${isEditing
                    ? "bg-stone-100 text-stone-700 border-stone-300"
                    : "bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100"
                  }`}
              >
                <span className="material-symbols-outlined text-[15px]">
                  {isEditing ? "visibility" : "edit"}
                </span>
                <span>{isEditing ? "View Profile" : "Edit Profile"}</span>
              </button>

              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-full text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors flex items-center gap-1"
                title="Sign out"
              >
                <span className="material-symbols-outlined text-[15px]">logout</span>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>

          {/* User Name & Details */}
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                {user?.fullName || user?.firstName || profileName}
              </h2>
              <span
                className="material-symbols-outlined text-amber-500 text-[20px] icon-filled"
                title="Verified Citizen Representative"
              >
                verified
              </span>
            </div>
            <p className="text-xs text-stone-500 font-medium mt-0.5">
              {user?.primaryEmailAddress?.emailAddress
                ? `${user.primaryEmailAddress.emailAddress} · District 9 Active Representative`
                : "District 9 Active Representative · Ward 14"}
            </p>
          </div>

          {/* ── EDIT PROFILE FORM (Shown when editing) ── */}
          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="mt-5 pt-4 border-t border-stone-200 flex flex-col gap-4 animate-in fade-in duration-150">
              {savedSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  <span>Profile updated successfully!</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Choose Avatar Preset
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                  {AVATAR_PRESETS.map((preset) => {
                    const isSelected = editAvatar === preset.url;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          setEditAvatar(preset.url);
                          setCustomUrlInput(preset.url);
                        }}
                        className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all group ${isSelected
                            ? "border-amber-500 ring-4 ring-amber-500/20 scale-95"
                            : "border-stone-200 hover:border-amber-300"
                          }`}
                        title={preset.name}
                      >
                        <Image
                          src={preset.url}
                          alt={preset.name}
                          fill
                          className="object-cover"
                          loading="lazy"
                          unoptimized
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-amber-600/30 flex items-center justify-center">
                            <span className="material-symbols-outlined text-white text-[18px] font-bold">
                              check
                            </span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Or Custom Image URL
                </label>
                <input
                  type="url"
                  value={customUrlInput}
                  onChange={(e) => {
                    setCustomUrlInput(e.target.value);
                    if (e.target.value.trim()) {
                      setEditAvatar(e.target.value.trim());
                    }
                  }}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-xs focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-md shadow-amber-500/20 transition-all active:scale-[0.98]"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            /* ── VIEW PROFILE DETAILS & STATS ── */
            <div className="mt-5 space-y-4">

              {/* Civic Impact Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-100 text-center">
                  <div className="flex items-center justify-center text-amber-600 mb-1">
                    <span className="material-symbols-outlined text-[20px] icon-filled">
                      military_tech
                    </span>
                  </div>
                  <span className="text-base sm:text-lg font-black text-stone-900 block leading-tight">
                    1,250
                  </span>
                  <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">
                    Points
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-100 text-center">
                  <div className="flex items-center justify-center text-blue-600 mb-1">
                    <span className="material-symbols-outlined text-[20px] icon-filled">
                      leaderboard
                    </span>
                  </div>
                  <span className="text-base sm:text-lg font-black text-stone-900 block leading-tight">
                    #42
                  </span>
                  <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">
                    District Rank
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-center">
                  <div className="flex items-center justify-center text-emerald-600 mb-1">
                    <span className="material-symbols-outlined text-[20px] icon-filled">
                      task_alt
                    </span>
                  </div>
                  <span className="text-base sm:text-lg font-black text-stone-900 block leading-tight">
                    18
                  </span>
                  <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">
                    Reports Filed
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-purple-50/70 border border-purple-100 text-center">
                  <div className="flex items-center justify-center text-purple-600 mb-1">
                    <span className="material-symbols-outlined text-[20px] icon-filled">
                      how_to_vote
                    </span>
                  </div>
                  <span className="text-base sm:text-lg font-black text-stone-900 block leading-tight">
                    12
                  </span>
                  <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">
                    Polls Voted
                  </span>
                </div>
              </div>

              {/* Quick Navigation Links */}
              <div className="pt-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-2 px-1">
                  Quick Actions
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/dashboard"
                    onClick={onClose}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl bg-stone-50 hover:bg-amber-50 hover:text-amber-700 border border-stone-200 transition-colors group"
                  >
                    <span className="material-symbols-outlined text-stone-500 group-hover:text-amber-600 text-[18px]">
                      dashboard
                    </span>
                    <span className="text-xs font-bold text-stone-800 group-hover:text-amber-700">
                      Dashboard
                    </span>
                  </Link>

                  <Link
                    href="/report"
                    onClick={onClose}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl bg-stone-50 hover:bg-red-50 hover:text-red-700 border border-stone-200 transition-colors group"
                  >
                    <span className="material-symbols-outlined text-stone-500 group-hover:text-red-600 text-[18px]">
                      report_problem
                    </span>
                    <span className="text-xs font-bold text-stone-800 group-hover:text-red-700">
                      Report Issue
                    </span>
                  </Link>

                  <Link
                    href="/rewards"
                    onClick={onClose}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl bg-stone-50 hover:bg-amber-50 hover:text-amber-700 border border-stone-200 transition-colors group"
                  >
                    <span className="material-symbols-outlined text-stone-500 group-hover:text-amber-600 text-[18px]">
                      military_tech
                    </span>
                    <span className="text-xs font-bold text-stone-800 group-hover:text-amber-700">
                      Rewards & Badges
                    </span>
                  </Link>

                  <Link
                    href="/notifications"
                    onClick={onClose}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl bg-stone-50 hover:bg-pink-50 hover:text-pink-700 border border-stone-200 transition-colors group"
                  >
                    <span className="material-symbols-outlined text-stone-500 group-hover:text-pink-600 text-[18px]">
                      notifications
                    </span>
                    <span className="text-xs font-bold text-stone-800 group-hover:text-pink-700">
                      Notifications
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
