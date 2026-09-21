"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import Sidebar from "./Sidebar";
import { UserButton, SignInButton, Show, useUser } from "@clerk/nextjs";

// Lazy load ProfileModal so its bundle is only downloaded when opened
const ProfileModal = dynamic(() => import("./ProfileModal"), {
  ssr: false,
});

interface AppLayoutProps {
  children: React.ReactNode;
}

const pageTitles: Record<string, { title: string; desc: string }> = {
  "/dashboard": { title: "Dashboard Overview", desc: "District 9 Civic Command Center" },
  "/report": { title: "Report an Issue", desc: "Flag infrastructure & public safety hazards" },
  "/polls": { title: "District Polls & Surveys", desc: "Vote on city proposals & participatory budgets" },
  "/map": { title: "Interactive Civic Map", desc: "Live geo-spatial reports & community alerts" },
  "/forum": { title: "Community Discussions", desc: "Engage with neighbors & municipal representatives" },
  "/directory": { title: "Representative Directory", desc: "Public official contacts & district offices" },
  "/rewards": { title: "Civic Rewards & Leaderboard", desc: "Citizen points, badges, & district ranking" },
  "/notifications": { title: "Notification Center", desc: "Updates on your reports, polls, and badges" },
};

export default function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [hasUnreadNotifs, setHasUnreadNotifs] = useState(true);
  const [unreadCount, setUnreadCount] = useState(3);
  const [profileName, setProfileName] = useState("Sagar Pathak");
  const { user } = useUser();
  const displayName = user?.fullName || user?.firstName || user?.username || profileName;
  const notifsDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateProfileAndNotifs = () => {
      const storedName = localStorage.getItem("civicvoice_user_name") || "Sagar Pathak";
      setProfileName(storedName);

      const storedNotifs = localStorage.getItem("civicvoice_notifications");
      if (storedNotifs) {
        try {
          const list = JSON.parse(storedNotifs) as Array<{ read?: boolean }>;
          const unread = list.filter((n) => !n.read).length;
          setHasUnreadNotifs(unread > 0);
          setUnreadCount(unread);
        } catch {
          setHasUnreadNotifs(true);
          setUnreadCount(3);
        }
      } else {
        setHasUnreadNotifs(true);
        setUnreadCount(3);
      }
    };

    updateProfileAndNotifs();
    window.addEventListener("profile-updated", updateProfileAndNotifs);
    window.addEventListener("notifications-updated", updateProfileAndNotifs);
    return () => {
      window.removeEventListener("profile-updated", updateProfileAndNotifs);
      window.removeEventListener("notifications-updated", updateProfileAndNotifs);
    };
  }, []);

  // Close notification popover on outside click or Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifsDropdownRef.current && !notifsDropdownRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF9F7]">
      {/* ── Mobile Top Bar (Header inside dashboard for mobile screens) ── */}
      <header className="md:hidden flex justify-between items-center h-16 px-5 bg-white border-b border-[#F0E4D7] sticky top-0 z-40 shadow-xs">
        <button 
          onClick={() => setMobileMenuOpen(true)}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-stone-100 text-stone-600 transition-colors cursor-pointer"
          aria-label="Open navigation drawer"
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>

        <Link href="/" className="flex items-center gap-2" style={{ textDecoration: "none" }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-amber-500 to-orange-500 shadow-md">
            <span className="material-symbols-outlined text-white text-[16px] icon-filled">how_to_vote</span>
          </div>
          <span className="font-black text-stone-900 text-base">Civic<span className="text-amber-600">Voice</span></span>
        </Link>

        {/* Mobile Right: Notification Bell & Profile Avatar */}
        <div className="flex items-center gap-1.5">
          <Link
            href="/notifications"
            className="relative w-9 h-9 rounded-full flex items-center justify-center text-stone-700 hover:bg-stone-100 transition-colors"
            title="Notifications"
            aria-label="View notifications"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            {hasUnreadNotifs && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white animate-pulse" />
            )}
          </Link>

          <Show when="signed-in">
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: "w-8 h-8 rounded-full border-2 border-amber-500 shadow-sm"
                }
              }}
            />
          </Show>
          <Show when="signed-out">
            <SignInButton mode="modal" fallbackRedirectUrl="/dashboard" forceRedirectUrl="/dashboard">
              <button 
                type="button"
                className="px-3 py-1 rounded-full bg-amber-500 text-stone-900 text-xs font-bold hover:bg-amber-400 transition-colors cursor-pointer"
              >
                Log In
              </button>
            </SignInButton>
          </Show>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar Container */}
        <div className={`fixed inset-y-0 left-0 w-64 z-50 md:z-40 transition-transform duration-300 ease-in-out md:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
          <Sidebar 
            onClose={() => setMobileMenuOpen(false)} 
            onOpenProfile={() => setProfileModalOpen(true)}
          />
        </div>

        {/* Backdrop for mobile */}
        {mobileMenuOpen && (
          <div 
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs z-40 md:hidden animate-fade-in"
          />
        )}

        <div className="flex-1 md:ml-64 min-w-0 flex flex-col">
          {/* ── DESKTOP DASHBOARD TOP NAVBAR (Header with Notification Bell & Profile) ── */}
          <header className="hidden md:flex justify-between items-center h-16 px-8 bg-white/90 backdrop-blur-md border-b border-[#F0E4D7] sticky top-0 z-30 shadow-2xs">
            {/* Left: Page Title & Breadcrumb */}
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-base font-black text-stone-900 tracking-tight leading-tight">
                  {pageTitles[pathname]?.title || "Dashboard Overview"}
                </h1>
                <p className="text-[11px] text-stone-500 font-medium leading-none mt-0.5">
                  {pageTitles[pathname]?.desc || "District 9 Civic Hub"}
                </p>
              </div>
            </div>

            {/* Right: Notification Bell & Profile */}
            <div className="flex items-center gap-3" ref={notifsDropdownRef}>
              {/* Notification Bell Dropdown Button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    notificationsOpen
                      ? "bg-amber-100 text-amber-900 shadow-inner"
                      : "hover:bg-stone-100 text-stone-600"
                  }`}
                  aria-label="Open notifications"
                  title="Notifications"
                >
                  <span className="material-symbols-outlined text-[22px]">
                    notifications
                  </span>
                  {hasUnreadNotifs && (
                    <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-white animate-pulse" />
                  )}
                </button>

                {/* Desktop Notifications Dropdown Popover */}
                {notificationsOpen && (
                  <div className="absolute top-full right-0 mt-2 w-84 bg-white rounded-2xl border border-stone-200 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-stone-100 px-1">
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-amber-600 text-[18px]">
                          notifications
                        </span>
                        <span className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                          Notifications
                        </span>
                      </div>
                      {unreadCount > 0 && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200">
                          {unreadCount} new
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 hover:bg-amber-50/50 transition-colors">
                        <div className="flex items-start gap-2.5">
                          <span className="material-symbols-outlined text-emerald-600 text-[18px] mt-0.5 shrink-0">
                            check_circle
                          </span>
                          <div>
                            <p className="text-xs font-bold text-stone-900 leading-snug">
                              Pothole Issue Resolved!
                            </p>
                            <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-2">
                              Public Works completed repair on Elm Blvd.
                            </p>
                            <span className="text-[10px] text-stone-400 mt-1 block">2 hours ago</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 hover:bg-amber-50/50 transition-colors">
                        <div className="flex items-start gap-2.5">
                          <span className="material-symbols-outlined text-amber-600 text-[18px] mt-0.5 shrink-0">
                            how_to_vote
                          </span>
                          <div>
                            <p className="text-xs font-bold text-stone-900 leading-snug">
                              New District Survey
                            </p>
                            <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-2">
                              Vote on District 9 Parks and Green Corridor Budget.
                            </p>
                            <span className="text-[10px] text-stone-400 mt-1 block">5 hours ago</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-stone-100 flex justify-center">
                      <Link
                        href="/notifications"
                        onClick={() => setNotificationsOpen(false)}
                        className="text-xs font-bold text-amber-600 hover:text-amber-700 py-1"
                      >
                        View All in Notifications →
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <Show when="signed-in">
                <div className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-stone-50 border border-stone-200/80">
                  <UserButton
                    appearance={{
                      elements: {
                        userButtonAvatarBox: "w-8 h-8 rounded-full border-2 border-amber-500 shadow-sm"
                      }
                    }}
                  />
                  <div className="text-left hidden lg:block">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-stone-900 leading-none">
                        {displayName}
                      </span>
                      <span className="material-symbols-outlined text-amber-500 text-[14px] icon-filled">verified</span>
                    </div>
                    <p className="text-[10px] text-stone-400 font-medium mt-0.5">District 9 Rep</p>
                  </div>
                </div>
              </Show>

              <Show when="signed-out">
                <SignInButton mode="modal" fallbackRedirectUrl="/dashboard" forceRedirectUrl="/dashboard">
                  <button
                    type="button"
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold text-xs shadow-sm transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">login</span>
                    Log In
                  </button>
                </SignInButton>
              </Show>
            </div>
          </header>

          {/* Main Dashboard Content */}
          <main className="flex-1 min-w-0 p-6 md:p-8 bg-background">{children}</main>
        </div>
      </div>

      {/* Global Profile Modal ("Profile Wala") */}
      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />
    </div>
  );
}
