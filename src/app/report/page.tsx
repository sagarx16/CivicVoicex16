"use client";

import AppLayout from "@/components/AppLayout";
import { useState, useEffect, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";

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
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("medium");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [mapAuthFailed, setMapAuthFailed] = useState(false);
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [isSettingsGuideOpen, setIsSettingsGuideOpen] = useState(false);

  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasApiKey = true;

  const searchParams = useSearchParams();
  const router = useRouter();

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);

  const geocodeLatLng = (lat: number, lng: number) => {
    if (typeof window !== "undefined" && window.google) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          setAddress(results[0].formatted_address);
        }
      });
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const originalError = console.error;
      console.error = (...args) => {
        const msg = args[0];
        if (typeof msg === "string" && (
          msg.includes("Google Maps JavaScript API error") ||
          msg.includes("ApiProjectMapError") ||
          msg.includes("InvalidKeyMapError")
        )) {
          return;
        }
        originalError(...args);
      };
    }
  }, []);

  useEffect(() => {
    const latParam = searchParams.get("lat");
    const lngParam = searchParams.get("lng");
    const addrParam = searchParams.get("address");

    let initialLat = 22.5726;
    let initialLng = 88.3639;

    if (latParam) {
      initialLat = parseFloat(latParam);
    }
    if (lngParam) {
      initialLng = parseFloat(lngParam);
    }

    setTimeout(() => {
      if (latParam) setLatitude(latParam);
      if (lngParam) setLongitude(lngParam);
      if (addrParam) setAddress(decodeURIComponent(addrParam));
    }, 0);

    if (hasApiKey) {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
      const isKeyValid = apiKey.startsWith("AIza");
      try {
        if (isKeyValid) {
          setOptions({
            key: apiKey,
            v: "weekly",
          });
        } else {
          setOptions({
            v: "weekly",
          });
        }
      } catch {
        // Ignore configuration re-definitions in React hot-reloading
      }

      Promise.all([
        importLibrary("maps"),
        importLibrary("geocoding"),
      ]).then(([mapsLib]) => {
        if (!mapRef.current) return;

        const mapInstance = new mapsLib.Map(mapRef.current, {
          center: { lat: initialLat, lng: initialLng },
          zoom: 13,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          zoomControl: false,
          gestureHandling: "greedy",
          scrollwheel: true,
        });

        mapInstanceRef.current = mapInstance;

        const marker = new google.maps.Marker({
          position: { lat: initialLat, lng: initialLng },
          map: latParam && lngParam ? mapInstance : null,
          draggable: true,
        });
        markerRef.current = marker;

        marker.addListener("dragend", () => {
          const pos = marker.getPosition();
          if (pos) {
            setLatitude(pos.lat().toFixed(6));
            setLongitude(pos.lng().toFixed(6));
            geocodeLatLng(pos.lat(), pos.lng());
          }
        });

        mapInstance.addListener("click", (e: google.maps.MapMouseEvent) => {
          const latLng = e.latLng;
          if (!latLng) return;

          setLatitude(latLng.lat().toFixed(6));
          setLongitude(latLng.lng().toFixed(6));

          marker.setPosition(latLng);
          if (!marker.getMap()) {
            marker.setMap(mapInstance);
          }

          geocodeLatLng(latLng.lat(), latLng.lng());
        });
      }).catch((err: unknown) => {
        console.error("Failed to load Google Maps inside ReportForm:", err);
      });
    }
  }, [searchParams, hasApiKey]);

  const handleUseCurrentLocation = () => {
    setIsPermissionModalOpen(true);
  };

  const triggerActualGeolocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Your browser doesn't support geolocation.");
      return;
    }

    setIsDetectingLocation(true);
    setLocationError(null);
    setAddress("Detecting your location...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setTimeout(() => {
          setLatitude(lat.toFixed(6));
          setLongitude(lng.toFixed(6));
          setIsDetectingLocation(false);

          if (hasApiKey && !mapAuthFailed) {
            const latLng = { lat, lng };

            if (mapInstanceRef.current) {
              mapInstanceRef.current.setCenter(latLng);
              mapInstanceRef.current.setZoom(15);
            }

            if (markerRef.current) {
              markerRef.current.setPosition(latLng);
              if (!markerRef.current.getMap()) {
                markerRef.current.setMap(mapInstanceRef.current);
              }
            }

            geocodeLatLng(lat, lng);
          } else {
            setAddress(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
          }
        }, 0);
      },
      (error) => {
        setTimeout(() => {
          setIsDetectingLocation(false);
          setAddress("");

          let msg = "Failed to detect location.";
          if (error.code === 1) {
            msg = "Location access denied — please enable location permissions in your browser settings.";
          } else if (error.code === 2) {
            msg = "Location information is unavailable on your device.";
          } else if (error.code === 3) {
            msg = "Location request timed out. Please try again.";
          }
          setLocationError(msg);
        }, 0);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const processFiles = (files: FileList) => {
    const remainingSlots = 5 - uploadedImages.length;
    const filesToProcess = Array.from(files)
      .filter(file => file.type.startsWith("image/"))
      .slice(0, remainingSlots);

    if (filesToProcess.length === 0) return;

    filesToProcess.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result && typeof event.target.result === "string") {
          setUploadedImages(prev => {
            if (prev.length >= 5) return prev;
            return [...prev, event.target!.result as string];
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !selectedCategory) {
      alert("Please enter a title and select a category.");
      return;
    }

    const newIssue = {
      id: `CV-${Math.floor(1000 + Math.random() * 9000)}`,
      title: title.trim(),
      category: selectedCategory,
      description: description.trim(),
      priority: selectedPriority,
      address: address,
      latitude: latitude,
      longitude: longitude,
      votes: 1,
      status: "Reported",
      createdAt: new Date().toISOString(),
      images: uploadedImages
    };

    const stored = localStorage.getItem("civicvoice_user_issues");
    let issuesList = [];
    if (stored) {
      try {
        issuesList = JSON.parse(stored);
      } catch (err) {
        console.error("Failed to load user issues from local storage", err);
      }
    }
    issuesList.unshift(newIssue);
    localStorage.setItem("civicvoice_user_issues", JSON.stringify(issuesList));

    // Redirect to my-issues
    router.push("/my-issues");
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

      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
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
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
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
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
                    className={`flex-1 py-2 px-3 rounded-lg border-2 text-label-md transition-all ${selectedPriority === p.value
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
            <div className="relative w-full rounded-3xl border border-gray-200 overflow-hidden bg-stone-50 shadow-xl mb-2" style={{ height: 320 }}>
              <div ref={mapRef} className="w-full h-full" />
              {latitude && longitude && (
                <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-xs rounded-xl p-3 border border-stone-200/70 shadow-md flex items-center justify-between gap-3 animate-fade-in z-10">
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-black text-amber-600 uppercase tracking-wider flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px] icon-filled">location_on</span>
                      Location Pinned
                    </p>
                    <p className="text-xs font-bold text-stone-700 truncate mt-0.5">{address || `${latitude}, ${longitude}`}</p>
                    <p className="text-[9px] text-stone-400 font-mono mt-0.5">Coordinates: {latitude}, {longitude}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 text-[11px] font-bold rounded-lg transition-colors cursor-pointer"
                      title="Open in Google Maps"
                    >
                      <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                      Open Map
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        setLatitude("");
                        setLongitude("");
                        setAddress("");
                        if (markerRef.current) {
                          markerRef.current.setMap(null);
                        }
                      }}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-red-500 hover:bg-stone-100 transition-colors cursor-pointer"
                      title="Clear Pin"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
              )}
              {(!latitude || !longitude) && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                  <div className="bg-white shadow-md border border-stone-200/60 rounded-full w-10 h-10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px] text-amber-500 animate-bounce">location_on</span>
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                disabled={isDetectingLocation}
                onClick={handleUseCurrentLocation}
                className={`flex items-center justify-center gap-2 py-2.5 px-4 border border-outline-variant rounded-lg text-label-md text-on-surface hover:bg-surface-container transition-colors cursor-pointer ${isDetectingLocation ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                <span className={`material-symbols-outlined text-[20px] ${isDetectingLocation ? "animate-spin" : ""}`}>
                  {isDetectingLocation ? "progress_activity" : "my_location"}
                </span>
                {isDetectingLocation ? "Detecting your location..." : "Use my current location"}
              </button>
              {locationError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs flex flex-col gap-2 mt-1 animate-fade-in">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-red-600 shrink-0">error</span>
                    <span>{locationError}</span>
                  </div>
                  {locationError.includes("denied") && (
                    <button
                      type="button"
                      onClick={() => setIsSettingsGuideOpen(true)}
                      className="text-left text-red-700 hover:text-red-900 font-bold underline cursor-pointer"
                    >
                      Show me how to enable location permissions
                    </button>
                  )}
                </div>
              )}
            </div>
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

      {isPermissionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-stone-200 shadow-xl animate-scale-in">
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-amber-500 text-[28px] icon-filled">location_on</span>
            </div>
            <h3 className="text-lg font-black text-stone-950">Request Location Access</h3>
            <p className="text-stone-500 text-xs mt-2 leading-relaxed">
              CivicVoice requires your GPS coordinates to automatically center the map and reverse-geocode your address.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setIsPermissionModalOpen(false)}
                className="flex-1 py-2.5 border border-stone-200 rounded-xl text-stone-600 text-xs font-bold hover:bg-stone-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsPermissionModalOpen(false);
                  triggerActualGeolocation();
                }}
                className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 rounded-xl text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Allow Access
              </button>
            </div>
          </div>
        </div>
      )}

      {isSettingsGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-stone-200 shadow-xl animate-scale-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-black text-stone-950 flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-500">settings</span>
                Browser Settings Guide
              </h3>
              <button
                type="button"
                onClick={() => setIsSettingsGuideOpen(false)}
                className="text-stone-400 hover:text-stone-600 p-1.5 rounded-lg hover:bg-stone-100 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <p className="text-stone-500 text-xs leading-relaxed">
              Websites cannot open browser settings pages programmatically due to security restrictions. Please follow these simple steps to enable location access:
            </p>

            <div className="mt-4 space-y-4">
              <div className="bg-stone-50 border border-stone-100 rounded-2xl p-4">
                <h4 className="text-xs font-black text-stone-800 flex items-center gap-1.5 mb-2">
                  <span className="w-5 h-5 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center text-[10px] font-bold">1</span>
                  Chrome, Edge & Brave
                </h4>
                <ol className="list-decimal pl-4 text-[11px] text-stone-600 space-y-1 font-medium">
                  <li>Click the <strong>Lock icon</strong> 🔒 next to the website URL in the address bar at the top.</li>
                  <li>Locate <strong>Location</strong> in the dropdown list.</li>
                  <li>Toggle the switch to <strong>Allow</strong>.</li>
                  <li>Reload the page to apply settings.</li>
                </ol>
              </div>

              <div className="bg-stone-50 border border-stone-100 rounded-2xl p-4">
                <h4 className="text-xs font-black text-stone-800 flex items-center gap-1.5 mb-2">
                  <span className="w-5 h-5 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center text-[10px] font-bold">2</span>
                  Safari (macOS)
                </h4>
                <ol className="list-decimal pl-4 text-[11px] text-stone-600 space-y-1 font-medium">
                  <li>Click <strong>Safari</strong> in the top menu bar, then select <strong>Settings for This Website...</strong></li>
                  <li>In the popup box, select <strong>Allow</strong> next to Location.</li>
                  <li>Reload the page.</li>
                </ol>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsSettingsGuideOpen(false)}
              className="w-full mt-6 py-2.5 bg-amber-500 hover:bg-amber-600 rounded-xl text-white text-xs font-bold transition-colors cursor-pointer"
            >
              I understand
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
