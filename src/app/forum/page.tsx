"use client";

import AppLayout from "@/components/AppLayout";
import { useState } from "react";
import Image from "next/image";

const categories = ["All", "Infrastructure", "Environment", "Community", "Policy", "Events"];

const threads = [
  {
    id: 1,
    title: "Why hasn't the pothole on Main St been fixed after 3 reports?",
    category: "Infrastructure",
    author: "Sarah M.",
    avatar: "SM",
    replies: 24,
    upvotes: 87,
    time: "2 hours ago",
    pinned: true,
    preview: "I submitted three separate reports over the last month and the city portal says \"In Progress\" but nothing has changed...",
    img: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: 2,
    title: "Proposed community garden at Riverside — who's interested?",
    category: "Community",
    author: "Daniel K.",
    avatar: "DK",
    replies: 42,
    upvotes: 134,
    time: "5 hours ago",
    pinned: false,
    preview: "I've been in contact with the parks department about converting the empty lot at Riverside Walk into a community garden...",
    img: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: 3,
    title: "Update on the District 9 cycling infrastructure grant",
    category: "Policy",
    author: "City Official",
    avatar: "CO",
    replies: 18,
    upvotes: 56,
    time: "1 day ago",
    pinned: true,
    preview: "I'm happy to share that the district has received approval for a $2.4M grant to expand cycling infrastructure in 2027...",
    official: true,
    img: "https://images.unsplash.com/photo-1541614101331-1a5a3a194e92?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: 4,
    title: "Litter on Oak Avenue — let's organize a cleanup!",
    category: "Environment",
    author: "Priya N.",
    avatar: "PN",
    replies: 31,
    upvotes: 72,
    time: "2 days ago",
    pinned: false,
    preview: "Every morning I walk past mountains of litter on Oak Ave. I'm thinking about organizing a community cleanup this Saturday...",
    img: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: 5,
    title: "Summer festival planning — seeking volunteers",
    category: "Events",
    author: "Marco T.",
    avatar: "MT",
    replies: 15,
    upvotes: 43,
    time: "3 days ago",
    pinned: false,
    preview: "The annual summer festival committee is looking for 20 volunteers to help with setup, logistics, and activities...",
    img: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=600",
  },
];

const avatarColors = ["bg-primary-container", "bg-secondary-container", "bg-tertiary-container", "bg-surface-container-high"];

export default function ForumPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [sort, setSort] = useState("Latest");

  const filtered = threads.filter(
    (t) => activeCategory === "All" || t.category === activeCategory
  );

  return (
    <AppLayout>
      <div className="max-w-[800px] mx-auto animate-fade-in">
        {/* Forum Banner */}
        <div className="relative w-full h-48 md:h-64 rounded-3xl overflow-hidden mb-6 shadow-md border border-[#F0E4D7]">
          <Image
            src="https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=1000"
            alt="Community Forum Banner"
            fill
            className="object-cover"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/30 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4 text-white z-10">
            <div>
              <span className="bg-amber-500 text-[10px] font-extrabold tracking-widest uppercase px-2.5 py-1 rounded-full text-white mb-2 inline-block">
                Interactive Forum
              </span>
              <h1 className="text-2xl md:text-4xl font-black text-white leading-tight tracking-tight">
                Community Forum
              </h1>
              <p className="text-sm md:text-base text-stone-200 mt-1 max-w-md">
                Discuss local issues and ideas with your neighbors in real time
              </p>
            </div>
            <button className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold py-3 px-5 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 shrink-0 self-start md:self-auto cursor-pointer">
              <span className="material-symbols-outlined icon-filled text-[18px]">edit</span>
              New Post
            </button>
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-label-md whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? "bg-primary-container text-on-primary-container shadow-subtle"
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-body-sm text-on-surface-variant">
            {filtered.length} discussions
          </p>
          <div className="flex items-center gap-2">
            <span className="text-label-sm text-on-surface-variant">Sort:</span>
            {["Latest", "Top", "Trending"].map((s) => (
              <button
                key={s}
                onClick={() => setSort(s)}
                className={`text-label-sm px-2.5 py-1 rounded-md transition-colors ${
                  sort === s
                    ? "bg-surface-container-highest text-on-surface font-medium"
                    : "text-on-surface-variant hover:bg-surface-container"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Threads */}
        <div className="flex flex-col gap-3">
          {filtered.map((thread, i) => (
            <div
              key={thread.id}
              className={`civic-card p-5 cursor-pointer ${thread.pinned ? "border-l-4 border-l-primary-container" : ""}`}
            >
              {thread.pinned && (
                <div className="flex items-center gap-1 text-label-sm text-primary mb-2">
                  <span className="material-symbols-outlined icon-filled text-[14px]">push_pin</span>
                  Pinned
                </div>
              )}
              {thread.official && (
                <div className="flex items-center gap-1 text-label-sm text-blue-600 mb-2">
                  <span className="material-symbols-outlined icon-filled text-[14px]">verified</span>
                  Official Update
                </div>
              )}

              <div className="flex gap-4">
                <div
                  className={`w-10 h-10 rounded-full ${avatarColors[i % avatarColors.length]} flex items-center justify-center shrink-0`}
                >
                  <span className="text-label-sm font-bold text-on-surface">{thread.avatar}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-body-md font-semibold text-on-surface leading-snug">
                      {thread.title}
                    </h2>
                    <span className="text-label-sm bg-surface-container px-2 py-0.5 rounded-full whitespace-nowrap text-on-surface-variant shrink-0">
                      {thread.category}
                    </span>
                  </div>

                  <p className="text-body-sm text-on-surface-variant mt-1 line-clamp-2">
                    {thread.preview}
                  </p>

                  {thread.img && (
                    <div className="relative w-full h-48 mt-3 rounded-xl overflow-hidden">
                      <Image
                        src={thread.img}
                        alt={thread.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-4 mt-3">
                    <span className="text-label-sm text-on-surface-variant">{thread.author}</span>
                    <span className="text-label-sm text-on-surface-variant">{thread.time}</span>
                    <button className="flex items-center gap-1 text-label-sm text-on-surface-variant hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-[14px]">thumb_up</span>
                      {thread.upvotes}
                    </button>
                    <button className="flex items-center gap-1 text-label-sm text-on-surface-variant hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-[14px]">chat_bubble</span>
                      {thread.replies}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
