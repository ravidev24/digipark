import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import {
  MapPin, Car, Search, Navigation,
  ChevronLeft, CheckCircle2, Filter, ArrowRight, Loader2, LocateFixed,
} from "lucide-react";
import MapComponent from "./MapComponent";
import { getUserLocation, sortAreasByDistance, formatDistance } from "../utils/geo";

const SearchSlotsView = ({
  areas,
  selectedArea,
  setSelectedArea,
  handleAreaSelect,
  slots,
  selectedSlot,
  setSelectedSlot,
  handleBookSlot,
}) => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [viewTab, setViewTab] = useState("all");
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyLoading, setNearbyLoading] = useState(false);
  const [nearbyError, setNearbyError] = useState(null);

  const filteredAreas = areas.filter((area) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      area.name.toLowerCase().includes(q) ||
      area.address.toLowerCase().includes(q);
    const matchType = filterType === "All" || area.type === filterType;
    return matchSearch && matchType;
  });

  const nearbyAreas = useMemo(() => {
    if (!userLocation) return [];
    return sortAreasByDistance(areas, userLocation.lat, userLocation.lng);
  }, [areas, userLocation]);

  const fetchNearby = useCallback(async () => {
    setNearbyLoading(true);
    setNearbyError(null);
    try {
      const coords = await getUserLocation();
      setUserLocation(coords);
      setViewTab("nearby");
    } catch (err) {
      setNearbyError(err.message);
    } finally {
      setNearbyLoading(false);
    }
  }, []);

  useEffect(() => {
    if (location.state?.openNearby) {
      fetchNearby();
      window.history.replaceState({}, document.title);
    }
  }, [location.state, fetchNearby]);

  const displayAreas = viewTab === "nearby" ? nearbyAreas : filteredAreas;

  const AreaCard = ({ area, index, showDistance = false }) => (
    <button
      key={area._id}
      onClick={() => handleAreaSelect(area)}
      className="w-full text-left rounded-2xl p-4 sm:p-5 border transition-all duration-200 group active:scale-[0.98] animate-slide-up
        bg-white dark:bg-slate-800/40 border-slate-200 dark:border-white/5 
        hover:border-teal-500/40 dark:hover:border-teal-500/40 hover:bg-slate-50 dark:hover:bg-slate-700/40"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-teal-600/10 flex items-center justify-center shrink-0 group-hover:bg-teal-600/20 transition-colors">
          <MapPin size={18} className="text-teal-600 dark:text-teal-400 sm:w-5 sm:h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm sm:text-base text-slate-900 dark:text-white truncate group-hover:text-teal-600 dark:group-hover:text-teal-300 transition-colors">
            {area.name}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{area.address}</p>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2">
            <span className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-700/60 rounded-full text-slate-600 dark:text-slate-400 uppercase font-medium">
              {area.type}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {area.totalSlots} total slots
            </span>
            {showDistance && area.distanceKm != null && (
              <span className="text-xs px-2 py-0.5 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-full font-semibold">
                {formatDistance(area.distanceKm)}
              </span>
            )}
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-teal-600 dark:text-teal-400 font-bold text-sm sm:text-base">₹20</p>
          <p className="text-xs text-slate-400">/hour</p>
          <ArrowRight size={16} className="mt-1 ml-auto text-slate-400 dark:text-slate-600 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors" />
        </div>
      </div>
    </button>
  );

  return (
    <section className="animate-fade-in space-y-4 sm:space-y-6 pb-4 md:pb-0">
      {!selectedArea ? (
        <>
          {/* Hero + Search */}
          <div className="relative overflow-hidden rounded-2xl p-5 sm:p-8 border border-teal-500/20 dark:border-teal-700/20 bg-gradient-to-r from-teal-500/10 via-slate-50 to-teal-50/20 dark:from-teal-900/40 dark:via-slate-900 dark:to-slate-900">
            <div className="absolute top-0 right-0 w-72 h-72 bg-teal-500/10 dark:bg-teal-500/10 blur-[80px] rounded-full -mr-24 -mt-24 pointer-events-none" />
            <div className="relative z-10 max-w-2xl mb-4 sm:mb-6">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/10 dark:bg-teal-500/15 border border-teal-500/20 dark:border-teal-500/25 text-teal-600 dark:text-teal-400 rounded-full text-xs font-semibold uppercase tracking-widest mb-3 sm:mb-4">
                <MapPin size={12} /> Find Parking in Chennai
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white leading-tight mb-2">
                Find & Book <span className="text-teal-600 dark:text-teal-400">Guaranteed Parking</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                Browse all locations or find parking near you — tap any area to view slots.
              </p>
            </div>

            {/* Search bar — hidden on nearby tab */}
            {viewTab === "all" && (
              <div className="flex flex-col sm:flex-row gap-3 relative z-10">
                <div className="flex-1 relative">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search location, area, landmark…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border rounded-xl text-sm outline-none transition-all
                      bg-white dark:bg-slate-800/80 border-slate-200 dark:border-white/10
                      text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500/40 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>
                <div className="relative">
                  <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none" />
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full sm:w-auto pl-9 pr-8 py-3 border rounded-xl text-sm outline-none transition-all appearance-none cursor-pointer
                      bg-white dark:bg-slate-800/80 border-slate-200 dark:border-white/10
                      text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500/40"
                  >
                    <option value="All">All Types</option>
                    <option value="Mall">Mall</option>
                    <option value="Theater">Theater</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Tab switcher: All | Nearby */}
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="flex rounded-xl p-1 bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-white/5 w-full sm:w-auto">
              <button
                onClick={() => setViewTab("all")}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 rounded-lg text-sm font-semibold transition-all
                  ${viewTab === "all"
                    ? "bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-400 shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                  }`}
              >
                <Search size={16} /> All Locations
              </button>
              <button
                onClick={() => {
                  setViewTab("nearby");
                  if (!userLocation && !nearbyLoading) fetchNearby();
                }}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 rounded-lg text-sm font-semibold transition-all
                  ${viewTab === "nearby"
                    ? "bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-400 shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                  }`}
              >
                <Navigation size={16} /> Nearby Parking
              </button>
            </div>

            {viewTab === "nearby" && (
              <button
                onClick={fetchNearby}
                disabled={nearbyLoading}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all
                  bg-teal-600 hover:bg-teal-500 text-white disabled:opacity-60"
              >
                {nearbyLoading ? <Loader2 size={16} className="animate-spin" /> : <LocateFixed size={16} />}
                {nearbyLoading ? "Detecting…" : "Refresh Location"}
              </button>
            )}
          </div>

          {/* Nearby prompt / error */}
          {viewTab === "nearby" && nearbyError && (
            <div className="rounded-xl p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 text-sm text-red-700 dark:text-red-400">
              {nearbyError}
            </div>
          )}

          {viewTab === "nearby" && !userLocation && !nearbyLoading && !nearbyError && (
            <div className="rounded-2xl p-6 sm:p-8 text-center bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-white/5">
              <div className="w-16 h-16 mx-auto bg-teal-500/10 rounded-2xl flex items-center justify-center mb-4">
                <LocateFixed size={32} className="text-teal-600 dark:text-teal-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Find Parking Near You</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-5 max-w-sm mx-auto">
                Allow location access to see the closest parking areas. Tap any result to book a slot.
              </p>
              <button
                onClick={fetchNearby}
                className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-xl transition-colors"
              >
                <Navigation size={18} /> Use My Location
              </button>
            </div>
          )}

          {/* Map + List split */}
          {(viewTab === "all" || userLocation) && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
              {/* List */}
              <div className="lg:col-span-5 space-y-3 max-h-[50vh] sm:max-h-[480px] lg:max-h-[600px] overflow-y-auto pr-1 custom-scrollbar order-2 lg:order-1">
                <div className="flex items-center justify-between px-1 mb-1 sticky top-0 bg-transparent z-10">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                    {displayAreas.length} location{displayAreas.length !== 1 ? "s" : ""}
                    {viewTab === "nearby" ? " nearby" : " found"}
                  </p>
                </div>

                {displayAreas.length === 0 ? (
                  <div className="rounded-2xl p-6 sm:p-8 text-center bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-white/5">
                    <MapPin size={36} className="mx-auto text-slate-400 dark:text-slate-600 mb-3" />
                    <p className="text-slate-500 dark:text-slate-400">
                      {viewTab === "nearby" ? "No parking areas with map coordinates found nearby" : "No locations match your search"}
                    </p>
                  </div>
                ) : displayAreas.map((area, index) => (
                  <AreaCard key={area._id} area={area} index={index} showDistance={viewTab === "nearby"} />
                ))}
              </div>

              {/* Map — shown first on mobile for nearby */}
              <div
                className="lg:col-span-7 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-xl order-1 lg:order-2 h-[280px] sm:h-[380px] md:h-[450px] lg:h-[600px]"
              >
                <MapComponent
                  areas={displayAreas}
                  onAreaSelect={handleAreaSelect}
                  selectedArea={selectedArea}
                  userLocation={viewTab === "nearby" ? userLocation : null}
                />
              </div>
            </div>
          )}
        </>
      ) : (
        /* === SLOT BOOKING SECTION === */
        <div className="space-y-4 sm:space-y-6 animate-slide-up pb-24 md:pb-8">
          <button
            onClick={() => { setSelectedArea(null); setSelectedSlot(null); }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors border
              bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-white"
          >
            <ChevronLeft size={18} /> Back to Finder
          </button>

          <div className="rounded-2xl p-4 sm:p-6 bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-white/5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-teal-600/10 rounded-2xl flex items-center justify-center shrink-0">
                  <MapPin size={22} className="text-teal-600 dark:text-teal-400 sm:w-[26px] sm:h-[26px]" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs px-2 py-0.5 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-full uppercase font-semibold">
                      {selectedArea.type}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">{selectedArea.name}</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-0.5 flex items-start gap-1.5">
                    <MapPin size={13} className="text-slate-400 dark:text-slate-500 shrink-0 mt-0.5" />
                    <span>{selectedArea.address}</span>
                  </p>
                </div>
              </div>

              <div className="flex gap-3 shrink-0 w-full sm:w-auto">
                <div className="flex-1 sm:flex-none rounded-xl p-3 sm:p-4 text-center min-w-0 sm:min-w-[110px] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Hourly</p>
                  <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">₹20</p>
                </div>
                <div className="flex-1 sm:flex-none rounded-xl p-3 sm:p-4 text-center min-w-0 sm:min-w-[110px] bg-teal-50/50 dark:bg-slate-800 border border-teal-200 dark:border-teal-500/20">
                  <p className="text-xs text-teal-600 dark:text-slate-500 uppercase font-semibold mb-1">Daily</p>
                  <p className="text-xl sm:text-2xl font-bold text-teal-600 dark:text-teal-400">₹150</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 h-[200px] sm:h-[260px]">
            <MapComponent
              areas={[selectedArea]}
              onAreaSelect={() => {}}
              selectedArea={selectedArea}
            />
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 px-1">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-md bg-slate-100 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-600" />
              Available
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-md bg-teal-600 border border-teal-400" />
              Selected
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-md bg-red-100 dark:bg-red-900/40 border border-red-200 dark:border-red-900/50 opacity-50" />
              Booked
            </div>
          </div>

          <div className="rounded-2xl p-4 sm:p-6 bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-white/5">
            <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white mb-4 sm:mb-5">
              Select an Available Slot{slots.length > 0 ? ` — ${slots.filter(s => !s.isBooked).length} available of ${slots.length}` : ""}
            </h3>
            {slots.length === 0 ? (
              <p className="text-slate-500 text-center py-8">No slots found for this area.</p>
            ) : (
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 sm:gap-3">
                {slots.map((slot) => {
                  const isSelected = selectedSlot?._id === slot._id;
                  return (
                    <button
                      key={slot._id}
                      disabled={slot.isBooked}
                      onClick={() => setSelectedSlot(slot)}
                      className={`
                        aspect-square rounded-xl flex flex-col items-center justify-center gap-0.5 sm:gap-1 border transition-all duration-200 text-[10px] sm:text-xs font-bold
                        ${slot.isBooked
                          ? "bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/30 text-red-700 dark:text-red-800 cursor-not-allowed opacity-50"
                          : isSelected
                            ? "bg-teal-600 border-teal-400 text-white shadow-lg shadow-teal-600/30 -translate-y-0.5"
                            : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60 text-slate-600 dark:text-slate-400 hover:border-teal-500/50 hover:bg-teal-50 dark:hover:bg-teal-600/10 hover:text-teal-600 dark:hover:text-teal-400"
                        }
                      `}
                    >
                      <Car size={14} className={`sm:w-4 sm:h-4 ${slot.isBooked ? "text-red-700 dark:text-red-800" : isSelected ? "text-white" : "text-slate-400 dark:text-slate-500"}`} />
                      {slot.slotNumber}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {selectedSlot && (
            <div className="fixed bottom-[4.5rem] md:bottom-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] sm:w-auto max-w-sm">
              <button
                onClick={handleBookSlot}
                className="w-full flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-10 py-3.5 sm:py-4 bg-teal-600 hover:bg-teal-500 active:scale-95 text-white text-base sm:text-lg font-bold rounded-2xl shadow-2xl shadow-teal-600/40 transition-all"
              >
                <CheckCircle2 size={22} className="sm:w-6 sm:h-6" />
                Book Slot {selectedSlot.slotNumber}
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default SearchSlotsView;
