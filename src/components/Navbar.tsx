"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";

// Lazy load ProfileModal so its bundle is only downloaded when opened
const ProfileModal = dynamic(() => import("./ProfileModal"), {
  ssr: false,
});

interface FeatureItem {
  title: string;
  desc: string;
  href: string;
  icon: string;
  color: string;
  badge?: string;
}

const landingFeatures: FeatureItem[] = [
  {
    title: "Report Issues",
    desc: "Flag potholes, lighting failures & hazards directly on city map",
    href: "/#features",
    icon: "report_problem",
    color: "#EF4444",
    badge: "Interactive Map",
  },
  {
    title: "District Polls",
    desc: "Vote in district surveys that shape city budgets & policy",
    href: "/#polls",
    icon: "how_to_vote",
    color: "#3B82F6",
    badge: "Real-time",
  },
  {
    title: "Community Forum",
    desc: "Discuss local issues & collaborate with neighbors & city reps",
    href: "/#features",
    icon: "forum",
    color: "#8B5CF6",
  },
  {
    title: "Civic Rewards",
    desc: "Gain civic points, unlock citizen badges & climb leaderboard",
    href: "/#features",
    icon: "military_tech",
    color: "#F59E0B",
    badge: "Badges & Points",
  },
];

const landingNavLinks = [
  { href: "/#impact", label: "Impact", icon: "trending_up", color: "text-emerald-400", bgHover: "hover:bg-emerald-500/15", borderHover: "hover:border-emerald-500/30" },
  { href: "/#issues", label: "Recent Issues", icon: "emergency", color: "text-rose-400", bgHover: "hover:bg-rose-500/15", borderHover: "hover:border-rose-500/30" },
  { href: "/#polls", label: "Polls", icon: "poll", color: "text-sky-400", bgHover: "hover:bg-sky-500/15", borderHover: "hover:border-sky-500/30" },
  { href: "/#stories", label: "Stories", icon: "auto_stories", color: "text-purple-400", bgHover: "hover:bg-purple-500/15", borderHover: "hover:border-purple-500/30" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Scroll detection for dynamic blur depth
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Close menus on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        setFeaturesOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close features dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setFeaturesOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* ── Mobile Backdrop Overlay ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/65 backdrop-blur-xs z-40 md:hidden pointer-events-auto transition-opacity"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <header className="sticky top-2.5 sm:top-4 z-50 w-full px-3 sm:px-6 lg:px-8 max-w-[1240px] mx-auto pointer-events-none">
        {/* ── Main Curved Floating Pill Navbar with Vibrant Gradient Glow ── */}
        <div className="pointer-events-auto p-[1.5px] rounded-2xl sm:rounded-full bg-gradient-to-r from-amber-500/70 via-rose-500/60 via-sky-500/60 to-emerald-500/70 shadow-[0_10px_35px_rgba(245,158,11,0.2),0_0_25px_rgba(234,88,12,0.15)] transition-all duration-300">
          <div
            className={`w-full backdrop-blur-2xl rounded-2xl sm:rounded-full px-3.5 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between transition-all duration-300 ${scrolled
                ? "bg-stone-950/92"
                : "bg-stone-950/80"
              }`}
          >

          {/* ── LEFT: Brand Logo & Wordmark ── */}
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 sm:gap-2.5 group focus:outline-none shrink-0"
            aria-label="CivicVoice Home"
          >
            {/* Logo Badge */}
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-full bg-gradient-to-tr from-amber-400 via-orange-500 to-rose-500 flex items-center justify-center shadow-md shadow-orange-500/40 group-hover:scale-105 group-hover:shadow-orange-500/60 transition-all duration-200">
              <span className="material-symbols-outlined text-white text-[18px] sm:text-[20px] icon-filled leading-none">
                how_to_vote
              </span>
            </div>

            {/* Logo Wordmark */}
            <div className="flex items-center gap-1.5">
              <span className="text-lg sm:text-2xl font-black tracking-tight text-white leading-none">
                Civic<span className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent">Voice</span>
              </span>
              <span className="hidden lg:inline-block text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-rose-500/20 text-amber-300 border border-amber-400/35 shadow-xs">
                Community
              </span>
            </div>
          </Link>

          {/* ── CENTER: Landing Page Features & Section Links (Desktop) ── */}
          <nav className="hidden md:flex items-center gap-1">
            {/* Features Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setFeaturesOpen(!featuresOpen)}
                onMouseEnter={() => setFeaturesOpen(true)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${featuresOpen
                    ? "bg-white/15 text-amber-300"
                    : "text-stone-200 hover:text-white hover:bg-white/10"
                  }`}
                aria-expanded={featuresOpen}
              >
                <span className="material-symbols-outlined text-[18px] text-amber-400">
                  auto_awesome
                </span>
                <span>Features</span>
                <span
                  className={`material-symbols-outlined text-[16px] transition-transform duration-200 ${featuresOpen ? "rotate-180 text-amber-400" : "text-stone-400"
                    }`}
                >
                  expand_more
                </span>
              </button>

              {/* Features Dropdown Card */}
              {featuresOpen && (
                <div
                  onMouseLeave={() => setFeaturesOpen(false)}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[440px] bg-stone-950/95 backdrop-blur-2xl rounded-3xl border border-stone-800 shadow-2xl shadow-black/70 p-4 z-50 animate-in fade-in zoom-in-95 duration-150"
                >
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-800 px-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                      Platform Features
                    </span>
                    <Link
                      href="/#features"
                      onClick={() => setFeaturesOpen(false)}
                      className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-0.5"
                    >
                      View on page
                      <span className="material-symbols-outlined text-[14px]">south</span>
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 gap-1.5">
                    {landingFeatures.map((feat) => (
                      <Link
                        key={feat.title}
                        href={feat.href}
                        onClick={() => setFeaturesOpen(false)}
                        className="flex items-start gap-3 p-2 rounded-2xl hover:bg-white/10 transition-colors group"
                      >
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform"
                          style={{ backgroundColor: `${feat.color}25` }}
                        >
                          <span
                            className="material-symbols-outlined text-[18px] icon-filled"
                            style={{ color: feat.color }}
                          >
                            {feat.icon}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                              {feat.title}
                            </span>
                            {feat.badge && (
                              <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-stone-800 text-stone-300 border border-stone-700">
                                {feat.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-stone-400 leading-snug mt-0.5">
                            {feat.desc}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>

                  <div className="mt-2.5 pt-2.5 border-t border-stone-800 flex items-center justify-between px-2 text-xs">
                    <span className="text-stone-400">Ready to make an impact?</span>
                    <Link
                      href="/signup"
                      onClick={() => setFeaturesOpen(false)}
                      className="font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                    >
                      Get Started Free →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Direct Landing Section Links with Colorful Accents */}
            {landingNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold text-stone-200 hover:text-white border border-transparent transition-all duration-200 ${link.bgHover} ${link.borderHover}`}
              >
                <span className={`material-symbols-outlined text-[16px] ${link.color}`}>
                  {link.icon}
                </span>
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>

          {/* ── RIGHT: Log In + Sign Up CTA + Hamburger ── */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* ── Clerk Auth Controls: Signed Out vs Signed In ── */}
            <Show when="signed-out">
              <SignInButton mode="modal" fallbackRedirectUrl="/dashboard" forceRedirectUrl="/dashboard">
                <button
                  type="button"
                  className="hidden sm:inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-sky-200 hover:text-white px-3.5 py-1.5 rounded-full bg-sky-500/15 hover:bg-sky-500/25 border border-sky-400/35 hover:border-sky-400/60 shadow-xs transition-all duration-200 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px] text-sky-400">login</span>
                  <span>Log In</span>
                </button>
              </SignInButton>

              <SignUpButton mode="modal" fallbackRedirectUrl="/dashboard" forceRedirectUrl="/dashboard">
                <button
                  type="button"
                  className="flex items-center gap-1.5 px-3.5 sm:px-4.5 py-1.5 sm:py-2 rounded-full font-black text-xs sm:text-sm text-white bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:via-orange-400 hover:to-rose-400 shadow-md shadow-orange-500/35 hover:shadow-lg hover:shadow-orange-500/55 active:scale-[0.97] border border-white/20 transition-all duration-200 shrink-0 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px] sm:text-[18px] icon-filled leading-none text-amber-200">
                    person_add
                  </span>
                  <span>Sign Up</span>
                </button>
              </SignUpButton>
            </Show>

            <Show when="signed-in">
              <Link
                href="/dashboard"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-amber-300 hover:text-white bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-rose-500/20 hover:from-amber-500/30 hover:to-rose-500/30 border border-amber-400/40 shadow-xs transition-all"
              >
                <span className="material-symbols-outlined text-[15px] text-amber-400">dashboard</span>
                <span>Dashboard</span>
              </Link>
              <UserButton 
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-8 h-8 rounded-full border-2 border-amber-400 shadow-sm shadow-amber-500/20"
                  }
                }}
              />
            </Show>

            {/* Hamburger Menu Toggle Button (Mobile) */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 text-white focus:outline-none transition-colors shrink-0"
              aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileOpen}
            >
              <span className="material-symbols-outlined text-[20px] sm:text-[22px]">
                {mobileOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>
        </div>

        {/* ── MOBILE MENU DRAWER (Scrollable, Full-featured, Touch-optimized) ── */}
        {mobileOpen && (
          <div className="pointer-events-auto md:hidden mt-2 w-full bg-stone-950/95 backdrop-blur-2xl border border-amber-500/30 shadow-2xl shadow-black/80 rounded-2xl sm:rounded-3xl p-4 sm:p-5 max-h-[calc(100dvh-85px)] overflow-y-auto overscroll-contain z-50 animate-in slide-in-from-top-2 duration-200">
            {/* Colorful top ambient bar */}
            <div className="h-1 w-full bg-gradient-to-r from-amber-400 via-rose-500 via-sky-400 to-emerald-400 rounded-full mb-3" />
            <div className="flex flex-col gap-3.5">

              {/* Clerk Mobile Auth Controls */}
              <Show when="signed-in">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-900/90 border border-stone-800">
                  <div className="flex items-center gap-3">
                    <UserButton />
                    <div>
                      <p className="text-xs font-bold text-white">Your Account</p>
                      <p className="text-[10px] text-amber-300 font-medium">District 9 Active Representative</p>
                    </div>
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="px-3 py-1.5 rounded-full bg-amber-500 text-stone-900 text-xs font-bold hover:bg-amber-400 transition-colors"
                  >
                    Dashboard
                  </Link>
                </div>
              </Show>

              <Show when="signed-out">
                <div className="flex flex-col gap-2">
                  <SignUpButton mode="modal" fallbackRedirectUrl="/dashboard" forceRedirectUrl="/dashboard">
                    <button
                      type="button"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-full font-bold text-white text-sm bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 shadow-md shadow-amber-500/30 active:scale-[0.98] transition-transform cursor-pointer"
                    >
                      <span className="material-symbols-outlined icon-filled text-[18px]">person_add</span>
                      Sign Up Free
                    </button>
                  </SignUpButton>
                  <div className="flex items-center justify-between px-2 pt-0.5 text-xs">
                    <span className="text-stone-400">Already registered?</span>
                    <SignInButton mode="modal" fallbackRedirectUrl="/dashboard" forceRedirectUrl="/dashboard">
                      <button
                        type="button"
                        onClick={() => setMobileOpen(false)}
                        className="font-bold text-amber-400 hover:text-amber-300 py-1 cursor-pointer"
                      >
                        Log In →
                      </button>
                    </SignInButton>
                  </div>
                </div>
              </Show>

              <hr className="border-stone-800/80" />

              {/* Platform Features Section */}
              <div>
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-2 px-1">
                  Platform Features
                </span>
                <div className="grid grid-cols-1 gap-1.5">
                  {landingFeatures.map((feat) => (
                    <Link
                      key={feat.title}
                      href={feat.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-start gap-3 p-2 rounded-xl bg-stone-900/70 border border-stone-800/80 active:bg-white/10 transition-colors"
                    >
                      <div
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                        style={{ backgroundColor: `${feat.color}25` }}
                      >
                        <span
                          className="material-symbols-outlined text-[16px] sm:text-[18px] icon-filled"
                          style={{ color: feat.color }}
                        >
                          {feat.icon}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white">
                            {feat.title}
                          </span>
                          {feat.badge && (
                            <span className="text-[8px] sm:text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-stone-800 text-stone-300 border border-stone-700">
                              {feat.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-stone-400 mt-0.5 leading-tight line-clamp-2">
                          {feat.desc}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <hr className="border-stone-800/80" />

              {/* Direct Section Links */}
              <div>
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-2 px-1">
                  Jump To Section
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {landingNavLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-1.5 p-2 rounded-xl bg-stone-900/60 active:bg-stone-800 text-stone-200 font-medium text-xs transition-colors"
                    >
                      <span className={`material-symbols-outlined text-[16px] ${link.color}`}>
                        {link.icon}
                      </span>
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Direct Link to Map */}
              <Link
                href="/map"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl text-xs font-semibold text-stone-300 bg-stone-900/50 hover:bg-stone-800/80 border border-stone-800/60 transition-colors"
              >
                <span className="material-symbols-outlined text-amber-400 text-[16px]">map</span>
                Open Interactive Map
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Profile Modal ("Profile Wala") */}
      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />
    </>
  );
}

