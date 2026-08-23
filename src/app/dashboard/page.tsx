"use client";

import AppLayout from "@/components/AppLayout";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

interface SubCardProps {
  title: string;
  count: string;
  metric?: string;
  color: string;
  icon: string;
}

const AVATAR_PRESETS = [
  {
    id: "preset-executive",
    name: "Smart Student (Default)",
    url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150&h=150"
  },
  {
    id: "preset-director",
    name: "Tech Director",
    url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150&h=150"
  },
  {
    id: "preset-lead",
    name: "Community Liaison",
    url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150&h=150"
  },
  {
    id: "preset-advocate",
    name: "Public Advocate",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150"
  }
];

// Mirror of DEFAULT_ISSUES from my-issues page — 3 active (In Progress/Under Review/Reported) + 3 resolved
const DEFAULT_ACTIVE = 3;
const DEFAULT_RESOLVED = 3;
const DEFAULT_TOTAL = DEFAULT_ACTIVE + DEFAULT_RESOLVED;

export default function DashboardPage() {
  const [profileName, setProfileName] = useState("Koushik Jha");
  const [avatarUrl, setAvatarUrl] = useState("https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150&h=150");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeReports, setActiveReports] = useState(DEFAULT_ACTIVE);
  const [resolvedReports, setResolvedReports] = useState(DEFAULT_RESOLVED);
  const [totalReports, setTotalReports] = useState(DEFAULT_TOTAL);
  const [civicPoints, setCivicPoints] = useState(1250);

  useEffect(() => {
    const updateProfile = () => {
      const storedName = localStorage.getItem("civicvoice_user_name") || "Koushik Jha";
      const storedAvatar = localStorage.getItem("civicvoice_avatar_url") || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150&h=150";

      // Read user-submitted issues from localStorage
      const storedIssues = localStorage.getItem("civicvoice_user_issues");
      let userIssues: { id: string; status?: string }[] = [];
      if (storedIssues) {
        try {
          userIssues = JSON.parse(storedIssues);
        } catch (err) {
          console.error(err);
        }
      }

      // Read deleted issue IDs (same as My Issues page)
      const storedDeleted = localStorage.getItem("civicvoice_deleted_issues");
      let deletedIds: string[] = [];
      if (storedDeleted) {
        try {
          deletedIds = JSON.parse(storedDeleted);
        } catch (err) {
          console.error(err);
        }
      }

      // Filter out deleted user issues
      const validUserIssues = userIssues.filter((i) => !deletedIds.includes(i.id));

      // Count user issues
      const userActive = validUserIssues.filter((i) => i.status !== "Resolved").length;
      const userResolved = validUserIssues.filter((i) => i.status === "Resolved").length;

      // Final counts = default baseline + user-submitted (matches My Issues exactly)
      const finalActive = DEFAULT_ACTIVE + userActive;
      const finalResolved = DEFAULT_RESOLVED + userResolved;
      const finalTotal = DEFAULT_TOTAL + validUserIssues.length;

      // Points: 1250 base + 50 per user-submitted issue (matches My Issues formula)
      const calculatedPoints = 1250 + (validUserIssues.length * 50);

      setTimeout(() => {
        setProfileName(storedName);
        setAvatarUrl(storedAvatar);
        setActiveReports(finalActive);
        setResolvedReports(finalResolved);
        setTotalReports(finalTotal);
        setCivicPoints(calculatedPoints);
      }, 0);
    };

    updateProfile();
    window.addEventListener("profile-updated", updateProfile);
    window.addEventListener("storage", updateProfile);
    return () => {
      window.removeEventListener("profile-updated", updateProfile);
      window.removeEventListener("storage", updateProfile);
    };
  }, []);

  // State for editing profile modal
  const [editName, setEditName] = useState("");
  const [editAvatar, setEditAvatar] = useState("");
  const [customUrlInput, setCustomUrlInput] = useState("");

  // Load and synchronize initial values for editing
  useEffect(() => {
    if (isEditModalOpen) {
      setTimeout(() => {
        setEditName(profileName);
        setEditAvatar(avatarUrl);
        setCustomUrlInput(avatarUrl.startsWith("data:") ? "" : avatarUrl);
      }, 0);
    }
  }, [isEditModalOpen, profileName, avatarUrl]);

  // State for quick support form
  const [issueId, setIssueId] = useState("");
  const [supportMessage, setSupportMessage] = useState("");
  const [hasSupported, setHasSupported] = useState(false);

  const handleSupport = (e: React.FormEvent) => {
    e.preventDefault();
    if (issueId.trim()) {
      setHasSupported(true);
      setTimeout(() => {
        setHasSupported(false);
        setIssueId("");
      }, 3000);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-[1200px] mx-auto animate-fade-in" style={{ paddingBottom: "40px" }}>

        <div
          className="relative overflow-hidden rounded-3xl p-6 md:p-8 mb-8 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6"
        >
          {/* Unsplash Background Image */}
          <Image
            src="https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&q=80&w=1000"
            alt="City Welcome Banner"
            fill
            className="object-cover"
            priority
            unoptimized
          />
          {/* Dark Overlay for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-stone-900/85 via-stone-900/50 to-transparent" />

          <div className="relative z-10">
            <p className="text-amber-400 text-xs font-black uppercase tracking-wider mb-1.5">
              ● Guru Govind Institutional Block · District 9
            </p>
            <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight">
              Welcome back, {profileName}
            </h1>
            <p className="text-white/90 mt-2 text-sm md:text-base max-w-xl">
              Your community profile is operating cleanly with {activeReports} active report{activeReports !== 1 ? "s" : ""} and {resolvedReports} resolved so far.
            </p>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
            <Link
              href="/report"
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-amber-900 bg-white hover:bg-amber-50 hover:scale-105 transition-all duration-300 w-full sm:w-auto"
              style={{ boxShadow: "0 4px 14px rgba(0,0,0,0.15)" }}
            >
              <span className="material-symbols-outlined icon-filled" style={{ fontSize: 18 }}>add_circle</span>
              Report Issue
            </Link>
            <Link
              href="/forum"
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white border border-white/30 bg-white/10 hover:bg-white/20 transition-all duration-300 w-full sm:w-auto"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>forum</span>
              Community Forum
            </Link>
          </div>
        </div>

        {/* ── TWO-COLUMN GRID LAYOUT (Main vs Sidebar) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── LEFT COLUMN (Main Stats & Trackers) ── */}
          <div className="lg:col-span-2 flex flex-col gap-8">

            {/* Card 1: Civic Impact Summary */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 sm:p-8">
              <div className="flex justify-between items-start gap-3 mb-6">
                <div>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Total Civic Impact</p>
                  <div className="flex items-baseline gap-3 mt-1.5">
                    <h2 className="text-3xl sm:text-4xl font-black text-gray-900">{civicPoints.toLocaleString()} Points</h2>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#BBF7D0] text-[#16A34A]">
                      +15.2% this month
                    </span>
                  </div>
                </div>
                <div className="w-12 h-12 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined icon-filled text-amber-500" style={{ fontSize: 32 }}>military_tech</span>
                </div>
              </div>

              {/* Sub cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { title: "Issues Resolved", count: `${resolvedReports} Fixed`, metric: `${totalReports} total reported`, color: "#B45309", bg: "#FEF3C7", icon: "task_alt", link: "/my-issues?tab=resolved" },
                  { title: "Polls Participated", count: "12 Voted", metric: "District active", color: "#C2410C", bg: "#FED7AA", icon: "how_to_vote", link: "/polls" },
                  { title: "Forum Upvotes", count: "180 Likes", metric: "Helpful citizen", color: "#9A3412", bg: "#FDBA74", icon: "thumb_up", link: "/forum" },
                ].map((subCard, idx) => (
                  <Link
                    href={subCard.link}
                    key={idx}
                    className="bg-[#FAF9F7] rounded-2xl p-5 border border-gray-100 flex flex-col justify-between hover:bg-stone-50 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <div>
                      <p className="text-xs text-gray-500 font-bold">{subCard.title}</p>
                      <p className="text-lg font-black text-gray-900 mt-2">{subCard.count}</p>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200/50">
                      <span className="text-[11px] text-gray-400 font-semibold">{subCard.metric}</span>
                      <div className="w-6 h-6 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined icon-filled text-[20px]" style={{ color: subCard.color }}>{subCard.icon}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Card 2: Active Cards (Fintech-like pass/ID style) */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">Active Civic Passes</h3>
                <span className="text-xs text-amber-600 font-bold hover:underline cursor-pointer">Manage Passes</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Civic Member Pass Card */}
                <div
                  className="rounded-3xl p-6 text-white relative overflow-hidden flex flex-col justify-between"
                  style={{
                    height: 200,
                    background: "linear-gradient(135deg, #b45309 0%, #d97706 50%, #f59e0b 100%)",
                    boxShadow: "0 10px 25px rgba(217,119,6,0.25)"
                  }}
                >
                  <div className="flex justify-between items-start z-10">
                    <div>
                      <p className="text-[10px] text-orange-200/75 uppercase tracking-widest font-black">CivicVoice Member Pass</p>
                      <p className="text-sm font-extrabold mt-1">District 9 Leadership</p>
                    </div>
                    <span className="material-symbols-outlined text-amber-400" style={{ fontSize: 28 }}>verified_user</span>
                  </div>
                  <div className="z-10 mt-6">
                    <p className="text-xs text-orange-200/75 tracking-widest">MEMBER ID</p>
                    <p className="text-lg font-bold tracking-widest mt-1">CV-902-882-KJ</p>
                  </div>
                  <div className="flex justify-between items-end z-10">
                    <div>
                      <p className="text-[9px] text-orange-200/60">HOLDER</p>
                      <p className="text-xs font-bold">{profileName.toUpperCase()}</p>
                    </div>
                  </div>
                  {/* Subtle Background Pattern */}
                  <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px]" />
                </div>

                {/* Subpass or secondary information card */}
                <div className="bg-amber-50/60 rounded-3xl border border-amber-100 shadow-sm p-6 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full font-bold uppercase">
                        Active Badge
                      </span>
                      <h4 className="text-base font-bold text-gray-900 mt-2">District Leader Badge</h4>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined icon-filled text-amber-500" style={{ fontSize: 20 }}>military_tech</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed mt-2">
                    Awarded for maintaining top 50 rank in civic points contribution inside District 9.
                  </p>
                  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
                    <span className="text-[11px] text-gray-400 font-bold">Active in Local Councils</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Savings Tracker (Civic Project Progress Bars) */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-lg font-bold text-gray-900">Neighborhood Projects Status</h3>
                <Link href="/map" className="text-xs text-amber-600 font-bold hover:underline">View Map Projects</Link>
              </div>
              <div className="flex flex-col gap-5">
                {[
                  { label: "Main Street Bike Lane Construction", progress: 70, target: "Est Completion: Sept 10", status: "Ahead of schedule" },
                  { label: "Riverside Walk Cleanup & Waste Bins", progress: 42, target: "Est Completion: Sept 18", status: "On track" },
                  { label: "District 9 School Area Speed Bump Installation", progress: 90, target: "Est Completion: Aug 28", status: "Almost completed" }
                ].map((project, idx) => (
                  <div key={idx} className="flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-bold text-gray-800 leading-snug">{project.label}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{project.target}</p>
                      </div>
                      <span className="text-xs font-bold text-amber-600">{project.progress}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden relative">
                      <div
                        className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-500"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      <span>{project.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ── RIGHT COLUMN (Fintech Sidebar widgets) ── */}
          <div className="flex flex-col gap-8">



            {/* Widget 1: Instant P2P Transfer (Fintech Form adapted to Civic Issue Support) */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-600 text-[22px]">bolt</span>
                Quick Issue Support
              </h3>
              <p className="text-xs text-gray-500 mb-5 leading-relaxed">
                Directly support local reports to speed up their allocation. Enter the Issue ID below.
              </p>

              <form onSubmit={handleSupport} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Issue Reference / ID</label>
                  <input
                    value={issueId}
                    onChange={(e) => setIssueId(e.target.value)}
                    required
                    placeholder="e.g. #902-ROAD, #882-LIGHT"
                    className="w-full px-4 py-3 rounded-xl border border-orange-100 bg-orange-50/40 text-sm focus:outline-none focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30"
                    style={{ fontSize: 13 }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Support Message (Optional)</label>
                  <textarea
                    value={supportMessage}
                    onChange={(e) => setSupportMessage(e.target.value)}
                    placeholder="e.g. Strongly support fixing this pothole before rains."
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border border-orange-100 bg-orange-50/40 text-sm focus:outline-none focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 resize-none"
                    style={{ fontSize: 13 }}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-white text-sm transition-all shadow-md flex items-center justify-center gap-2"
                  style={{
                    background: "linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)",
                    boxShadow: "0 3px 10px rgba(217,119,6,0.25)"
                  }}
                >
                  <span className="material-symbols-outlined icon-filled" style={{ fontSize: 16 }}>bolt</span>
                  {hasSupported ? "Supported Successfully!" : "Support Issue Instantly"}
                </button>
              </form>
              <p className="text-[10px] text-gray-400 text-center mt-3">
                Protected by CivicVoice 256-bit Community Integrity
              </p>
            </div>

            {/* Widget 2: Active Chores & Tasks (Fintech list adapted to Community Tasks) */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">Active Tasks & Missions</h3>
                <Link href="/rewards" className="text-xs text-amber-600 font-bold hover:underline">View All</Link>
              </div>
              <div className="flex flex-col gap-4.5">
                {[
                  { title: "Maintain 100% Voting Rate", reward: "+200 Points", tag: "IN PROGRESS", tagColor: "bg-orange-50 text-orange-700 border-orange-200", accent: "#D97706" },
                  { title: "Clean & Organize Riverside Cleanup", reward: "+500 Points", tag: "PENDING ALLOCATION", tagColor: "bg-amber-50 text-amber-700 border-amber-200", accent: "#C2410C" },
                  { title: "Report 1 Verified Hazards in D9", reward: "+150 Points", tag: "COMPLETED", tagColor: "bg-orange-100 text-orange-800 border-orange-300", accent: "#FBBF24" }
                ].map((task, idx) => (
                  <div key={idx} className="flex flex-col gap-2 p-3 bg-[#FAF9F7] rounded-2xl border border-gray-100/50 border-l-4" style={{ borderLeftColor: task.accent }}>
                    <div className="flex justify-between items-start gap-2">
                      <p className="text-xs font-bold text-gray-800 leading-snug">{task.title}</p>
                      <span className="text-xs font-black text-amber-600 shrink-0">{task.reward}</span>
                    </div>
                    <div className="flex items-center mt-1">
                      <span
                        className={`text-[9px] font-black border px-2 py-0.5 rounded-full ${task.tagColor}`}
                      >
                        {task.tag}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* ── PROFILE EDIT MODAL ── */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-black text-stone-900">Edit Profile</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 text-stone-400 hover:text-stone-600 transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Content (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Profile Image Preview & File Upload */}
              <div className="flex flex-col items-center gap-3">
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-amber-100 shadow-inner">
                  <Image
                    src={editAvatar}
                    alt="Preview"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>

                {/* Upload Button */}
                <label className="cursor-pointer px-4 py-1.5 rounded-lg border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold text-xs transition-colors flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px]">upload</span>
                  Upload Custom Photo
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          if (typeof reader.result === "string") {
                            setEditAvatar(reader.result);
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>

              {/* Name Input */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-sm text-stone-800"
                  placeholder="e.g. Koushik Jha"
                  required
                />
              </div>

              {/* Unsplash Presets */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-2">Professional Presets (Unsplash)</label>
                <div className="grid grid-cols-4 gap-3">
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
                        className={`group relative aspect-square rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${isSelected ? "border-amber-500 scale-95 ring-4 ring-amber-500/10" : "border-gray-200 hover:border-gray-300"
                          }`}
                        title={preset.name}
                      >
                        <Image
                          src={preset.url}
                          alt={preset.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-amber-500/20 flex items-center justify-center">
                            <span className="material-symbols-outlined text-white text-[16px] font-bold">check</span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Image URL */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1.5">Or Paste Custom Image URL</label>
                <input
                  type="url"
                  value={customUrlInput}
                  onChange={(e) => {
                    setCustomUrlInput(e.target.value);
                    if (e.target.value.trim()) {
                      setEditAvatar(e.target.value.trim());
                    }
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-sm text-stone-800"
                  placeholder="https://images.unsplash.com/photo-..."
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-100 text-stone-600 font-bold text-sm transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  localStorage.setItem("civicvoice_user_name", editName.trim() || "Koushik Jha");
                  localStorage.setItem("civicvoice_avatar_url", editAvatar || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150&h=150");
                  window.dispatchEvent(new Event("profile-updated"));
                  setIsEditModalOpen(false);
                }}
                className="px-5 py-2.5 rounded-xl text-white font-bold text-sm transition-all shadow-md cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)",
                  boxShadow: "0 3px 8px rgba(245,158,11,0.2)"
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
