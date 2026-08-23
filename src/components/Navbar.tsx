"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";

const navLinks = [
  { href: "/map", label: "Map", icon: "map", accent: "#2563EB", tint: "#EFF6FF", hoverTint: "#DBEAFE" },
  { href: "/polls", label: "Polls", icon: "poll", accent: "#9333EA", tint: "#FAF5FF", hoverTint: "#F3E8FF" },
  { href: "/forum", label: "Forum", icon: "forum", accent: "#0F766E", tint: "#F0FDFA", hoverTint: "#CCFBF1" },
  { href: "/directory", label: "Directory", icon: "contact_page", accent: "#D97706", tint: "#FFF7ED", hoverTint: "#FFEDD5" },
];

const mobileNavLinks = [
  { href: "/dashboard", label: "Dashboard", icon: "dashboard", accent: "#2563EB", tint: "#EFF6FF" },
  { href: "/my-issues", label: "My Issues", icon: "assignment", accent: "#D97706", tint: "#FFF7ED" },
  { href: "/report", label: "Report Issue", icon: "report_problem", accent: "#DC2626", tint: "#FEF2F2" },
  ...navLinks,
  { href: "/rewards", label: "Rewards", icon: "military_tech", accent: "#CA8A04", tint: "#FEFCE8" },
  { href: "/notifications", label: "Notifications", icon: "notifications", accent: "#DB2777", tint: "#FDF2F8" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileName, setProfileName] = useState("Koushik Jha");
  const [avatarUrl, setAvatarUrl] = useState("https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150&h=150");
  const [hasUnread, setHasUnread] = useState(false);

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

  useEffect(() => {
    const updateNotifications = () => {
      const stored = localStorage.getItem("civicvoice_notifications");
      if (stored) {
        try {
          const list = JSON.parse(stored);
          setHasUnread(list.some((n: { read?: boolean }) => !n.read));
        } catch (err) {
          setHasUnread(true);
        }
      } else {
        setHasUnread(true);
      }
    };

    updateNotifications();
    window.addEventListener("notifications-updated", updateNotifications);
    return () => window.removeEventListener("notifications-updated", updateNotifications);
  }, []);

  return (
    <header
      className="w-full sticky top-0 z-50"
      style={{
        background: "#FFFFFF",
        borderBottom: "1px solid #F0E4D7",
        boxShadow: "0 4px 20px 0 rgba(0,0,0,0.05)",
      }}
    >
      <div
        className="flex justify-between items-center gap-3 w-full px-3 sm:px-4 md:px-12 max-w-[1280px] mx-auto h-16 md:h-[88px]"
        style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
      >
        {/* ── LEFT: Logo + Search ── */}
        <div className="flex items-center min-w-0" style={{ display: "flex", alignItems: "center", gap: "32px" }}>
          {/* Logo with perfect vertical centering layout */}
          <Link 
            href="/" 
            className="shrink-0 group flex min-w-0"
            style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "12px", 
              textDecoration: "none" 
            }}
          >
            {/* Icon badge — rounded square with premium gradient */}
            <div
              className="rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-105"
              style={{
                width: 42,
                height: 42,
                background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
                boxShadow: "0 3px 12px rgba(217,119,6,0.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <span 
                className="material-symbols-outlined icon-filled text-white" 
                style={{ 
                  fontSize: 22, 
                  display: "inline-flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  lineHeight: "1" 
                }}
              >
                how_to_vote
              </span>
            </div>
            
            {/* Wordmark - Made Bigger, Bolder, and Perfectly Aligned */}
            <span 
              className="font-black tracking-tight" 
              style={{ 
                fontSize: "24px",
                fontFamily: "Inter, sans-serif",
                display: "flex",
                alignItems: "center",
                lineHeight: "1.2",
                paddingBottom: "1px" // Fine-tuning vertical alignment
              }}
            >
              <span className="whitespace-nowrap" style={{ color: "#1c1917" }}>Civic</span>
              <span style={{ color: "#D97706" }}>Voice</span>
            </span>
          </Link>

          {/* Search */}
          <div className="hidden md:flex relative" style={{ position: "relative" }}>
            <span
              className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2"
              style={{ fontSize: 18, color: "#A8A29E" }}
            >
              search
            </span>
            <input
              className="pl-10 pr-4 py-2.5 rounded-full transition-all duration-200 focus:outline-none focus:w-72"
              style={{
                border: "1px solid #E7DDD5",
                background: "#FAF9F7",
                fontSize: 14,
                color: "#1c1917",
                width: 256,
              }}
              onFocus={(e) => {
                e.currentTarget.style.background = "#FFFFFF";
                e.currentTarget.style.borderColor = "#F59E0B";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(245,158,11,0.15)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.background = "#FAF9F7";
                e.currentTarget.style.borderColor = "#E7DDD5";
                e.currentTarget.style.boxShadow = "none";
              }}
              placeholder="Search issues, polls…"
              type="text"
            />
          </div>
        </div>

        {/* ── CENTER: Nav links (Explicit Inline Spacing to guarantee clean layout) ── */}
        <nav className="hidden md:flex items-center gap-3">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-4 py-2.5 rounded-xl text-[14px] font-bold transition-all duration-200"
                style={{
                  color: isActive ? link.accent : "#57534E",
                  background: isActive ? link.tint : "transparent",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLAnchorElement).style.background = link.hoverTint;
                    (e.currentTarget as HTMLAnchorElement).style.color = link.accent;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                    (e.currentTarget as HTMLAnchorElement).style.color = "#57534E";
                  }
                }}
              >
                <span className={`material-symbols-outlined text-[18px] ${isActive ? "icon-filled" : ""}`} style={{ color: link.accent }}>
                  {link.icon}
                </span>
                {link.label}
                {isActive && (
                  <span
                    className="absolute rounded-full"
                    style={{
                      left: 16,
                      right: 16,
                      bottom: 0,
                      height: 3,
                      background: link.accent,
                    }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* ── RIGHT: Actions ── */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0" style={{ display: "flex", alignItems: "center" }}>
          {/* Notification bell */}
          <Link
            href="/notifications"
            className="relative hidden md:flex items-center justify-center rounded-full transition-all"
            style={{ width: 40, height: 40, background: "#FAF9F7" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "#FEF3E2"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "#FAF9F7"; }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 22, color: "#78716C" }}>
              notifications
            </span>
            {hasUnread && (
              <span
                className="absolute rounded-full border-2 border-white animate-pulse"
                style={{ width: 10, height: 10, background: "#EF4444", top: 8, right: 8 }}
              />
            )}
          </Link>

          {/* Divider */}
          <div
            className="shrink-0 hidden md:block"
            style={{ width: 1.5, height: 28, background: "#F0E4D7", borderRadius: 1 }}
          />

          {/* Profile avatar with Unsplash image */}
          <Link href="/dashboard" className="group hidden md:flex items-center gap-2.5" style={{ textDecoration: "none" }}>
            <div
              className="relative rounded-full overflow-hidden transition-all duration-200 group-hover:scale-105"
              style={{
                width: 40,
                height: 40,
                boxShadow: "0 2px 10px rgba(245,158,11,0.30)",
                border: "2px solid #FFFFFF",
                outline: "2px solid #F59E0B",
              }}
            >
              <Image
                src={avatarUrl}
                alt={profileName}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <span className="hidden lg:inline text-sm font-bold text-gray-800 group-hover:text-amber-600 transition-colors">
              {profileName.split(" ")[0]}
            </span>
          </Link>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex items-center justify-center rounded-full transition-colors"
            style={{ width: 40, height: 40, background: "#FAF9F7" }}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 24, color: "#78716C" }}>
              {mobileOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* ── Mobile Menu Drawer ── */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-all duration-300 ${
          mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-stone-900/40 backdrop-blur-xs transition-opacity duration-300"
          onClick={() => setMobileOpen(false)}
        />
        
        {/* Drawer panel */}
        <div
          className={`absolute inset-y-0 right-0 w-[min(320px,calc(100vw-24px))] bg-white shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-out transform ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
          style={{ borderLeft: "1px solid #F0E4D7" }}
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-4 border-b border-[#F0E4D7] shrink-0">
            <Link 
              href="/" 
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2"
              style={{ textDecoration: "none" }}
            >
              <div
                className="rounded-lg flex items-center justify-center bg-gradient-to-br from-amber-500 to-orange-500 shadow-md"
                style={{ width: 32, height: 32 }}
              >
                <span className="material-symbols-outlined icon-filled text-white text-[16px]">
                  how_to_vote
                </span>
              </div>
              <span className="font-black text-stone-900 text-lg tracking-tight">
                Civic<span className="text-amber-600">Voice</span>
              </span>
            </Link>
            <button
              onClick={() => setMobileOpen(false)}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* User Profile Card */}
          <div className="p-4 border-b border-[#F0E4D7] bg-[#FAF9F7] shrink-0">
            <div className="flex items-center gap-3">
              <div
                className="relative rounded-full overflow-hidden shrink-0 border-2 border-amber-500"
                style={{ width: 44, height: 44 }}
              >
                <Image
                  src={avatarUrl}
                  alt={profileName}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-stone-900 truncate text-sm">{profileName}</p>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="text-xs font-semibold text-amber-600 hover:underline flex items-center gap-0.5 mt-0.5"
                >
                  View Dashboard
                  <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 min-h-0 overflow-y-auto py-3 px-3 flex flex-col gap-1">
            {mobileNavLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-sm transition-colors"
                  style={{
                    color: isActive ? link.accent : "#57534E",
                    background: isActive ? link.tint : "transparent",
                  }}
                >
                  <span className={`material-symbols-outlined text-[20px] ${isActive ? "icon-filled" : ""}`} style={{ color: link.accent }}>
                    {link.icon}
                  </span>
                  <span>{link.label}</span>
                  {link.href === "/notifications" && hasUnread && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Drawer Footer Actions */}
          <div className="p-4 border-t border-[#F0E4D7] flex flex-col gap-2 shrink-0">
            <Link
              href="/report"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-white text-sm"
              style={{
                background: "linear-gradient(135deg, #F59E0B, #EA580C)",
                boxShadow: "0 2px 12px rgba(245,158,11,0.35)",
              }}
            >
              <span className="material-symbols-outlined icon-filled" style={{ fontSize: 18 }}>add_circle</span>
              Report Issue
            </Link>
            
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-amber-600 bg-amber-50 hover:bg-amber-100 text-sm transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
              Log out
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
