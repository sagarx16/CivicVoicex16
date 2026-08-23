"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { href: "/dashboard", icon: "dashboard", label: "Dashboard", color: "text-blue-600", activeBg: "bg-blue-50" },
  { href: "/profile", icon: "account_circle", label: "My Profile", color: "text-amber-600", activeBg: "bg-amber-50" },
  { href: "/my-issues", icon: "assignment", label: "My Issues", color: "text-amber-600", activeBg: "bg-amber-50" },
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
}

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [hasUnread, setHasUnread] = useState(false);

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
      {/* ── TOP SECTION: Navigation Links (No User Profile Card) ── */}
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

      <button
        type="button"
        onClick={() => {
          onClose?.();
          router.push("/login");
        }}
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group font-bold text-sm text-amber-600 bg-amber-50 hover:bg-amber-100"
      >
        <span className="material-symbols-outlined text-[22px] text-amber-600">logout</span>
        <span>Log out</span>
      </button>
    </aside>
  );
}
