"use client";

import AppLayout from "@/components/AppLayout";
import { useState, useEffect } from "react";

const notifications = [
  { id: 1, icon: "check_circle", iconColor: "text-green-600", bgColor: "bg-green-50", title: "Issue resolved!", body: "Your report 'Broken streetlight on Elm Blvd' has been marked as resolved by the Public Works department.", time: "2 hours ago", read: false, type: "issue" },
  { id: 2, icon: "thumb_up", iconColor: "text-blue-600", bgColor: "bg-blue-50", title: "34 upvotes on your report", body: "Your pothole report on Main Street is gaining traction in the community.", time: "5 hours ago", read: false, type: "engagement" },
  { id: 3, icon: "poll", iconColor: "text-purple-600", bgColor: "bg-purple-50", title: "New poll: Bike Lane Expansion", body: "A new poll has been posted by the District Council. It ends in 3 days — vote now!", time: "8 hours ago", read: false, type: "poll" },
  { id: 4, icon: "military_tech", iconColor: "text-yellow-600", bgColor: "bg-yellow-50", title: "Badge earned: Trendsetter!", body: "Congratulations! You earned the 'Trendsetter' badge for receiving 50+ upvotes on a report.", time: "1 day ago", read: true, type: "badge" },
  { id: 5, icon: "chat_bubble", iconColor: "text-primary", bgColor: "bg-primary-fixed/20", title: "New reply in your forum post", body: "Emily R. replied to your thread: 'Community garden at Riverside — who's interested?'", time: "2 days ago", read: true, type: "forum" },
  { id: 6, icon: "verified", iconColor: "text-blue-700", bgColor: "bg-blue-50", title: "Official Update: District 9 Grant", body: "The City Council posted an official update on the cycling infrastructure grant approval.", time: "2 days ago", read: true, type: "official" },
  { id: 7, icon: "local_activity", iconColor: "text-rose-600", bgColor: "bg-rose-50", title: "Event reminder: Community Cleanup", body: "The Riverside Walk cleanup event starts in 2 hours. 18 volunteers have signed up.", time: "3 days ago", read: true, type: "event" },
];

const filters = ["All", "Issues", "Polls", "Forum", "Badges"];

export default function NotificationsPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [notifs, setNotifs] = useState<typeof notifications>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("civicvoice_notifications");
    setTimeout(() => {
      if (stored) {
        try {
          setNotifs(JSON.parse(stored));
        } catch (err) {
          setNotifs(notifications);
        }
      } else {
        localStorage.setItem("civicvoice_notifications", JSON.stringify(notifications));
        setNotifs(notifications);
      }
      setMounted(true);
    }, 0);
  }, []);

  const typeMap: Record<string, string> = {
    issue: "Issues",
    poll: "Polls",
    forum: "Forum",
    badge: "Badges",
    engagement: "Issues",
    official: "Issues",
    event: "Issues",
  };

  const filtered = mounted
    ? notifs.filter((n) => activeFilter === "All" || typeMap[n.type] === activeFilter)
    : [];

  const unreadCount = notifs.filter((n) => !n.read).length;

  const markAllRead = () => {
    const updated = notifs.map((n) => ({ ...n, read: true }));
    setNotifs(updated);
    localStorage.setItem("civicvoice_notifications", JSON.stringify(updated));
    window.dispatchEvent(new Event("notifications-updated"));
  };

  const markRead = (id: number) => {
    const updated = notifs.map((n) => (n.id === id ? { ...n, read: true } : n));
    setNotifs(updated);
    localStorage.setItem("civicvoice_notifications", JSON.stringify(updated));
    window.dispatchEvent(new Event("notifications-updated"));
  };

  return (
    <AppLayout>
      <div className="max-w-[720px] mx-auto animate-fade-in">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-headline-lg-mobile md:text-headline-md font-bold text-on-surface">
              Notifications
            </h1>
            <p className="text-body-md text-on-surface-variant mt-1">
              {unreadCount > 0 ? (
                <span className="text-primary font-medium">{unreadCount} unread</span>
              ) : (
                "All caught up!"
              )}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-label-md text-primary hover:underline flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">done_all</span>
              Mark all read
            </button>
          )}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-full text-label-md whitespace-nowrap transition-colors ${
                activeFilter === f
                  ? "bg-primary-container text-on-primary-container shadow-subtle"
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Notifications list */}
        <div className="flex flex-col gap-2">
          {filtered.map((notif) => (
            <button
              key={notif.id}
              onClick={() => markRead(notif.id)}
              className={`w-full text-left civic-card p-4 flex gap-4 transition-all ${
                !notif.read ? "border-l-4 border-l-primary-container" : ""
              }`}
            >
              <div className="w-10 h-10 flex items-center justify-center shrink-0">
                <span className={`material-symbols-outlined icon-filled ${notif.iconColor} text-[24px]`}>
                  {notif.icon}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-body-md font-medium ${!notif.read ? "text-on-surface" : "text-on-surface-variant"}`}>
                    {notif.title}
                  </p>
                  {!notif.read && (
                    <div className="w-2 h-2 bg-primary-container rounded-full shrink-0 mt-1.5" />
                  )}
                </div>
                <p className="text-body-sm text-on-surface-variant mt-0.5 leading-snug">
                  {notif.body}
                </p>
                <p className="text-label-sm text-on-surface-variant mt-1.5 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">schedule</span>
                  {notif.time}
                </p>
              </div>
            </button>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <span className="material-symbols-outlined text-on-surface-variant text-[48px]">
                notifications_none
              </span>
              <p className="text-body-lg text-on-surface-variant mt-2">No notifications here</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
