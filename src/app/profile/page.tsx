"use client";

import AppLayout from "@/components/AppLayout";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

const AVATAR_PRESETS = [
  { id: "preset-executive", name: "Smart Student (Default)", url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150&h=150" },
  { id: "preset-director", name: "Tech Director", url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150&h=150" },
  { id: "preset-lead", name: "Community Liaison", url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150&h=150" },
  { id: "preset-advocate", name: "Public Advocate", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150" }
];

export default function ProfilePage() {
  const [profileName, setProfileName] = useState("Koushik Jha");
  const [avatarUrl, setAvatarUrl] = useState("https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150&h=150");
  const [civicPoints, setCivicPoints] = useState(1250);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editAvatar, setEditAvatar] = useState("");
  const [customUrlInput, setCustomUrlInput] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem("civicvoice_user_name") || "Koushik Jha";
    const storedAvatar = localStorage.getItem("civicvoice_avatar_url") || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150&h=150";
    const storedIssues = localStorage.getItem("civicvoice_user_issues");
    let calculatedPoints = 1250;
    if (storedIssues) {
      try { const parsed = JSON.parse(storedIssues); calculatedPoints = 1250 + (parsed.length * 50); } catch {}
    }
    setProfileName(storedName);
    setAvatarUrl(storedAvatar);
    setCivicPoints(calculatedPoints);
  }, []);

  useEffect(() => {
    if (isEditModalOpen) {
      setTimeout(() => {
        setEditName(profileName);
        setEditAvatar(avatarUrl);
        setCustomUrlInput(avatarUrl.startsWith("data:") ? "" : avatarUrl);
      }, 0);
    }
  }, [isEditModalOpen, profileName, avatarUrl]);

  const handleSave = () => {
    const newName = editName.trim() || "Koushik Jha";
    const newAvatar = editAvatar || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150&h=150";
    localStorage.setItem("civicvoice_user_name", newName);
    localStorage.setItem("civicvoice_avatar_url", newAvatar);
    window.dispatchEvent(new Event("profile-updated"));
    setProfileName(newName);
    setAvatarUrl(newAvatar);
    setIsEditModalOpen(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const stats = [
    { label: "Civic Points", value: civicPoints.toLocaleString(), icon: "military_tech", color: "#D97706" },
    { label: "District Rank", value: "#42 of 12.4k", icon: "leaderboard", color: "#C2410C" },
    { label: "Issues Filed", value: "6 Reports", icon: "report_problem", color: "#EF4444" },
    { label: "Polls Voted", value: "12 Votes", icon: "how_to_vote", color: "#8B5CF6" },
    { label: "Forum Likes", value: "180 Likes", icon: "thumb_up", color: "#3B82F6" },
    { label: "Badges Earned", value: "4 Badges", icon: "workspace_premium", color: "#F59E0B" },
  ];

  const badges = [
    { name: "District Leader", desc: "Top 50 in civic points", icon: "military_tech", color: "#D97706", bg: "#FEF3C7" },
    { name: "Active Reporter", desc: "Filed 5+ verified issues", icon: "report_problem", color: "#EF4444", bg: "#FEE2E2" },
    { name: "Poll Veteran", desc: "Voted in 10+ polls", icon: "how_to_vote", color: "#8B5CF6", bg: "#EDE9FE" },
    { name: "Forum Helper", desc: "100+ upvotes received", icon: "thumb_up", color: "#3B82F6", bg: "#DBEAFE" },
  ];

  return (
    <AppLayout>
      <div className="max-w-[700px] mx-auto animate-fade-in pb-16">

        {/* HEADER BANNER */}
        <div className="relative h-36 rounded-3xl overflow-hidden mb-0">
          <Image
            src="https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&q=80&w=1000"
            alt="Profile Banner"
            fill className="object-cover" unoptimized priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-900/80 via-stone-900/50 to-transparent" />
          <Link href="/dashboard" className="absolute top-4 left-4 flex items-center gap-1.5 text-white/80 hover:text-white text-xs font-bold transition-colors">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Dashboard
          </Link>
          {saved && (
            <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">check_circle</span>
              Saved!
            </div>
          )}
        </div>

        {/* AVATAR + NAME */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm px-6 pt-0 pb-6 -mt-6 relative z-10">
          <div className="flex flex-col items-center -mt-12">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="group relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <Image src={avatarUrl} alt={profileName} fill className="object-cover transition-transform duration-300 group-hover:scale-110" unoptimized />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-[20px]">photo_camera</span>
              </div>
            </button>
            <h1 className="text-2xl font-black text-stone-900 flex items-center gap-2 mt-3">
              {profileName}
              <span className="material-symbols-outlined text-amber-500 text-[22px] icon-filled">verified</span>
            </h1>
            <p className="text-sm text-stone-500 font-medium mt-0.5">District 9 Active Representative</p>
            <span className="mt-2 text-[11px] bg-amber-50 border border-amber-200 text-amber-700 font-bold px-3 py-0.5 rounded-full">
              Member ID: CV-902-882-KJ
            </span>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="mt-4 w-full max-w-xs py-2.5 px-4 rounded-xl border border-amber-200 bg-amber-50/50 hover:bg-amber-100 text-amber-700 font-bold text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">edit</span>
              Edit Profile
            </button>
          </div>
        </div>

        {/* STATS GRID */}
        <div className="mt-4 bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-black text-stone-900 mb-4">Civic Stats</h2>
          <div className="grid grid-cols-3 gap-3">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col items-center bg-gray-50 rounded-2xl p-3 border border-gray-100">
                <span className="material-symbols-outlined icon-filled text-[22px]" style={{ color: s.color }}>{s.icon}</span>
                <p className="text-sm font-black text-stone-900 mt-1 text-center leading-tight">{s.value}</p>
                <p className="text-[10px] text-gray-400 font-semibold mt-0.5 text-center">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* BADGES */}
        <div className="mt-4 bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-black text-stone-900 mb-4">Earned Badges</h2>
          <div className="flex flex-col gap-3">
            {badges.map((b) => (
              <div key={b.name} className="flex items-center gap-3 p-3 rounded-2xl border border-gray-100" style={{ background: b.bg + "44" }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: b.bg }}>
                  <span className="material-symbols-outlined icon-filled text-[20px]" style={{ color: b.color }}>{b.icon}</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-stone-900">{b.name}</p>
                  <p className="text-xs text-gray-400">{b.desc}</p>
                </div>
                <span className="material-symbols-outlined text-[18px] ml-auto" style={{ color: b.color }}>verified</span>
              </div>
            ))}
          </div>
        </div>

        {/* CIVIC PASS */}
        <div
          className="mt-4 rounded-3xl p-6 text-white relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #b45309 0%, #d97706 50%, #f59e0b 100%)", boxShadow: "0 10px 25px rgba(217,119,6,0.25)" }}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-orange-200/75 uppercase tracking-widest font-black">CivicVoice Member Pass</p>
              <p className="text-sm font-extrabold mt-1">District 9 Leadership</p>
            </div>
            <span className="material-symbols-outlined text-amber-400" style={{ fontSize: 28 }}>verified_user</span>
          </div>
          <div className="mt-6">
            <p className="text-xs text-orange-200/75 tracking-widest">MEMBER ID</p>
            <p className="text-lg font-bold tracking-widest mt-1">CV-902-882-KJ</p>
          </div>
          <div className="flex justify-between items-end mt-4">
            <div>
              <p className="text-[9px] text-orange-200/60">HOLDER</p>
              <p className="text-xs font-bold">{profileName.toUpperCase()}</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] text-orange-200/60">POINTS</p>
              <p className="text-xs font-bold">{civicPoints.toLocaleString()}</p>
            </div>
          </div>
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px]" />
        </div>

      </div>

      {/* EDIT MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-black text-stone-900">Edit Profile</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 text-stone-400 hover:text-stone-600 transition-colors">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="flex flex-col items-center gap-3">
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-amber-100 shadow-inner">
                  <Image src={editAvatar} alt="Preview" fill className="object-cover" unoptimized />
                </div>
                <label className="cursor-pointer px-4 py-1.5 rounded-lg border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold text-xs transition-colors flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px]">upload</span>
                  Upload Custom Photo
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) { const reader = new FileReader(); reader.onloadend = () => { if (typeof reader.result === "string") setEditAvatar(reader.result); }; reader.readAsDataURL(file); }
                  }} />
                </label>
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1.5">Full Name</label>
                <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-sm text-stone-800" placeholder="e.g. Koushik Jha" />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-2">Professional Presets</label>
                <div className="grid grid-cols-4 gap-3">
                  {AVATAR_PRESETS.map((preset) => {
                    const isSelected = editAvatar === preset.url;
                    return (
                      <button key={preset.id} type="button" onClick={() => { setEditAvatar(preset.url); setCustomUrlInput(preset.url); }}
                        className={`group relative aspect-square rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${isSelected ? "border-amber-500 scale-95 ring-4 ring-amber-500/10" : "border-gray-200 hover:border-gray-300"}`}
                        title={preset.name}>
                        <Image src={preset.url} alt={preset.name} fill className="object-cover" unoptimized />
                        {isSelected && (<div className="absolute inset-0 bg-amber-500/20 flex items-center justify-center"><span className="material-symbols-outlined text-white text-[16px] font-bold">check</span></div>)}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1.5">Or Paste Custom Image URL</label>
                <input type="url" value={customUrlInput} onChange={(e) => { setCustomUrlInput(e.target.value); if (e.target.value.trim()) setEditAvatar(e.target.value.trim()); }}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-sm text-stone-800" placeholder="https://images.unsplash.com/photo-..." />
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-100 text-stone-600 font-bold text-sm transition-colors cursor-pointer">Cancel</button>
              <button type="button" onClick={handleSave} className="px-5 py-2.5 rounded-xl text-white font-bold text-sm transition-all shadow-md cursor-pointer" style={{ background: "linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)" }}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
