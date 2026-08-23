"use client";

import AppLayout from "@/components/AppLayout";
import Image from "next/image";
import { useState, useEffect } from "react";

const badges = [
  { id: 1, name: "First Reporter", desc: "Reported your first community issue", icon: "flag", earned: true, points: 50, gradient: "from-amber-400 to-orange-500" },
  { id: 2, name: "Poll Voter", desc: "Participated in 5+ civic polls", icon: "how_to_vote", earned: true, points: 75, gradient: "from-blue-400 to-cyan-500" },
  { id: 3, name: "Community Champion", desc: "Received 100+ upvotes on your reports", icon: "emoji_events", earned: true, points: 150, gradient: "from-yellow-400 to-amber-500" },
  { id: 4, name: "Forum Voice", desc: "Made 10+ forum contributions", icon: "forum", earned: true, points: 100, gradient: "from-purple-400 to-violet-500" },
  { id: 5, name: "Issue Resolver", desc: "5 of your reports were resolved", icon: "check_circle", earned: false, points: 200, gradient: "from-green-400 to-emerald-500", progress: 3, total: 5 },
  { id: 6, name: "District Hero", desc: "Top 10 in your district for 3 months", icon: "military_tech", earned: false, points: 500, gradient: "from-red-400 to-pink-500", progress: 1, total: 3 },
  { id: 7, name: "Trendsetter", desc: "Reported an issue that 50+ people upvoted", icon: "trending_up", earned: true, points: 150, gradient: "from-pink-400 to-rose-500" },
  { id: 8, name: "Night Owl", desc: "Reported an issue between midnight and 5 AM", icon: "nightlight", earned: false, points: 75, gradient: "from-indigo-400 to-blue-600" },
];

const pointHistory = [
  { label: "Pothole report upvoted (×34)", points: "+34", time: "2 hours ago", color: "text-green-600" },
  { label: "Voted in 'Bike Lanes' poll", points: "+10", time: "1 day ago", color: "text-blue-600" },
  { label: "Earned 'Trendsetter' badge", points: "+150", time: "3 days ago", color: "text-amber-600" },
  { label: "Forum reply liked (×8)", points: "+8", time: "5 days ago", color: "text-purple-600" },
  { label: "Issue marked as resolved", points: "+25", time: "1 week ago", color: "text-green-600" },
];

const leaderboard = [
  { name: "Alexandra W.", points: 3420, rank: 1, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150", bg: "from-yellow-400 to-amber-500" },
  { name: "Marcus T.", points: 2890, rank: 2, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150", bg: "from-gray-300 to-gray-400" },
  { name: "Priya N.", points: 2150, rank: 3, avatar: "/avatar_woman.jpg", bg: "from-orange-300 to-orange-400" },
  { name: "You (Koushik Jha)", points: 1250, rank: 42, avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150&h=150", isMe: true, bg: "from-amber-400 to-orange-500" },
];

const earned = badges.filter((b) => b.earned);
const upcoming = badges.filter((b) => !b.earned);

export default function RewardsPage() {
  const [profileName, setProfileName] = useState("Koushik Jha");
  const [avatarUrl, setAvatarUrl] = useState("https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150&h=150");

  useEffect(() => {
    const updateProfile = () => {
      const storedName = localStorage.getItem("civicvoice_user_name") || "Koushik Jha";
      const storedAvatar = localStorage.getItem("civicvoice_avatar_url") || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150&h=150";
      setProfileName(storedName);
      setAvatarUrl(storedAvatar);
    };

    updateProfile();
    window.addEventListener("profile-updated", updateProfile);
    return () => window.removeEventListener("profile-updated", updateProfile);
  }, []);

  const dynamicLeaderboard = leaderboard.map((user) => {
    if (user.isMe) {
      return {
        ...user,
        name: `You (${profileName})`,
        avatar: avatarUrl,
      };
    }
    return user;
  });

  return (
    <AppLayout>
      <div className="max-w-[1040px] mx-auto animate-fade-in">
        {/* Points banner with real image background */}
        <div className="relative rounded-3xl overflow-hidden mb-8" style={{ minHeight: 220 }}>
          <Image
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200"
            alt="Badges"
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(133,83,0,0.85) 0%, rgba(180,83,9,0.75) 100%)" }} />
          <div className="relative z-10 p-5 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6">
            <div>
              <p className="text-white/70 text-xs md:text-sm font-medium uppercase tracking-wider mb-1">Total Civic Points</p>
              <p className="text-4xl md:text-6xl font-extrabold text-white leading-none">1,250</p>
              <p className="text-white/80 mt-1 md:mt-2 text-sm md:text-base">Ranked <strong>#42</strong> in District 9</p>
            </div>
            <div className="flex gap-5 md:gap-8">
              {[
                { value: earned.length, label: "Badges" },
                { value: "4", label: "Reports" },
                { value: "12", label: "Polls" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-2xl md:text-3xl font-extrabold text-white">{s.value}</p>
                  <p className="text-white/60 text-xs md:text-sm">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Badges */}
          <div className="md:col-span-2">
            <h2 className="text-xl font-bold text-gray-900 mb-4">🏅 Earned Badges</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              {earned.map((badge) => (
                <div key={badge.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col items-center text-center gap-2 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${badge.gradient} flex items-center justify-center shadow-md`}>
                    <span className="material-symbols-outlined icon-filled text-white text-[28px]">{badge.icon}</span>
                  </div>
                  <p className="text-xs font-bold text-gray-900">{badge.name}</p>
                  <span className="text-xs text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full font-semibold font-bold">+{badge.points}pts</span>
                </div>
              ))}
            </div>

            <h2 className="text-xl font-bold text-gray-900 mb-4">🔒 Upcoming Badges</h2>
            <div className="flex flex-col gap-3">
              {upcoming.map((badge) => (
                <div key={badge.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4 opacity-80 hover:opacity-100 transition-opacity">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${badge.gradient} flex items-center justify-center shrink-0 opacity-50`}>
                    <span className="material-symbols-outlined text-white text-[24px]">{badge.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-bold text-gray-800">{badge.name}</p>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full font-semibold">+{badge.points}pts</span>
                    </div>
                    <p className="text-sm text-gray-500">{badge.desc}</p>
                    {badge.progress !== undefined && (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span>Progress</span>
                          <span>{badge.progress}/{badge.total}</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full bg-gradient-to-r ${badge.gradient} rounded-full`} style={{ width: `${(badge.progress! / badge.total!) * 100}%` }} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right panel */}
          <div className="flex flex-col gap-6">
            {/* Point history */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Point History</h2>
              <div className="flex flex-col gap-4">
                {pointHistory.map((item, i) => (
                  <div key={i} className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-sm text-gray-800 leading-snug">{item.label}</p>
                      <p className="text-xs text-gray-400">{item.time}</p>
                    </div>
                    <span className={`text-sm font-extrabold ${item.color}`}>{item.points}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Leaderboard */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="text-lg font-bold text-gray-900 mb-4">🏆 District Leaderboard</h2>
              <div className="flex flex-col gap-3">
                {dynamicLeaderboard.map((user) => (
                  <div key={user.rank} className={`flex items-center gap-3 p-2.5 rounded-xl ${user.isMe ? "bg-amber-50 border border-amber-200" : ""}`}>
                    <span className="text-sm font-bold w-6 text-center">
                      {user.rank <= 3 ? ["🥇","🥈","🥉"][user.rank - 1] : `#${user.rank}`}
                    </span>
                    <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 relative">
                      {user.avatar ? (
                        <Image src={user.avatar} alt={user.name} width={32} height={32} className="object-cover w-full h-full" unoptimized />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${user.bg} flex items-center justify-center`}>
                          <span className="text-white text-xs font-bold">{user.name.split(" ").map(n => n[0]).join("").slice(0,2)}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold truncate ${user.isMe ? "text-amber-700 font-bold" : "text-gray-900"}`}>{user.name}</p>
                    </div>
                    <span className="text-xs text-gray-500 font-bold">{user.points.toLocaleString()}</span>
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
