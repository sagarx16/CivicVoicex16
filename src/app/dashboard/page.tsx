"use client";

import AppLayout from "@/components/AppLayout";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

export default function DashboardPage() {
  const { user } = useUser();
  const [profileName, setProfileName] = useState("Sagar Pathak");
  const displayName = user?.fullName || user?.firstName || profileName;

  useEffect(() => {
    const updateProfile = () => {
      const storedName = localStorage.getItem("civicvoice_user_name") || "Sagar Pathak";
      setProfileName(storedName);
    };

    updateProfile();
    window.addEventListener("profile-updated", updateProfile);
    return () => window.removeEventListener("profile-updated", updateProfile);
  }, []);

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
          className="relative overflow-hidden rounded-3xl p-8 mb-8 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6"
        >
          {/* Unsplash Background Image */}
          <Image
            src="https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&q=80&w=1000"
            alt="City Welcome Banner"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1200px) 100vw, 1200px"
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
              Your community profile is operating cleanly with 3 active reports and 2 pending polls.
            </p>
          </div>

          <div className="relative z-10 flex gap-3 shrink-0">
            <Link
              href="/report"
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-amber-900 bg-white hover:bg-amber-50 hover:scale-105 transition-all duration-300"
              style={{ boxShadow: "0 4px 14px rgba(0,0,0,0.15)" }}
            >
              <span className="material-symbols-outlined icon-filled" style={{ fontSize: 18 }}>add_circle</span>
              Report Issue
            </Link>
            <Link
              href="/forum"
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white border border-white/30 bg-white/10 hover:bg-white/20 transition-all duration-300"
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
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-4 sm:p-7 md:p-8">
              <div className="flex items-start justify-between gap-3 mb-5 sm:mb-6">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="text-gray-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                      Total Civic Impact
                    </p>
                    <span className="text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full bg-[#BBF7D0] text-[#16A34A] inline-flex items-center gap-1 shrink-0">
                      <span className="material-symbols-outlined text-[13px] font-bold">trending_up</span>
                      +15.2% this month
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight leading-tight flex items-baseline gap-1.5 sm:gap-2">
                    <span>1,250</span>
                    <span className="text-base sm:text-2xl font-bold text-amber-600">Points</span>
                  </h2>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-50 border border-amber-200/70 flex items-center justify-center shrink-0 shadow-xs">
                  <span className="material-symbols-outlined icon-filled text-amber-500 text-[24px] sm:text-[30px]">military_tech</span>
                </div>
              </div>

              {/* Sub cards: 3-column compact KPI grid on mobile, spacious on tablet/desktop */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                {[
                  { title: "Issues Resolved", shortTitle: "Issues", count: "3 Fixed", metric: "100% rate", color: "#B45309", bg: "#FEF3C7", icon: "task_alt" },
                  { title: "Polls Participated", shortTitle: "Polls", count: "12 Voted", metric: "District active", color: "#C2410C", bg: "#FED7AA", icon: "how_to_vote" },
                  { title: "Forum Upvotes", shortTitle: "Upvotes", count: "180 Likes", metric: "Helpful citizen", color: "#9A3412", bg: "#FDBA74", icon: "thumb_up" },
                ].map((subCard, idx) => (
                  <div 
                    key={idx} 
                    className="bg-[#FAF9F7] rounded-2xl p-2.5 sm:p-5 border border-gray-100 flex flex-col justify-between hover:bg-amber-50/40 transition-colors"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div 
                          className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0" 
                          style={{ backgroundColor: subCard.bg }}
                        >
                          <span className="material-symbols-outlined icon-filled text-[16px] sm:text-[20px]" style={{ color: subCard.color }}>
                            {subCard.icon}
                          </span>
                        </div>
                        <span className="hidden sm:inline text-[11px] text-gray-400 font-semibold">{subCard.metric}</span>
                      </div>
                      <p className="text-xs sm:text-lg font-black text-gray-900 leading-tight">
                        {subCard.count}
                      </p>
                      <p className="text-[10px] sm:text-xs text-gray-500 font-bold mt-0.5 truncate">
                        <span className="hidden sm:inline">{subCard.title}</span>
                        <span className="sm:hidden">{subCard.shortTitle}</span>
                      </p>
                    </div>
                    <div className="sm:hidden mt-1.5 pt-1.5 border-t border-gray-200/50">
                      <span className="text-[9px] text-gray-400 font-medium truncate block">{subCard.metric}</span>
                    </div>
                  </div>
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
    </AppLayout>
  );
}
