"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "./Sidebar";

interface AppLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { href: "/dashboard", icon: "dashboard", label: "Dashboard" },
  { href: "/my-issues", icon: "assignment", label: "Issues" },
  { href: "/map", icon: "map", label: "Map" },
  { href: "/forum", icon: "forum", label: "Forum" },
  { href: "/polls", icon: "poll", label: "Polls" },
  { href: "/notifications", icon: "notifications", label: "Alerts" },
];

export default function AppLayout({ children }: AppLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150&h=150");
  const [hasUnread, setHasUnread] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const updateAvatar = () => {
      const storedAvatar = localStorage.getItem("civicvoice_avatar_url") || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150&h=150";
      setAvatarUrl(storedAvatar);
    };
    updateAvatar();
    window.addEventListener("profile-updated", updateAvatar);
    return () => window.removeEventListener("profile-updated", updateAvatar);
  }, []);

  useEffect(() => {
    const updateNotifications = () => {
      const stored = localStorage.getItem("civicvoice_notifications");
      if (stored) {
        try {
          const list = JSON.parse(stored);
          setHasUnread(list.some((n: { read?: boolean }) => !n.read));
        } catch {
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

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 100);
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF9F7]">
      {/* ── NAVBAR (Mobile + Desktop top bar) ── */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#F0E4D7] shadow-sm">
        <div className="flex items-center gap-2 h-14 px-3 sm:px-4 md:pl-72 md:pr-6">
          {/* Mobile: Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-full hover:bg-stone-100 text-stone-600 transition-colors shrink-0"
          >
            <span className="material-symbols-outlined text-[22px]">menu</span>
          </button>

          {/* Mobile Logo */}
          <Link href="/" className="md:hidden flex items-center gap-2" style={{ textDecoration: "none" }}>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-gradient-to-br from-amber-500 to-orange-500 shadow-md">
              <span className="material-symbols-outlined text-white text-[14px] icon-filled">how_to_vote</span>
            </div>
            <span className="font-black text-stone-900 text-base">Civic<span className="text-amber-600">Voice</span></span>
          </Link>

          {/* Desktop: Page title area (spacer) */}
          <div className="hidden md:flex flex-1 items-center">
            {/* Search bar — desktop always visible */}
            <form onSubmit={handleSearch} className="relative w-full max-w-xs">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-stone-400">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search issues, polls, forums…"
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-400/20 transition-all"
              />
            </form>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2 ml-auto shrink-0">
            {/* Search icon — mobile only (toggle) */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-full hover:bg-stone-100 text-stone-500 transition-colors"
            >
              <span className="material-symbols-outlined text-[22px]">{searchOpen ? "close" : "search"}</span>
            </button>

            {/* Report button */}
            <Link
              href="/report"
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold text-white shrink-0"
              style={{ background: "linear-gradient(135deg, #F59E0B, #EA580C)" }}
            >
              <span className="material-symbols-outlined text-[14px] icon-filled">add</span>
              <span className="hidden sm:inline">Report</span>
            </Link>

            {/* Profile Avatar */}
            <Link href="/profile" className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-amber-500 shadow-sm shrink-0">
              <Image src={avatarUrl} alt="Avatar" fill className="object-cover" unoptimized />
            </Link>
          </div>
        </div>

        {/* Mobile Search Bar (slides down when searchOpen) */}
        {searchOpen && (
          <div className="md:hidden px-4 pb-3 animate-fade-in">
            <form onSubmit={handleSearch} className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-stone-400">search</span>
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search issues, polls, forums…"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-400/20 transition-all"
              />
            </form>
          </div>
        )}
      </header>

      <div className="flex flex-1">
        {/* Sidebar Container — desktop fixed, mobile slide-in drawer */}
        <div className={`fixed inset-y-0 left-0 w-64 z-50 md:z-40 transition-transform duration-300 ease-in-out md:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
          <Sidebar onClose={() => setMobileMenuOpen(false)} />
        </div>

        {/* Backdrop for mobile */}
        {mobileMenuOpen && (
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs z-40 md:hidden animate-fade-in"
          />
        )}

        <main className="flex-1 md:ml-64 min-w-0 p-3 sm:p-4 md:p-8 pb-24 md:pb-8 bg-background">{children}</main>
      </div>

      {/* ── Mobile Bottom Navigation Bar ── */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-[#F0E4D7] shadow-lg">
        <div className="flex items-stretch">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex-1 flex flex-col items-center justify-center py-2 gap-0.5 relative transition-colors"
                style={{ color: isActive ? "#D97706" : "#78716C" }}
              >
                {isActive && (
                  <span className="absolute top-0 inset-x-2 h-0.5 rounded-b-full bg-amber-500" />
                )}
                <span className={`material-symbols-outlined text-[22px] ${isActive ? "icon-filled" : ""}`}>
                  {item.icon}
                </span>
                {item.href === "/notifications" && hasUnread && (
                  <span className="absolute top-1.5 right-1/4 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse" />
                )}
                <span className="text-[10px] font-bold">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
