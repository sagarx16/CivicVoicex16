"use client";

import AppLayout from "@/components/AppLayout";
import { useState } from "react";
import Image from "next/image";

const officials = [
  { name: "Mayor Linda Chen", role: "Mayor", dept: "Mayor's Office", phone: "(555) 001-0001", email: "mayor@cityvoice.gov", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150&h=150", tag: "Elected" },
  { name: "Robert Tan", role: "City Manager", dept: "City Administration", phone: "(555) 001-0010", email: "rtan@cityvoice.gov", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150&h=150", tag: "Staff" },
  { name: "Dr. Priya Nair", role: "Dir. of Public Works", dept: "Public Works", phone: "(555) 001-0100", email: "pnair@cityvoice.gov", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150&h=150", tag: "Staff" },
  { name: "Councilman Joe Walsh", role: "District 9 Council", dept: "City Council", phone: "(555) 001-0900", email: "jwalsh@cityvoice.gov", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150", tag: "Elected" },
  { name: "Emily Rodriguez", role: "Dir. of Parks & Rec", dept: "Parks Department", phone: "(555) 001-0400", email: "erod@cityvoice.gov", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150", tag: "Staff" },
  { name: "Chief Sam Okafor", role: "Chief of Police", dept: "Police Department", phone: "(555) 001-0911", email: "sokafor@cityvoice.gov", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150&h=150", tag: "Staff" },
  { name: "Fire Chief Maria Lopez", role: "Fire Chief", dept: "Fire Department", phone: "(555) 001-0119", email: "mlopez@cityvoice.gov", avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=150&h=150", tag: "Staff" },
  { name: "Supt. Tom Green", role: "Schools Superintendent", dept: "Education", phone: "(555) 001-0200", email: "tgreen@cityvoice.gov", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150&h=150", tag: "Staff" },
];

const departments = ["All Departments", "Mayor's Office", "City Council", "Public Works", "Parks Department", "Police Department", "Fire Department", "Education"];

export default function DirectoryPage() {
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("All Departments");

  const filtered = officials.filter((o) => {
    const matchSearch =
      search === "" ||
      o.name.toLowerCase().includes(search.toLowerCase()) ||
      o.role.toLowerCase().includes(search.toLowerCase()) ||
      o.dept.toLowerCase().includes(search.toLowerCase());
    const matchDept = dept === "All Departments" || o.dept === dept;
    return matchSearch && matchDept;
  });

  return (
    <AppLayout>
      <div className="max-w-[960px] mx-auto animate-fade-in w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-xl sm:text-headline-md font-bold text-on-surface flex items-center gap-2 sm:gap-2.5">
              <span className="material-symbols-outlined text-primary text-[28px] sm:text-[36px] icon-filled shrink-0">
                contact_page
              </span>
              City Directory
            </h1>
            <p className="text-xs sm:text-body-md text-on-surface-variant mt-1 sm:mt-2">
              Connect with city officials and community representatives
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 mb-5 sm:mb-6">
          <span className="material-symbols-outlined absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/70 text-[20px] sm:text-[22px]">
            search
          </span>
          <input
            className="block w-full pl-11 sm:pl-12 pr-4 py-3 sm:py-3.5 border border-outline-variant/30 rounded-2xl bg-surface-container-lowest text-xs sm:text-body-md text-on-surface placeholder:text-on-surface-variant/40 shadow-subtle focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
            placeholder="Search by name, role, or department..."
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Department Filters Pills (Smooth horizontal scroll without page overflow) */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none touch-pan-x w-full">
          {departments.map((d) => (
            <button
              key={d}
              onClick={() => setDept(d)}
              className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-label-md transition-all whitespace-nowrap border shrink-0 cursor-pointer ${
                dept === d
                  ? "bg-primary text-on-primary border-primary shadow-subtle font-bold"
                  : "bg-surface-container-lowest text-on-surface-variant border-outline-variant/30 hover:border-outline-variant hover:text-on-surface"
              }`}
            >
              {d === "All Departments" ? "All Contacts" : d}
            </button>
          ))}
        </div>

        <p className="text-xs sm:text-label-sm text-on-surface-variant mb-4 font-semibold">
          {filtered.length} contact{filtered.length !== 1 ? "s" : ""} found
        </p>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {filtered.map((official) => (
            <div 
              key={official.name} 
              className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-4 sm:p-5 flex flex-col justify-between hover:shadow-hover hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="flex items-start gap-3.5 sm:gap-4">
                {/* Avatar with border */}
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden shrink-0 border-2 border-primary-fixed-dim/40 shadow-sm transition-transform duration-300 group-hover:scale-105">
                  <Image
                    src={official.avatar}
                    alt={official.name}
                    fill
                    className="object-cover"
                    loading="lazy"
                    sizes="(max-width: 640px) 56px, 64px"
                  />
                </div>
                
                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm sm:text-body-lg font-bold text-on-surface leading-tight truncate group-hover:text-primary transition-colors">
                        {official.name}
                      </h3>
                      <p className="text-xs sm:text-label-md text-primary font-medium mt-0.5 truncate">{official.role}</p>
                    </div>
                    <span className={`text-[10px] sm:text-[11px] font-bold tracking-wider uppercase px-2 py-0.5 sm:px-2.5 rounded-md ${
                      official.tag === "Elected"
                        ? "bg-amber-100/70 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300"
                        : "bg-surface-container text-on-surface-variant"
                    } shrink-0`}>
                      {official.tag}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 text-xs sm:text-body-sm text-on-surface-variant mt-2 sm:mt-2.5 font-medium min-w-0">
                    <span className="material-symbols-outlined text-[15px] sm:text-[16px] text-on-surface-variant/70 shrink-0">business</span>
                    <span className="truncate">{official.dept}</span>
                  </div>
                </div>
              </div>
              
              {/* Quick actions row */}
              <div className="grid grid-cols-2 gap-2 mt-4 pt-3.5 sm:mt-5 sm:pt-4 border-t border-outline-variant/10">
                <a
                  href={`mailto:${official.email}`}
                  className="flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2 rounded-xl text-xs sm:text-label-sm font-semibold text-primary bg-primary-fixed/20 hover:bg-primary hover:text-on-primary transition-all duration-200 min-w-0"
                >
                  <span className="material-symbols-outlined text-[16px] icon-filled shrink-0">mail</span>
                  <span className="truncate">Email</span>
                </a>
                <a
                  href={`tel:${official.phone}`}
                  className="flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2 rounded-xl text-xs sm:text-label-sm font-semibold text-on-secondary-container bg-secondary-container/40 hover:bg-secondary-container hover:text-on-secondary-container transition-all duration-200 min-w-0"
                  title={official.phone}
                >
                  <span className="material-symbols-outlined text-[16px] icon-filled shrink-0">call</span>
                  <span className="truncate sm:hidden">Call</span>
                  <span className="truncate hidden sm:inline">{official.phone}</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-on-surface-variant text-[48px]">search_off</span>
            <p className="text-body-lg text-on-surface-variant mt-2">No contacts found</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
