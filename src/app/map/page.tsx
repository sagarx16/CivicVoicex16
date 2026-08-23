"use client";

import { useEffect, useRef, useState } from "react";
import AppLayout from "@/components/AppLayout";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";

// Markers with real coordinates centered around Kolkata, India
const markersData = [
  { lat: 22.5485, lng: 88.3515, type: "road", label: "Pothole – Park St", status: "In Progress" },
  { lat: 22.5800, lng: 88.4120, type: "lighting", label: "Broken light – Salt Lake", status: "Reported" },
  { lat: 22.5180, lng: 88.3680, type: "sanitation", label: "Overflow bins – Gariahat", status: "Reported" },
  { lat: 22.5850, lng: 88.3410, type: "environment", label: "Illegal dumping – Howrah", status: "In Progress" },
  { lat: 22.5320, lng: 88.3370, type: "road", label: "Cracked sidewalk – Alipore", status: "Resolved" },
  { lat: 22.5448, lng: 88.3425, type: "parks", label: "Damaged bench – Victoria Gardens", status: "Resolved" },
];

const categories = [
  { id: "all", label: "All Issues", icon: "layers", count: 38, color: "text-gray-700", activeBg: "bg-gray-700" },
  { id: "road", label: "Road & Transport", icon: "directions_car", count: 14, color: "text-blue-600", activeBg: "bg-blue-600" },
  { id: "lighting", label: "Street Lighting", icon: "light_mode", count: 7, color: "text-yellow-600", activeBg: "bg-yellow-500" },
  { id: "sanitation", label: "Sanitation", icon: "delete", count: 9, color: "text-orange-600", activeBg: "bg-orange-500" },
  { id: "parks", label: "Parks", icon: "park", count: 5, color: "text-green-600", activeBg: "bg-green-600" },
  { id: "environment", label: "Environment", icon: "eco", count: 3, color: "text-emerald-600", activeBg: "bg-emerald-600" },
];

const markerColors: Record<string, string> = {
  road: "#3b82f6", // blue-500
  lighting: "#ca8a04", // yellow-600
  sanitation: "#ea580c", // orange-600
  environment: "#059669", // emerald-600
  parks: "#16a34a", // green-600
};

const statusStyles: Record<string, { bg: string; text: string; colorHex: string }> = {
  "In Progress": { bg: "bg-[#DBEAFE]", text: "text-[#1D4ED8]", colorHex: "#3b82f6" },
  Reported: { bg: "bg-[#F3F4F6]", text: "text-[#4B5563]", colorHex: "#9ca3af" },
  Resolved: { bg: "bg-[#DCFCE7]", text: "text-[#15803D]", colorHex: "#22c55e" },
};

const getMarkerIconSvg = (type: string) => {
  const color = markerColors[type] || "#6b7280";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="38" height="38">
    <path fill="${color}" stroke="#ffffff" stroke-width="1.5" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>`;
  return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
};

export default function MapPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [googleMarkers, setGoogleMarkers] = useState<google.maps.Marker[]>([]);
  const [, setSelectedIssue] = useState<typeof markersData[0] | null>(null);

  const reportMarkerRef = useRef<google.maps.Marker | null>(null);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  const hasApiKey = true;

  // Load Google Maps API
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
    ])
      .then(([mapsLib]) => {
        if (!mapRef.current) return;

        const mapInstance = new mapsLib.Map(mapRef.current, {
          center: { lat: 22.5726, lng: 88.3639 }, // Kolkata Center
          zoom: 13,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          zoomControl: false, // Custom controls used instead
          gestureHandling: "greedy",
          scrollwheel: true,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ],
        });

        const infoWindow = new mapsLib.InfoWindow();
        infoWindowRef.current = infoWindow;

        // Create markers
        const createdMarkers = markersData.map((data) => {
          const marker = new google.maps.Marker({
            position: { lat: data.lat, lng: data.lng },
            map: mapInstance,
            title: data.label,
            icon: {
              url: getMarkerIconSvg(data.type),
              scaledSize: new google.maps.Size(38, 38),
            },
          });

          marker.addListener("click", () => {
            setSelectedIssue(data);
            if (reportMarkerRef.current) {
              reportMarkerRef.current.setMap(null);
              reportMarkerRef.current = null;
            }
            const s = statusStyles[data.status];
            const content = `
              <div style="font-family: sans-serif; padding: 8px; min-width: 180px;">
                <h3 style="margin: 0 0 6px 0; font-size: 14px; font-weight: bold; color: #111827;">${data.label}</h3>
                <div style="display: inline-block; padding: 2px 8px; font-size: 11px; font-weight: 600; border-radius: 9999px; background-color: ${s?.colorHex}15; color: ${s?.colorHex};">
                  ${data.status}
                </div>
                <div style="margin-top: 10px; font-size: 12px; color: #4b5563;">
                  Type: <span style="text-transform: capitalize; font-weight: 500;">${data.type}</span>
                </div>
              </div>
            `;
            infoWindow.setContent(content);
            infoWindow.open(mapInstance, marker);
          });

          return marker;
        });

        setGoogleMarkers(createdMarkers);
        setMap(mapInstance);

        // Handle map clicks to place new pins
        mapInstance.addListener("click", (e: google.maps.MapMouseEvent) => {
          const latLng = e.latLng;
          if (!latLng) return;

          // Clear existing temporary marker if any
          if (reportMarkerRef.current) {
            reportMarkerRef.current.setMap(null);
          }

          const tempMarker = new google.maps.Marker({
            position: latLng,
            map: mapInstance,
            icon: {
              url:
                "data:image/svg+xml;charset=UTF-8," +
                encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="38" height="38">
                  <path fill="#f59e0b" stroke="#ffffff" stroke-width="1.5" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              `),
              scaledSize: new google.maps.Size(38, 38),
            },
          });

          reportMarkerRef.current = tempMarker;

          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ location: latLng }, (results, status) => {
            let address = "Selected Location";
            if (status === "OK" && results && results[0]) {
              address = results[0].formatted_address;
            }

            const lat = latLng.lat().toFixed(6);
            const lng = latLng.lng().toFixed(6);

            const content = `
              <div style="font-family: sans-serif; padding: 8px; min-width: 200px;">
                <h3 style="margin: 0 0 4px 0; font-size: 14px; font-weight: bold; color: #111827;">Report Issue Here</h3>
                <p style="margin: 0 0 10px 0; font-size: 12px; color: #6b7280; line-height: 1.4;">${address}</p>
                <a href="/report?lat=${lat}&lng=${lng}&address=${encodeURIComponent(
              address
            )}" style="display: block; text-align: center; background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 6px 12px; font-size: 12px; font-weight: bold; border-radius: 8px; text-decoration: none;">
                  Create Report
                </a>
              </div>
            `;
            infoWindow.setContent(content);
            infoWindow.open(mapInstance, tempMarker);
          });
        });
      })
      .catch((err: unknown) => {
        console.error("Error loading Google Maps API:", err);
      });
  }, []);

  // Filter markers based on active category
  useEffect(() => {
    googleMarkers.forEach((marker, index) => {
      const data = markersData[index];
      if (activeCategory === "all" || data.type === activeCategory) {
        marker.setMap(map);
      } else {
        marker.setMap(null);
      }
    });

    if (infoWindowRef.current) {
      infoWindowRef.current.close();
    }
    if (reportMarkerRef.current) {
      reportMarkerRef.current.setMap(null);
      reportMarkerRef.current = null;
    }
  }, [activeCategory, googleMarkers, map]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!map || !searchQuery.trim() || typeof window === "undefined" || !window.google) return;

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: searchQuery }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        map.setCenter(results[0].geometry.location);
        map.setZoom(15);
      } else {
        alert("Location not found. Please try another query.");
      }
    });
  };

  const handleZoomIn = () => {
    if (!map) return;
    map.setZoom((map.getZoom() || 13) + 1);
  };

  const handleZoomOut = () => {
    if (!map) return;
    map.setZoom((map.getZoom() || 13) - 1);
  };

  const handleMyLocation = () => {
    if (!map) return;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          map.setCenter(pos);
          map.setZoom(15);
        },
        () => {
          alert("Error: The Geolocation service failed.");
        }
      );
    } else {
      alert("Error: Your browser doesn't support geolocation.");
    }
  };

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">Community Map</h1>
          <p className="text-gray-500 mt-1">Explore reported issues in your neighborhood in real time</p>
        </div>

        {!hasApiKey && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-amber-600">info</span>
            <span>
              <strong>Map Sandbox Mode:</strong> Copy <code>.env.example</code> to <code>.env.local</code> and set <code>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> to enable full production Google Maps.
            </span>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="lg:w-72 shrink-0 flex flex-col gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">search</span>
              <input
                className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl bg-white text-sm placeholder:text-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                placeholder="Search location..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              )}
            </form>

            {/* Category filters */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <p className="font-bold text-gray-900 mb-3 text-sm">Filter by Category</p>
              <div className="flex flex-row overflow-x-auto lg:flex-col gap-2 pb-2 lg:pb-0 scrollbar-none">
                {categories.map((cat) => {
                  const isActive = activeCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`flex items-center justify-between p-3 rounded-xl transition-all text-left group cursor-pointer shrink-0 ${isActive ? `${cat.activeBg} text-white` : "hover:bg-gray-50 text-gray-700"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`material-symbols-outlined ${isActive ? "text-white" : cat.color} text-[20px]`}>
                          {cat.icon}
                        </span>
                        <span className={`text-sm font-medium ${isActive ? "text-white" : "text-gray-700"}`}>
                          {cat.label}
                        </span>
                      </div>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-semibold ${isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
                          }`}
                      >
                        {cat.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <p className="font-bold text-gray-900 mb-3 text-sm">Status Legend</p>
              {[
                { label: "Reported", color: "bg-gray-400" },
                { label: "In Progress", color: "bg-blue-500" },
                { label: "Resolved", color: "bg-green-500" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2 mb-2.5">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="text-sm text-gray-600">{item.label}</span>
                </div>
              ))}
            </div>
          </aside>

          {/* Map area */}
          <div className="flex-1">
            {/* Map Canvas */}
            <div className="relative h-[380px] sm:h-[460px] lg:h-[600px] rounded-3xl overflow-hidden shadow-xl border border-gray-200">
              <div ref={mapRef} className="w-full h-full bg-stone-100" />

              {/* Map controls */}
              <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
                <button
                  onClick={handleZoomIn}
                  className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-lg hover:bg-amber-50 hover:text-amber-600 transition-colors cursor-pointer"
                  title="Zoom In"
                >
                  <span className="material-symbols-outlined text-gray-700 text-[18px]">add</span>
                </button>
                <button
                  onClick={handleZoomOut}
                  className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-lg hover:bg-amber-50 hover:text-amber-600 transition-colors cursor-pointer"
                  title="Zoom Out"
                >
                  <span className="material-symbols-outlined text-gray-700 text-[18px]">remove</span>
                </button>
                <button
                  onClick={handleMyLocation}
                  className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-lg hover:bg-amber-50 hover:text-amber-600 transition-colors cursor-pointer"
                  title="Use My Location"
                >
                  <span className="material-symbols-outlined text-gray-700 text-[18px]">my_location</span>
                </button>
              </div>

              {/* Report button */}
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10">
                <a
                  href="/report"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white text-sm shadow-2xl hover:-translate-y-1 hover:shadow-amber-500/40 transition-all duration-300"
                  style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}
                >
                  <span className="material-symbols-outlined icon-filled text-[18px]">add_circle</span>
                  Report Issue Here
                </a>
              </div>
            </div>

            {/* Nearby issues */}
            <div className="mt-5">
              <h2 className="text-lg font-bold text-gray-900 mb-3">Nearby Issues</h2>
              <div className="grid md:grid-cols-2 gap-3">
                {markersData.slice(0, 4).map((marker, i) => {
                  const s = statusStyles[marker.status];
                  const color = markerColors[marker.type] || "#6b7280";
                  return (
                    <div
                      key={i}
                      onClick={() => {
                        if (map && googleMarkers[i] && typeof window !== "undefined" && window.google) {
                          map.setCenter({ lat: marker.lat, lng: marker.lng });
                          map.setZoom(15);
                          window.google.maps.event.trigger(googleMarkers[i], "click");
                        }
                      }}
                      className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
                    >
                      <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: color }} />
                      <p className="text-sm font-medium text-gray-900 flex-1 truncate">{marker.label}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${s?.bg} ${s?.text}`}>{marker.status}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
