"use client";

import { useEffect, useRef, useState } from "react";
import AppLayout from "@/components/AppLayout";
import "leaflet/dist/leaflet.css";
import type * as LeafletType from "leaflet";

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

export default function MapPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletType.Map | null>(null);
  const leafletModuleRef = useRef<typeof LeafletType | null>(null);
  const markersLayerRef = useRef<LeafletType.LayerGroup | null>(null);
  const reportMarkerRef = useRef<LeafletType.Marker | null>(null);
  const markerObjectsRef = useRef<LeafletType.Marker[]>([]);

  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Initialize Map
  useEffect(() => {
    let isMounted = true;

    import("leaflet").then((L) => {
      if (!isMounted || !mapRef.current || mapInstanceRef.current) return;

      leafletModuleRef.current = L;

      // Create Leaflet Map centered on Kolkata
      const map = L.map(mapRef.current, {
        center: [22.5726, 88.3639],
        zoom: 13,
        zoomControl: false,
        attributionControl: false,
      });

      mapInstanceRef.current = map;

      // Official OpenStreetMap Tile Layer (100% Free, NO API key required, zero watermarks)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Create Layer Group for markers
      const markersLayer = L.layerGroup().addTo(map);
      markersLayerRef.current = markersLayer;

      // Build Marker Elements
      const createdMarkers: LeafletType.Marker[] = [];

      markersData.forEach((data) => {
        const color = markerColors[data.type] || "#6b7280";
        const customIcon = L.divIcon({
          className: "custom-leaflet-marker",
          html: `
            <div style="position: relative; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.32)); cursor: pointer;">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="38" height="38">
                <path fill="${color}" stroke="#ffffff" stroke-width="1.8" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </div>
          `,
          iconSize: [38, 38],
          iconAnchor: [19, 38],
          popupAnchor: [0, -36],
        });

        const marker = L.marker([data.lat, data.lng], { icon: customIcon });
        const s = statusStyles[data.status];

        const popupContent = `
          <div style="font-family: inherit; padding: 4px; min-width: 180px;">
            <h3 style="margin: 0 0 6px 0; font-size: 14px; font-weight: 700; color: #111827;">${data.label}</h3>
            <div style="display: inline-block; padding: 2px 8px; font-size: 11px; font-weight: 600; border-radius: 9999px; background-color: ${s?.colorHex}18; color: ${s?.colorHex};">
              ${data.status}
            </div>
            <div style="margin-top: 8px; font-size: 12px; color: #4b5563;">
              Category: <span style="text-transform: capitalize; font-weight: 600; color: #1f2937;">${data.type}</span>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);
        marker.addTo(markersLayer);
        createdMarkers.push(marker);
      });

      markerObjectsRef.current = createdMarkers;

      // Handle map clicks to place new issue report pin
      map.on("click", async (e: LeafletType.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;

        if (reportMarkerRef.current) {
          reportMarkerRef.current.remove();
        }

        const pinIcon = L.divIcon({
          className: "custom-leaflet-marker",
          html: `
            <div style="position: relative; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.35)); cursor: pointer;">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="38" height="38">
                <path fill="#f59e0b" stroke="#ffffff" stroke-width="1.8" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </div>
          `,
          iconSize: [38, 38],
          iconAnchor: [19, 38],
          popupAnchor: [0, -36],
        });

        const tempMarker = L.marker([lat, lng], { icon: pinIcon }).addTo(map);
        reportMarkerRef.current = tempMarker;

        const latStr = lat.toFixed(6);
        const lngStr = lng.toFixed(6);

        // Initial loading popup
        tempMarker.bindPopup(`
          <div style="font-family: inherit; padding: 4px; min-width: 200px;">
            <h3 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 700; color: #111827;">Report Issue Here</h3>
            <p style="margin: 0 0 10px 0; font-size: 12px; color: #6b7280;">Fetching location details...</p>
            <a href="/report?lat=${latStr}&lng=${lngStr}&address=Selected%20Location" style="display: block; text-align: center; background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 6px 12px; font-size: 12px; font-weight: 700; border-radius: 8px; text-decoration: none;">
              Create Report
            </a>
          </div>
        `).openPopup();

        // Reverse geocoding via OpenStreetMap Nominatim
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
          const resData = await res.json();
          const address = resData?.display_name || `Location (${latStr}, ${lngStr})`;

          tempMarker.setPopupContent(`
            <div style="font-family: inherit; padding: 4px; min-width: 200px;">
              <h3 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 700; color: #111827;">Report Issue Here</h3>
              <p style="margin: 0 0 10px 0; font-size: 12px; color: #6b7280; line-height: 1.4; max-height: 52px; overflow: hidden; text-overflow: ellipsis;">${address}</p>
              <a href="/report?lat=${latStr}&lng=${lngStr}&address=${encodeURIComponent(address)}" style="display: block; text-align: center; background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 6px 12px; font-size: 12px; font-weight: 700; border-radius: 8px; text-decoration: none;">
                Create Report
              </a>
            </div>
          `).openPopup();
        } catch {
          // Keep default fallback
        }
      });
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Filter markers based on active category
  useEffect(() => {
    const markersLayer = markersLayerRef.current;
    if (!markersLayer) return;

    markersLayer.clearLayers();

    markerObjectsRef.current.forEach((marker, index) => {
      const data = markersData[index];
      if (activeCategory === "all" || data.type === activeCategory) {
        markersLayer.addLayer(marker);
      }
    });

    if (reportMarkerRef.current) {
      reportMarkerRef.current.remove();
      reportMarkerRef.current = null;
    }
  }, [activeCategory]);

  // Search Location via Nominatim
  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const map = mapInstanceRef.current;
    if (!map || !searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
      const results = await res.json();
      if (results && results.length > 0) {
        const { lat, lon } = results[0];
        map.flyTo([parseFloat(lat), parseFloat(lon)], 14, { duration: 1.2 });
      } else {
        alert("Location not found. Please try another place name.");
      }
    } catch {
      alert("Search request failed. Please check network connection.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleMyLocation = () => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          map.flyTo([position.coords.latitude, position.coords.longitude], 15, { duration: 1.2 });
        },
        () => {
          alert("Error: The Geolocation service failed or was denied.");
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

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="lg:w-72 shrink-0 flex flex-col gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">
                {isSearching ? "sync" : "search"}
              </span>
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

            {/* Mobile Category pills (touch-friendly horizontal scroll) */}
            <div className="lg:hidden flex gap-2 overflow-x-auto pb-1 scrollbar-none touch-pan-x w-full">
              {categories.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                      isActive ? `${cat.activeBg} text-white shadow-xs font-bold` : "bg-white text-gray-700 border border-gray-200"
                    }`}
                  >
                    <span className={`material-symbols-outlined text-[16px] ${isActive ? "text-white" : cat.color}`}>
                      {cat.icon}
                    </span>
                    <span>{cat.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? "bg-white/25 text-white" : "bg-gray-100 text-gray-500"}`}>
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Desktop Category filters */}
            <div className="hidden lg:block bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <p className="font-bold text-gray-900 mb-3 text-sm">Filter by Category</p>
              <div className="flex flex-col gap-1">
                {categories.map((cat) => {
                  const isActive = activeCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`flex items-center justify-between p-3 rounded-xl transition-all text-left group cursor-pointer ${
                        isActive ? `${cat.activeBg} text-white` : "hover:bg-gray-50 text-gray-700"
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
                        className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                          isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {cat.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Desktop Legend */}
            <div className="hidden lg:block bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
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
            <div className="relative rounded-3xl overflow-hidden shadow-xl border border-gray-200 h-[380px] sm:h-[460px] md:h-[520px]">
              <div ref={mapRef} className="w-full h-full bg-stone-100 z-0" />

              {/* Map controls */}
              <div className="absolute top-4 right-4 flex flex-col gap-2 z-[400]">
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
              <div className="absolute bottom-4 sm:bottom-5 left-1/2 -translate-x-1/2 z-[400] max-w-[90%] w-max">
                <a
                  href="/report"
                  className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-white text-xs sm:text-sm shadow-2xl hover:-translate-y-1 hover:shadow-amber-500/40 transition-all duration-300 whitespace-nowrap"
                  style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}
                >
                  <span className="material-symbols-outlined icon-filled text-[16px] sm:text-[18px]">add_circle</span>
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
                        const map = mapInstanceRef.current;
                        const targetMarker = markerObjectsRef.current[i];
                        if (map && targetMarker) {
                          map.flyTo([marker.lat, marker.lng], 15, { duration: 1 });
                          targetMarker.openPopup();
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
