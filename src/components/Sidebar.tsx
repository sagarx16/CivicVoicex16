"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";

const navItems = [
  { href: "/dashboard", icon: "dashboard", label: "Dashboard", color: "text-blue-600", activeBg: "bg-blue-50" },
  { href: "/report", icon: "report_problem", label: "Report Issue", color: "text-red-600", activeBg: "bg-red-50" },
  { href: "/polls", icon: "poll", label: "Polls", color: "text-purple-600", activeBg: "bg-purple-50" },
  { href: "/map", icon: "map", label: "Map", color: "text-green-600", activeBg: "bg-green-50" },
  { href: "/forum", icon: "forum", label: "Forum", color: "text-violet-600", activeBg: "bg-violet-50" },
  { href: "/directory", icon: "contact_page", label: "Directory", color: "text-teal-600", activeBg: "bg-teal-50" },
  { href: "/rewards", icon: "military_tech", label: "Rewards", color: "text-amber-600", activeBg: "bg-amber-50" },
  { href: "/notifications", icon: "notifications", label: "Notifications", color: "text-pink-600", activeBg: "bg-pink-50" },
];

interface SidebarProps {
  onClose?: () => void;
  onOpenProfile?: () => void;
}

export default function Sidebar({ onClose, onOpenProfile }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [hasUnread, setHasUnread] = useState(false);
  const [profileName, setProfileName] = useState("Sagar Pathak");
  const [avatarUrl, setAvatarUrl] = useState("https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150&h=150");
  const { user } = useUser();
  const { signOut } = useClerk();
  const displayName = user?.fullName || user?.firstName || user?.username || profileName;
  const displayAvatar = user?.imageUrl || avatarUrl;

  useEffect(() => {
    const updateProfile = () => {
      const storedName = localStorage.getItem("civicvoice_user_name") || "Sagar Pathak";
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
          const list = JSON.parse(stored) as Array<{ read?: boolean }>;
          setHasUnread(list.some((n) => !n.read));
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

  return (
    <aside
      className="flex flex-col h-full w-full py-6 px-4 overflow-y-auto"
      style={{
        background: "#FAF9F7",
        borderRight: "1px solid #F0E4D7",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
      }}
    >
      {/* ── TOP SECTION: Navigation Links ── */}
      <div className="flex flex-col gap-1 flex-grow relative">
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center hover:bg-stone-200 text-stone-500 focus:outline-none"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        )}
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center gap-3 px-3 pb-5 mb-4 border-b border-amber-100 group"
          style={{ textDecoration: "none" }}
        >
          <div
            className="rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-105"
            style={{
              width: 48,
              height: 48,
              background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
              boxShadow: "0 3px 12px rgba(217,119,6,0.28)",
            }}
          >
            <span className="material-symbols-outlined icon-filled text-white" style={{ fontSize: 26 }}>
              how_to_vote
            </span>
          </div>
          <span className="font-black tracking-tight text-[26px]">
            <span className="text-stone-900">Civic</span>
            <span className="text-amber-600">Voice</span>
          </span>
        </Link>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group font-bold text-sm"
              style={{
                background: isActive ? "#FEF3E2" : "transparent",
                color: isActive ? "#D97706" : "#78716C",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLAnchorElement).style.background = "#F5F0EB";
                  (e.currentTarget as HTMLAnchorElement).style.color = "#44403C";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                  (e.currentTarget as HTMLAnchorElement).style.color = "#78716C";
                }
              }}
            >
              <span
                className={`material-symbols-outlined text-[22px] transition-all ${isActive ? "icon-filled" : ""}`}
                style={{ color: isActive ? "#D97706" : "#78716C" }}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
              {item.href === "/notifications" && !isActive && hasUnread && (
                <span
                  className="ml-auto w-2 h-2 rounded-full"
                  style={{ background: "#EF4444" }}
                />
              )}
            </Link>
          );
        })}
      </div>

      {/* ── BOTTOM SECTION: Profile Card + Logout ── */}
      <div className="flex flex-col gap-2 pt-3 border-t border-amber-100">
        <button
          type="button"
          onClick={() => {
            onClose?.();
            onOpenProfile?.();
          }}
          className="flex items-center gap-3 p-2.5 rounded-2xl bg-white hover:bg-amber-50/80 border border-stone-200 transition-all text-left cursor-pointer group shadow-2xs hover:shadow-xs"
          title="Open Profile"
        >
          <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-amber-500 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={displayAvatar} alt={displayName} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-xs font-black text-stone-900 truncate group-hover:text-amber-700">
                {displayName}
              </span>
              <span className="material-symbols-outlined text-amber-500 text-[14px] icon-filled">verified</span>
            </div>
            <p className="text-[10px] text-stone-500 font-semibold truncate">District 9 · 1,250 Pts</p>
          </div>
          <span className="material-symbols-outlined text-stone-400 group-hover:text-amber-600 text-[18px]">
            account_circle
          </span>
        </button>

        <button
          type="button"
          onClick={async () => {
            onClose?.();
            await signOut(() => router.push("/"));
          }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group font-bold text-xs text-amber-700 bg-amber-50 hover:bg-amber-100 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px] text-amber-600">logout</span>
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
}
