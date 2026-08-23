"use client";

import AppLayout from "@/components/AppLayout";
import Link from "next/link";
import { useState, useEffect } from "react";

interface TimelineEvent {
  title: string;
  timeText: string;
  description?: string;
  status: "completed" | "current" | "pending";
  icon?: string;
  actor?: string;
}

interface Issue {
  id: string;
  title: string;
  category: string;
  description: string;
  status: "Reported" | "Under Review" | "In Progress" | "Resolved";
  priority: "low" | "medium" | "high";
  date: string; // ISO string
  votes: number;
  icon: string;
  img?: string;
  images?: string[];
  timeline: TimelineEvent[];
}

const CATEGORY_ICONS: Record<string, string> = {
  road: "directions_car",
  lighting: "light_mode",
  sanitation: "delete",
  parks: "park",
  vandalism: "warning",
  safety: "security",
  environment: "eco",
  other: "more_horiz",
};

const CATEGORY_LABELS: Record<string, string> = {
  road: "Road & Transport",
  lighting: "Street Lighting",
  sanitation: "Sanitation",
  parks: "Parks & Green Spaces",
  vandalism: "Vandalism",
  safety: "Public Safety",
  environment: "Environmental",
  other: "Other",
};

const DEFAULT_ISSUES: Issue[] = [
  {
    id: "CV-8924",
    title: "Major Water Leak on Main St",
    category: "Sanitation",
    description: "Water pooling near the intersection of Main and 4th, creating a hazard for motorists and pedestrians.",
    status: "In Progress",
    priority: "high",
    date: "2026-08-20T09:15:00.000Z",
    votes: 34,
    icon: "water_drop",
    img: "/water_leak.jpg",
    timeline: [
      { title: "Report Submitted", timeText: "Aug 20, 2026 - 09:15 AM", status: "completed" },
      { title: "Under Review", timeText: "Aug 20, 2026 - 11:30 AM", status: "completed" },
      {
        title: "Team Assigned",
        timeText: "Aug 21, 2026 - 08:00 AM",
        status: "completed",
        actor: "Water Dept. Dispatch",
        description: "Crew has been assigned to inspect the main line in this area."
      },
      {
        title: "Work in Progress",
        timeText: "Aug 22, 2026 - 10:00 AM",
        status: "current",
        actor: "Maintenance Crew C",
        description: "Crew is currently on-site working on repairs."
      },
      { title: "Resolved", timeText: "Pending completion", status: "pending" }
    ]
  },
  {
    id: "CV-8945",
    title: "Pothole on Oak Ave",
    category: "Road & Transport",
    description: "Deep pothole in the right lane going north. Cars have to swerve to avoid it.",
    status: "Under Review",
    priority: "high",
    date: "2026-08-22T11:00:00.000Z",
    votes: 12,
    icon: "directions_car",
    img: "/pothole_report.jpg",
    timeline: [
      { title: "Report Submitted", timeText: "Aug 22, 2026 - 11:00 AM", status: "completed" },
      {
        title: "Under Review",
        timeText: "Aug 22, 2026 - 02:00 PM",
        status: "current",
        actor: "District 9 Road Office",
        description: "Assigned to a safety inspector for on-site evaluation."
      },
      { title: "Team Assigned", timeText: "Pending dispatch", status: "pending" },
      { title: "Work in Progress", timeText: "Pending schedule", status: "pending" },
      { title: "Resolved", timeText: "Pending completion", status: "pending" }
    ]
  },
  {
    id: "CV-8951",
    title: "Broken streetlight on Elm Blvd",
    category: "Street Lighting",
    description: "The streetlight opposite building 45 has been completely dark for three days, creating safety concerns at night.",
    status: "Reported",
    priority: "medium",
    date: "2026-08-23T05:00:00.000Z",
    votes: 8,
    icon: "light_mode",
    img: "/broken_streetlight.jpg",
    timeline: [
      { title: "Report Submitted", timeText: "Aug 23, 2026 - 05:00 AM", status: "completed" },
      {
        title: "Under Review",
        timeText: "In Progress",
        status: "current",
        description: "Queued for scheduling with city lighting maintenance."
      },
      { title: "Team Assigned", timeText: "Pending", status: "pending" },
      { title: "Work in Progress", timeText: "Pending", status: "pending" },
      { title: "Resolved", timeText: "Pending", status: "pending" }
    ]
  },
  {
    id: "CV-8891",
    title: "Overflowing Trash Bins at Park",
    category: "Parks & Green Spaces",
    description: "Central Park entrance bins haven't been emptied in a week. Trash is blowing onto the footpaths.",
    status: "Resolved",
    priority: "medium",
    date: "2026-08-15T14:20:00.000Z",
    votes: 18,
    icon: "delete",
    img: "/overflowing_bins.jpg",
    timeline: [
      { title: "Report Submitted", timeText: "Aug 15, 2026 - 02:20 PM", status: "completed" },
      { title: "Under Review", timeText: "Aug 15, 2026 - 04:00 PM", status: "completed" },
      { title: "Team Assigned", timeText: "Aug 16, 2026 - 09:00 AM", status: "completed" },
      { title: "Work in Progress", timeText: "Aug 16, 2026 - 11:30 AM", status: "completed" },
      {
        title: "Resolved",
        timeText: "Aug 16, 2026 - 04:30 PM",
        status: "completed",
        actor: "Sanitation Dept.",
        description: "Sanitation crew cleared the trash bins and scheduled daily checks."
      }
    ]
  },
  {
    id: "CV-8872",
    title: "Illegal dumping near River Walk",
    category: "Environmental",
    description: "Construction waste debris left beside the walking path near River Walk.",
    status: "Resolved",
    priority: "high",
    date: "2026-08-10T08:00:00.000Z",
    votes: 56,
    icon: "eco",
    img: "/community_cleanup.jpg",
    timeline: [
      { title: "Report Submitted", timeText: "Aug 10, 2026 - 08:00 AM", status: "completed" },
      { title: "Under Review", timeText: "Aug 10, 2026 - 10:00 AM", status: "completed" },
      { title: "Team Assigned", timeText: "Aug 11, 2026 - 09:00 AM", status: "completed" },
      { title: "Work in Progress", timeText: "Aug 12, 2026 - 11:00 AM", status: "completed" },
      {
        title: "Resolved",
        timeText: "Aug 12, 2026 - 03:00 PM",
        status: "completed",
        actor: "Environmental Safety",
        description: "Waste cleared and area designated as a no-dumping zone with new signage."
      }
    ]
  },
  {
    id: "CV-8854",
    title: "Graffiti Wall near High School",
    category: "Vandalism",
    description: "Vandalism spray paint on the public block wall beside the high school entrance.",
    status: "Resolved",
    priority: "low",
    date: "2026-08-05T12:00:00.000Z",
    votes: 14,
    icon: "warning",
    img: "/graffiti_wall.jpg",
    timeline: [
      { title: "Report Submitted", timeText: "Aug 5, 2026 - 12:00 PM", status: "completed" },
      { title: "Under Review", timeText: "Aug 5, 2026 - 02:00 PM", status: "completed" },
      { title: "Team Assigned", timeText: "Aug 6, 2026 - 10:00 AM", status: "completed" },
      { title: "Work in Progress", timeText: "Aug 7, 2026 - 09:00 AM", status: "completed" },
      {
        title: "Resolved",
        timeText: "Aug 7, 2026 - 01:00 PM",
        status: "completed",
        actor: "District Anti-Graffiti Unit",
        description: "Wall repainted to match building facade."
      }
    ]
  }
];

const isTeamAssigned = (issue: Issue) => {
  const event = issue.timeline.find((e) => e.title === "Team Assigned");
  return event ? event.status !== "pending" : false;
};

export default function MyIssuesPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [expandedIssueId, setExpandedIssueId] = useState<string | null>("CV-8924");
  const [filter, setFilter] = useState<"All" | "Active" | "Resolved">("All");
  const [sortBy, setSortBy] = useState<"Newest First" | "Oldest First" | "Status">("Newest First");

  useEffect(() => {
    // Check URL parameters for tab filter
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab");
      setTimeout(() => {
        if (tab === "resolved") {
          setFilter("Resolved");
        } else if (tab === "active") {
          setFilter("Active");
        }
      }, 0);
    }

    // Load local storage issues
    const stored = localStorage.getItem("civicvoice_user_issues");
    let userIssues: Issue[] = [];
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        userIssues = parsed.map((item: {
          id?: string;
          title?: string;
          category: string;
          description?: string;
          status?: "Reported" | "Under Review" | "In Progress" | "Resolved";
          priority?: "low" | "medium" | "high";
          createdAt?: string;
          votes?: number;
          img?: string;
        }) => {
          const dateStr = item.createdAt || new Date().toISOString();
          const localDate = new Date(dateStr);
          const formattedDate = localDate.toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
          });

          return {
            id: item.id || `CV-${Math.floor(1000 + Math.random() * 9000)}`,
            title: item.title || "Reported Issue",
            category: CATEGORY_LABELS[item.category] || "Other",
            description: item.description || "",
            status: item.status || "Reported",
            priority: item.priority || "medium",
            date: dateStr,
            votes: item.votes || 1,
            icon: CATEGORY_ICONS[item.category] || "more_horiz",
            img: item.img || (
              item.category === "road" ? "/pothole_report.jpg" :
              item.category === "sanitation" ? "/overflowing_bins.jpg" :
              item.category === "lighting" ? "/broken_streetlight.jpg" :
              item.category === "parks" ? "/community_cleanup.jpg" :
              item.category === "vandalism" ? "/graffiti_wall.jpg" :
              item.category === "environment" ? "/community_cleanup.jpg" :
              "/badges_visual.jpg"
            ),
            timeline: [
              { title: "Report Submitted", timeText: formattedDate, status: "completed" },
              {
                title: "Under Review",
                timeText: "In Progress",
                status: "current",
                description: "Our city dispatchers are reviewing the details of your report."
              },
              { title: "Team Assigned", timeText: "Pending", status: "pending" },
              { title: "Work in Progress", timeText: "Pending", status: "pending" },
              { title: "Resolved", timeText: "Pending", status: "pending" }
            ]
          };
        });
      } catch (err) {
        console.error("Failed to parse user issues from localStorage", err);
      }
    }

    const deletedStored = localStorage.getItem("civicvoice_deleted_issues");
    let deletedIds: string[] = [];
    if (deletedStored) {
      try {
        deletedIds = JSON.parse(deletedStored);
      } catch (err) {
        console.error("Failed to parse deleted issue IDs", err);
      }
    }

    setTimeout(() => {
      const combined = [...userIssues, ...DEFAULT_ISSUES];
      setIssues(combined.filter((issue) => !deletedIds.includes(issue.id)));
    }, 0);
  }, []);

  // Filter logic
  const filteredIssues = issues.filter((issue) => {
    if (filter === "All") return true;
    if (filter === "Resolved") return issue.status === "Resolved";
    // Active means Reported, Under Review, or In Progress
    return issue.status !== "Resolved";
  });

  // Sort logic
  const sortedIssues = [...filteredIssues].sort((a, b) => {
    if (sortBy === "Newest First") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    if (sortBy === "Oldest First") {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
    if (sortBy === "Status") {
      // Group by status relevance: In Progress > Under Review > Reported > Resolved
      const score: Record<string, number> = {
        "In Progress": 4,
        "Under Review": 3,
        Reported: 2,
        Resolved: 1,
      };
      return (score[b.status] || 0) - (score[a.status] || 0);
    }
    return 0;
  });

  // Statistics calculation
  const totalReported = issues.length;
  const resolvedCount = issues.filter((i) => i.status === "Resolved").length;
  const inProgressCount = issues.filter((i) => i.status !== "Resolved").length;
  const civicPoints = 1250 + (issues.length - DEFAULT_ISSUES.length) * 50; // Earn 50 points per report

  const handleToggleExpand = (id: string) => {
    setExpandedIssueId(expandedIssueId === id ? null : id);
  };

  const handleDeleteIssue = (id: string) => {
    if (!window.confirm("Are you sure you want to withdraw this report? This action cannot be undone.")) {
      return;
    }

    const deletedStored = localStorage.getItem("civicvoice_deleted_issues");
    let deletedIds: string[] = [];
    if (deletedStored) {
      try {
        deletedIds = JSON.parse(deletedStored);
      } catch (err) {
        console.error("Failed to parse deleted issues from localStorage", err);
      }
    }
    if (!deletedIds.includes(id)) {
      deletedIds.push(id);
      localStorage.setItem("civicvoice_deleted_issues", JSON.stringify(deletedIds));
    }

    setIssues((prev) => prev.filter((issue) => issue.id !== id));
    const stored = localStorage.getItem("civicvoice_user_issues");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const updated = parsed.filter((item: Issue) => item.id !== id);
        localStorage.setItem("civicvoice_user_issues", JSON.stringify(updated));
      } catch (err) {
        console.error("Failed to delete user issue from localStorage", err);
      }
    }
  };

  const getStatusBadge = (status: Issue["status"]) => {
    const configs: Record<
      Issue["status"],
      {
        text: string;
        borderColor: string;
        icon: string;
        glowColor: string;
      }
    > = {
      Reported: {
        text: "text-stone-500 dark:text-stone-400",
        borderColor: "border-stone-300 dark:border-stone-700",
        icon: "drafts",
        glowColor: "bg-stone-400",
      },
      "Under Review": {
        text: "text-blue-600 dark:text-blue-400",
        borderColor: "border-blue-200 dark:border-blue-800",
        icon: "visibility",
        glowColor: "bg-blue-500",
      },
      "In Progress": {
        text: "text-amber-600 dark:text-amber-400",
        borderColor: "border-amber-200 dark:border-amber-800",
        icon: "pending",
        glowColor: "bg-amber-500",
      },
      Resolved: {
        text: "text-emerald-600 dark:text-emerald-400",
        borderColor: "border-emerald-200 dark:border-emerald-800",
        icon: "verified",
        glowColor: "bg-emerald-500",
      },
    };
    
    const c = configs[status] || configs.Reported;
    
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-transparent border ${c.borderColor} ${c.text} shadow-xs hover:scale-[1.02] transition-all duration-200`}
      >
        <span className="material-symbols-outlined text-[13px]" style={{ fontSize: 13 }}>
          {c.icon}
        </span>
        <span>{status}</span>
        <span className="relative flex h-1.5 w-1.5 ml-0.5">
          {status === "In Progress" && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          )}
          <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${c.glowColor}`}></span>
        </span>
      </span>
    );
  };

  const getPriorityBadge = (priority: Issue["priority"]) => {
    const configs: Record<Issue["priority"], { bg: string; text: string }> = {
      low: { bg: "bg-stone-100 text-stone-600", text: "Low Priority" },
      medium: { bg: "bg-amber-50 text-amber-600", text: "Medium Priority" },
      high: { bg: "bg-red-50 text-red-600", text: "High Priority" }
    };
    const c = configs[priority] || configs.medium;
    return (
      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${c.bg}`}>
        {c.text}
      </span>
    );
  };

  return (
    <AppLayout>
      <div className="max-w-[1200px] mx-auto animate-fade-in pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-stone-900 tracking-tight text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #1c1917, #44403c)" }}>My Issues</h1>
            <p className="text-stone-500 text-sm md:text-base mt-1">
              Track resolution progress and status of your reported community issues.
            </p>
          </div>
          <Link
            href="/report"
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #f59e0b, #d97706)",
              boxShadow: "0 4px 12px rgba(217,119,6,0.25)"
            }}
          >
            <span className="material-symbols-outlined icon-filled" style={{ fontSize: 18 }}>add_circle</span>
            Report New Issue
          </Link>
        </div>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {[
            { label: "Total Reported", value: totalReported, color: "text-blue-600", bg: "bg-blue-50 border-blue-100", icon: "assignment" },
            { label: "Resolved Issues", value: resolvedCount, color: "text-green-600", bg: "bg-green-50 border-green-100", icon: "check_circle" },
            { label: "In Progress", value: inProgressCount, color: "text-amber-600", bg: "bg-amber-50 border-amber-100", icon: "pending_actions" },
            { label: "Civic Points", value: civicPoints, color: "text-purple-600", bg: "bg-purple-50 border-purple-100", icon: "military_tech" },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-stone-200/60 p-6 flex items-center justify-between shadow-xs hover:shadow-sm transition-all duration-200"
            >
              <div>
                <p className="text-xs text-stone-400 font-bold uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-black text-stone-900 mt-1.5">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} border shrink-0`}>
                <span className={`material-symbols-outlined text-[24px] ${stat.icon === "military_tech" || stat.icon === "check_circle" ? "icon-filled" : ""} ${stat.color}`}>
                  {stat.icon}
                </span>
              </div>
            </div>
          ))}
        </section>

        {/* Filters and Search row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex gap-4 border-b border-stone-200 dark:border-stone-800 pb-px w-full md:w-auto">
            {(["All", "Active", "Resolved"] as const).map((tab) => {
              const isActive = filter === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-3 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer border-b-2 -mb-px ${
                    isActive
                      ? "border-amber-500 text-amber-600 font-black"
                      : "border-transparent text-stone-400 dark:text-stone-500 hover:text-stone-700 hover:border-stone-300"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Sort by</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "Newest First" | "Oldest First" | "Status")}
              className="text-sm font-semibold border border-stone-200 bg-white rounded-xl text-stone-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent min-w-[140px]"
            >
              <option value="Newest First">Newest First</option>
              <option value="Oldest First">Oldest First</option>
              <option value="Status">By Status</option>
            </select>
          </div>
        </div>

        {/* Issues List Container */}
        {sortedIssues.length === 0 ? (
          <div className="bg-white rounded-3xl border border-stone-200/60 p-12 text-center shadow-xs">
            <span className="material-symbols-outlined text-stone-300 text-[64px]">assignment_late</span>
            <h3 className="text-lg font-bold text-stone-800 mt-4">No reported issues found</h3>
            <p className="text-stone-500 text-sm mt-1 max-w-sm mx-auto">
              You haven&apos;t reported any issues matching this filter. Submit a report to get started!
            </p>
            <Link
              href="/report"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 font-bold text-xs rounded-xl mt-5 transition-all duration-200"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
              Report New Issue
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {sortedIssues.map((issue) => {
              const isExpanded = expandedIssueId === issue.id;
              const formattedDate = new Date(issue.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric"
              });

              return (
                <div
                  key={issue.id}
                  className="bg-white rounded-3xl border border-stone-200/60 shadow-xs overflow-hidden transition-all duration-300"
                >
                  {/* Collapsed Header click area */}
                  <div
                    onClick={() => handleToggleExpand(issue.id)}
                    className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer hover:bg-stone-50/50 transition-colors"
                  >
                    <div className="flex gap-4 items-start flex-1 min-w-0">
                      {/* Image / Icon */}
                      <div className="w-16 h-16 rounded-2xl overflow-hidden border border-stone-200/60 shrink-0 relative bg-stone-50 flex items-center justify-center">
                        {issue.images && issue.images.length > 0 ? (
                          <img
                            src={issue.images[0]}
                            alt={issue.title}
                            className="object-cover w-full h-full hover:scale-110 transition-transform duration-500"
                          />
                        ) : issue.img ? (
                          <img
                            src={issue.img}
                            alt={issue.title}
                            className="object-cover w-full h-full hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <span className="material-symbols-outlined text-[24px] text-amber-600">
                            {issue.icon}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                          {getStatusBadge(issue.status)}
                          {getPriorityBadge(issue.priority)}
                          <span className="text-xs text-stone-400 font-semibold font-mono">ID: {issue.id}</span>
                        </div>
                        <h3 className="text-base md:text-lg font-black text-stone-900 leading-snug truncate">
                          {issue.title}
                        </h3>
                        <p className="text-stone-400 text-xs font-semibold mt-1">
                          {issue.category} · Reported {formattedDate}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 self-end md:self-auto">
                      <div className="flex items-center gap-1 text-xs font-bold text-stone-500 bg-stone-100 px-3 py-1.5 rounded-lg">
                        <span className="material-symbols-outlined text-[16px] icon-filled text-stone-400">thumb_up</span>
                        <span>{issue.votes} upvotes</span>
                      </div>
                      <span
                        className={`material-symbols-outlined text-stone-400 transition-transform duration-300 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      >
                        expand_more
                      </span>
                    </div>
                  </div>

                  {/* Expanded Body Details (Timeline & Details) */}
                  {isExpanded && (
                    <div className="border-t border-stone-200/50 bg-stone-50/40 p-6 md:p-8 animate-fade-in">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left/Middle Column: Issue description and detail metrics */}
                        <div className="lg:col-span-2 space-y-6">
                          <div>
                            <h4 className="text-xs font-black text-stone-400 uppercase tracking-widest mb-2">Description</h4>
                            <p className="text-stone-600 text-sm md:text-base leading-relaxed whitespace-pre-line">
                              {issue.description || "No description provided."}
                            </p>
                            {issue.images && issue.images.length > 0 && (
                              <div className="mt-4">
                                <h4 className="text-xs font-black text-stone-400 uppercase tracking-widest mb-3">Attached Photos</h4>
                                <div className="flex flex-wrap gap-3">
                                  {issue.images.map((img: string, idx: number) => (
                                    <div key={idx} className="w-24 h-24 rounded-xl overflow-hidden border border-stone-200 bg-stone-100 relative group cursor-zoom-in">
                                      <img 
                                        src={img} 
                                        alt={`Attached issue photo ${idx + 1}`} 
                                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          window.open(img, "_blank");
                                        }}
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-6 pt-4 border-t border-stone-200/30">
                            <div>
                              <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Reported On</p>
                              <p className="text-sm font-bold text-stone-700 mt-1">
                                {new Date(issue.date).toLocaleString("en-US", {
                                  dateStyle: "medium",
                                  timeStyle: "short"
                                })}
                              </p>
                            </div>
                            <div>
                              <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Community Impact</p>
                              <p className="text-sm font-bold text-stone-700 mt-1">
                                {issue.votes + 1} citizens supporting this report
                              </p>
                            </div>
                          </div>

                          {!isTeamAssigned(issue) && (
                            <div className="pt-4 border-t border-stone-200/30 flex justify-end">
                              <button
                                onClick={() => handleDeleteIssue(issue.id)}
                                className="flex items-center gap-1.5 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-[16px]">delete</span>
                                Withdraw Report
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Right Column: Interactive Resolution timeline */}
                        <div className="border-t lg:border-t-0 lg:border-l border-stone-200/80 pt-6 lg:pt-0 lg:pl-8">
                          <h4 className="text-xs font-black text-stone-400 uppercase tracking-widest mb-6">Resolution Status</h4>
                          
                          <div className="relative pl-6 space-y-6">
                            {/* Line connecting milestones */}
                            <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-stone-200" />
                            
                            {issue.timeline.map((event, idx) => {
                              const isCompleted = event.status === "completed";
                              const isCurrent = event.status === "current";

                              return (
                                <div key={idx} className="relative">
                                  {/* Milestone Bullet */}
                                  <div
                                    className={`absolute -left-6.5 top-1 flex items-center justify-center w-5 h-5 rounded-full z-10 ring-4 ring-white ${
                                      isCompleted
                                        ? "bg-green-500 text-white"
                                        : isCurrent
                                        ? "bg-amber-500 text-white animate-pulse"
                                        : "bg-stone-200 text-stone-400"
                                    }`}
                                  >
                                    <span className="material-symbols-outlined text-[10px] font-bold">
                                      {isCompleted ? "check" : isCurrent ? "fiber_manual_record" : "radio_button_unchecked"}
                                    </span>
                                  </div>

                                  <div>
                                    <h5 className={`text-xs font-black ${isCurrent ? "text-amber-600" : "text-stone-800"}`}>
                                      {event.title}
                                    </h5>
                                    <p className="text-[10px] text-stone-400 mt-0.5">{event.timeText}</p>
                                    
                                    {event.description && (isCompleted || isCurrent) && (
                                      <div className="mt-2 bg-white border border-stone-200/60 rounded-xl p-3 text-xs shadow-xs relative">
                                        <div className="absolute -left-[5px] top-3 w-0 h-0 border-t-4 border-t-transparent border-r-[5px] border-r-white border-b-4 border-b-transparent" />
                                        <div className="absolute -left-[6px] top-3 w-0 h-0 border-t-4 border-t-transparent border-r-[5px] border-r-stone-200 border-b-4 border-b-transparent -z-10" />
                                        {event.actor && (
                                          <p className="font-bold text-stone-900 mb-1 flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-[12px] text-stone-400">engineering</span>
                                            {event.actor}
                                          </p>
                                        )}
                                        <p className="text-stone-600 leading-relaxed">{event.description}</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
