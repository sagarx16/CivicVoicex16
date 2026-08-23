import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";

const stats = [
  { label: "Active Citizens", value: "12,400+", icon: "groups", color: "#f59e0b", bg: "#fff8e1" },
  { label: "Issues Resolved", value: "3,280", icon: "check_circle", color: "#22c55e", bg: "#f0fdf4" },
  { label: "Polls Conducted", value: "840", icon: "poll", color: "#3b82f6", bg: "#eff6ff" },
  { label: "Communities", value: "48", icon: "location_city", color: "#a855f7", bg: "#faf5ff" },
];

const recentIssues = [
  { id: 1, title: "Pothole on Main Street near Oak Ave", category: "Road Maintenance", status: "In Progress", time: "2 hours ago", votes: 34, icon: "construction", img: "/pothole_report.jpg" },
  { id: 2, title: "Community Cleanup Drive — Riverside", category: "Environment", status: "Active", time: "Now", votes: 78, icon: "volunteer_activism", img: "/community_cleanup.jpg" },
  { id: 3, title: "Broken streetlight on Elm Blvd", category: "Street Lighting", status: "Reported", time: "5 hours ago", votes: 12, icon: "light_mode", img: "/broken_streetlight.jpg" },
  { id: 4, title: "Illegal dumping near River Walk", category: "Environmental", status: "Resolved", time: "1 day ago", votes: 56, icon: "eco", img: "/overflowing_bins.jpg" },
];

const featuredPolls = [
  { id: 1, title: "Should we expand the city bike lane network?", votes: 1840, endDate: "3 days left", yesPercent: 68, color: "#f59e0b" },
  { id: 2, title: "New community center location preference", votes: 924, endDate: "5 days left", yesPercent: 52, color: "#3b82f6" },
];

const features = [
  { icon: "report_problem", label: "Report Issues", desc: "Flag potholes, lighting failures, and public hazards directly on an interactive city map.", color: "#ef4444", bg: "from-red-500 to-orange-500" },
  { icon: "poll", label: "Vote on Polls", desc: "Participate in district-level surveys that shape city budgets and infrastructure decisions.", color: "#3b82f6", bg: "from-blue-500 to-cyan-500" },
  { icon: "forum", label: "Join the Forum", desc: "Discuss local issues, share ideas, and collaborate with neighbors and city officials.", color: "#8b5cf6", bg: "from-violet-500 to-purple-500" },
  { icon: "military_tech", label: "Earn Rewards", desc: "Gain civic points and badges for every contribution. Climb the district leaderboard.", color: "#f59e0b", bg: "from-amber-500 to-yellow-500" },
];

const testimonials = [
  { name: "Priya N.", role: "District 9 Resident", text: "I reported a pothole and it was fixed within a week! CivicVoice actually makes the city listen.", avatar: "/avatar_woman.jpg" },
  { name: "Marcus T.", role: "Community Leader", text: "The forum feature is amazing — I've connected with 50+ neighbors who care about the same issues.", avatar: null, initials: "MT" },
  { name: "Sarah M.", role: "Parent & Volunteer", text: "Finally a platform where my vote on park hours actually counted. This is what democracy looks like.", avatar: null, initials: "SM" },
];

const statusConfig: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  "In Progress": { label: "In Progress", bg: "bg-[#DBEAFE]", text: "text-[#1D4ED8]", dot: "bg-[#1D4ED8]" },
  Reported: { label: "Reported", bg: "bg-[#F3F4F6]", text: "text-[#4B5563]", dot: "bg-[#4B5563]" },
  Resolved: { label: "Resolved", bg: "bg-[#DCFCE7]", text: "text-[#15803D]", dot: "bg-[#15803D]" },
  Active: { label: "Active", bg: "bg-[#FEF3E2]", text: "text-[#D97706]", dot: "bg-[#D97706]" },
};

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background font-sans">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative w-full overflow-hidden" style={{ minHeight: "92vh" }}>
        {/* Full-bleed image */}
        <div className="absolute inset-0">
          <Image src="/hero_city.jpg" alt="Vibrant city aerial view" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        {/* Floating animated blobs */}
        <div className="absolute top-20 right-32 w-72 h-72 rounded-full blur-3xl opacity-30 animate-float" style={{ background: "#f59e0b" }} />
        <div className="absolute bottom-32 right-64 w-48 h-48 rounded-full blur-3xl opacity-20 animate-float-delayed" style={{ background: "#3b82f6" }} />

        <div className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-12 py-16 md:py-20 flex flex-col md:flex-row items-center gap-8 md:gap-12 h-full" style={{ minHeight: "92vh" }}>
          {/* Left: Text */}
          <div className="flex-1 flex flex-col gap-5 md:gap-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs md:text-sm font-medium px-3 md:px-4 py-1.5 md:py-2 rounded-full w-fit">
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
              Live civic platform · 12,400+ active citizens
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold text-white leading-tight">
              Your voice.<br />
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #f59e0b, #fbbf24, #fb923c)" }}>
                Your city.
              </span><br />
              Your impact.
            </h1>

            <p className="text-base md:text-xl text-white/80 max-w-xl leading-relaxed">
              Join thousands of citizens actively shaping your community. Report local issues, vote on polls, and connect with initiatives that matter.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <Link href="/signup" className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm md:text-base text-white shadow-2xl hover:-translate-y-1 hover:shadow-amber-500/40 transition-all duration-300" style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}>
                <span className="material-symbols-outlined icon-filled">how_to_vote</span>
                Get Involved Free
              </Link>
              <Link href="/map" className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm md:text-base text-white bg-white/10 backdrop-blur-sm border border-white/30 hover:bg-white/20 transition-all duration-300">
                <span className="material-symbols-outlined">map</span>
                Explore Map
              </Link>
            </div>

            {/* Trust row */}
            <div className="flex gap-5 md:gap-6 pt-2">
              {[["12,400+", "Citizens"], ["3,280", "Issues Fixed"], ["840", "Polls Done"]].map(([num, label]) => (
                <div key={label}>
                  <p className="text-xl md:text-2xl font-bold text-white">{num}</p>
                  <p className="text-white/60 text-xs md:text-sm">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Live Feed Card */}
          <div className="hidden lg:flex flex-col w-[400px] shrink-0 gap-3 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-white font-bold text-lg flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                  </span>
                  Live Activity
                </span>
                <span className="flex items-center gap-1.5 text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-full border border-green-400/30">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  Real-time
                </span>
              </div>
              {recentIssues.slice(0, 3).map((issue) => {
                const s = statusConfig[issue.status];
                return (
                  <div key={issue.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors mb-2 cursor-pointer">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0 overflow-hidden">
                      {issue.img ? (
                        <Image src={issue.img} alt={issue.category} width={40} height={40} className="object-cover w-full h-full" />
                      ) : (
                        <span className="material-symbols-outlined text-amber-400 text-[20px]">{issue.icon}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{issue.title}</p>
                      <p className="text-white/50 text-xs">{issue.time}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.bg} ${s.text}`}>{s.label}</span>
                  </div>
                );
              })}
              <Link href="/map" className="block text-center text-amber-400 text-sm font-semibold mt-3 hover:underline">
                View all on map →
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 flex flex-col items-center gap-1 animate-bounce">
          <span className="text-xs">Scroll</span>
          <span className="material-symbols-outlined text-[18px]">expand_more</span>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section className="bg-white border-y border-gray-100 py-6 md:py-8">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined icon-filled text-[26px] md:text-[32px]" style={{ color: stat.color }}>{stat.icon}</span>
                </div>
                <div>
                  <p className="text-lg md:text-2xl font-extrabold text-gray-900">{stat.value}</p>
                  <p className="text-xs md:text-sm text-gray-500">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-amber-50/30">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12">
          <div className="text-center mb-10 md:mb-16">
            <span className="inline-block text-amber-600 font-semibold text-xs md:text-sm tracking-widest uppercase mb-3">What you can do</span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-gray-900">One platform. Every civic need.</h2>
            <p className="text-base md:text-lg text-gray-500 mt-3 max-w-xl mx-auto">From reporting a pothole to shaping city policy — CivicVoice puts the power in your hands.</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-6">
            {features.map((f) => (
              <div key={f.label} className="group bg-white rounded-xl p-3 md:rounded-2xl md:p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer">
                <div className="w-9 h-9 md:w-16 md:h-16 rounded-full flex items-center justify-center mb-2 md:mb-5 group-hover:scale-110 transition-transform duration-300 border shadow-xs"
                     style={{
                       backgroundColor: `${f.color}0f`,
                       borderColor: `${f.color}25`
                     }}>
                  <span className="material-symbols-outlined icon-filled text-[18px] md:text-[30px]" style={{ color: f.color }}>{f.icon}</span>
                </div>
                <h3 className="text-sm font-bold text-gray-900 md:text-lg md:mb-2 leading-snug">{f.label}</h3>
                <p className="hidden sm:block text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMMUNITY IN ACTION ── */}
      <section className="py-24 bg-white">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-2 gap-10 md:gap-16 items-center">
            {/* Image */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
                <Image src="/community_meeting.jpg" alt="Community meeting" fill className="object-cover" />
              </div>
              {/* Floating stat card */}
              <div className="absolute bottom-4 right-4 md:-bottom-6 md:-right-6 bg-white rounded-2xl shadow-xl p-4 md:p-5 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                    <span className="material-symbols-outlined icon-filled text-amber-600 text-[20px] md:text-[24px]">trending_up</span>
                  </div>
                  <div>
                    <p className="text-xl md:text-2xl font-extrabold text-gray-900">+340%</p>
                    <p className="text-xs text-gray-500">Civic participation</p>
                  </div>
                </div>
              </div>
              {/* Floating avatar stack */}
              <div className="absolute top-4 left-4 md:-top-4 md:-left-4 bg-white rounded-2xl shadow-lg p-2.5 md:p-3 border border-gray-100">
                <div className="flex -space-x-2">
                  {["#f59e0b", "#3b82f6", "#22c55e", "#a855f7"].map((c, i) => (
                    <div key={i} className="w-7 h-7 md:w-8 md:h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] md:text-xs font-bold text-white" style={{ background: c }}>
                      {["KJ", "SM", "PK", "MT"][i]}
                    </div>
                  ))}
                </div>
                <p className="text-[10px] md:text-xs text-gray-500 mt-1 md:mt-1.5 font-medium">+12k joined</p>
              </div>
            </div>

            {/* Text */}
            <div className="flex flex-col gap-8">
              <div>
                <span className="inline-block text-amber-600 font-semibold text-sm tracking-widest uppercase mb-3">Real Impact</span>
                <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                  Citizens driving real<br />
                  <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #f59e0b, #d97706)" }}>
                    change together
                  </span>
                </h2>
              </div>
              <p className="text-lg text-gray-500 leading-relaxed">
                CivicVoice bridges the gap between residents and local government. Every report, every vote, every comment creates a verifiable record that city officials are required to respond to.
              </p>
              <div className="flex flex-col gap-4">
                {[
                  { icon: "check_circle", text: "Reports go directly to the responsible city department", color: "text-green-500" },
                  { icon: "check_circle", text: "City officials must respond within 72 hours", color: "text-green-500" },
                  { icon: "check_circle", text: "All responses are publicly visible and trackable", color: "text-green-500" },
                ].map((item) => (
                  <div key={item.text} className="flex items-start gap-3">
                    <span className={`material-symbols-outlined icon-filled ${item.color} text-[22px] shrink-0 mt-0.5`}>{item.icon}</span>
                    <p className="text-gray-700">{item.text}</p>
                  </div>
                ))}
              </div>
              <Link href="/signup" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-base text-white w-fit shadow-lg hover:-translate-y-1 hover:shadow-amber-400/40 transition-all duration-300" style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}>
                Join the movement
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── RECENT ISSUES (with media) ── */}
      <section className="py-24" style={{ background: "linear-gradient(135deg, #fafafa 0%, #fff8e1 100%)" }}>
        <div className="max-w-[1280px] mx-auto px-6 md:px-12">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="inline-block text-amber-600 font-semibold text-sm tracking-widest uppercase mb-3">Community Feed</span>
              <h2 className="text-4xl font-extrabold text-gray-900">What&apos;s happening nearby</h2>
            </div>
            <Link href="/map" className="flex items-center gap-1 text-amber-600 font-semibold hover:underline text-sm">
              View all on map
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {recentIssues.map((issue) => {
              const s = statusConfig[issue.status];
              return (
                <div key={issue.id} className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer">
                  {issue.img && (
                    <div className="relative w-full h-48 overflow-hidden">
                      <Image src={issue.img} alt={issue.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <span className={`absolute top-3 right-3 text-xs px-2.5 py-1 rounded-full font-semibold ${s.bg} ${s.text}`}>
                        {s.label}
                      </span>
                    </div>
                  )}
                  <div className="p-5">
                    {!issue.img && (
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                          <span className="material-symbols-outlined text-amber-600 text-[20px]">{issue.icon}</span>
                        </div>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${s.bg} ${s.text}`}>{s.label}</span>
                      </div>
                    )}
                    <h3 className="font-bold text-gray-900 text-base leading-snug mb-1">{issue.title}</h3>
                    <p className="text-sm text-gray-500 mb-4">{issue.category}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">schedule</span>{issue.time}</span>
                      <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">thumb_up</span>{issue.votes} upvotes</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── POLLS ── */}
      <section className="py-24 bg-white">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="inline-block text-blue-600 font-semibold text-sm tracking-widest uppercase mb-3">Make Your Voice Heard</span>
              <h2 className="text-4xl font-extrabold text-gray-900">Active Polls & Surveys</h2>
            </div>
            <Link href="/polls" className="flex items-center gap-1 text-blue-600 font-semibold hover:underline text-sm">
              All polls <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {featuredPolls.map((poll) => (
              <div key={poll.id} className="rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-10" style={{ background: poll.color, transform: "translate(30%, -30%)" }} />
                <div className="flex items-start justify-between gap-3 mb-5">
                  <p className="text-lg font-bold text-gray-900 leading-snug">{poll.title}</p>
                  <span className="text-xs text-white px-3 py-1.5 rounded-full font-semibold shrink-0" style={{ background: poll.color }}>
                    {poll.endDate}
                  </span>
                </div>
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-500 mb-2">
                    <span>Yes / Support</span>
                    <span className="font-bold" style={{ color: poll.color }}>{poll.yesPercent}%</span>
                  </div>
                  <div className="h-3 bg-gray-100/20 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${poll.yesPercent}%`, background: `linear-gradient(90deg, ${poll.color}, ${poll.color}cc)` }} />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">{poll.votes.toLocaleString()} participants</span>
                  <Link href="/polls" className="text-sm font-bold flex items-center gap-1 hover:underline" style={{ color: poll.color }}>
                    Vote now <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-16 md:py-24" style={{ background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)" }}>
        <div className="max-w-[1280px] mx-auto px-6 md:px-12">
          <div className="text-center mb-10 md:mb-16">
            <span className="inline-block text-amber-400 font-semibold text-xs md:text-sm tracking-widest uppercase mb-3">Community Voices</span>
            <h2 className="text-2xl md:text-4xl font-extrabold text-white">Real stories, real impact</h2>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-7 hover:bg-white/10 transition-colors">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined icon-filled text-amber-400 text-[18px]">star</span>
                  ))}
                </div>
                <p className="text-white/80 text-base leading-relaxed mb-6">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  {t.avatar ? (
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-amber-400/30">
                      <Image src={t.avatar} alt={t.name} width={40} height={40} className="object-cover w-full h-full" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-amber-500/20 border-2 border-amber-400/30 flex items-center justify-center">
                      <span className="text-amber-400 text-xs font-bold">{t.initials}</span>
                    </div>
                  )}
                  <div>
                    <p className="text-white font-semibold text-sm">{t.name}</p>
                    <p className="text-white/40 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 bg-white">
        <div className="max-w-[800px] mx-auto px-6 text-center">
          <div className="relative rounded-3xl overflow-hidden p-6 sm:p-12" style={{ background: "linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)" }}>
            <div className="absolute top-0 left-0 w-48 h-48 rounded-full blur-3xl bg-white/20 -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full blur-3xl bg-black/10 translate-x-1/2 translate-y-1/2" />
            <div className="relative z-10">
              <span className="material-symbols-outlined icon-filled text-white/60 text-[48px] md:text-[64px] block mb-4">how_to_vote</span>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4">Ready to make a difference?</h2>
              <p className="text-white/80 text-lg mb-8">Join CivicVoice today — free forever for citizens.</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/signup" className="px-8 py-4 bg-white text-amber-700 font-bold text-base rounded-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                  Create Free Account
                </Link>
                <Link href="/login" className="px-8 py-4 bg-white/10 border border-white/30 text-white font-bold text-base rounded-xl hover:bg-white/20 transition-all duration-300">
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-gray-900 text-white py-10 md:py-12">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 mb-8 md:mb-10">
            <div>
              <div className="flex items-center gap-2 text-xl font-extrabold text-amber-400 mb-3">
                <span className="material-symbols-outlined icon-filled">how_to_vote</span>
                CivicVoice
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">Empowering communities, one voice at a time.</p>
            </div>
            {[
              { title: "Platform", links: ["Report Issue", "Community Map", "Polls & Surveys", "Forum"] },
              { title: "Community", links: ["Directory", "Rewards", "Leaderboard", "Events"] },
              { title: "Legal", links: ["Privacy Policy", "Terms of Service", "Accessibility", "Contact"] },
            ].map((col) => (
              <div key={col.title}>
                <p className="font-semibold text-sm mb-4 text-white">{col.title}</p>
                <div className="flex flex-col gap-2">
                  {col.links.map((link) => (
                    <a key={link} href="#" className="text-gray-400 text-sm hover:text-amber-400 transition-colors">{link}</a>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">© 2026 CivicVoice. All rights reserved.</p>
            <div className="flex gap-4">
              {["verified", "security", "public"].map((icon) => (
                <div key={icon} className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-amber-600 transition-colors cursor-pointer">
                  <span className="material-symbols-outlined text-gray-400 hover:text-white text-[18px]">{icon}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
