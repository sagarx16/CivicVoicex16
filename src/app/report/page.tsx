"use client";

import AppLayout from "@/components/AppLayout";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

const categories = [
  { id: "road", label: "Road & Transport", icon: "directions_car", color: "#2563EB", tint: "#EFF6FF", border: "#DBEAFE" },
  { id: "lighting", label: "Street Lighting", icon: "light_mode", color: "#CA8A04", tint: "#FEF9C3", border: "#FEF08A" },
  { id: "sanitation", label: "Sanitation", icon: "delete", color: "#EA580C", tint: "#FFEDD5", border: "#FED7AA" },
  { id: "parks", label: "Parks & Green Spaces", icon: "park", color: "#16A34A", tint: "#DCFCE7", border: "#BBF7D0" },
  { id: "vandalism", label: "Vandalism", icon: "warning", color: "#DC2626", tint: "#FEE2E2", border: "#FECACA" },
  { id: "safety", label: "Public Safety", icon: "security", color: "#4F46E5", tint: "#EEF2FF", border: "#E0E7FF" },
  { id: "environment", label: "Environmental", icon: "eco", color: "#059669", tint: "#D1FAE5", border: "#A7F3D0" },
  { id: "other", label: "Other", icon: "more_horiz", color: "#7C3AED", tint: "#F3E8FF", border: "#E9D5FF" },
];

const priorities = [
  { value: "low", label: "Low", color: "text-green-600", bg: "bg-green-50 border-green-200" },
  { value: "medium", label: "Medium", color: "text-yellow-700", bg: "bg-yellow-50 border-yellow-200" },
  { value: "high", label: "High — Urgent", color: "text-red-600", bg: "bg-red-50 border-red-200" },
];

export default function ReportPage() {
  return (
    <AppLayout>
      <Suspense fallback={
        <div className="max-w-[720px] mx-auto py-20 text-center text-on-surface-variant">
          <p className="text-body-md">Loading form...</p>
        </div>
      }>
        <ReportForm />
      </Suspense>
    </AppLayout>
  );
}

function ReportForm() {
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("medium");
  const [address, setAddress] = useState(() => {
    const addr = searchParams.get("address");
    return addr ? decodeURIComponent(addr) : "";
  });
  const [latitude, setLatitude] = useState(() => searchParams.get("lat") || "");
  const [longitude, setLongitude] = useState(() => searchParams.get("lng") || "");

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      setAddress("Detecting address...");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude.toFixed(6);
          const lng = position.coords.longitude.toFixed(6);
          setLatitude(lat);
          setLongitude(lng);

          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
            .then((res) => res.json())
            .then((data) => {
              if (data && data.display_name) {
                setAddress(data.display_name);
              } else {
                setAddress(`Current Location (${lat}, ${lng})`);
              }
            })
            .catch(() => {
              setAddress(`Current Location (${lat}, ${lng})`);
            });
        },
        () => {
          setAddress("");
          alert("Error: The Geolocation service failed.");
        }
      );
    } else {
      alert("Error: Your browser doesn't support geolocation.");
    }
  };

  return (
    <div className="max-w-[720px] mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-headline-lg-mobile md:text-headline-md font-bold text-on-surface">
          Report an Issue
        </h1>
        <p className="text-body-md text-on-surface-variant mt-1">
          Help improve your community by reporting local issues.
        </p>
      </div>

      <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
          {/* Category */}
          <div className="civic-card p-6">
            <h2 className="text-headline-sm font-semibold text-on-surface mb-4">
              Issue Category
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    style={{
                      borderColor: isSelected ? cat.color : "#E5E7EB",
                      backgroundColor: isSelected ? cat.tint : "#FFFFFF",
                      color: isSelected ? cat.color : "#4B5563",
                      boxShadow: isSelected ? `0 4px 12px ${cat.color}15` : "none",
                    }}
                    className="group flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
                  >
                    <div 
                      className="w-12 h-12 flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
                      style={{
                        color: cat.color,
                      }}
                    >
                      <span className={`material-symbols-outlined ${isSelected ? "icon-filled" : ""} text-[32px]`}>
                        {cat.icon}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-center leading-tight">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div className="civic-card p-6">
            <h2 className="text-headline-sm font-semibold text-on-surface mb-4">
              Issue Details
            </h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-label-md text-on-surface mb-1">
                  Title <span className="text-error">*</span>
                </label>
                <input
                  className="block w-full px-3 py-2.5 border border-outline-variant rounded-lg bg-surface text-on-surface text-body-md placeholder:text-on-surface-variant/50"
                  placeholder="Brief description of the issue"
                  type="text"
                />
              </div>
              <div>
                <label className="block text-label-md text-on-surface mb-1">
                  Description
                </label>
                <textarea
                  className="block w-full px-3 py-2.5 border border-outline-variant rounded-lg bg-surface text-on-surface text-body-md placeholder:text-on-surface-variant/50 resize-none"
                  rows={4}
                  placeholder="Describe the issue in detail — what it is, when you noticed it, who it affects..."
                />
              </div>

              {/* Priority */}
              <div>
                <label className="block text-label-md text-on-surface mb-2">Priority</label>
                <div className="flex gap-3">
                  {priorities.map((p) => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setSelectedPriority(p.value)}
                      className={`flex-1 py-2 px-3 rounded-lg border-2 text-label-md transition-all ${
                        selectedPriority === p.value
                          ? `${p.bg} ${p.color} border-current`
                          : "border-outline-variant/40 text-on-surface-variant hover:bg-surface-container"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="civic-card p-6">
            <h2 className="text-headline-sm font-semibold text-on-surface mb-4">
              Location
            </h2>
            <div className="flex flex-col gap-3">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
                  location_on
                </span>
                <input
                  className="block w-full pl-10 pr-3 py-2.5 border border-outline-variant rounded-lg bg-surface text-on-surface text-body-md placeholder:text-on-surface-variant/50"
                  placeholder="Address or location description"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              {latitude && longitude ? (
                <div className="h-48 rounded-lg border border-amber-200 bg-amber-50/50 flex flex-col items-center justify-center p-4 text-center">
                  <span className="material-symbols-outlined text-amber-600 text-[36px] icon-filled animate-bounce">
                    location_on
                  </span>
                  <p className="font-semibold text-sm text-stone-800 mt-2">Location Pinned!</p>
                  <p className="text-xs text-stone-500 mt-0.5 max-w-md truncate">{address || `${latitude}, ${longitude}`}</p>
                  <p className="text-[10px] text-stone-400 mt-1">Coordinates: {latitude}, {longitude}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setLatitude("");
                      setLongitude("");
                      setAddress("");
                    }}
                    className="text-xs font-bold text-amber-600 hover:text-amber-700 hover:underline mt-2 cursor-pointer"
                  >
                    Clear Pin
                  </button>
                </div>
              ) : (
                <div className="h-48 bg-surface-container rounded-lg border border-outline-variant/40 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50" />
                  <div className="relative text-center">
                    <span className="material-symbols-outlined icon-filled text-primary text-[48px]">
                      location_on
                    </span>
                    <p className="text-body-sm text-on-surface-variant mt-2">
                      Click to pin location on map
                    </p>
                  </div>
                </div>
              )}
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                className="flex items-center justify-center gap-2 py-2.5 px-4 border border-outline-variant rounded-lg text-label-md text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">my_location</span>
                Use my current location
              </button>
            </div>
          </div>

          {/* Photo upload */}
          <div className="civic-card p-6">
            <h2 className="text-headline-sm font-semibold text-on-surface mb-4">
              Add Photos (optional)
            </h2>
            <div className="border-2 border-dashed border-outline-variant rounded-lg p-8 text-center hover:border-primary-container hover:bg-primary-fixed/10 transition-all cursor-pointer">
              <span className="material-symbols-outlined text-on-surface-variant text-[40px]">
                add_photo_alternate
              </span>
              <p className="text-body-md text-on-surface-variant mt-2">
                Drag & drop photos here
              </p>
              <p className="text-label-sm text-on-surface-variant">
                or{" "}
                <span className="text-primary font-semibold cursor-pointer">
                  browse files
                </span>{" "}
                (max 5 photos, 10MB each)
              </p>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3">
            <button
              type="button"
              className="flex-1 py-3 px-4 border border-outline-variant rounded-lg text-label-md font-semibold text-on-surface hover:bg-surface-container transition-colors"
            >
              Save as Draft
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 bg-primary-container text-on-primary-container text-label-md font-semibold rounded-lg shadow-subtle hover:shadow-hover hover:bg-primary hover:text-on-primary transition-all duration-200"
            >
              Submit Report
            </button>
          </div>
        </form>
      </div>
    );
  }
